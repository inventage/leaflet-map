import { css, html, LitElement, property } from 'lit-element';
import { Circle, Icon, LeafletEvent, LeafletMouseEvent, Map, Marker } from 'leaflet';
import { PropertyValues } from 'lit-element/lib/updating-element';

// https://github.com/Leaflet/Leaflet/issues/7055
// https://github.com/Leaflet/Leaflet/pull/7174
// https://github.com/Leaflet/Leaflet/pull/6239
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as L from 'leaflet/dist/leaflet-src.esm.js';

export interface MarkerInformation {
  latitude: number;
  longitude: number;
  title?: string;
}

/**
 * @link https://github.com/leaflet-extras/leaflet-map/
 * @link https://github.com/Gubancs/leaflet4vaadin
 * @link https://github.com/ggcity/leaflet-map
 *
 * @fires 'tiles-loading' - Event transporting a promise, fires when the tiles layer starts loading tiles. The promise resolves once all tiles have loaded.
 * @fires 'center-updated' - Event transporting the latitude and longitude each time the map center has updated.
 */
export class LeafletMap extends LitElement {
  @property({ type: Number })
  latitude = 47.38991;

  @property({ type: Number })
  longitude = 8.51604;

  @property({ type: Number })
  radius = 0;

  @property({ type: Array })
  markers: Array<MarkerInformation> = [];

  @property({ type: Object })
  selectedMarker: MarkerInformation | null = null;

  @property({ type: Boolean })
  updateCenterOnClick = false;

  @property({ type: Boolean })
  detectRetina = true;

  @property({ type: Number })
  defaultZoom = 16;

  @property({ type: Number })
  maxZoom = 19;

  private map!: Map;

  private mapCenterMarker: Marker | null = null;

  private mapMarkers: Array<Marker> = [];

  private mapClickDelayedTimeout: number | null = null;

  private radiusLayer: Circle | null = null;

  private markerRed: Icon;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .map {
        width: 100%;
        height: 100%;
      }
    `;
  }

  constructor() {
    super();

    this.markerRed = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  /**
   * Called after the element’s DOM has been updated the first time, immediately before updated is called.
   *
   * Implement firstUpdated to perform one-time work after the element’s template has been created.
   *
   * @param _changedProperties
   */
  firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    const mapDomElement = this.renderRoot.querySelector('.map') as HTMLElement;
    if (!mapDomElement) {
      return;
    }

    this.map = L.map(mapDomElement);

    // Delayed click handler so we do not interfere with double clicks
    // @see https://github.com/Outdooractive/leaflet-singleclick_0.7
    this.map.on('click', e => this._onMapClickDelayed(e));
    this.map.on('dblclick', () => this._clearMapClickDelayedTimeout());

    // Fixes click events on iOS touch devices
    // @see https://github.com/Leaflet/Leaflet/issues/6705#issuecomment-575465329
    if (this.map.tap) {
      this.map.tap.disable();
    }

    // @see https://github.com/leaflet-extras/leaflet-providers
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      detectRetina: this.detectRetina,
      maxZoom: this.maxZoom,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Fires an event transporting a promise when the tiles layer starts loading tiles
    // @see https://leafletjs.com/reference-1.6.0.html#gridlayer-loading
    tiles.on('loading', () => {
      // The promise transported in the event resolves once all tiles have loaded
      // @see https://leafletjs.com/reference-1.6.0.html#gridlayer-load
      const promise = new Promise<void>(resolve => {
        tiles.on('load', resolve);
      });

      this.dispatchEvent(
        new CustomEvent('tiles-loading', {
          composed: true,
          bubbles: true,
          detail: { promise },
        })
      );
    });

    // Add scale controls
    L.control.scale().addTo(this.map);

    // Update map size before centering and updating markers
    this._updateMapSize();

    // Center map and update layers
    this._centerMap();
    this._updateMapCenterMarker();
    this._updateRadiusLayer();
    this._fitBounds();
  }

  /**
   * Called when the element’s DOM has been updated and rendered. Implement to perform some task after an update.
   *
   * @param _changedProperties
   *
   * @see https://lit-element.polymer-project.org/guide/lifecycle#updated
   */
  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    this._updateMapSize();

    // Center map and update marker whenever the lat / long properties change
    if (_changedProperties.has('latitude') || _changedProperties.has('longitude')) {
      this._updateMapCenterMarker();
    }

    if (_changedProperties.has('latitude') || _changedProperties.has('longitude') || _changedProperties.has('radius')) {
      this._updateRadiusLayer();
    }

    if (_changedProperties.has('markers')) {
      this._updateMarkers();
    }

    if (_changedProperties.has('selectedMarker')) {
      this._markSelectedMarker();
    }

    if (_changedProperties.has('latitude') || _changedProperties.has('longitude') || _changedProperties.has('radius') || _changedProperties.has('markers')) {
      this._fitBounds();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', () => this._handleResize());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', () => this._handleResize());
  }

  render() {
    // noinspection JSUnresolvedLibraryURL
    return html`<link rel="stylesheet" href="https://unpkg.com/leaflet@${L.version}/dist/leaflet.css" />
      <div class="map"></div>`;
  }

  _hasValidMapData() {
    return this.latitude && this.longitude && this.map;
  }

  _centerMap(zoom = this.defaultZoom) {
    if (!this._hasValidMapData()) {
      return;
    }

    this.map?.setView([this.latitude, this.longitude], zoom);
  }

  _updateMapCenterMarker() {
    if (!this._hasValidMapData()) {
      return;
    }

    // Remove any existing center marker
    if (this.mapCenterMarker) {
      this.mapCenterMarker.remove();
      this.mapCenterMarker = null;
    }

    // Set a new one
    this.mapCenterMarker = L.marker([this.latitude, this.longitude], { icon: this.markerRed }).addTo(this.map!);
  }

  _updateMarkers() {
    if (!this._hasValidMapData()) {
      return;
    }

    // Remove existing markers
    this.mapMarkers.forEach(marker => marker.remove());
    this.mapMarkers = [];

    // Add new markers for each marker from the custom element property
    this.mapMarkers = this.markers.map(marker => {
      const { title, latitude, longitude } = marker;

      const mapMarker = L.marker([latitude, longitude]).addTo(this.map);
      if (title) {
        mapMarker.bindPopup(title);
      }

      return mapMarker;
    });
  }

  _fitBounds() {
    if (!this._hasValidMapData()) {
      return;
    }

    let bounds;
    if (this.mapMarkers.length > 0) {
      bounds = L.featureGroup(this.mapMarkers).getBounds();
    } else if (this.radiusLayer) {
      bounds = this.radiusLayer.getBounds();
    }

    if (bounds) {
      this.map.fitBounds(bounds);
      this.map.setZoom(this.map.getBoundsZoom(bounds, true) - 1);
    }
  }

  _markSelectedMarker() {
    if (!this.selectedMarker) {
      return;
    }

    const { latitude, longitude } = this.selectedMarker;

    // const selectedMarker = this.markers.find(marker => marker.latitude === latitude && marker.longitude === longitude);
    const selectedMarker = this.mapMarkers.find(marker => {
      const { lat, lng } = marker.getLatLng();

      return lat === latitude && lng === longitude;
    });

    if (selectedMarker) {
      selectedMarker.openPopup();
      this.map.panTo(selectedMarker.getLatLng());
    }
  }

  _onMapClick(e: LeafletEvent) {
    if (!this.updateCenterOnClick) {
      return;
    }

    const {
      latlng: { lat, lng },
    } = e as LeafletMouseEvent;

    this.latitude = lat;
    this.longitude = lng;

    this._updateMapCenterMarker();

    this.dispatchEvent(
      new CustomEvent('center-updated', {
        detail: {
          latitude: this.latitude,
          longitude: this.longitude,
        },
      })
    );
  }

  /**
   * Invalidates the map size and updates the map.
   * This is particularly useful when the map container size changed.
   *
   * @private
   */
  _updateMapSize() {
    if (!this._hasValidMapData()) {
      return;
    }

    this.map.invalidateSize(true);
  }

  _onMapClickDelayed(e: LeafletEvent) {
    this._clearMapClickDelayedTimeout();

    this.mapClickDelayedTimeout = window.setTimeout(() => {
      this._onMapClick(e);
    }, 500);
  }

  _clearMapClickDelayedTimeout() {
    if (!this.mapClickDelayedTimeout) {
      return;
    }

    clearTimeout(this.mapClickDelayedTimeout);
    this.mapClickDelayedTimeout = null;
  }

  _updateRadiusLayer() {
    if (!this._hasValidMapData() || !this.radius) {
      return;
    }

    if (this.radiusLayer) {
      this.radiusLayer.remove();
    }

    this.radiusLayer = L.circle([this.latitude, this.longitude], {
      weight: 2,
      opacity: 0.4,
      fillOpacity: 0.1,
      radius: this.radius,
    }).addTo(this.map);
  }

  _handleResize() {
    if (!this._hasValidMapData()) {
      return;
    }

    this._updateMapSize();
    this._fitBounds();
  }
}

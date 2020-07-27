import { LeafletMap } from './src/LeafletMap.js';

window.customElements.define('leaflet-map', LeafletMap);

declare global {
  interface HTMLElementTagNameMap {
    'leaflet-map': LeafletMap;
  }
}

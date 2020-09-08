<div align="center">
  <br>
  <img src="media/undraw_Map_light_3hjy.svg" width="200" alt="undraw.co map illustration">
  <br>
  <h1>&#x3C;leaflet-map&#x3E;</h1>
  <br>
</div>

A web component for displaying a map with certain features using [Leaflet].

[![made with open-wc](https://img.shields.io/badge/made%20with-open--wc-%23217ff9?style=flat-square)](https://open-wc.org)
[![Main Workflow](https://img.shields.io/github/workflow/status/inventage/leaflet-map/Main%20Workflow?style=flat-square)](https://github.com/inventage/leaflet-map/actions?query=workflow%3A"Main+Workflow")
[![npm version](https://img.shields.io/npm/v/@inventage/leaflet-map?style=flat-square)](https://www.npmjs.com/package/@inventage/leaflet-map)

## Installation

```bash
npm i @inventage/leaflet-map
```

## Usage

```html
<script type="module">
  import '@inventage/leaflet-map';
</script>

<leaflet-map></leaflet-map>
```

## Example

https://inventage-leaflet-map.glitch.me/

## Properties

| Property              | Attribute             | Type                        | Default  |
| --------------------- | --------------------- | --------------------------- | -------- |
| `defaultZoom`         | `defaultZoom`         | `number`                    | 16       |
| `detectRetina`        | `detectRetina`        | `boolean`                   | true     |
| `latitude`            | `latitude`            | `number`                    | 47.38991 |
| `longitude`           | `longitude`           | `number`                    | 8.51604  |
| `markers`             | `markers`             | `MarkerInformation[]`       | []       |
| `maxZoom`             | `maxZoom`             | `number`                    | 19       |
| `radius`              | `radius`              | `number`                    | 0        |
| `selectedMarker`      | `selectedMarker`      | `MarkerInformation \| null` | null     |
| `updateCenterOnClick` | `updateCenterOnClick` | `boolean`                   | false    |

## Events

| Event            | Type                                                    | Description                                                                                                                     |
| ---------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `center-updated` | `CustomEvent<{ latitude: number; longitude: number; }>` | Event transporting the latitude and longitude each time the map center has updated.                                             |
| `map-ready`      | `CustomEvent<{ map: Map; }>`                            | Event transporting an leaflet map instance. Fires using the `whenReady` event of leaflet map.                                   |
| `tiles-loading`  | `CustomEvent<{ promise: Promise<void>; }>`              | Event transporting a promise, fires when the tiles layer starts loading tiles. The promise resolves once all tiles have loaded. |

## CSS Custom Properties

| Property                   | Type   | Description                    | Default |
| -------------------------- | ------ | ------------------------------ | ------- |
| `--leaflet-map-min-height` | Length | Min. height of the map element | `50vh`  |

[leaflet]: https://leafletjs.com/

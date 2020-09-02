```js script
import { html } from '@open-wc/demoing-storybook';

import '../dist/leaflet-map.js';

export default {
  title: '<leaflet-map>',
  component: 'leaflet-map',
  options: { selectedPanel: 'storybookjs/knobs/panel' },
};
```

# &#x3C;leaflet-map&#x3E;

A web component for displaying a map with certain features using [Leaflet].

```js preview-story
export const Simple = () => html` <leaflet-map></leaflet-map> `;
```

## API

The api table will show the data of `<leaflet-map>` in your `custom-elements.json`.

<sb-props of="leaflet-map"></sb-props>

[leaflet]: https://leafletjs.com/

```js script
import { html } from '@open-wc/demoing-storybook';

import '../dist/leaflet-map.js';

export default {
  title: 'LeafletMap',
  component: 'leaflet-map',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# LeafletMap

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add leaflet-map
```

```js
import 'leaflet-map/leaflet-map.js';
```

```js preview-story
export const Simple = () => html`
  <leaflet-map></leaflet-map>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <leaflet-map title="Hello World"></leaflet-map>
`;
```

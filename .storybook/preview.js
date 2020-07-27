import { addParameters, setCustomElements } from '@open-wc/demoing-storybook';

async function run() {
  // const customElements = await (await fetch(new URL('../custom-elements.json', import.meta.url))).json();
  // setCustomElements(customElements);
  // setCustomElements({});

  // Using async / await from above breaks the navigation tree rendering, so we resort to promises ¯\_(ツ)_/¯
  // which seems to work. Also, we need custom-elements.json in order to be able to use automatic knobs
  // through withWebComponentsKnobs
  // @see https://open-wc.org/demoing-storybook/?path=/docs/decorators-withwebcomponentknobs--example-output
  fetch(`${new URL('../custom-elements.json', import.meta.url)}`)
    .then(response => response.json())
    .then(customElements => setCustomElements(customElements))
    .catch(e => console.error(e));

  addParameters({
    // Storybook Docs
    // @see https://github.com/storybookjs/storybook/tree/master/addons/docs
    // @see https://github.com/storybookjs/storybook/blob/next/addons/docs/common/README.md#iframe-height
    // @see https://github.com/storybookjs/storybook/blob/next/addons/docs/web-components/README.md
    docs: {
      iframeHeight: '200px',
    },
  });

  setCustomElements(customElements);
}

run();

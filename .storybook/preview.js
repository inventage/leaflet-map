import { addParameters, setCustomElements } from '@open-wc/demoing-storybook';

addParameters({
  // Storybook Docs
  // @see https://github.com/storybookjs/storybook/tree/master/addons/docs
  // @see https://github.com/storybookjs/storybook/blob/next/addons/docs/common/README.md#iframe-height
  // @see https://github.com/storybookjs/storybook/blob/next/addons/docs/web-components/README.md
  docs: {
    iframeHeight: '200px',
  },
});

async function run() {
  const customElements = await (await fetch(new URL('../custom-elements.json', import.meta.url))).json();

  setCustomElements(customElements);
}

run();

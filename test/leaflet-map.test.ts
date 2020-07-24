import { html, fixture, expect } from '@open-wc/testing';

import { LeafletMap } from '../src/LeafletMap.js';
import '../leaflet-map.js';

describe('LeafletMap', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: LeafletMap = await fixture(html` <leaflet-map></leaflet-map> `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el: LeafletMap = await fixture(html` <leaflet-map></leaflet-map> `);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el: LeafletMap = await fixture(html` <leaflet-map title="attribute title"></leaflet-map> `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el: LeafletMap = await fixture(html` <leaflet-map></leaflet-map> `);

    await expect(el).shadowDom.to.be.accessible();
  });
});

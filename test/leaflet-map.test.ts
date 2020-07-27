import { assert, expect, fixture } from '@open-wc/testing';
import '../leaflet-map.js';
import { html } from 'lit-html';
import { LeafletMap } from '../src/LeafletMap.js';

describe('<leaflet-map>', () => {
  describe('Functionality', () => {
    it('is defined', () => {
      const el = document.createElement('leaflet-map');
      assert.instanceOf(el, LeafletMap);
    });

    it('has a default latitude, longitude and radius', async () => {
      const el: LeafletMap = await fixture(html` <leaflet-map></leaflet-map> `);

      expect(el.latitude).to.equal(47.38991);
      expect(el.longitude).to.equal(8.51604);
      expect(el.radius).to.equal(0);
    });
  });

  describe('Structure', () => {
    it('has a .map item', async () => {
      const el: LeafletMap = await fixture(html`<leaflet-map></leaflet-map>`);
      expect(el.shadowRoot!.querySelector('.map')).to.exist;
    });
  });

  describe('Accessibility', () => {
    it('passes the a11y audit', async () => {
      const el: LeafletMap = await fixture(html` <leaflet-map style="height: 200px; width: 200px;"></leaflet-map> `);

      await expect(el).shadowDom.to.be.accessible();
    });
  });
});

// describe('LeafletMap', () => {
//   it('has a default title "Hey there" and counter 5', async () => {
//     const el: LeafletMap = await fixture(html` <leaflet-map></leaflet-map> `);
//
//     expect(el.title).to.equal('Hey there');
//     expect(el.counter).to.equal(5);
//   });
//
//   it('increases the counter on button click', async () => {
//     const el: LeafletMap = await fixture(html` <leaflet-map></leaflet-map> `);
//     el.shadowRoot!.querySelector('button')!.click();
//
//     expect(el.counter).to.equal(6);
//   });
//
//   it('can override the title via attribute', async () => {
//     const el: LeafletMap = await fixture(html` <leaflet-map title="attribute title"></leaflet-map> `);
//
//     expect(el.title).to.equal('attribute title');
//   });
// });

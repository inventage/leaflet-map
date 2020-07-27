import { html, css, LitElement, property, TemplateResult } from 'lit-element';

/**
 * @cssprop {Color} --leaflet-map-text-color - Text Color
 */
export class LeafletMap extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--leaflet-map-text-color, #000);
      }
    `;
  }

  @property({ type: String }) title = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment(): void {
    this.counter += 1;
  }

  render(): TemplateResult {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}

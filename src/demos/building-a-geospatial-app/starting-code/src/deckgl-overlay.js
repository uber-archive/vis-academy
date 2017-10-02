import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => [0, 128, 255],
        getRadius: d => 1,
        opacity: 0.5,
        pickable: false,
        radiusScale: 3,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        ...this.props
      })
    ];

    return (
      <DeckGL {...this.props.viewport} layers={layers} />
    );
  }
}
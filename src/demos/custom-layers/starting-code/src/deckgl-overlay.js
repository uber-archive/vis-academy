import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: 'pickup',
        data: this.props.data,
        getPosition: d => [d.pickup_longitude, d.pickup_latitude],
        getColor: d => [0, 128, 255],
        radiusScale: 40
      })
    ];

    return (
      <DeckGL {...this.props.viewport} layers={layers} />
    );
  }
}

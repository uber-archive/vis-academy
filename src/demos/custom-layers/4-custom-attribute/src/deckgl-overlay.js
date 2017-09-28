import React, {Component} from 'react';
import DeckGL from 'deck.gl';
import ScatterplotLayer from './my-scatterplot-layer';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

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
        getColor: d => PICKUP_COLOR,
        getAngle: d => Math.atan2(d.dropoff_latitude - d.pickup_latitude, d.dropoff_longitude - d.pickup_longitude),
        radiusScale: 40
      })
    ];

    return (
      <DeckGL {...this.props.viewport} layers={layers} />
    );
  }
}

import React, {Component} from 'react';
import DeckGL from 'deck.gl';
import TaxiLayer from './taxi-layer';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

export default class DeckGLOverlay extends Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    const layers = [
      new TaxiLayer({
        id: 'taxi-trips',
        data: this.props.data,
        pickupColor: PICKUP_COLOR,
        dropoffColor: DROPOFF_COLOR,
        radiusScale: 40,
        getPickupLocation: d => [d.pickup_longitude, d.pickup_latitude],
        getDropoffLocation: d => [d.dropoff_longitude, d.dropoff_latitude]
      })
    ];

    return (
      <DeckGL {...this.props.viewport} layers={layers} />
    );
  }
}

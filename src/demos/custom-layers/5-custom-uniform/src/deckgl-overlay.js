import React, {Component} from 'react';
import DeckGL from 'deck.gl';
import ScatterplotLayer from './my-scatterplot-layer';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

const INFO_STYLE = {
  position: 'absolute',
  top: 12,
  left: 12,
  fontSize: 24,
  color: 'white'
};

export default class DeckGLOverlay extends Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    const timeOfDay = (this.props.currentTime / 1000) % 24;

    const layers = [
      new ScatterplotLayer({
        id: 'pickup',
        data: this.props.data,
        getPosition: d => [d.pickup_longitude, d.pickup_latitude],
        getColor: d => PICKUP_COLOR,
        getAngle: d => Math.atan2(d.dropoff_latitude - d.pickup_latitude, d.dropoff_longitude - d.pickup_longitude),
        getTime: d => {
          const pickupDate = new Date(d.pickup_datetime);
          return pickupDate.getUTCHours() + pickupDate.getMinutes() / 60;
        },
        currentTime: timeOfDay,
        radiusScale: 40
      })
    ];

    return (
      <div>
        <DeckGL {...this.props.viewport} layers={layers} />
        <div style={INFO_STYLE}>
          { Math.floor(timeOfDay) }:00
        </div>
      </div>
    );
  }
}

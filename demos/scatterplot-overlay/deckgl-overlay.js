import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

export default class DeckGLOverlay extends Component {

  render() {
    const {viewport, data, onHover, settings} = this.props;

    if (!data) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: 'scatterplot',
        data,
        getPosition: d => d.position,
        getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
        getRadius: d => 1,
        opacity: 0.5,
        pickable: true,
        onHover,
        radiusScale: settings.radiusScale,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30
      })
    ];

    return (
      <DeckGL {...viewport} layers={ layers } />
    );
  }
}

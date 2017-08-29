import React, {Component} from 'react';

import DeckGL, {ScatterplotLayer, HexagonLayer} from 'deck.gl';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

const HEATMAP_COLORS = [
  [213,62,79],
  [252,141,89],
  [254,224,139],
  [230,245,152],
  [153,213,148],
  [50,136,189]
].reverse();

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      longitude: -74,
      latitude: 40.7,
      zoom: 11,
      maxZoom: 16,
      pitch: 0,
      bearing: 0
    };
  }

  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const {viewport, data, onHover, settings} = this.props;

    if (!data) {
      return null;
    }

    const layers = [
      !settings.showHexagon ? new ScatterplotLayer({
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
      }) : null,
      settings.showHexagon ? new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        coverage: settings.coverage,
        data,
        elevationRange,
        elevationScale: 10,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        onHover,
        opacity: 1,
        pickable: true,
        radius: settings.radius,
        upperPercentile: settings.upperPercentile
      }): null
    ];

    return (
      <DeckGL {...viewport} layers={ layers } onWebGLInitialized={this._initialize} />
    );
  }
}

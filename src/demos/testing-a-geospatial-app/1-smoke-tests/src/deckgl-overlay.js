import React, { Component } from "react";
import DeckGL, { ScatterplotLayer, HexagonLayer } from "deck.gl";

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

const HEATMAP_COLORS = [
  [213, 62, 79],
  [252, 141, 89],
  [254, 224, 139],
  [230, 245, 152],
  [153, 213, 148],
  [50, 136, 189]
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
  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    if (!this.props.data) {
      return null;
    }

    const filteredData =
      this.props.hour === null
        ? this.props.data
        : this.props.data.filter(d => d.hour === this.props.hour);

    const layers = [
      !this.props.showHexagon
        ? new ScatterplotLayer({
            id: "scatterplot",
            getPosition: d => d.position,
            getColor: d => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
            getRadius: d => 5,
            opacity: 0.5,
            pickable: true,
            radiusMinPixels: 0.25,
            radiusMaxPixels: 30,
            ...this.props,
            data: filteredData
          })
        : null,
      this.props.showHexagon
        ? new HexagonLayer({
            id: "heatmap",
            colorRange: HEATMAP_COLORS,
            elevationRange,
            elevationScale: 5,
            extruded: true,
            getPosition: d => d.position,
            lightSettings: LIGHT_SETTINGS,
            opacity: 1,
            pickable: true,
            ...this.props,
            data: filteredData
          })
        : null
    ];

    return (
      <DeckGL
        {...this.props.viewport}
        layers={layers}
        onWebGLInitialized={this._initialize}
      />
    );
  }
}

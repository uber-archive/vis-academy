/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import {
  LayerControls,
  MapStylePicker,
  SCATTERPLOT_CONTROLS
} from './controls';
import { tooltipStyle } from './style';
import DeckGL from 'deck.gl';
import taxiData from '../../../data/taxi';
import { renderLayers } from './deckgl-layers';

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class App extends Component {
  state = {
    hover: {
      x: 0,
      y: 0,
      hoveredObject: null
    },
    points: [],
    settings: Object.keys(SCATTERPLOT_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }),
      {}
    ),
    style: 'mapbox://styles/mapbox/light-v9'
  };

  componentDidMount() {
    this._processData();
  }

  _processData = () => {
    const points = taxiData.reduce((accu, curr) => {
      accu.push({
        position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
        pickup: true
      });

      accu.push({
        position: [
          Number(curr.dropoff_longitude),
          Number(curr.dropoff_latitude)
        ],
        pickup: false
      });
      return accu;
    }, []);
    this.setState({
      points
    });
  };

  _onHover({ x, y, object }) {
    const label = object ? (object.pickup ? 'Pickup' : 'Dropoff') : null;

    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings } = this.state;
    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`
            }}
          >
            <div>{hover.label}</div>
          </div>
        )}
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL 
          layers={renderLayers({
            data: this.state.points,
            onHover: hover => this._onHover(hover),
            settings: this.state.settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          controller
        >
          <StaticMap mapStyle={this.state.style} />
        </DeckGL>
      </div>
    );
  }
}

/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import { LayerControls, MapStylePicker, HEXAGON_CONTROLS } from './controls';
import { tooltipStyle } from './style';
import DeckGL from 'deck.gl';
import taxiData from '../../../data/taxi';
import { renderLayers } from './deckgl-layers';
import Charts from './charts';

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
    settings: Object.keys(HEXAGON_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: HEXAGON_CONTROLS[key].value
      }),
      {}
    ),
    selectedHour: null,
    style: 'mapbox://styles/mapbox/light-v9'
  };

  componentDidMount() {
    this._processData();
  }

  _processData = () => {
    const data = taxiData.reduce(
      (accu, curr) => {
        const pickupHour = new Date(curr.pickup_datetime).getUTCHours();
        const dropoffHour = new Date(curr.dropoff_datetime).getUTCHours();

        const pickupLongitude = Number(curr.pickup_longitude);
        const pickupLatitude = Number(curr.pickup_latitude);

        if (!isNaN(pickupLongitude) && !isNaN(pickupLatitude)) {
          accu.points.push({
            position: [pickupLongitude, pickupLatitude],
            hour: pickupHour,
            pickup: true
          });
        }

        const dropoffLongitude = Number(curr.dropoff_longitude);
        const dropoffLatitude = Number(curr.dropoff_latitude);

        if (!isNaN(dropoffLongitude) && !isNaN(dropoffLatitude)) {
          accu.points.push({
            position: [dropoffLongitude, dropoffLatitude],
            hour: dropoffHour,
            pickup: false
          });
        }

        const prevPickups = accu.pickupObj[pickupHour] || 0;
        const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

        accu.pickupObj[pickupHour] = prevPickups + 1;
        accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

        return accu;
      },
      {
        points: [],
        pickupObj: {},
        dropoffObj: {}
      }
    );

    data.pickups = Object.entries(data.pickupObj).map(([hour, count]) => {
      return { hour: Number(hour), x: Number(hour) + 0.5, y: count };
    });
    data.dropoffs = Object.entries(data.dropoffObj).map(([hour, count]) => {
      return { hour: Number(hour), x: Number(hour) + 0.5, y: count };
    });
    this.setState(data);
  };

  _onHover({ x, y, object }) {
    const label = object
      ? object.points
        ? `${object.points.length} pickups or dropoffs here`
        : object.pickup
        ? 'Pickup'
        : 'Dropoff'
      : null;

    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  _onHighlight(highlightedHour) {
    this.setState({ highlightedHour });
  }

  _onSelect(selectedHour) {
    this.setState({
      selectedHour:
        selectedHour === this.state.selectedHour ?
          null :
          selectedHour
    });
  }

  onStyleChange = style => {
    this.setState({ style });
  };
  _onWebGLInitialize = gl => {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  };
  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const { viewState, controller = true } = this.props;
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
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL
          {...this.state.settings}
          onWebGLInitialized={this._onWebGLInitialize}
          layers={renderLayers({
            data: this.state.points,
            hour: this.state.highlightedHour || this.state.selectedHour,
            onHover: hover => this._onHover(hover),
            settings: this.state.settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          viewState={viewState}
          controller={controller}
        >
          <StaticMap mapStyle={this.state.style} />
        </DeckGL>
        <Charts {...this.state} 
          highlight={hour => this._onHighlight(hour)}
          select={hour => this._onSelect(hour)}
        />
      </div>
    );
  }
}

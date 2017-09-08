/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import {
  LayerControls,
  HEXAGON_CONTROLS
} from './layer-controls';
import Charts from './charts';
import Spinner from './spinner';
import {tooltipStyle} from './style';

import taxiData from '../data/taxi.csv';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      points: [],
      settings: Object.keys(HEXAGON_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: HEXAGON_CONTROLS[key].value
      }), {}),

      // hoverInfo
      x: 0,
      y: 0,
      hoveredObject: null,
      status: 'LOADING'
    };
  }

  componentDidMount() {
    this._processData();
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  _processData() {
    if (taxiData) {
      this.setState({status: 'LOADED'});
      const data = taxiData.reduce((accu, curr) => {
        const pickupTime = curr.tpep_pickup_datetime || '';
        const dropoffTime = curr.tpep_dropoff_datetime || '';

        const distance = curr.trip_distance;
        const amount = curr.total_amount;

        const pickupHour = Number(pickupTime.slice(11, 13));
        const dropoffHour = Number(dropoffTime.slice(11, 13));

        if (!isNaN(Number(curr.pickup_longitude)) && !isNaN(Number(curr.pickup_latitude))) {
          accu.points.push({
            position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
            hour: pickupHour,
            pickup: true
          });
        }

        if (!isNaN(Number(curr.dropoff_longitude)) && !isNaN(Number(curr.dropoff_latitude))) {
          accu.points.push({
            position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
            hour: dropoffHour,
            pickup: false
          });
        }
        
        const prevPickups = accu.pickupObj[pickupHour] || 0;
        const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

        accu.pickupObj[pickupHour] = prevPickups + 1;
        accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

        return accu;
      }, {
        points: [],
        pickupObj: {},
        dropoffObj: {}
      });

      data.pickups = Object.entries(data.pickupObj).map(d => {
        const hour = Number(d[0]);
        return {hour, x: hour + 0.5, y: d[1]};
      });
      data.dropoffs = Object.entries(data.dropoffObj).map(d => {
        const hour = Number(d[0]);
        return {hour, x: hour + 0.5, y: d[1]};
      });
      data.status = 'READY';

      this.setState(data);
    }
  }

  updateLayerSettings = settings => this.setState({settings})

  _onHover = ({x, y, object}) => this.setState({x, y, hoveredObject: object})

  _onViewportChange = (viewport) => this.setState({
      viewport: {...this.state.viewport, ...viewport}
  })

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const {viewport, hoveredObject, points, settings, status, x, y} = this.state;
    
    return (
      <div>
        {hoveredObject &&
          <div style={{...tooltipStyle, left: x, top: y}}>
            <div>{hoveredObject.id}</div>
          </div>}
        <LayerControls
          settings={settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={this.updateLayerSettings}/>
        <MapGL
          {...viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={viewport}
            data={points}
            onHover={this._onHover}
            settings={settings}/>
        </MapGL>
        <Charts {...this.state} />
        <Spinner status={status} />
      </div>
    );
  }
}

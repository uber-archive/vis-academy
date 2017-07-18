/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import LayerControls from './layer-controls';
import Charts from './charts';
import {tooltipStyle} from './style';
import Spinner from './spinner';

import taxiData from '../data/taxi.csv';

const MAPBOX_STYLE = 'mapbox://styles/uberdata/cive485h000192imn6c6cc8fc';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const LAYER_CONTROLS = {
  showHexagon: {
    displayName: 'Show Hexagon',
    type: 'boolean',
    value: false
  },
  radius: {
    displayName: 'Radius',
    type: 'range',
    value: 250,
    step: 50,
    min: 50,
    max: 1000
  },
  coverage: {
    displayName: 'Coverage',
    type: 'range',
    value: 0.7,
    step: 0.1,
    min: 0,
    max: 1
  },
  upperPercentile: {
    displayName: 'Upper Percentile',
    type: 'range',
    value: 100,
    step: 0.1,
    min: 80,
    max: 100
  }
};

const chartInfo = {
  BAR: {
    title: 'Pickups by hour',
    subtitle: 'As percentage of all trips',
    next: 'LINE'
  },
  LINE: {
    title: 'Pickups and dropoffs',
    subtitle: 'As percentage of all trips',
    next: 'SCATTERPLOT'
  },
  SCATTERPLOT: {
    title: 'Distance vs Amount',
    subtitle: 'Miles and USD',
    next: 'BAR'
  }
};

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
      settings: Object.keys(LAYER_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: LAYER_CONTROLS[key].value
      }), {}),
      chartType: 'SCATTERPLOT',
      // hoverInfo
      x: 0,
      y: 0,
      hoveredObject: null,
      status: 'LOADING'
    };
  }

  componentDidMount() {
    this._processData();
    window.addEventListener('resize', this._resize.bind(this));
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

        if (!isNaN(Number(curr.pickup_longitude)) && !isNaN(Number(curr.pickup_latitude))) {
          accu.points.push({
            position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
            pickup: true
          });
        }

        if (!isNaN(Number(curr.dropoff_longitude)) && !isNaN(Number(curr.dropoff_latitude))) {
          accu.points.push({
            position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
            pickup: false
          });
        }

        const pickupHour = pickupTime.slice(11, 13);
        const dropoffHour = dropoffTime.slice(11, 13);

        const prevPickups = accu.pickupObj[pickupHour] || 0;
        const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

        accu.pickupObj[pickupHour] = prevPickups + 1;
        accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

        if (distance > 0 && amount > 0) {
          accu.scatterplot.push({x: distance, y: amount, opacity: 0.2});
        }

        return accu;
      }, {
        points: [],
        pickupObj: {},
        dropoffObj: {},
        scatterplot: []
      });

      data.pickups = Object.entries(data.pickupObj)
        .map((d) => ({x: Number(d[0]) + 0.5, y: d[1]}))
        .sort((a, b) => a.x < b.x ? 1 : -1);
      data.dropoffs = Object.entries(data.dropoffObj)
        .map(d => ({x: Number(d[0]) + 0.5, y: d[1]}))
        .sort((a, b) => a.x < b.x ? 1 : -1);

      data.status = 'READY';

      this.setState(data);
    }
  }

  updateLayerSettings(settings) {
    this.setState({settings});
  }

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  _cycleChart() {
    this.setState({chartType: chartInfo[this.state.chartType].next});
  }

  _renderTooltip() {
    const {x, y, hoveredObject} = this.state;

    if (!hoveredObject) {
      return null;
    }

    return (
      <div style={{...tooltipStyle, left: x, top: y}}>
        <div>{hoveredObject.id}</div>
      </div>
    );
  }

  render() {
    const {
      chartType, viewport, dropoffs, pickups, points, scatterplot,
      settings, status
    } = this.state;

    return (
      <div>
        {this._renderTooltip()}
        <LayerControls
          settings={settings}
          propTypes={LAYER_CONTROLS}
          onChange={this.updateLayerSettings.bind(this)}/>
        <MapGL
          {...viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={viewport}
            data={points}
            onHover={this._onHover.bind(this)}
            settings={settings}/>
        </MapGL>
        <Charts
          chartType={chartType}
          onClick={this._cycleChart.bind(this)}
          dropoffs={dropoffs}
          pickups={pickups}
          scatterplot={scatterplot}
          subtitle={chartInfo[chartType].subtitle}
          title={chartInfo[chartType].title}
        />
        <Spinner status={status} />
      </div>
    );
  }
}

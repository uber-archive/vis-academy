/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import LayerControls from './layer-controls';
import Spinner from './spinner';
import {tooltipStyle} from './style';
import taxiData from '../data/taxi.csv';

const MAPBOX_STYLE = 'mapbox://styles/uberdata/cive485h000192imn6c6cc8fc';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const LAYER_CONTROLS = {
  radiusScale: {
    displayName: 'Scatterplot Radius',
    type: 'range',
    value: 30,
    step: 10,
    min: 10,
    max: 200
  }
};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16
      },
      points: [],
      settings: Object.keys(LAYER_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: LAYER_CONTROLS[key].value
      }), {}),
      // hoverInfo
      x: 0,
      y: 0,
      hoveredObject: null,
      status: 'LOADING'
    };
  }

  componentDidMount() {
    this._processData(this.props);
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize.bind(this));
  }

  _processData() {
    if (taxiData) {
      this.setState({status: 'LOADED'});
      const points = taxiData.reduce((accu, curr) => {
        accu.push({
          position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
          pickup: true
        });

        accu.push({
          position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
          pickup: false
        });
        return accu;
      }, []);
      this.setState({
        points,
        status: 'READY'
      });
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

  render() {
    const {viewport, points, settings, status, x, y, hoveredObject} = this.state;
    return (
      <div>
        {hoveredObject &&
          <div style={{...tooltipStyle, left: x, top: y}}>
            <div>{hoveredObject.id}</div>
          </div>}
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
        <Spinner status={status} />
      </div>
    );
  }
}

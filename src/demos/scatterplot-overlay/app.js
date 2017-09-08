/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import {LayerControls, SCATTERPLOT_CONTROLS} from './layer-controls';
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
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16
      },
      points: [],
      settings: Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
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
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
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

  updateLayerSettings = (settings) => this.setState({settings})

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
    const {viewport, points, settings, status, x, y, hoveredObject} = this.state;
    return (
      <div>
        {this.state.hoveredObject &&
          <div style={{
            ...tooltipStyle,
            left: this.state.x,
            top: this.state.y
          }}>
            <div>{this.state.hoveredObject.id}</div>
          </div>}
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={this.updateLayerSettings}/>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={this.state.viewport}
            data={this.state.points}
            onHover={this._onHover}
            settings={this.state.settings}/>
        </MapGL>
        <Spinner status={this.state.status} />
      </div>
    );
  }
}

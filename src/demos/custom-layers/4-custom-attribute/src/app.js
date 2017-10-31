/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';

import taxiData from '../../../data/taxi';

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
        pitch: 30,
        maxZoom: 16
      },
      currentTime: 0
    };
    this._resize = this._resize.bind(this);
    this._animate = this._animate.bind(this);
    this._onViewportChange = this._onViewportChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    this._animate();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    window.cancelAnimationFrame(this._animation);
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

  _animate() {
    this.setState({currentTime: Date.now()});
    this._animation = window.requestAnimationFrame(this._animate);
  }

  render() {
    const {viewport} = this.state;

    return (
      <div>
        <MapGL {...viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}>

          <DeckGLOverlay viewport={viewport} data={taxiData} />

        </MapGL>
      </div>
    );
  }
}

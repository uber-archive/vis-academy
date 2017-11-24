/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import {
  LayerControls,
  HEXAGON_CONTROLS
} from './layer-controls';
import Charts from './charts';
import {tooltipStyle} from './style';
import taxiData from '../../../data/taxi';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
    this._resize = this._resize.bind(this);
  }

  componentDidMount() {
    this.props.init({
      data: taxiData,
      settingsObject: HEXAGON_CONTROLS,
    });
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize() {
    this.props.changeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    return (
      <div>
        {this.props.hoveredObject &&
          <div style={{
            ...tooltipStyle,
            transform: `translate(${this.props.x}px, ${this.props.y}px)`
          }}>
            <div>{JSON.stringify(this.props.hoveredObject)}</div>
          </div>}
        {this.props.noControls ? null : <LayerControls
          settings={this.props.settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={this.props.updateLayerSettings}
        />}
        <MapGL
          {...this.props.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={this.props.changeViewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={this.props.viewport}
            data={this.props.points}
            hour={this.props.highlightedHour || this.props.selectedHour}
            onHover={this.props.hover}
            {...this.props.settings}
          />
        </MapGL>
        <Charts 
          {...this.props}
        />
      </div>
    );
  }
}

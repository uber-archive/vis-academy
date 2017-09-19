/* global window */
import React, {Component} from 'react';

// data
import SAMPLE_GRAPH from '../data/sample-graph2';
// components
import Graph from './graph';
import GraphRenderer from './graph-renderer'
import LayoutEngine from './layout-engine';

export default class App extends Component {

  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      viewport: {width, height}
    };
    this._engine = new LayoutEngine();

    // bind methods
    this._getEdgeColor = this._getEdgeColor.bind(this);
    this._getEdgeWidth = this._getEdgeWidth.bind(this);
    this._getNodeColor = this._getNodeColor.bind(this);
    this._getNodeSize = this._getNodeSize.bind(this);
    this._reRender = this._reRender.bind(this);
  }

  componentWillMount() {
    this._engine.registerCallbacks({
     onUpdate: this._reRender
    });
    this._processData();
  }

  componentWillUnmount() {
    this._engine.unregisterCallbacks();
  }

  _reRender() {
    this.forceUpdate();
  }

  _processData() {
    this._graph = new Graph();
    // load data
    if (SAMPLE_GRAPH) {
      const {viewport} = this.state;
      const {width, height} = viewport;
      SAMPLE_GRAPH.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          isHighlighted: false
        });
      });
      SAMPLE_GRAPH.edges.forEach(edge => {
        this._graph.addEdge({
          ...edge,
          isHighlighted: false
        });
      });
      // update engine
      this._engine.update(this._graph);
      this._engine.start();
    }
  }

  // node accessors
  _getNodeColor(node) {
    return [94, 94, 94];
  }

  _getNodeSize(node){
    return 10;
  }

  // edge accessors
  _getEdgeColor(edge) {
    return [64, 64, 64];
  }

  _getEdgeWidth() {
    return 2;
  }

  render() {
    if (this._graph.isEmpty()) {
      return null;
    }

    const {viewport} = this.state;
    return (
      <GraphRenderer
        /* viewport related */
        width={viewport.width}
        height={viewport.height}
        /* update trigger */
        alpha={this._engine.alpha()}
        /* nodes related */
        nodes={this._graph.nodes}
        getNodeColor={this._getNodeColor}
        getNodeSize={this._getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        /* edges related */
        edges={this._graph.edges}
        getEdgeColor={this._getEdgeColor}
        getEdgeWidth={this._getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}

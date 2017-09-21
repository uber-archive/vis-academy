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
  }

  componentWillMount() {
    this._engine.registerCallbacks({
     onUpdate: this.reRender
    });
    this.processData();
  }

  componentWillUnmount() {
    this._engine.unregisterCallbacks();
  }

  reRender() {
    this.forceUpdate();
  }

  processData() {
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
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10

  // edge accessors
  getEdgeColor = edge => [64, 64, 64]
  getEdgeWidth = () => 2

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
        /* update triggers */
        positionUpdateTrigger={this._engine.alpha()}
        /* nodes related */
        nodes={this._graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        /* edges related */
        edges={this._graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}

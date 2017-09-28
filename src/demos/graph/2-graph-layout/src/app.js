/* global window */
import React, { Component } from 'react'

// data
import sampleGraph from '../../data/sample-graph';

// utils
import Graph from '../../common/graph';
import LayoutEngine from '../../common/layout-engine';

// components
import GraphRender from './graph-render';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 1000,
        height: 700
      },
      graph: new Graph()
    };
    this._engine = new LayoutEngine();
  }

  componentDidMount() {
    this._engine.registerCallbacks(this.reRender);
    this.processData();
  }

  componentWillUnmount() {
    this._engine.unregisterCallbacks();
  }

  processData = () => {
    const newGraph = new Graph();
    sampleGraph.nodes.forEach(node =>
      newGraph.addNode(node)
    );
    sampleGraph.edges.forEach(edge =>
      newGraph.addEdge(edge)
    );
    this.setState({graph: newGraph});
    // update engine
    this._engine.update(newGraph);
    this._engine.start();
  }

  reRender = () => this.forceUpdate()

  // node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10

  // edge accessors
  getEdgeColor = edge => [64, 64, 64]
  getEdgeWidth = () => 2

  render() {
    if (this.state.graph.isEmpty()) {
      return null;
    }

    return (
      <GraphRender
        /* viewport related */
        width={this.state.viewport.width}
        height={this.state.viewport.height}
        /* update triggers */
        positionUpdateTrigger={this._engine.alpha()}
        /* nodes related */
        nodes={this.state.graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        /* edges related */
        edges={this.state.graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}

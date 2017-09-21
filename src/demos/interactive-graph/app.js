/* global window */
import React, { Component } from 'react'

// data
import SAMPLE_GRAPH from '../data/sample-graph2';

// components
import Graph from './graph';
import GraphRender from './graph-render';
import LayoutEngine from './layout-engine';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      hoveredNodeID: null
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

  processData = () => {
    this._graph = new Graph();
    // load data
    if (SAMPLE_GRAPH) {
      const {viewport} = this.state
      const {width, height} = viewport
      SAMPLE_GRAPH.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          isHighlighted: false,
        });
      });
      SAMPLE_GRAPH.edges.forEach(edge => {
        this._graph.addEdge({
          ...edge,
          isHighlighted: false,
        });
      });
      // update engine
      this._engine.update(this._graph);
      this._engine.start();
    }
  }

  reRender = () => this.forceUpdate()

  // node accessors
  getNodeColor = node => (node.isHighlighted ? [256, 0, 0] : [94, 94, 94])

  getNodeSize = node => 10

  onHoverNode = node => {
    // check if is hovering on a node
    const hoveredNodeID = node.object && node.object.id;
    if (hoveredNodeID) {
      // highlight the selected node and connected edges
      const connectedEdgeIDs =
        this._graph.findConnectedEdges(hoveredNodeID).map(e => e.id);
      this._graph.nodes.forEach(n => n.isHighlighted = n.id === hoveredNodeID);
      this._graph.edges.forEach(e => e.isHighlighted = connectedEdgeIDs.includes(e.id));
      // update component state
      this.setState({hoveredNodeID});
    } else {
      // unset all nodes and edges
      this._graph.nodes.forEach(n => n.isHighlighted = false);
      this._graph.edges.forEach(e => e.isHighlighted = false);
      // update component state
      this.setState({hoveredNodeID: null});
    }
  }

  // edge accessors
  getEdgeColor = edge => (edge.isHighlighted ? [256, 0, 0] : [64, 64, 64])

  getEdgeWidth = () => 2

  render() {
    if (this._graph.isEmpty()) {
      return null;
    }

    const {viewport, hoveredNodeID} = this.state;
    return (
      <GraphRender
        width={viewport.width}
        height={viewport.height}
        positionUpdateTrigger={this._engine.alpha()}
        colorUpdateTrigger={hoveredNodeID}
        nodes={this._graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        onHoverNode={this.onHoverNode}
        edges={this._graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}

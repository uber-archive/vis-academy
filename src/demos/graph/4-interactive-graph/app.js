/* global window */
import React, { Component } from 'react'

// data
import sampleGraph from '../../data/sample-graph2';

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
    this._graph = new Graph();
    this._engine = new LayoutEngine();
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this._engine.registerCallbacks(this.reRender);
    this.processData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    this._engine.unregisterCallbacks();
  }

  onResize = () => {
    this.setState({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  processData = () => {
    if (sampleGraph) {
      const {viewport} = this.state
      const {width, height} = viewport
      sampleGraph.nodes.forEach(node =>
        this._graph.addNode({
          id: node.id,
          isHighlighted: false,
        })
      );
      sampleGraph.edges.forEach(edge =>
        this._graph.addEdge({
          ...edge,
          isHighlighted: false,
        })
      );
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
        /* viewport related */
        width={viewport.width}
        height={viewport.height}
        /* update triggers */
        colorUpdateTrigger={hoveredNodeID}
        positionUpdateTrigger={this._engine.alpha()}
        /* nodes related */
        nodes={this._graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        onHoverNode={this.onHoverNode}
        /* edges related */
        edges={this._graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}

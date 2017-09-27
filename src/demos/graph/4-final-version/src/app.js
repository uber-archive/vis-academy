/* global window */
import React, { Component } from 'react'

// data
import sampleGraph from '../../data/sample-graph';
import Graph from '../../data/graph';

// components
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
      graph: new Graph(),
      hoveredNodeID: null
    };
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
      const newGraph = new Graph();
      sampleGraph.nodes.forEach(node =>
        newGraph.addNode({
          id: node.id,
          isHighlighted: false
        })
      );
      sampleGraph.edges.forEach(edge =>
        newGraph.addEdge({
          ...edge,
          isHighlighted: false
        })
      );
      this.setState({graph: newGraph});
      // update engine
      this._engine.update(newGraph);
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
    const graph = new Graph(this.state.graph);
    if (hoveredNodeID) {
      // highlight the selected node and connected edges
      const connectedEdgeIDs =
        this.state.graph.findConnectedEdges(hoveredNodeID).map(e => e.id);
      graph.nodes.forEach(n => n.isHighlighted = n.id === hoveredNodeID);
      graph.edges.forEach(e => e.isHighlighted = connectedEdgeIDs.includes(e.id));
    } else {
      // unset all nodes and edges
      graph.nodes.forEach(n => n.isHighlighted = false);
      graph.edges.forEach(e => e.isHighlighted = false);      
    }
    // update component state
    this.setState({graph, hoveredNodeID});
  }

  // edge accessors
  getEdgeColor = edge => (edge.isHighlighted ? [256, 0, 0] : [64, 64, 64])

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
        colorUpdateTrigger={this.state.hoveredNodeID}
        positionUpdateTrigger={this._engine.alpha()}
        /* nodes related */
        nodes={this.state.graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        onHoverNode={this.onHoverNode}
        /* edges related */
        edges={this.state.graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}

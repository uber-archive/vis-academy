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
      graph: new Graph(),
      hoveredNodeID: null
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

  reRender = () => this.forceUpdate()

  // node accessors
  getNodeColor = node => (node.isHighlighted ? [255, 0, 0] : [94, 94, 94])

  getNodeSize = node => 10


  onHoverNode = pickedObj => {
    // 1. check if is hovering on a node
    const hoveredNodeID = pickedObj.object && pickedObj.object.id;
    const graph = new Graph(this.state.graph);
    if (hoveredNodeID) {
      // 2. highlight the selected node, neighbor nodes, and connected edges
      const connectedEdges = this.state.graph.findConnectedEdges(hoveredNodeID);
      const connectedEdgeIDs = connectedEdges.map(e => e.id);
      const hightlightNodes = connectedEdges.reduce((res, e) => {
        if (!res.includes(e.source)) {
          res.push(e.source);
        }
        if (!res.includes(e.target)) {
          res.push(e.target);
        }
        return res;
      }, []);
      graph.nodes.forEach(n => n.isHighlighted = hightlightNodes.includes(n.id));
      graph.edges.forEach(e => e.isHighlighted = connectedEdgeIDs.includes(e.id));
    } else {
      // 3. unset all nodes and edges
      graph.nodes.forEach(n => n.isHighlighted = false);
      graph.edges.forEach(e => e.isHighlighted = false);      
    }
    // 4. update component state
    this.setState({graph, hoveredNodeID});
  }

  // edge accessors
  getEdgeColor = edge => (edge.isHighlighted ? [255, 0, 0] : [64, 64, 64])

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

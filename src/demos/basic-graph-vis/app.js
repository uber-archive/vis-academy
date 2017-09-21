/* global window */
import React, {Component} from 'react';

// data
import SAMPLE_GRAPH from '../data/sample-graph';

// components
import Graph from './graph';
import GraphRender from './graph-render'

function randomPosition(width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const x = Math.random() * width - halfWidth;
  const y = Math.random() * height - halfHeight;
  return [x, y];
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  componentWillMount() {
    this.processData();
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
          position: randomPosition(width, height)
        });
      });
      SAMPLE_GRAPH.edges.forEach(edge => {
        this._graph.addEdge(edge);
      });
    }
  }

  // node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10
  getNodePosition = node => this._graph.findNode(node.id).position

  // edge accessors
  getEdgeColor = edge => [64, 64, 64]
  getEdgeWidth = () => 2
  getEdgePosition = edge => ({
    sourcePosition: this._graph.findNode(edge.source).position,
    targetPosition: this._graph.findNode(edge.target).position
  })

  render() {
    if (this._graph.isEmpty()) {
      return null;
    }

    const {viewport} = this.state;
    return (
      <GraphRender
        /* viewport related */
        width={viewport.width}
        height={viewport.height}
        /* nodes related */
        nodes={this._graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this.getNodePosition}
        /* edges related */
        edges={this._graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this.getEdgePosition}
      />
    );
  }
}

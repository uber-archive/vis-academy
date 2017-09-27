/* global window */
import React, {Component} from 'react';

// data
import sampleGraph from '../../data/sample-graph';
import Graph from '../../data/graph';

// components
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
      },
      graph: new Graph()
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.processData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  processData() {
    if (sampleGraph) {
      const width = this.state.viewport.width;
      const height = this.state.viewport.height;
      const newGraph = new Graph();
      sampleGraph.nodes.forEach(node =>
        newGraph.addNode({
          id: node.id,
          position: randomPosition(width, height)
        })
      );
      sampleGraph.edges.forEach(edge =>
        newGraph.addEdge(edge)
      );
      this.setState({graph: newGraph});
    }
  }

  // node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10
  getNodePosition = node => node.position

  // edge accessors
  getEdgeColor = edge => [64, 64, 64]
  getEdgeWidth = () => 2
  getEdgePosition = edge => ({
    sourcePosition: this.state.graph.findNode(edge.source).position,
    targetPosition: this.state.graph.findNode(edge.target).position
  })

  render() {
    if (this.state.graph.isEmpty()) {
      return null;
    }

    return (
      <GraphRender
        /* viewport related */
        width={this.state.viewport.width}
        height={this.state.viewport.height}
        /* nodes related */
        nodes={this.state.graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this.getNodePosition}
        /* edges related */
        edges={this.state.graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this.getEdgePosition}
      />
    );
  }
}

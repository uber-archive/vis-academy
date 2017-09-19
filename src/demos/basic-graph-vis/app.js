/* global window */
import React, {Component} from 'react';

// data
import SAMPLE_GRAPH from '../data/sample-graph';
// components
import Graph from './graph';
import GraphRenderer from './graph-renderer'

function randomPosition(width, height) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  return [x, y];
}

export default class App extends Component {

  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.state = {
      viewport: {
        width,
        height,
        scale: 1,
        offset: {
          x: -1 * width / 2,
          y: -1 * height / 2
        }
      }
    };

    // bind methods
    this._getEdgeColor = this._getEdgeColor.bind(this);
    this._getEdgeWidth = this._getEdgeWidth.bind(this);
    this._getEdgePosition = this._getEdgePosition.bind(this);
    this._getNodeColor = this._getNodeColor.bind(this);
    this._getNodeSize = this._getNodeSize.bind(this);
    this._getNodePosition = this._getNodePosition.bind(this);
  }

  componentWillMount() {
    this._processData();
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
          position: randomPosition(width, height),
          isHighlighted: false
        });
      });
      SAMPLE_GRAPH.edges.forEach(edge => {
        this._graph.addEdge({
          ...edge,
          isHighlighted: false
        });
      });
    }
  }

  // node accessors
  _getNodeColor(node) {
    return [94, 94, 94, 256];
  }

  _getNodeSize(node){
    return 10;
  }

  _getNodePosition(node) {
    return this._graph.findNode(node.id).position;
  }

  // edge accessors
  _getEdgeColor(edge) {
    return [64, 64, 64, 256];
  }

  _getEdgeWidth() {
    return 5;
  }

  _getEdgePosition(edge) {
    return {
      sourcePosition: this._graph.findNode(edge.source).position,
      targetPosition: this._graph.findNode(edge.target).position
    };
  }

  render() {
    if (this._graph.isEmpty()) {
      return null;
    }

    const {viewport} = this.state;
    return (
      <div>
        <GraphRenderer
          /* viewport related */
          width={viewport.width}
          height={viewport.height}
          offset={viewport.offset}
          scale={viewport.scale}
          /* nodes related */
          nodes={this._graph.nodes}
          getNodeColor={this._getNodeColor}
          getNodeSize={this._getNodeSize}
          getNodePosition={this._getNodePosition}
          /* edges related */
          edges={this._graph.edges}
          getEdgeColor={this._getEdgeColor}
          getEdgeWidth={this._getEdgeWidth}
          getEdgePosition={this._getEdgePosition}
        />
      </div>
    );
  }
}

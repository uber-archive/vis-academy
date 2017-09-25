/* global window */
import React, {Component} from 'react';

// data
import sampleGraph from '../../data/sample-graph2';

// components
import Graph from './graph';
import GraphRender from './graph-render'
import LayoutEngine from './layout-engine';

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

  processData() {
    if (sampleGraph) {
      const {viewport} = this.state;
      const {width, height} = viewport;
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

    const {viewport} = this.state;
    return (
      <GraphRender
        /* viewport related */
        width={viewport.width}
        height={viewport.height}
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

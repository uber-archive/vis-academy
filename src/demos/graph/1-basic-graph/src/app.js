/* global window */
import React, {Component} from 'react';

// data
import sampleGraph from '../../data/sample-graph';

// utils
import Graph from '../../common/graph';

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
    this.processData();
  }

  processData() {
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

  render() {
    if (this.state.graph.isEmpty()) {
      return null;
    }

    // add GraphRender component here
    return (
      <div>
        <div className='intro'>
          Graph is loaded in the state.
        </div>
      </div>
    );
  }
}

<ul class='insert learning-objectives'>
  <li>Interaction: hover to highlight</li>
</ul>

## Add visual property

First, we need to add a new visual property 'isHighlighted' to nodes and edges.
We will change the color to red when `isHighlighted` is true.

```js
export default class App extends Component {
  processData = () => {
    // ...
    if (sampleGraph) {
      // ...
      sampleGraph.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          isHighlighted: false,
        });
      });
      sampleGraph.edges.forEach(edge => {
        this._graph.addEdge({
          ...edge,
          isHighlighted: false,
        });
      });
      // ...
    }
  }
}
```

## Add hover event listener

For more detail about picking behavior, please see the documentation [here](https://uber.github.io/deck.gl/#/documentation/advanced-topics/picking).

```js
// graph-render.js
export default class GraphRender extends PureComponent {
  // ...

  createNodeLayer() {
    const {
      // ...
      onHoverNode
    } = this.props;

    return new ScatterplotLayer({
      // ...
      onHover: onHoverNode,
      pickable: true
    });
  }

  // ...
}

// app.js
export default class App extends Component {
  constructor(props) {
    // ...
    this.state = {hoveredNodeID: null};
  }

  // ...

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

  render() {
    // ...
    return (
      <GraphRender
        // ...
        onHoverNode={this.onHoverNode}
      />
    );
  }
}
```

## Add color update trigger

As we mentioned in the previous [step](), `deck.gl` doesn't re-evaluate the `getColor` unless we define the updateTrigger for `getColor` explicitly.

```js
export default class App extends Component {
  // ...

  render() {
    // ...
    return (
      <GraphRender
        // ...
        colorUpdateTrigger={hoveredNodeID}
      />
    );
  }
}

export default class GraphRender extends PureComponent {
  // ...

  createNodeLayer() {
    const {
      // ...
      colorUpdateTrigger
    } = this.props;

    return new ScatterplotLayer({
      // ...
      updateTriggers: {
        getPosition: positionUpdateTrigger,
        getColor: colorUpdateTrigger
      }
    });
  }

  createEdgeLayer() {
    const {
      // ...
      colorUpdateTrigger
    } = this.props;

    return new LineLayer({
      // ...
      updateTriggers: {
        getSourcePosition: positionUpdateTrigger,
        getTargetPosition: positionUpdateTrigger,
        getColor: colorUpdateTrigger
      }
    });
  }

  // ...
}

```

## Complete code

Our completed component [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/starting-with-map/app.js) should now look like this:


```js

// app.js
/* global window */
import React, { Component } from 'react'

// data
import sampleGraph from '../data/sample-graph2';

// components
import Graph from './graph';
import GraphRender from './graph-render';
import LayoutEngine from './layout-engine';

export default class App extends Component {
  constructor(props) {
    super(props);
    this._graph = new Graph();
    this.state = {hoveredNodeID: null};
    this._engine = new LayoutEngine();
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.processData();
  }

  componentWillMount() {
    this._engine.registerCallbacks({
     onUpdate: this.reRender
    });
  }

  componentWillUnmount() {
    this._engine.unregisterCallbacks();
  }

  handleResize() => {
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
      sampleGraph.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          isHighlighted: false,
        });
      });
      sampleGraph.edges.forEach(edge => {
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

// graph-render.js
import React, {PureComponent} from 'react';

import DeckGL, {
  LineLayer,
  ScatterplotLayer,
  OrthographicViewport,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRender extends PureComponent {

  creatViewport() {
    const {height, width} = this.props;
    return new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
    });
  }

  createNodeLayer() {
    const {
      nodes,
      getNodeColor,
      getNodePosition,
      getNodeSize,
      onHoverNode,
      // update triggers
      colorUpdateTrigger,
      positionUpdateTrigger,
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: node => getNodePosition(node),
      // getPosition: getNodePosition,
      // ^^^ this doesn't work?
      getRadius: getNodeSize,
      getColor: getNodeColor,
      onHover: onHoverNode,
      pickable: true,
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getPosition: positionUpdateTrigger,
        getColor: colorUpdateTrigger
      }
    });
  }

  createEdgeLayer() {
    const {
      edges,
      getEdgeColor,
      getEdgePosition,
      getEdgeWidth,
      // update triggers
      colorUpdateTrigger,
      positionUpdateTrigger,
    } = this.props;

    return new LineLayer({
      id: 'edge-layer',
      data: edges,
      getSourcePosition: e => getEdgePosition(e).sourcePosition,
      getTargetPosition: e => getEdgePosition(e).targetPosition,
      getColor: getEdgeColor,
      strokeWidth: getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getSourcePosition: positionUpdateTrigger,
        getTargetPosition: positionUpdateTrigger,
        getColor: colorUpdateTrigger
      }
    });
  }

  render() {
    const {height, width} = this.props;
    return (
      <div id="graph-render">
        <DeckGL
          width={width}
          height={height}
          viewport={this.creatViewport()}
          layers={[
            this.createEdgeLayer(),
            this.createNodeLayer()
          ]}
        />
      </div>
    );
  }
}
```
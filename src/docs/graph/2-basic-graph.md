<ul class='insert learning-objectives'>
<li>Render a graph with random layout in a React application,</li>
<li>Update the viewport when resizing the window</li>
</ul>

# Starting With a Graph

Checkout the complete code for this step
[here](https://github.com/uber-common/vis-academy/tree/master/demos/starting-with-graph).

## 1. Start with a bare React Component

**HOLD UP!!!** If you got here without reading the **Setup** step, it is
highly recommended that you do so, or your application might not work.
[GO HERE](#/graph-vis/setup) and go through it now.

The app component in the starting code above currently looks like this:
```js
...
export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Empty App, Edit Me!</div>
    );
  }

}
```
The next steps of this tutorial will only refer to parts of the outline shown
above, and not the whole thing.

## 2. Add Graph Data

We already prepared the sample graph data in the repository
[here](https://github.com/uber-common/vis-tutorial/blob/master/demos/data/sample-graph.js),
and then import the file into your `app.js` component.

```js
import sampleGraph from '../data/sample-graph';
```

Now we need to process this data into a usable format. 
We already prepared a basic graph class [here](https://github.com/uber-common/vis-tutorial/blob/master/demos/graph/1-starting-code/graph.js) for storing graph data and some basic graph operations.

We add a `processData` method and call it when component mounts to process the data.

```js
export default class App extends Component {

  constructor(props) {
    // ...
    this.state = {
      graph: new Graph
    };
  }

  componentDidMount() {
    // ...
    this.processData();
  }

  processData() {
    if (sampleGraph) {
      const newGraph = new Graph();
      sampleGraph.nodes.forEach(node =>
        newGraph.addNode(node)
      );
      sampleGraph.edges.forEach(edge =>
        newGraph.addEdge(edge)
      );
      this.setState({graph: newGraph});
    }
  }

  // ...
}
```

## 3. Random position for nodes

Once we loaded the graph, we need to assign positions to the nodes so they can be plotted.
In this example, we can just assign random positions to the nodes within the container.


```js
function randomPosition(width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const x = Math.random() * width - halfWidth;
  const y = Math.random() * height - halfHeight;
  return [x, y];
}

export default class App extends Component {
  // ...

  processData() {
    if (sampleGraph) {
      const newGraph = new Graph();
      const {viewport} = this.state;
      const {width, height} = viewport;
      sampleGraph.nodes.forEach(node =>
        newGraph.addNode({
          id: node.id,
          position: randomPosition(width, height)
        })
      );
      // ...
    }
  }

  // ...
}

```


## 4. Viewport State

The next thing will be the state of the viewport, here we only need the size of the window.
The width and height can be easily retrieved from the global object `window`.
We set the viewport object on component state because `deck.gl` leaves
the control of the viewport to the user. We will have to update this viewport
manually and pass it back into `deck.gl` if the size of the window changes.
Let's quickly add the viewport state and the resize handler that updates our viewport with the new dimension:

```js
export default class App extends Component {
  constructor(props) {
    // ...
    this.state = {
      // ...
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    // ...
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  // ...
}
```

## 5. Connect everything together

The last step, we now can connect the accessors of nodes and edges with the `GraphRender` component.
To simplify the application, the color accessor and size/width accessor will only return constant values.
`getNodePosition` will simply return the `position` property of the node.
`getEdgePosition` will try to find the source/target node and return its position.

```js
export default class App extends Component {
  // ...

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
    // ...
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

```

<ul class='insert takeaways'>
<li>GraphRender behaves just as another React component with props and callbacks.</li>
<li>Basic settings of the nodes and edges are controlled by the accessors in `app.js`.</li>
<li>`onResize` method will be triggered and to update the viewport when a user resizes the window.</li>
</ul>

## Completed Code

Our completed component [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/1-basic-graph/src/app.js) should now look like this:

```js
/* global window */
import React, {Component} from 'react';

// data
import sampleGraph from '../data/sample-graph2';

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
      graph: new Graph(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.processData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() => {
    this.setState({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  processData() {
    this._graph = new Graph();
    // load data
    if (sampleGraph) {
      const newGraph = new Graph();
      const {viewport} = this.state;
      const {width, height} = viewport;
      sampleGraph.nodes.forEach(node =>
        newGraph.addNode({
          id: node.id,
          position: randomPosition(width, height)
        })
      );
      sampleGraph.edges.forEach(edge => {
        newGraph.addEdge(edge);
      });
      this.setState({graph: newGraph});
    }
  }

  // node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10
  getNodePosition =
    node => node.position

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
```

That's all you need to render a graph and make it interactive!

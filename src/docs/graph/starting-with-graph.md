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
[GO HERE](https://uber-common.github.io/vis-academy/#/graph/setup) and go through it now.

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
We already prepared a basic graph class [here]() for storing graph data and some basic graph operations.

We add a `processData` method and call it when component mounts to process
the data.

```js
export default class App extends Component {

  constructor(props) {
    // ...
    this._graph = new Graph();
  }

  componentDidMount() {
    // ...
    this.processData();
  }

  processData() {
    if (sampleGraph) {
      sampleGraph.nodes.forEach(node =>
        this._graph.addNode(node);
      );
      sampleGraph.edges.forEach(edge =>
        this._graph.addEdge(edge);
      );
    }
  }

  // ...
}
```

## 3. Random position for nodes

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
    if (SAMPLE_GRAPH) {
      const {viewport} = this.state;
      const {width, height} = viewport;
      SAMPLE_GRAPH.nodes.forEach(node =>
        this._graph.addNode({
          id: node.id,
          position: randomPosition(width, height)
        });
      );
      SAMPLE_GRAPH.edges.forEach(edge =>
        this._graph.addEdge(edge);
      );
    }
  }

  // ...
}

```


## 4. Viewport State

We now have a fully functional map, and we could stop here. But what happens
when you resize the window? If you do it right now, you'll notice that the map
stays the same size. That's a terrible user experience, and we wouldn't want that.

Let's quickly add a resize handler that updates our viewport with the new dimension
```js
export default class App extends Component {
  // ...

  componentDidMount() {
    // ...
    window.addEventListener('resize', this.onResize);
    this.onResize();
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

}
```

## 5. Connect everything together

```js
export default class App extends Component {

  // ...

  // node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10
  getNodePosition =
    node => this._graph.findNode(node.id).position

  // edge accessors
  getEdgeColor = edge => [64, 64, 64]
  getEdgeWidth = () => 2
  getEdgePosition = edge => ({
    sourcePosition: this._graph.findNode(edge.source).position,
    targetPosition: this._graph.findNode(edge.target).position
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
<li>We can use the ReactMapGL's MapGL component to use a map in React.</li>
<li>MapGL behaves just as another React component with props and callbacks.</li>
<li>Basic settings of the map are stored in the __viewport__ prop.</li>
<li>the __onViewportChange__ prop can be used to update the viewport when a user interacts with the map.</li>
</ul>

## Completed Code

Our completed component [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/starting-with-map/app.js) should now look like this:

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
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.processData();
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
      const {viewport} = this.state;
      const {width, height} = viewport;
      sampleGraph.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          position: randomPosition(width, height)
        });
      });
      sampleGraph.edges.forEach(edge => {
        this._graph.addEdge(edge);
      });
    }
  }

  // node accessors
  getNodeColor = node => [94, 94, 94]
  getNodeSize = node => 10
  getNodePosition =
    node => this._graph.findNode(node.id).position

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

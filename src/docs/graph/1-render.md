<ul class='insert learning-objectives'>
  <li>Create a GraphRender component</li>
</ul>

First of all, we will need to create a render engine to draw the nodes and edges of the graph on the canvas. 
[Deck.GL](http://uber.github.io/deck.gl) is a WebGL overlay suite for React,
providing a set of highly performant data visualization overlays that we can compose the visualization layer by layer.
Let's get your hands on the component and add the layers by following steps:


## 1. Create a GraphRender Component

Create a new file named `graph-render.js` in `src/` folder where we will put the deck.gl component. First, let's layout the component:

```js
import React, {Component} from 'react';
import DeckGL from 'deck.gl';

export default class GraphRender extends Component {
  render() {
    const layers = [];
    return (
      <DeckGL layers={layers} />
    );
  }
}
```

This gives us the basic structure, using the `DeckGL` react component to render our `deck.gl` overlay.
You'll notice that `layers` is being passed to `DeckGL` but it's an empty array.
We have to initialize each `deck.gl` layer separately. 
`Deck.GL` comes with several prepackaged layers that we can use to show all kinds graph visualization.
Let's edit the function and creat a node layer in `render()` function.

## 2. Node Layer: Add Scatterplot Layer with Deck.gl

[Scatterplot](https://uber.github.io/deck.gl/#/documentation/layer-catalog/scatterplot-layer) can be used to plot point locations. You can color the points to show different types of nodes, or have its radius based on a numeric metric such as the degree of node or any other node attributes.

We will pass the data `nodes` and accessors like `getNodeColor`, `getNodePosition`, and `getNodeSize` as props to this `GraphRender` component later.

```js
import DeckGL, {
  ScatterplotLayer,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRender extends Component {

  createNodeLayer() {
    return new ScatterplotLayer({
      id: 'node-layer',
      data: this.props.nodes,
      getPosition: this.props.getNodePosition,
      getRadius: this.props.getNodeSize,
      getColor: this.props.getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  // ...
}
```

Let's go over some properties of the `ScatterplotLayer` above:

##### `data` {Array}
Array of points for the layer. In this case, it's the nodes of the graph.
format as `[{id: nodeId, position: [x, y]}, {id: nodeId, position: [x, y]}, ...]`

##### `getPosition` {Function}
Function that gets called for the position of each node, should return [x, y].

#### `getRadius` {Function}
Function that gets called for the radius of each node, should return a number.

#### `getColor` {Function}
Function that gets called for the color of each node, should return an array [r, g, b, alpha].
If the alpha parameter is not provided, it will be set to 255.

#### `projectionMode` {Number}
COORDINATE_SYSTEM.IDENTITY: no projection


## 3. Edge Layer: Add Line Layer with Deck.gl

[LineLayer](https://uber.github.io/deck.gl/#/documentation/layer-catalog/line-layer) can be used to plot a series of lines.

The color and stroke width also can controlled by the accessors. Note that we expect the accessor `getEdgePosition` will return `{sourcePosition: [x, y], targetPosition: [x, y]}`.

```js
import DeckGL, {
  // ...
  LineLayer
} from 'deck.gl';

export default class GraphRender extends Component {
  // ...

  createEdgeLayer() {
    return new LineLayer({
      id: 'edge-layer',
      data: this.props.edges,
      getSourcePosition: e =>
        this.props.getEdgePosition(e).sourcePosition,
      getTargetPosition: e =>
        this.props.getEdgePosition(e).targetPosition,
      getColor: this.props.getEdgeColor,
      strokeWidth: this.props.getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  // ...
}
```

Here are some properties we used in the `LineLayer` above:

##### `data` {Array}
Array of lines for the layer. In this case, it's the edges of the graph.
The expected format is:
```
data = [
  {source: sourceNodeId, target: targetNodeId},
  {source: sourceNodeId, target: targetNodeId},
  ...
]
```

##### `getSourcePosition` {Function}
Function that gets called for the position of ther source node, should return [x, y].

#### `getTargetPosition` {Function}
Function that gets called for the position of ther target node, should return [x, y].

#### `getColor` {Function}
Function that gets called for the color of the edge, should return an array [r, g, b, alpha].
If the alpha parameter is not provided, it will be set to 255.

#### `strokeWidth` {Number}
The stroke width used to draw each line. Unit is pixels.

#### `projectionMode` {Number}
COORDINATE_SYSTEM.IDENTITY: no projection

## 4. Viewport

The `Viewport` manages projection and unprojection of coordinates between world and viewport coordinates (which is essentially a 3D matrix "camera" class of the type you would find in any 3D/WebGL/OpenGL library, holding `view` and `projection` matrices). OrthographicViewport will place the camera on the top and look at the graph.

```js
import DeckGL, {
  // ...
  OrthographicViewport
} from 'deck.gl';

export default class GraphRender extends Component {
  
  createViewport() {
    const {height, width} = this.props;
    return new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
    });
  }

  // ...
}
```

## 5. Put it all together

Navigate to bottom of graph-rener.js and add the `render` function.

```js
export default class GraphRender extends PureComponent {
  // ...

  render() {
    return (
      <div id="graph-render">
        <DeckGL
          width={this.props.width}
          height={this.props.height}
          viewport={this.createViewport()}
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

render() is simply render the deck.gl instance with the viewport and layers we created.

<ul class='insert takeaways'>
<li>GraphRender component contains viewport, node layer, and edge layer.</li>
<li>The setting of nodes and edges can be controlled by the properties passed into this component.</li>
</ul>

## 5. Complete Code

Our completed component [graph-render.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/1-basic-graph/src/graph-render.js) should now look like this:

```js
import React, {PureComponent} from 'react';

import DeckGL, {
  LineLayer,
  ScatterplotLayer,
  OrthographicViewport,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRender extends PureComponent {

  createViewport() {
    const width = this.props.width;
    const height = this.props.height;
    return new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
    });
  }

  createNodeLayer() {
    return new ScatterplotLayer({
      id: 'node-layer',
      data: this.props.nodes,
      getPosition: node => this.props.getNodePosition(node),
      // getPosition: this.props.getNodePosition,
      getRadius: this.props.getNodeSize,
      getColor: this.props.getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getPosition: this.props.positionUpdateTrigger
      }
    });
  }

  createEdgeLayer() {
    return new LineLayer({
      id: 'edge-layer',
      data: this.props.edges,
      getSourcePosition: e =>
        this.props.getEdgePosition(e).sourcePosition,
      getTargetPosition: e =>
        this.props.getEdgePosition(e).targetPosition,
      getColor: this.props.getEdgeColor,
      strokeWidth: this.props.getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getSourcePosition: this.props.positionUpdateTrigger,
        getTargetPosition: this.props.positionUpdateTrigger
      }
    });
  }

  render() {
    return (
      <div id="graph-render">
        <DeckGL
          width={this.props.width}
          height={this.props.height}
          viewport={this.createViewport()}
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
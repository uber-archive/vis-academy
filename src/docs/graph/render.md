<ul class='insert learning-objectives'>
  <li>Create a GraphRender component</li>
  <li>Render a graph with random layout</li>
</ul>

## 1. Create a Graph Render Component

Create a new file named `graph-render.js` where we will put the deck.gl
component. First, let's layout the component:

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

[Deck.GL](http://uber.github.io/deck.gl) is a WebGL overlay suite for React,
providing a set of highly performant data visualization overlays.
This gives us the basic structure, using the export `DeckGL` react component
to render our `deck.gl` overlay. You'll notice that `layers` is being passed to
`DeckGL` but it's an empty array. We have to initialize each `deck.gl` layer
separately. 
`Deck.GL` comes with several prepackaged layers that we can use to show all kinds graph visualization.
Let's edit the function and creat a `node layer` in `render()` function.


## 2. Node Layer: Add Scatterplot Layer with Deck.gl

[Scatterplot](https://uber.github.io/deck.gl/#/documentation/layer-catalog/scatterplot-layer) can be used to plot point locations. You can color the points to show different types of nodes, or have its radius based on a numeric metric such as the degree of node or any other node attributes.

Let's see if we can add a `Scatterplot` overlay with the graph node data we loaded in the previous example.

```js
import DeckGL, {
  ScatterplotLayer,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRender extends Component {

  renderNodeLayer() {
    const {
      nodes,
      getNodeColor,
      getNodePosition,
      getNodeSize
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: getNodePosition,
      getRadius: getNodeSize,
      getColor: getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  // ...
}
```

## 3. Edge Layer: Add Line Layer with Deck.gl

[LineLayer](https://uber.github.io/deck.gl/#/documentation/layer-catalog/line-layer) can be used to plot a series of lines. The color of the line can be also coded by edge attributes.

```js
import DeckGL, {
  // ...
  LineLayer
} from 'deck.gl';

export default class GraphRender extends Component {
  // ...

  renderEdgeLayer() {
    const {
      edges,
      getEdgeColor,
      getEdgePosition,
      getEdgeWidth
    } = this.props;

    return new LineLayer({
      id: 'edge-layer',
      data: edges,
      getSourcePosition: e => getEdgePosition(e).sourcePosition,
      getTargetPosition: e => getEdgePosition(e).targetPosition,
      getColor: getEdgeColor,
      strokeWidth: getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  // ...
}
```

## 4. Viewport

```js
import DeckGL, {
  // ...
  OrthographicViewport
} from 'deck.gl';

export default class GraphRender extends Component {
  
  creatViewport() {
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

## 5. Complete Code

Our completed component [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/starting-with-map/app.js) should now look like this:

```js
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

  renderNodeLayer() {
    const {
      nodes,
      getNodeColor,
      getNodePosition,
      getNodeSize
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: getNodePosition,
      getRadius: getNodeSize,
      getColor: getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  renderEdgeLayer() {
    const {
      edges,
      getEdgeColor,
      getEdgePosition,
      getEdgeWidth
    } = this.props;

    return new LineLayer({
      id: 'edge-layer',
      data: edges,
      getSourcePosition: e => getEdgePosition(e).sourcePosition,
      getTargetPosition: e => getEdgePosition(e).targetPosition,
      getColor: getEdgeColor,
      strokeWidth: getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
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
            this.renderEdgeLayer(),
            this.renderNodeLayer()
          ]}
        />
      </div>
    );
  }
}
```

Let's go over some properties of the layers we used:

[Deck.gl documentation of Scatterplot Layer](https://uber.github.io/deck.gl/#/documentation/layer-catalog/scatterplot-layer)

## Scatterplot Layer Properties

Let's go over just some properties of the `ScatterplotLayer` above:

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
COORDINATE_SYSTEM.IDENTITY


## Line Layer Properties

[Deck.gl documentation of Line Layer](https://uber.github.io/deck.gl/#/documentation/layer-catalog/line-layer)
Properties of the `LineLayer` above:

data: edges,
      getSourcePosition: e => getEdgePosition(e).sourcePosition,
      getTargetPosition: e => getEdgePosition(e).targetPosition,
      getColor: getEdgeColor,
      strokeWidth: getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY

##### `data` {Array}
Array of lines for the layer. In this case, it's the edges of the graph.
format as `[{source: sourceNodeId, target: targetNodeId}, {source: sourceNodeId, target: targetNodeId}, ...]`

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
COORDINATE_SYSTEM.IDENTITY
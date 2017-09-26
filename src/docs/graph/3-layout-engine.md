<ul class='insert learning-objectives'>
  <li>Plugin a Graph Layout Engine</li>
</ul>


## Layout engine

Spring system simulation
annealing

Decouple the layout calculation logic from the rendering, 

Layout engine will trigger onUpdate callback function when every step of the 'simulation' is finished.


[D3 Force](https://github.com/d3/d3-force)

First, we need to install [d3-force(https://github.com/d3/d3-force) from npm:
```
yarn add d3-force
or
npm install d3-force --save-dev (slower)
```
Layout engine will trigger onUpdate callback function when every step of the 'simulation' is finished.


```js
import * as d3 from 'd3-force';

// ...

export default class LayoutEngine {

  constructor(props) {
    this._d3Graph = {nodes: [], edges: []};
    // ...
    this._simulator = d3.forceSimulation(_d3Graph.nodes)...
    this._simulator.on('tick', this.ticked);
  }

  // ...

  registerCallbacks(onUpdate) {
    this._onUpdateCallback = onUpdate;
  }

  ticked = () => {
    // ...
    this._onUpdateCallback();
  }

  start() {
    // ...
    this._simulator.alpha(alpha).restart();
  }

  // ...
}
```
For more detail, please see the complete code of the layout engine at [here]().
Note that, the layout engine should be replaceable with any other implementation to achieve different type of graph layout.

Let's plug in the layout engine we have here with our graph application.

## 1. Start layout engine

To speedup the rendering, we want the component rerender without 'diffing' the component state of props.
One trick we can do here is to call 'forceUpdate()' method to rerender the component.

```js
// step0: import layout engine
import LayoutEngine from './layout-engine';

export default class App extends Component {
  constructor(props) {
    // ...
    // step1: instantiate layout engine
    this._engine = new LayoutEngine();
  }

  componentDidMount() {
    // ...
    // step2: register onUpdate callback.
    this._engine.registerCallbacks(this.reRender);
  }

  reRender = () => this.forceUpdate()

  processData() {
    // ...
    if (sampleGraph) {
      // ...
      const newGraph = new Graph();
      newGraph.nodes.forEach(node => {
        newGraph.addNode(node);
      });
      sampleGraph.edges.forEach(edge => {
        newGraph.addEdge(edge);
      });
      this.setState({graph: newGraph});
      // step3: update engine
      this._engine.update(this._graph);
      // step4: start the engine
      this._engine.start();
    }
  }

  // ...
}
```

See the complete doe of the layout engine at [here]().

## 2. Connect Render with engine

Once the engine has been lauched, we can start to get the node/edge positions from the engine instead of reading the position from the internal graph (`this._graph`).

```js
export default class App extends Component {
  // ...

  render() {
    // ...
    return (
      <GraphRender
      	// ...
        getNodePosition={this._engine.getNodePosition}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}
```

## 3. Update trigger

<!-- The last part is to trigger `deck.gl` to update when every time the layout is updated. -->
In the previous step, we connected `getNodePosition` and `getEdgePosition` with the accessors in the layout engine. However, `deck.gl` doesn't recalculate positions unlesss the data prop changes by shallow comparison. To inform deck.gl to re-evaluate `getPosition` outcome, we need to explicitly define `updateTriggers`. 
`updateTriggers` expect an object whose keys are names of accessor props of this layer, and values are one or more variables that affect the output of the accessors. In our case, the key is 'getPosition' and the value can be the `alpha` value from the layout engine since the value of alpha changes when layout updated.

```js
// layout-engine.js
export default class GraphRender extends PureComponent {
  // ...

  renderNodeLayer() {
    const {
      //...
      positionUpdateTrigger
    } = this.props;

    return new ScatterplotLayer({
      // ...
      updateTriggers: {
        getPosition: positionUpdateTrigger
      }
    });
  }

  renderEdgeLayer() {
    const {
      // ...
      positionUpdateTrigger
    } = this.props;

    return new LineLayer({
      updateTriggers: {
        getSourcePosition: positionUpdateTrigger,
        getTargetPosition: positionUpdateTrigger
      }
    });
  }

  // ...
}

// app.js
export default class App extends Component {
  // ...

  render() {
    // ...
    return (
      <GraphRender
      	// ...
        positionUpdateTrigger={this._engine.alpha()}
      />
    );
  }
}
```

<ul class='insert takeaways'>
<li></li>
</ul>

## Complete code

Our completed component [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/2-graph-layout/src/app.js) should now look like this:

```js
// app.js
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
      getNodeSize,
      // update triggers
      positionUpdateTrigger
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: node => getNodePosition(node),
      // getPosition: getNodePosition,
      // ^^^ this doesn't work?
      getRadius: getNodeSize,
      getColor: getNodeColor,
      pickable: true,
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getPosition: positionUpdateTrigger
      }
    });
  }

  renderEdgeLayer() {
    const {
      edges,
      getEdgeColor,
      getEdgePosition,
      getEdgeWidth,
      // update triggers
      positionUpdateTrigger
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
        getTargetPosition: positionUpdateTrigger
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
            this.renderEdgeLayer(),
            this.renderNodeLayer()
          ]}
        />
      </div>
    );
  }
}
```
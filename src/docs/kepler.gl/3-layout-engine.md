<!-- INJECT:"GraphLayout" -->

<ul class='insert learning-objectives'>
  <li>Plugin a Graph Layout Engine</li>
  <li>Get new graph layout from layout engine</li>
</ul>

**HOLD UP!!!** If you got here without reading the previous steps,
it is highly recommended that you do so, or you can just check out the complete code from the previous step:
```
cd src/demos/graph/1-basic-graph
```

# What Will We Do
In this step, we will add a layout engine with the `app.js` for calculating graph layout.
Here's the overview of the architecture:
<p class="inline-images center">
  <img src="images/graph-vis/architecture-with-layout-engine.png" alt="extruded" width="600px"/>
</p>

## 1. D3 Force Layout Engine

First, we need to install [d3-force](https://github.com/d3/d3-force) from npm:
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
    // ...
    // 0. instantiate d3 force layout
    this._simulator = d3.forceSimulation(graph.nodes)...
    // 1. register callback when every 'simulation' is finished.
    this._simulator.on('tick', this.ticked);
  }

  registerCallbacks(onUpdate) {
    // 2. register external callback
    this._onUpdateCallback = onUpdate;
  }

  ticked = () => {
    // 3. trigger registered callback
    this._onUpdateCallback();
  }

  start() {
    // ...
    // 4. start the layout simulation
    this._simulator.alpha(alpha).restart();
  }

  // ...
}
```
The main purpose is to decouple the layout calculation logic from the rendering.
We already wrote the layout engine for you, so you can just import it to your `app.js`;
For more detail, please see the complete code of the layout engine at [here](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/common/layout-engine.js).
Note that, the layout engine should be replaceable with any other implementation to achieve a different type of graph layout.

Now let's plug in the layout engine with our graph application.

## 2. Start Layout Engine

Once the layout engine is instantiated in the constructor, we will need to register the update callback to get notified when the laout simulation is finished on each step. 
To speed up the rendering, we want the component rerender without 'diffing' the component state and props.
One trick we can do here is to call 'forceUpdate()' method to rerender the component when the layout simulation is completed on each step.

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
    const newGraph = new Graph();
    newGraph.nodes.forEach(node => {
      newGraph.addNode(node);
    });
    sampleGraph.edges.forEach(edge => {
      newGraph.addEdge(edge);
    });
    this.setState({graph: newGraph});
    // step3: update engine
    this._engine.update(newGraph);
    // step4: start the engine
    this._engine.start();
  }

  // ...
}
```

## 3. Connect Graph Render with Layout Engine

Once the engine has been launched, we can start to get the node/edge positions from the engine instead of getting the positions from the graph in the component state(`this.state.graph`).

```js
export default class App extends Component {
  // ...

  render() {
    // ...
    return (
      <GraphRender
      	// ...
        // 0. connect the accessors from engine to GraphRender
        getNodePosition={this._engine.getNodePosition}
        getEdgePosition={this._engine.getEdgePosition}
      />
    );
  }
}
```

## 4. Position Update Trigger
To here, you may still see a still graph without animaiton like this:

<p class="inline-images center">
  <img src="images/graph-vis/no-position-update-trigger.png" alt="extruded" width="600px"/>
</p>

In the previous step, we connected `getNodePosition` and `getEdgePosition` with the accessors in the layout engine. However, `deck.gl` doesn't recalculate positions unless the data prop changes by shallow comparison. To inform deck.gl to re-evaluate `getPosition` outcome, we need to explicitly define `updateTriggers`. 
`updateTriggers` expects an object whose keys are names of accessor props of this layer, and values are one or more variables that affect the output of the accessors. For more information about `updateTriggers`, please check [here](http://uber.github.io/deck.gl/#/documentation/advanced-topics/updates?section=update-triggers)

The layout engine has an attribute `alpha` represents the momentum of the current force layout simulation. Since the value of `alpha` changes on every simulation, we can use it as the update trigger for `getPosition`. That means, `deck.gl` will re-evalute the position of nodes and edges when the `alpha` value changes.

```js
// graph-render.js
export default class GraphRender extends PureComponent {
  // ...

  createNodeLayer() {
    return new ScatterplotLayer({
      // ...
      // 0. add positionUpdateTrigger to node layer
      updateTriggers: {
        getPosition: this.props.positionUpdateTrigger
      }
    });
  }

  createEdgeLayer() {
    return new LineLayer({
      // ...
      // 1. add positionUpdateTrigger to edge layer
      updateTriggers: {
        getSourcePosition: this.props.positionUpdateTrigger,
        getTargetPosition: this.props.positionUpdateTrigger
      }
    });
  }

  // ...
}

// app.js
export default class App extends Component {
  // ...

  render() {
    return (
      <GraphRender
      	// ...
        // 2. pass positionUpdateTrigger into GraphRender
        positionUpdateTrigger={this._engine.alpha()}
      />
    );
  }
}
```

<ul class='insert takeaways'>
  <li>Decouple the layout calculation logic from the rendering.</li>
  <li>Connect node/edge position accessors with layout engine.</li>
  <li>Add update trigger to inform deck.gl re-evaluate positions.</li>
</ul>

## Complete code

You can check the complete code at here:
 - [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/2-graph-layout/src/app.js)
 - [graph-render.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/2-graph-layout/src/graph-render.js).

Next, you can head to the last step [**Interaction**](#/graph-vis/4-interacting-with-graph).

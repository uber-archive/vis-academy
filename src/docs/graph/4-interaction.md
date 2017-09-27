<!-- INJECT:"InteractiveGraph" -->

<ul class='insert learning-objectives'>
  <li>In this step, we will learn how to make graph interactive with mouse events.</li>
  <li>We want to highlight the node and its connected edges when hovering over a node.</li>
</ul>

**HOLD UP!!!** If you got here without reading the previous steps,
it is highly recommended that you do so, or you can just check out the complete code from the last step:
```
cd src/demos/graph/3-interactive-graph
```

## Add Visual Property

First, we need to add a new visual property 'isHighlighted' to nodes and edges.
We will use this property to change the color to red when `isHighlighted` is true.

```js
export default class App extends Component {
  // ...

  processData = () => {
    // ...
    if (sampleGraph) {
      // ...
      // 0. add a new property 'isHighlighted' to nodes
      sampleGraph.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          isHighlighted: false,
        });
      });
      // 1. add a new property 'isHighlighted' to edges
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

## Add Hover Event Listener to GraphRender

`deck.gl` includes a powerful picking engine that enables the application to precisely determine what object and layer is "picked" on the screen. 
The "picking engine" identifies which object in which layer is at the given coordinates. While usually intuitive, what constitutes a pickable "object" is defined by each layer. Typically, it corresponds to one of the data entries that are passed in via prop.data. In our case, we use Scatterplot Layer as the node layer, the pickable object will be the nodes we passed in the props.data array.

Picking can be enabled or disabled on a layer-by-layer basis. To enable picking on a layer, set its pickable prop to true. This value is false by default.
`deck.gl` provides two basic mouse events: hover and click, to run the picking engine and calls callbacks with a single parameter `info` which contains the resulting picking info object.

For more detail about picking behavior, please see the documentation [here](https://uber.github.io/deck.gl/#/documentation/getting-started/adding-interactivity).

```js
// graph-render.js
export default class GraphRender extends PureComponent {
  // ...

  createNodeLayer() {
    return new ScatterplotLayer({
      // ...
      // 0. enable picking on the layer
      pickable: true
      // 1. pass onHover callback from props
      onHover: this.props.onHoverNode
    });
  }

  // ...
}
```
## Implement onHoverNode Handler

```js
// app.js
export default class App extends Component {
  constructor(props) {
    // ...
    this.state = {
      // ...
      // 0. add hoveredNodeID to component state
      hoveredNodeID: null
    };
  }

  // ...

  onHoverNode = node => {
    // 1. check if is hovering on a node
    const hoveredNodeID = node.object && node.object.id;
    const graph = new Graph(this.state.graph);
    if (hoveredNodeID) {
      // 2. highlight the selected node and connected edges
      const connectedEdgeIDs =
        this.state.graph.findConnectedEdges(hoveredNodeID).map(e => e.id);
      graph.nodes.forEach(n => n.isHighlighted = n.id === hoveredNodeID);
      graph.edges.forEach(e => e.isHighlighted = connectedEdgeIDs.includes(e.id));
    } else {
      // 3. unset all nodes and edges
      graph.nodes.forEach(n => n.isHighlighted = false);
      graph.edges.forEach(e => e.isHighlighted = false);      
    }
    // 4. update component state
    this.setState({graph, hoveredNodeID});
  }

  render() {
    // ...
    return (
      <GraphRender
        // ...
        // 5. pass onHoverNode handler
        onHoverNode={this.onHoverNode}
      />
    );
  }
}
```

## Add Color Update Trigger

As we mentioned in the previous [step](#/graph-vis/3-layout-engine), `deck.gl` doesn't re-evaluate the accessors when data is not changed. We will need add the update trigger for `getColor` to inform `deck.gl` re-evaluate the colors again.

```js
export default class App extends Component {
  // ...

  render() {
    // ...
    return (
      <GraphRender
        // ...
        // 0. add color update trigger
        colorUpdateTrigger={hoveredNodeID}
      />
    );
  }
}

export default class GraphRender extends PureComponent {
  // ...

  createNodeLayer() {
    return new ScatterplotLayer({
      // ...
      updateTriggers: {
        // ...
        // 1. register the color update trigger
        getColor: this.props.colorUpdateTrigger
      }
    });
  }

  createEdgeLayer() {
    return new LineLayer({
      // ...
      updateTriggers: {
        // ...
        // 2. register the color update trigger
        getColor: this.props.colorUpdateTrigger
      }
    });
  }

  // ...
}
```

## Complete code

You can check the complete code at here:
 - [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/4-final-version/src/app.js)
 - [graph-render.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/graph/4-final-version/src/graph-render.js).

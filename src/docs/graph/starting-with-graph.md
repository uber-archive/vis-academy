<!-- INJECT:"StartingWithMap" heading -->

<ul class='insert learning-objectives'>
<li>Render a graph with random layout in a React application,</li>
<li>Update the viewport when resizing the window</li>
</ul>

# Starting With a Graph

Checkout the complete code for this step
[here](https://github.com/uber-common/vis-tutorial/tree/master/demos/starting-with-graph).

## 1. Start with a bare React Component

**HOLD UP!!!** If you got here without reading the **Setup** step, it is
highly recommended that you do so, or your application might not work.
[GO HERE](https://uber-common.github.io/vis-tutorial/#/setup) and go through it now.

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
    ...
    this._graph = new Graph();
  }

  componentDidMount() {
    this.processData();
    // ...
  }

  processData() {
    if (sampleGraph) {
      ...loaddata
    }
  }

  // ...
}
```

## 3. Random position for nodes

....


## 4. Viewport State

We now have a fully functional map, and we could stop here. But what happens
when you resize the window? If you do it right now, you'll notice that the map
stays the same size. That's a terrible user experience, and we wouldn't want that.

Let's quickly add a resize handler that updates our viewport with the new dimension
```js
export default class App extends Component {

  constructor(props) {
    //...
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeHandler);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  resizeHandler = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

}
```

## 5. Put it all together with Graph Render


```js

```

<ul class='insert takeaways'>
<li>We can use the ReactMapGL's MapGL component to use a map in React.</li>
<li>MapGL behaves just as another React component with props and callbacks.</li>
<li>Basic settings of the map are stored in the __viewport__ prop.</li>
<li>the __onViewportChange__ prop can be used to update the viewport when a user interacts with the map.</li>
</ul>

## 6. Completed Code

Our completed component [app.js](https://github.com/uber-common/vis-tutorial/blob/master/src/demos/starting-with-map/app.js) should now look like this:

```js

```

That's all you need to render a graph and make it interactive!

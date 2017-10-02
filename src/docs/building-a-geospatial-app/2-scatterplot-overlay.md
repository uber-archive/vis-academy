<!-- INJECT:"GeospatialAppScatterplotOverlay" heading -->

<ul class='insert learning-objectives'>
<li>Plot data on a map</li>
<li>First contact with Deck.GL</li>
</ul>

# Add a Scatterplot Overlay with Deck.GL

As cool as having a map is, an empty map is not that useful. Let's see if we
can add a `Scatterplot` overlay with the Taxi data set to the map we created in the previous example.

[Deck.GL](http://uber.github.io/deck.gl) is a WebGL overlay suite for React,
providing a set of highly performant data visualization overlays.

`Deck.GL` comes with several prepackaged layers that we can use, in conjunction
with our map, to show display geospatial data. The simplest one is the `ScatterplotLayer`,
which we will use.

Checkout the complete code for this step
[here](https://github.com/uber-common/vis-academy/blob/master/src/demos/building-a-geospatial-app/2-scatterplot-overlay/src/app.js).


## 1. Add Taxi Data

Import the taxi data into your `app.js` component. If you cloned our
tutorial repo as-is, your import statement should look like this:

```js
import taxiData from '../../../data/taxi';
```

Now we need to process this data into a usable format. Since we are only going
to be working with a `ScatterplotLayer` for now, we only care about the
`latitude`, `longitude`, and another bit called `pickup` to use for coloring
the dots.

We add a `_processData` method and call it when component mounts to process
the data.

```js
export default class App extends Component {

  componentDidMount() {
    this._processData();
    // ...
  }

  _processData() {
    if (taxiData) {
      this.setState({status: 'LOADED'});
      const points = taxiData.reduce((accu, curr) => {
        accu.push({
          position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
          pickup: true
        });
        accu.push({
          position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
          pickup: false
        });
        return accu;
      }, []);
      this.setState({
        points,
        status: 'READY'
      });
    }
  }

  // ...
}
```

## 2. Add `deck.gl` Component

Open file `deckgl-overlay.js` where we will put the deck.gl
component. First, let's add  `DeckGl`:

```
import DeckGL, {ScatterplotLayer} from 'deck.gl';

```

then render it:

```js

  render() {
    if (!this.props.data) {
      return null;
    }

    const layers = [];

    return (
      <DeckGL {...this.props.viewport} layers={layers} onWebGLInitialized={this._initialize}/>
    );
  }

```

This gives us the basic structure, using the export `DeckGL` react component
to render our `deck.gl` overlay. You'll notice that `layers` is being passed to
`DeckGL` but it's an empty array. We have to initialize each `deck.gl` layer
separately. Let's edit the function and initialize a `ScatterplotLayer` in `render()` function.

```js
// const layers = [];

const layers = [
  new ScatterplotLayer({
    id: 'scatterplot',
    getPosition: d => d.position,
    getColor: d => [0, 128, 255],
    getRadius: d => 5,
    opacity: 0.5,
    pickable: false,
    radiusScale: 5,
    radiusMinPixels: 0.25,
    radiusMaxPixels: 30,
    ...this.props
  })
];
```

## 3. Using the `deck.gl` Component

Now that we have the component created, we can render it inside `App` and pass
data as well as other props to it.

```js
import DeckGLOverlay from './deckgl-overlay';

export default class App extends Component {

  render() {
    return (
      <div>
        <MapGL ...>
          <DeckGLOverlay
            viewport={this.state.viewport}
            data={this.state.points} />
        </MapGL>
      </div>
    );
  }
}
```

Once we add the code to initialize a `ScatterplotLayer`, we will have
a working map. We can further edit our `ScatterplotLayer` to color
the dots by `pickup` or `dropoff`. Let's edit our `ScatterplotLayer` to have the color depends on pickup or dropoff by changing
the `getColor` callback

```js
  getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,

```
That's all you need to render a scatter plot layer with deck.gl. Let's go over
just some properties of the `ScatterplotLayer` above:

##### `data` {Array}
Data for the layer. In this case, it's our Taxi data set.

##### `getPosition` {Function}
Function that gets called for each data point, should return an array of [longitude, latitude].

##### `getColor, getRadius` {Function}
Also get called for each data point, and return the color and radius, respectively,
for each point.

##### `pickable` {Bool}
Indicates whether this layer would be interactive.


With this, you should have a working `deck.gl` overlay that displays the taxi
data as a scatterplot overlay.


<ul class="insert takeaways">
  <li>the Deck.GL __DeckGL__ component can be used to plot _layers_ over a map.</li>
  <li>Each layer can have different parameters that control the result, including a dataset.</li>
</ul>

<ul class="insert further-readings">
  <li>[Deck.GL](http://uber.github.io/deck.gl) and its extensive documentation</li>
  <li>[Gallery of Deck.GL overlays](https://uber-common.github.io/vis-academy/#/building-a-geospatial-app/data-overlays-gallery/mapping-types)</li>
</ul>

## Optional section

Feel free to skip to [lesson 3](https://uber-common.github.io/vis-academy/#/building-a-geospatial-app/3-more-data-overlays-hexagons) or even [lesson 4](https://uber-common.github.io/vis-academy/#/building-a-geospatial-app/4-a-basic-chart).

## 4. Adding Polish

If you check out the source code for this step, you'll see extra code that add
functionalities such as a settings panel, hover handler, hover tooltip, and
loading spinner.

The control for the settings panel is already provided in your starting code. It's a typical React component, so there's no use going through the details in this tutorial.

## 4.1. Add layer control panel

Import `LayerControls` and `SCATTERPLOT_CONTROLS` from `./layer-controls`, then add `settings` to `this.state`.
With this code, we created settings for our scatterplot layer

```js
/* global window */
import {LayerControls, SCATTERPLOT_CONTROLS} from './layer-controls';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // add settings
      settings: Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }), {}),
    };
  }
}
```
Next, lets render a layer control panel on the screen. Lets add `LayerControls` to render methods.

```js
  _updateLayerSettings(settings) {
    this.setState({settings});
  }

  render() {
    return (
      <div>
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}/>
        <MapGL
           // ...
        </MapGL>
      </div>
    );
  }
}
```

Finally, let's pass `state.settings` to `DeckGLOverlay`.

```js

    <DeckGLOverlay
    // ...
    {...this.state.settings}
    />

```
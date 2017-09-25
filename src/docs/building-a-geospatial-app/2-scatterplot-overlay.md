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

## 1. Add Taxi Data

Import the taxi data into your `app.js` component. If you cloned our
tutorial repo as-is, your import statement should look like this:

```js
import taxiData from '../data/taxi';
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

Create a new file named `deckgl-overlay.js` where we will put the deck.gl
component. First, let's layout the component:

```js
import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class DeckGLOverlay extends Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    const layers = [];

    return (
      <DeckGL {...this.props.viewport} layers={layers} />
    );
  }
}
```

This gives us the basic structure, using the export `DeckGL` react component
to render our `deck.gl` overlay. You'll notice that `layers` is being passed to
`DeckGL` but it's an empty array. We have to initialize each `deck.gl` layer
separately. Let's edit the function and initialize a `ScatterplotLayer` in `render()` function.

```js
const layers = [
  new ScatterplotLayer({
    id: 'scatterplot',
    getPosition: d => d.position,
    getColor: d => [0, 128, 255],
    getRadius: d => 1,
    opacity: 0.5,
    pickable: false,
    radiusScale: 3,
    radiusMinPixels: 0.25,
    radiusMaxPixels: 30,
    ...this.props
  })
];
```

Once we add the code to initialize a `ScatterplotLayer`, we will have
a working map. We can further edit our `ScatterplotLayer` to color
the dots by `pickup` or `dropoff`. First lets define colors outside the component 
under the imports.

```js
import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];
```

Then let's edit our `ScatterplotLayer` to have the color depends on pickup or dropoff by changing
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

With this, you should have a working `deck.gl` overlay that displays the taxi
data as a scatterplot overlay.


<ul class="insert takeaways">
  <li>the Deck.GL __DeckGL__ component can be used to plot _layers_ over a map.</li>
  <li>Each layer can have different parameters that control the result, including a dataset.</li>
</ul>

<ul class="insert further-readings">
  <li>[Deck.GL](http://uber.github.io/deck.gl) and its extensive documentation</li>
  <li>[Gallery of Deck.GL overlays](https://uber-common.github.io/vis-tutorial/#/data-overlays-gallery/mapping-types)</li>
</ul>

## Optional section

Feel free to skip to [lesson 3](https://uber-common.github.io/vis-tutorial/#/3-more-data-overlays-hexagons) or even [lesson 4](https://uber-common.github.io/vis-tutorial/#/4-a-basic-chart). 

## 4. Adding Polish

If you check out the source code for this step, you'll see extra code that add
functionalities such as a settings panel, hover handler, hover tooltip, and
loading spinner.

The control for the settings panel is already provided in your starting code. It's a typical React component, so there's no use going through the details in this tutorial. 

## 5. code of app.js

Here's the complete [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/building-a-geospatial-app/2-scatterplot-overlay/app.js) file including the control panel: 

```js
/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import {LayerControls, SCATTERPLOT_CONTROLS} from './layer-controls';
import Spinner from './spinner';
import {tooltipStyle} from './style';
import taxiData from '../data/taxi';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16
      },
      points: [],
      settings: Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }), {}),
      // hoverInfo
      x: 0,
      y: 0,
      hoveredObject: null,
      status: 'LOADING'
    };
    this._resize = this._resize.bind(this);
  }

  componentDidMount() {
    this._processData();
    window.addEventListener('resize', this._resize);
    this._resize();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
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

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _updateLayerSettings(settings) {
    this.setState({settings});
  }

  render() {
    return (
      <div>
        {this.state.hoveredObject &&
          <div style={{
            ...tooltipStyle,
            left: this.state.x,
            top: this.state.y
          }}>
            <div>{this.state.hoveredObject.id}</div>
          </div>}
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}/>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={viewport => this._onViewportChange(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay
            viewport={this.state.viewport}
            data={this.state.points}
            onHover={hover => this._onHover(hover)}
            {...this.state.settings}
          />
        </MapGL>
        <Spinner status={this.state.status} />
      </div>
    );
  }
}
```

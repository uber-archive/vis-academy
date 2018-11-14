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

## 1. An introduction to Deck.GL

Deck.GL allows you to visualize stacked layers of data. Each layer can be of a different type (we'll see two: scatterplots and hexagons, but there are many more) and can have millions of data points. In the finished visualization, the layers appear on top of each other, and they support interactions like pan, zoom, rotate, as well as mouse hover, clicks, etc.

In our app, Deck.GL will appear as a <DeckGL /> component with, among others, a layers property which is where these layers will be defined.

Deck.GL doesn't have to work with a map but it was designed with geospatial applications in mind.
Like the map we've designed in the previous module, Deck.GL layers have the same concept of viewport and similar interactions.

As such, there are 2 ways of making Deck.GL work with React-Map-GL:

- DeckGL is a child of a React-Map-GL map:

In the previous lesson, when there are interactions in the map, we update the state of the app.
We could have a DeckGL component inside our MapGL component and pass it the viewport as it is updated:

```js
<MapGL ...>
  <DeckGL viewport={this.state.viewport} />
</MapGL>
```

- we use a special React-Map-GL map is a child of DeckGL.

Instead, we can use a staticMap from React-Map-GL. StaticMaps get all the viewport information from their parent and all the interactions for free (viewport change, resize). We no longer need to maintain the viewport in a state. The resulting code is much more concise:

```js
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from 'deck.gl';

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class App extends Component {
  render() {
    return (
      <div>
        <DeckGL initialViewState={INITIAL_VIEW_STATE} controller>
          <StaticMap />
        </DeckGL>
      </div>
    );
  }
}
```

That's enough to create a map!
We are going to going to use that syntax going forward. It's still interesting to show the previous form because:

- so you can see the interactions needed for a workable map,
- in earlier versions of React-Map-GL/Deck.GL this was the only way to go so you may encounter code that is written this way.

Also note that in our initialViewState object, we must include pitch and bearing (which we could just omit in the previous form.)

In our example, we are still going to maintain a state to do things like changing the style of the map but we no longer need to maintain the viewport in it. So if we want to have the exact same features as at the end of the previous lesson, let's use this code with which you may replace your app.js file entirely -

```js
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import { MapStylePicker } from './controls';

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class App extends Component {
  state = {
    style: 'mapbox://styles/mapbox/light-v9'
  };
  onStyleChange = style => {
    this.setState({ style });
  };
  render() {
    return (
      <div>
        <DeckGL initialViewState={INITIAL_VIEW_STATE} controller>
          <StaticMap style={this.state.style} />
        </DeckGL>
      </div>
    );
  }
}
```

## 2. Add data

Import the taxi data into your `app.js` component.

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

  state = {
    points: [],
    style: 'mapbox://styles/mapbox/light-v9'
  }

  componentDidMount() {
    this._processData();
    // ...
  }

  _processData() {
    const points = taxiData.reduce((accu, curr) => {
      accu.push({
        position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
        pickup: true
      });
      accu.push({
        position: [
          Number(curr.dropoff_longitude),
          Number(curr.dropoff_latitude)
        ],
        pickup: false
      });
      return accu;
    }, []);
    this.setState({
      points
    });
  }

  // ...
}
```

## 2. Add deck.gl layers

Open file `deckgl-layers.js` where we will put the deck.gl layers.

First, let's import our first layer, the ScatterplotLayer:

```js
import {ScatterplotLayer} from 'deck.gl';

```

then edit the renderLayers function:

```js

  export function renderLayers(props) {
    const {data} = props;
    return [
      new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => [0, 128, 255],
        getRadius: d => 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data
      })
    ];
  }
```

Now, let's just use our layers in the app.js file. 

In the render function of app.js, add the following property to the DeckGL component:

```js
  <DeckGL
    layers={renderLayers({data: this.state.points})}
    initialViewState={INITIAL_VIEW_STATE}
    controller
  >
```

There we go! our first layer!

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

## 3. Polish

### Dynamic color
Right now, our `getColor` accessor returns a constant. We can have color change depending on the data we pass. 
Let's do that change in our deckgl-layers.js file:

```js
  getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,

```

### Control panel
Import `LayerControls` and `SCATTERPLOT_CONTROLS` from `./controls`, then add `settings` to `this.state`.
With this code, we created settings for our scatterplot layer:

In the imports:
```js
import {
  LayerControls,
  MapStylePicker,
  SCATTERPLOT_CONTROLS
} from './controls';
```

In the state definition:
```js
state = {
  points: [],
  settings: Object.keys(SCATTERPLOT_CONTROLS).reduce(
    (accu, key) => ({
      ...accu,
      [key]: SCATTERPLOT_CONTROLS[key].value
    }),
    {}
  ),
  style: 'mapbox://styles/mapbox/light-v9'
}
```

Before the render:
```js
  _updateLayerSettings(settings) {
    this.setState({ settings });
  }
```

In the DeckGL component in render:
```js
  <DeckGL
    layers={renderLayers({data: this.state.points, settings: this.state.settings})}
    initialViewState={INITIAL_VIEW_STATE}
    controller
  >
```

In the deckgl-layers file:
```js
export function renderLayers(props) {
  const {data, settings} = props;
  return [
    settings.showScatterplot && new ScatterplotLayer({
      id: 'scatterplot',
      getPosition: d => d.position,
      getColor: d => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
      getRadius: d => 5,
      opacity: 0.5,
      pickable: true,
      radiusMinPixels: 0.25,
      radiusMaxPixels: 30,
      data,
      ...settings
    })
  ];
}
```

Now, we have a control panel with which we can control aspects of our layer. We can control our WebGL layer the same way as we can pass properties to React Components

### Mouseover interaction

Finally, we can add mouseover interaction to our scatterplot. The steps are very similar to the above, even though we are doing the opposite: instead of capturing an interaction in HTML components and reflecting it to the WebGL layer, we capture an interaction in the WebGL layer and we reflect it in HTML components. 
Let's go:

In the imports, let's add:
```js
import { tooltipStyle } from './style';
```

In the state:
```js
  state = {
    hover: {
      x: 0,
      y: 0,
      hoveredObject: null
    },
    points: [],
    settings: Object.keys(SCATTERPLOT_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }),
      {}
    ),
    style: 'mapbox://styles/mapbox/light-v9'
  };
```

Before render, let's add this method:
```js
  _onHover({ x, y, object }) {
    const label = object ? (object.pickup ? 'Pickup' : 'Dropoff') : null;

    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }
```

Let's change the beginning of render:
```js
  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings } = this.state;
    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`
            }}
          >
            <div>{hover.label}</div>
          </div>
        )}
```

Add the following to our DeckGL component: 
```js
  <DeckGL
    layers={renderLayers({
      data: this.state.points,
      onHover: hover => this._onHover(hover),
      settings: this.state.settings
    })}
    initialViewState={INITIAL_VIEW_STATE}
    controller
  >
```

And finally, add onHover in the deckgl-layers file:
```js
export function renderLayers(props) {
  const {data, onHover, settings} = props;
  return [
    settings.showScatterplot && new ScatterplotLayer({
      id: 'scatterplot',
      getPosition: d => d.position,
      getColor: d => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
      getRadius: d => 5,
      opacity: 0.5,
      pickable: true,
      radiusMinPixels: 0.25,
      radiusMaxPixels: 30,
      data,
      onHover,
      ...settings
    })
  ];
}
```

This is it! we now have two-way interactions between our webGL layer and the rest of our application.

Complete code:

app.js:
```js
/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import {
  LayerControls,
  MapStylePicker,
  SCATTERPLOT_CONTROLS
} from './controls';
import { tooltipStyle } from './style';
import DeckGL from 'deck.gl';
import taxiData from '../../../data/taxi';
import { renderLayers } from './deckgl-layers';

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class App extends Component {
  state = {
    hover: {
      x: 0,
      y: 0,
      hoveredObject: null
    },
    points: [],
    settings: Object.keys(SCATTERPLOT_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }),
      {}
    ),
    style: 'mapbox://styles/mapbox/light-v9'
  };

  componentDidMount() {
    this._processData();
  }

  _processData = () => {
    const points = taxiData.reduce((accu, curr) => {
      accu.push({
        position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
        pickup: true
      });

      accu.push({
        position: [
          Number(curr.dropoff_longitude),
          Number(curr.dropoff_latitude)
        ],
        pickup: false
      });
      return accu;
    }, []);
    this.setState({
      points
    });
  };

  _onHover({ x, y, object }) {
    const label = object ? (object.pickup ? 'Pickup' : 'Dropoff') : null;

    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings } = this.state;
    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`
            }}
          >
            <div>{hover.label}</div>
          </div>
        )}
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        <LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL
          layers={renderLayers({
            data: this.state.points,
            onHover: hover => this._onHover(hover),
            settings: this.state.settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          controller
        >
          <StaticMap mapStyle={this.state.style} />
        </DeckGL>
      </div>
    );
  }
}
```

deckgl-layers.js:
```
import { ScatterplotLayer } from 'deck.gl';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

export function renderLayers(props) {
  const {data, onHover, settings} = props;
  return [
    settings.showScatterplot && new ScatterplotLayer({
      id: 'scatterplot',
      getPosition: d => d.position,
      getColor: d => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
      getRadius: d => 5,
      opacity: 0.5,
      pickable: true,
      radiusMinPixels: 0.25,
      radiusMaxPixels: 30,
      data,
      onHover,
      ...settings
    })
  ];
}
```

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

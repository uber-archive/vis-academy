<!-- INJECT:"ScatterplotOverlay" -->

# Add a Scatterplot Overlay with Deck.GL

**NOTE** This step follows from the completed code of the previous section,
[Starting With A Map](/#/react-map/starting-with-map).

As cool as having a map is, an empty map is not that useful. Let's see if we
can add a `Scatterplot` overlay with the Taxi data set to the map we created in the previous example.

[Deck.GL](http://uber.github.io/deck.gl) is a WebGL overlay suite for React,
providing a set of highly performant data visualization overlays.

`Deck.GL` comes with several prepackaged layers that we can use, in conjunction
with our map, to show display geospatial data. The simplest one is the `ScatterplotLayer`,
which we will use.

## 1. Add Taxi Data

Download the Taxi data we have in the repository
[here](https://github.com/uber-common/vis-tutorial/blob/master/demos/data/taxi.csv),
and then import the file into your `app.js` component. If you cloned our
tutorial repo as-is, your import statement should look like this:

```js
import taxiData from '../data/taxi.csv';
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
    const {viewport, data, onHover, settings} = this.props;

    if (!data) {
      return null;
    }

    const layers = [];

    return (
      <DeckGL {...viewport} layers={ layers } />
    );
  }
}
```

This gives us the basic structure, using the export `DeckGL` react component
to render our `deck.gl` overlay. You'll notice that `layers` is being passed to
`DeckGL` but it's an empty array. We have to initialize each `deck.gl` layer
separately. Once we add the code to initialize a `ScatterplotLayer`, we will have
a working `deck.gl` component. The final code looks like this:

```js
import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

export default class DeckGLOverlay extends Component {

  render() {
    const {viewport, data} = this.props;

    if (!data) {
      return null;
    }

    const layers = [
      new ScatterplotLayer({
        id: 'scatterplot',
        data,
        getPosition: d => d.position,
        getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
        getRadius: d => 1,
        opacity: 0.5,
        pickable: false,
        radiusScale: 3,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30
      })
    ];

    return (
      <DeckGL {...viewport} layers={ layers } />
    );
  }
}
```

Let's go over just some properties of the `ScatterplotLayer` above:

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
data as well as other probs to it.

```js
import DeckGLOverlay from './deckgl-overlay';

export default class App extends Component {

  render() {
    const {viewport, points} = this.state;
    return (
      <div>
        <MapGL ...>
          <DeckGLOverlay
            viewport={viewport}
            data={points} />
        </MapGL>
      </div>
    );
  }

}
```

With this, you should have a working `deck.gl` overlay that displays the taxi
data as a scatterplot overlay.

## 4. Adding Polish

If you check out the source code for this step, you'll see extra code that add
functionalities such as a settings panel, hover handler, hover tooltip, and
loading spinner.

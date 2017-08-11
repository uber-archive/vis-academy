<!-- INJECT:"HexagonOverlay" -->

# Add a Hexagon Overlay with Deck.GL
[View code](https://github.com/uber-common/vis-tutorial/tree/master/demos/hexagon-overlay)

**NOTE** This step follows from the **completed** code of the previous section,
[Scatterplot Overlay](/#/deck/scatterplot-overlay).

`Scatterplot` can plot raw points, but to visualize distribution of these
points, we need a layer that can aggregate points into a geo grid.
`HexagonLayer` and `GridLayer` are both aggregation layers that
can visualize a distribution heatmap from raw points.

The functional change that's needed here is to add more code to `deckgl-overlay.js`

## 1. Add Constants for Hexagon Layer

Deck.gl performances shallow compares on layer props to decide how to update attribute buffer.
To avoid unnecessary re-calculations, we define constant params outside of the render function.

You can add these constants at the very top of `deckgl-overlay.js`.
We will pass them into the `HexagonLayer` layer on.

```js
const HEATMAP_COLORS = [
  [213, 62, 79],
  [252, 141, 89],
  [254, 224, 139],
  [230, 245, 152],
  [153, 213, 148],
  [50, 136, 189]
].reverse();

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];
```

## 2. Add Hexagon Layer

We have already passed the necessary data into this component from the previous example. So now we only need to take care of rendering the `HexagonLayer` when needed.

```js
// ...
import DeckGL, {ScatterplotLayer, HexagonLayer} from 'deck.gl';

// ...

export default class DeckGLOverlay extends Component {

  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const {viewport, data, onHover, settings} = this.props;

    if (!data) {
      return null;
    }

    const layers = [
      !settings.showHexagon ? new ScatterplotLayer({
        id: 'scatterplot',
        data,
        getPosition: d => d.position,
        getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
        getRadius: d => 1,
        opacity: 0.5,
        pickable: true,
        onHover,
        radiusScale: settings.radiusScale,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30
      }) : null,
      settings.showHexagon ? new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        coverage: settings.coverage,
        data,
        elevationRange,
        elevationScale: 10,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        onHover,
        opacity: 1,
        pickable: true,
        radius: settings.radius,
        upperPercentile: settings.upperPercentile
      }) : null
    ];

    return (
      <DeckGL {...viewport} layers={ layers } onWebGLInitialized={this._initialize} />
    );
  }
}
```

With this, your `deckgl-overlay.js` should be ready to  render a functional `HexagonLayer`.

Let's go over some properties of the `HexagonLayer`:

[Deck.gl documentation of Hexagon Layer](https://uber.github.io/deck.gl/#/documentation/layer-catalog/hexagon-layer)

Let's go over just some properties of the `HexagonLayer` above:

##### `data` {Array}
Array of points for the layer. In this case, it's our Taxi data set.
format as `[{position: [lng, lat]}, {position: [lng, lat]}]`

##### `getPosition` {Function}
Function that gets called for each data point, should return an array of [longitude, latitude].

##### `extruded` {Bool}
Whether to enable hexagon elevation

#### `radius` {Number}
Hexagon layer cell radius in meter

#### `upperPercentile` {Number}
- Default: `100`
Hexagon cells with value larger than upperPercentile will be hidden

##### `pickable` {Bool}
Indicates whether this layer would be interactive.

## 3. Adding Polish

To get the completed example, you need to modify the settings panel that was added in the polish step in the previous example. Check out the source code for more info.

<!-- INJECT:"GeospatialAppHexagonOverlay" heading -->

<ul class="insert learning-objectives">
  <li>Discover more types of Deck.GL overlays</li>
  <li>See how Deck.GL can handle several layers at once</li>
</ul>

# Add a Hexagon Overlay with Deck.GL
[View code](https://github.com/uber-common/vis-academy/tree/master/src/demos/building-a-geospatial-app/3-hexagon-overlay)

**NOTE** This step follows from the **completed** code of the previous section,
[Scatterplot Overlay](#/building-a-geospatial-app/2-scatterplot-overlay.md).

`Scatterplot` can plot raw points, but to visualize distribution of these
points, we need a layer that can aggregate points into a geo grid.
`HexagonLayer` and `GridLayer` are both aggregation layers that
can visualize a distribution heatmap from raw points.

## 1. Update our control panel
We're going to upgrade our control panel so we can switch from the scatterplot layer to the hexagon layer. Let's do that now, so you can see the changes on the hexagon layer as we build it.

Replace SCATTERPLOT_CONTROLS with HEXAGON_CONTROLS everywhere in app.js. It appears 4 times:
- in the import statement,
- in the component's contructor method, while preparing the initial state,
- in the render method, as an argument to the LayerControls component.

Now, to implement our new overlay, let's focus on `deckgl-overlay.js`:

## 2. Add Constants for Hexagon Layer

Deck.gl performantly shallow compares on layer props to decide how to update attribute buffer.
To avoid unnecessary re-calculations, we define constant params outside of the render function.

You can add these constants at the very top of `deckgl-overlay.js`.
We will pass them into the `HexagonLayer` later on.

```js
// in RGB
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

## 3. Add Hexagon Layer

We have already passed the necessary data into this component in the previous example. So now we only need to take care of rendering the `HexagonLayer` when needed.

```js
// ...
import DeckGL, {ScatterplotLayer, HexagonLayer} from 'deck.gl';

// ...

export default class DeckGLOverlay extends Component {

  render() {
    // ...
    const layers = [
      !this.props.showHexagon ? new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
        getRadius: d => 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        ...this.props
      }) : null,
      this.props.showHexagon ? new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 1,
        pickable: true,
        radius: 300,
        ...this.props
      }) : null
    ];

    // ...
  }
}
```

With this, your `deckgl-overlay.js` should be ready to render a functional `HexagonLayer`.

Here's a link to the [complete code of this step](https://github.com/uber-common/vis-academy/tree/master/src/demos/building-a-geospatial-app/hexagon-overlay)

<ul class="insert takeaways">
  <li>The HexagonLayer can display aggregated, 3D hexagons</li>
  <li>Deck.GL can display any number of layers at once</li>
  <li>It's possible to deactivate any of these layers at runtime by returning null instead of a layer</li>
</ul>

Let's go over some properties of the `HexagonLayer`:

[Deck.gl documentation of Hexagon Layer](https://uber.github.io/deck.gl/#/layer-catalog/hexagon-layer)

Let's go over just some properties of the `HexagonLayer` above:

##### `data` {Array}
Array of points for the layer. In this case, it's our Taxi data set.
format as `[{position: [lng, lat]}, {position: [lng, lat]}]`

##### `getPosition` {Function}
Function that gets called on each data point, should return an array of [longitude, latitude].

##### `extruded` {Bool}
Whether to enable hexagon elevation

#### `radius` {Number}
Hexagon layer cell radius in meters

#### `upperPercentile` {Number} (Default: `100`)
Hexagon cells with value larger than upperPercentile will be hidden

##### `pickable` {Bool}
Indicates whether this layer should be interactive.

## Optional section

Feel free to skip to [lesson 4](https://uber-common.github.io/vis-academy/#/building-a-geospatial-app/4-a-basic-chart).

## 4. Adding Polish

Adding mouseover interaction to our hexagons:

In app.js, add this method to our app component:

```js
  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }
```

Then, in the <DeckGLOverlay /> component, add a call to this method:

```js
  <DeckGLOverlay
    viewport={this.state.viewport}
    data={this.state.points}
    onHover={hover => this._onHover(hover)}
    {...this.state.settings}
/>
```

With this, we effectively pass information whenever the user mousesover the hexagons or scatterplot and we store it in the state of the app. However, we don't display it yet.

Let's add a tooltip component:

At the beginning of the app, import the styling for the tooltip: 
```js
import {tooltipStyle} from './style';
```

Then, in the render method, right before the <LayerControls /> component, add:

```js
  {this.state.hoveredObject &&
    <div style={{
      ...tooltipStyle,
      transform: `translate(${this.state.x}px, ${this.state.y}px)`
    }}>
      <div>{JSON.stringify(this.state.hoveredObject)}</div>
    </div>
  }
```

You will now be able to see additional information when mousing over your map!



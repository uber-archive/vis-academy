# Map Overlay Types

[ReactMapGL](https://github.com/uber/react-map-gl) and [Deck.gl](https://github.com/uber/deck.gl)
offers a collection of map overlays. Here we provide a list of overlays and
explan how they can be used in mapping visualizations

### Scatterplot

[Scatterplot](https://uber.github.io/deck.gl/#/documentation/layer-catalog/scatterplot-layer) can be used to plot point locations. It provided a fast overview of where the events have occured. You can color code the points to show different types of events, or have its radius based on a numeric metric such as price, occurrence or duration.

<p class="inline-images">
  <img src="images/mg_scatterplot_2.png" alt="extruded" width="300px" height="300px"/>
  <img src="images/mg_scatterplot_1.png" alt="extruded" width="300px" height="300px"/>
</p>

_Left: Trip dropoffs in LA, using additive blending to show density_  
```js

class DeckGLOverlay extends Component {

  _initialize(gl) {
    gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    gl.blendEquation(gl.FUNC_ADD);
  }

  render() {
    return (
      <DeckGL {...viewport} layers={ layers } onWebGLInitialized={this._initialize} />
    );
  }
}
```
_Right: Trips in NYC, blue is pickup and pink is dropoff_  
```js
const layers = [
  new ScatterplotLayer({
    id: 'scatterplot',
    data,
    getColor: d => d.pickup ? [0, 128, 255] : [255, 0, 128]
  })
];
```
### Arc

[Arc](https://uber.github.io/deck.gl/#/documentation/layer-catalog/arc-layer) can be used to plot links between two points. Color and thickness of arcs can be based on different metrics. Arc overlay can be used to plot network graphs. The connection of different region is more visible when viewed in 3d.

<p class="inline-images">
  <img src="images/mg_arc_1.png" alt="extruded" width="300px" height="300px"/>
  <img src="images/mg_arc_2.png" alt="extruded" width="300px" height="300px"/>
</p>

_Left: Restaurant deliveries. Color based on cuisine type_


```js
const layers = [
  new ArcLayer({
    id: 'arc-layer',
    data,
    getSourcePosition: d => d.restaurtPosition,
    getTargetPosition: d => d.deliveryPosition,
    getSourceColor: d => CUISINE_TO_COLOR[d.cuisineType],
    getTargetColor: d => CUISINE_TO_COLOR[d.cuisineType]
  })
];
```

_Right: All trips originated from a specific area, in perspective view. Color based on type of rides_


### Hexagon

[Hexagon](https://uber.github.io/deck.gl/#/documentation/layer-catalog/hexagon-layer) renders a hexagonal heatmap based on points aggregations.
It takes an array of points and radius of the hexagon bin, then projects points into the bins. The color and height of the hexagon
is scaled by number of points it contains by default. However, you can pass a function to getColorValue that calculate a value by all the points in a hex bin to used as color reference.
Hexagon elevation can be enabled in 3d by passing `extruded: true`. Elevation is based on number of points in each bin.

You can pass in `upperPercentiles` and `lowerPercentile` to filter bins and re-calculate color based on filtered range.
Bins with value outside the percentile range will be hidden. The percentile is a useful feature to help visualize hidden patterns in the low percentile range.

<p class="inline-images">
  <img src="images/mg_hex_1.png" alt="extruded" width="300px" height="300px"/>
  <img src="images/mg_hex_2.png" alt="extruded" width="300px" height="300px"/>
</p>

_Left: Trip pickup heatmap in LA_

```js
const layers = [
  new HexagonLayer({
    id: 'heatmap',
    data,
    radius: 1000,
    getPosition: d => d.position
  })
];
```

_Right: Trip pickup heatmap in LA with elevation enabled_
```js
const layers = [
  new HexagonLayer({
    id: 'heatmap',
    data,
    radius: 1000,
    getPosition: d => d.position,
    extruded: true
  })
];
```

<p class="inline-images">
  <img src="images/mg_hex_5.png" alt="extruded" width="300px" height="300px"/>
  <img src="images/mg_hex_6.png" alt="extruded" width="300px" height="300px"/>
</p>

_Left: Trips in NYC, color based on average trip fares_
```js
// Outside render function
const getColorValue = points => average(points.map(p => p.fare));

// Inside render function
const layers = [
  new HexagonLayer({
    id: 'heatmap',
    data,
    radius: 1000,
    getColorValue
  })
];
```
_Right: Trips in NYC, color based on average trip fares, elevation based on number of trips in each bin_
```js
//
const layers = [
  new HexagonLayer({
    id: 'heatmap',
    data,
    radius: 1000,
    getColorValue,
    extruded: true
  })
];
```

<p class="inline-images">
  <img src="images/mg_hex_3.png" alt="extruded" width="300px" height="300px"/>
  <img src="images/mg_hex_4.png" alt="extruded" width="300px" height="300px"/>
</p>

_Left: Road accident in UK, upper percentile set to 100._
```js
//
const layers = [
  new HexagonLayer({
    id: 'heatmap',
    data,
    radius: 1000,
    extruded: true
  })
];
```
_Right: Road accident in UK, upper percentile set to 99.5._  

```js
const layers = [
  new HexagonLayer({
    id: 'heatmap',
    data,
    radius: 1000,
    upperPercentile: 99.5,
    extruded: true
  })
];
```

# Hexagon

[Hexagon](https://uber.github.io/deck.gl/#/documentation/layer-catalog/hexagon-layer) renders a hexagonal heatmap based on points aggregations.
It takes an array of points and radius of the hexagon bin, then projects points into the bins. The color and height of the hexagon
is scaled by number of points it contains by default. However, you can pass a function to getColorValue that calculate a value by all the points in a hex bin to used as color reference.

### Extrusion
Hexagon elevation can be enabled in 3d by passing `extruded: true`. Elevation is based on number of points in each bin.

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
### Color Value
By default, hexagon color is based on number of points it contains. `getColorValue` gives you the option to color the hexagons based
 on your choice of value aggregation. For example, You can pass in getColorValue to color the bins by avg/mean/max of a specific attributes of each point.

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
### Percentile
You can pass in `upperPercentiles` and `lowerPercentile` to filter bins and re-calculate color based on filtered range.
Bins with value outside the percentile range will be hidden. The percentile is a useful feature to help visualize hidden patterns in the low percentile range.

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

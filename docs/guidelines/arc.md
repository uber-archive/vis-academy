# Arc

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

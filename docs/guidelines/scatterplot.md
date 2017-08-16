# Scatterplot

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

<!-- INJECT:"LinkingItAll" heading -->

# Linking it all

For our grand finale, we're going to link interaction on the charts with the deck.gl overlays!

In our app.js in the render method, let's add an "hour" property to DeckGLOverlay:

```js
<DeckGLOverlay
  viewport={this.state.viewport}
  data={this.state.points}
  hour={this.state.highlightedHour || this.state.selectedHour}
  onHover={this._onHover}
  settings={this.state.settings}
/>
```

And in our deckgl-overlay.js file, let's make these changes:

We're creting filteredData which is only the datapoints which correspond to the time slot highlighted or selected on the bar chart, and we're replacing data by filtered data in the layers. 

```js
const filteredData = hour === null ? data : data.filter(d => d.hour === hour);

const layers = [
  !settings.showHexagon ? new ScatterplotLayer({
    id: 'scatterplot',
    data: filteredData,
    getPosition: d => d.position,
    getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
    getRadius: d => 1,
    opacity: 0.5,
    pickable: true,
    onHover,
    radiusScale: 30,
    radiusMinPixels: 0.25,
    radiusMaxPixels: 30
  }) : null,
  settings.showHexagon ? new HexagonLayer({
    id: 'heatmap',
    colorRange: HEATMAP_COLORS,
    coverage: settings.coverage,
    data: filteredData,
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
  }): null
];
```

And as you can see, interactions on the bar chart are now visible on our deck.gl part!

# Congratulations!

You've built your own interactive mapping application combining Mapbox-powered maps in react, WebGL layers and versatile charts!

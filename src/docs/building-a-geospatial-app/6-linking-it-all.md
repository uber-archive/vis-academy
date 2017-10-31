<!-- INJECT:"GeospatialAppLinkingItAll" heading -->
<ul class="insert learning-objectives">
  <li>Enable our chart to interact with our data overlays</li>
</ul>

# Linking it all

For our grand finale, we're going to link interaction on the charts with the deck.gl overlays!

In our app.js:

Let's add a `selectedHour` property to the default state and initialize it to `null`.

```js
this.state = {
  // ...
  selectedHour: null
};
```

Then, in the render method, let's add an `hour` property to `DeckGLOverlay`:

```js
<DeckGLOverlay
  viewport={this.state.viewport}
  data={this.state.points}
  hour={this.state.highlightedHour || this.state.selectedHour}
  onHover={hover => this._onHover(hover)}
  settings={this.state.settings}
/>
```

And in our deckgl-overlay.js file, let's make these changes:

We're creating a new filteredData variable, which is only the datapoints that correspond to the time slot highlighted or selected on the bar chart, and we're replacing data by filtered data in the layers.

```js
const filteredData = this.props.hour === null
  ? this.props.data
  : this.props.data.filter(d => d.hour === this.props.hour);

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
    ...this.props,
    data: filteredData
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
    ...this.props,
    data: filteredData
  }) : null
];
```

And as you can see, interactions on the bar chart are now visible on our deck.gl part!

<ul class="insert takeaways">
  <li>React-Vis and Deck.GL components can interact their parent and their children, just like any other React component!</li>
  <li>There's no limit to what you can achieve!</li>
</ul>

Here's a link to the [complete code of this step](https://github.com/uber-common/vis-academy/tree/master/src/demos/building-a-geospatial-app/6-linking-it-all)

# Congratulations!

You've built your own interactive mapping application combining Mapbox-powered maps in react, WebGL layers and versatile charts!

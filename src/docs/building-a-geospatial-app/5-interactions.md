<!-- INJECT:"GeospatialAppInteraction" heading -->

<ul class="insert learning-objectives">
  <li>Implement mouse interactions in a chart</li>
</ul>

# Introducing interaction

## 1. Interact with bar charts on hover

React-Vis has many methods to [handle interaction](https://uber.github.io/react-vis/general-principles/interaction).
We're already using the state of our app to store our data and interaction with the deck.gl components, so let's use it for react-vis interaction as well.

In app.js, let's add a method to handle this interaction:

```js
_onHighlight(highlightedHour) {
  this.setState({highlightedHour});
}
```

then in the render method:

```js
<Charts {...this.state}
  highlight={hour => this._onHighlight(hour)}
/>
```

That's pretty classic - we create a way to change the state and an initial value for the property we're interested in.

Now in charts.js, we're going to do the following changes:

we add arguments to Charts:

```js
function Charts({
  highlight,
  highlightedHour,
  pickups
})
```

Then, before the return statement:

```js
const data = pickups.map(d => ({
  ...d, color: d.hour === highlightedHour ? '#19CDD7' : '#125C77'
}));
```

And finally, in the VerticalBarSeries component:

```js
<VerticalBarSeries
  colorType="literal"
  data={data}
  onValueMouseOver={d => highlight(d.hour)}
/>
```
<!-- INJECT:"GeospatialAppHoverInteraction" inline -->

We are getting the highlighted hour from the the parent component's state, and adding a callback method to set the hour on the parent state.

We are now integrating that information to prepare a dataset: we're going to add some color information to it. If a bar is highlighted, we're giving it a special color.

In VerticalBarSeries, the onValueMouseOver is the way to plug our callback to an interaction event. When a user will mouseover a bar of the series, highlight will be called.

When we prepared the dataset for the pickups series, we provided an x and a y value for each mark, which is required by React-Vis. However, we can provide any attributes we want to our data array. We chose to include an "hour" property which corresponds to the integer value of the hour when a pickup happened.

onValueMouseOver passes the object which corresponds to the mark which is highlighted, with all its properties. We can then pass the hour property to that highlight callback.

We also changed the colorType to be "literal". There are many ways to pass color to a react-vis series, but if we pass explicit color values in the dataset, we must signal it to the series.

## 2. Fine-tuning: handling mousing out of the chart and clicks.

For now the last highlighted bar remains highlighted even if the cursor leaves the chart. We can fix that by adding the following property to XYPlot:

```js
<XYPlot
  ...
  onMouseLeave={() => highlight(null)}
/>
```

But eventually we'd like to leave a bar selected while we mouse over elsewhere on the chart. So, we'd like to handle clicks.

Let's go back to app.js to add the `_onSelect` method:

```js
_onSelect(selectedHour) {
  this.setState({
    selectedHour: selectedHour === this.state.selectedHour ? null : selectedHour
  });
}
```

and update the `Charts` component in our render method:

```js
<Charts {...this.state}
  highlight={hour => this._onHighlight(hour)}
  select={hour => this._onSelect(hour)}
/>
```

Now, back to `charts.js`: let's change the beginning of the component:

```js
export default function Charts({
  highlight,
  highlightedHour,
  pickups,
  select,
  selectedHour
}) {
  if (!pickups) {
    return (<div style={charts}/>);
  }
  const data = pickups.map(d => {
    let color = '#125C77';
    if (d.hour === selectedHour) {
      color = '#19CDD7';
    }
    if (d.hour === highlightedHour) {
      color = '#17B8BE';
    }
    return {...d, color};
  });

// ...
```

And in the VerticalBarSeries component:

```js
<VerticalBarSeries
  colorType="literal"
  data={data}
  onValueMouseOver={d => highlight(d.hour)}
  onValueClick={d => select(d.hour)}
  style={{cursor: 'pointer'}}
/>
```

`onValueClick` is to `onValueMouseOver` what click is to mouse over.
We can change the style of the cursor to pointer by passing a style property, that's a nice way to signal that an element is clickable.

If the user clicks on a bar twice, it will be unselected.

<ul class="insert takeaways">
  <li>XYPlot and Series components can take callbacks as props to handle mouse events</li>
</ul>

<ul class="insert further-readings">
  <li>
    [React-Vis interaction documentation](https://uber.github.io/react-vis/general-principles/interaction)
  </li>
</ul>

Here's a link to the [complete code of this step](https://github.com/uber-common/vis-academy/tree/master/src/demos/building-a-geospatial-app/5-interaction)

<!-- INJECT:"GeospatialAppBasicCharts" heading -->

<ul class="insert learning-objectives">
  <li>Create a simple chart</li>
</ul>

# Adding Charts with React-Vis

[React-Vis](http://uber.github.io/react-vis) is the Uber library for rendering charts with React.

In React Vis, creating a chart has a nice React-y feeling of assembling components one into another.

## 1. Before we get started - some changes to our app

We're going to need extra data for the charts.

in your app.js file, replace your _processData method with this one:
```js
  _processData() {
    if (taxiData) {
      this.setState({status: 'LOADED'});
      const data = taxiData.reduce((accu, curr) => {

        const pickupHour = new Date(curr.pickup_datetime).getUTCHours();
        const dropoffHour = new Date(curr.dropoff_datetime).getUTCHours();

        const pickupLongitude = Number(curr.pickup_longitude);
        const pickupLatitude = Number(curr.pickup_latitude);

        if (!isNaN(pickupLongitude) && !isNaN(pickupLatitude)) {
          accu.points.push({
            position: [pickupLongitude, pickupLatitude],
            hour: pickupHour,
            pickup: true
          });
        }

        const dropoffLongitude = Number(curr.dropoff_longitude);
        const dropoffLatitude = Number(curr.dropoff_latitude);

        if (!isNaN(dropoffLongitude) && !isNaN(dropoffLatitude)) {
          accu.points.push({
            position: [dropoffLongitude, dropoffLatitude],
            hour: dropoffHour,
            pickup: false
          });
        }

        const prevPickups = accu.pickupObj[pickupHour] || 0;
        const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

        accu.pickupObj[pickupHour] = prevPickups + 1;
        accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

        return accu;
      }, {
        points: [],
        pickupObj: {},
        dropoffObj: {}
      });

      data.pickups = Object.entries(data.pickupObj).map(([hour, count]) => {
        return {hour: Number(hour), x: Number(hour) + 0.5, y: count};
      });
      data.dropoffs = Object.entries(data.dropoffObj).map(([hour, count]) => {
        return {hour: Number(hour), x: Number(hour) + 0.5, y: count};
      });
      data.status = 'READY';

      this.setState(data);
    }
  }
```

You can just copy/paste. Nothing is rocket science here, we're just creating our dataset.
We're building 3 extra objects: _pickups_, which has the number of pickups by hour, _dropoffs_, which has the tally of dropoffs by hour, and _scatterplot_, which will show how the distance and time of the trips are correlated.
We're also adding the hour of the pickup or dropoff time to the dataset we passed to the deck.gl overlay.

Then, create a new file called charts.js with the following:

```js
import React from 'react';
import {charts} from './style';

import {
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

export default function Charts() {
  return (
    <div style={charts} />
  );
}
```

Finally, back in your app.js file, add the following:

```js
import Charts from './charts';
```

Towards the top of the file with your other imports, and update the render method like so:

```js
render() {
  return (
    <div>
      {this.state.hoveredObject &&
        <div style={{
          ...tooltipStyle,
          left: this.state.x,
          top: this.state.y
        }}>
          <div>{this.state.hoveredObject.id}</div>
        </div>}
      <LayerControls
        settings={this.state.settings}
        propTypes={HEXAGON_CONTROLS}
        onChange={settings => this._updateLayerSettings(settings)}/>
      <MapGL
        {...this.state.viewport}
        mapStyle={MAPBOX_STYLE}
        onViewportChange={viewport => this._onViewportChange(viewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay
          viewport={this.state.viewport}
          data={this.state.points}
          onHover={hover => this._onHover(hover)}
          {...this.state.settings}/>
      </MapGL>
      <Charts {...this.state} />
    </div>
  );
}
```

Are you ready?

## 2. Creating a basic React-vis chart

First, we are going to create a simple bar chart of pickups by hour.

To do this, we are going to use the pickup variable we prepared above. This is an array of objects of the form: {x, y}.
x is going to be the hour, and y is going to be the number of dropoffs we want to plot.

Then, we are going to create our barchart using the following React-Vis components: [XYPlot](http://uber.github.io/react-vis/#/api-reference/xy-plot), [XAxis](http://uber.github.io/react-vis/#/api-reference/axes), [YAxis](http://uber.github.io/react-vis/#/api-reference/axes), and [VerticalBarSeries](http://uber.github.io/react-vis/#/series-reference/bar-series).

In your charts.js file, update the Charts component as follows:

```js
export default function Charts({pickups}) {
  if (!pickups) {
    return (<div style={charts}/>);
  }
  return (
    <div style={charts}>
      <h2>Pickups by hour</h2>
      <p>As percentage of all trips</p>
      <XYPlot
        height={140}
        width={480}
      >
      <XAxis />
      <YAxis />
      <VerticalBarSeries
        data={pickups}
      />
      </XYPlot>
    </div>
  );
}
```

This code produces this output:

<!-- INSERT:"GeospatialAppBarChartBasic" -->

In just 8 lines of React-vis code we have a bar chart with axes!

XYPlot is the wrapper component around all React-Vis marks. It must be passed a height and width, or you can use React-Vis's FlexibleXYPlot to get the dimensions from the parent container (for responsive graphs, e.g.).

Inside our XYPlot component, we just add the components that we need in the order that we want:

XAxis is our horizontal axis, YAxis is our vertical axis, and VerticalBarSeries is the series of data proper.

## 2. Customize components with props

Every component in React-Vis can be fine tuned.
In this next session, we're going to work on the appearance of the y-axis. Our objective is to make it go from 0% to 10%.

Our dataset is based a sample of 10,000 trips on a single day. The Y values proper contain an absolute number of pickups - in our sample, there were 434 pickups between 10 and 11 AM, for instance. 434 out of a sample of 10000 is not very useful, but a better way to phrase it is that it represents 4.34% of all the trips.

We can do that by changing the way the ticks are represented in the axes.

```js
<YAxis
  tickFormat={d => (d / 100).toFixed(0) + '%'}
/>
```

We'd also like to have the labels of axis go from 0% to 10% (that is: y between 0 and 1000). To do that, we can use the yDomain prop on XYPlot.

We could actually pass a yDomain prop in the YAxis and the VerticalBarSeries components, but if we do it in XYPlot, we can do it everywhere in one go.

```js
<XYPlot
  height={140}
  width={480}
  yDomain={[0, 1000]}
>
```

<!-- INSERT:"GeospatialAppBarChartYDomain" -->

To read more about axes in React-Vis, consult the [Axes docs](https://uber.github.io/react-vis/api-reference/axes).

<ul class="insert takeaways">
  <li>With the React-Vis component __XYPlot__ you can insert charts in your application.</li>
  <li>And again, these charts work like other React components - with props and callbacks.</li>
  <li>XYPlot can have various children like XAxis or BarSeries.</li>
  <li>Series-type components need to have a _data_ prop.</li>
</ul>

<ul class="insert further-readings">
  <li>[Visualization guidelines](https://uber-common.github.io/vis-tutorial/#documentation/visualization-guidelines/do-clear-simple-charts) - beyond technique, advice on how to build meaningful charts</li>
  <li>[React-Vis](https://uber.github.io/react-vis/) and its documentation</li>
</ul>

## Optional section

Feel free to skip to [lesson 5](#/5-interactions.md)

## 3. Fine tune our chart

The rest of this document will guide you through further fine-tuning improvements we can do to our chart, as the difference between a good chart and a great chart lie in the details.

### a. margins

XYPlot has a margin property which defines the interior spacing. Its default values are set for larger charts. So let's change this:

```js
<XYPlot
  margin={{left: 40, right: 25, top: 10, bottom: 25}}
  height={140}
  width={480}
>
```

You can read more about margins and other properties in the [XYPlot](https://uber.github.io/react-vis/api-reference/xy-plot) docs.

### b. x-axis customization

Right now, our x-axis is not very useful. It shows numbers: 0, 2, 4 ... with ticks on top of them.
If you created this dataset, you may know those are hours, but that may not be obvious for people reading this chart.

Also, when plotting time on an x-axis, one should be **extra-careful** because it's so easy to be ambiguous.

In our cases, our columns represent things that happened between midnight and 1:00AM, 1:00AM and 2:00 AM etc. until our last time slot, 11PM to midnight. So our columns correspond to time slots, not precise times. Writing 12AM below a column is ambiguous, because: is this the period _starting_ at 12AM? or _ending_ at 12AM?

For React-vis, the x value of a bar chart corresponds to its center, not to its left-most point. This is why, when preparing the dataset, we made the x values to be 0.5 more than their hour value: so that the column can be drawn in between 2 ticks.

We don't want to write out many x-axis labels either: every 6 hours should be enough.
XAxis has a tickValues prop that allows us to specify where we want to draw a tick: in our case, on [0, 6, 12, 18 and 24].

We can pass those custom values to the xAxis with the *tickValues* prop.

But we also want to format them right! we our ticks to read 12AM, 6AM, 12PM, 6PM and 12PM.
We can use *tickFormat* just as above to turn these values in the correct strings.
Finally, we can set *tickInnerSize* to 0 to only have ticks going from the axis to the outside of the chart.

```js
<XAxis
  tickFormat={h => (h % 24) >= 12 ?
    (h % 12 || 12) + 'PM' :
    (h % 12 || 12) + 'AM'
  }
  tickSizeInner={0}
  tickValues={[0, 6, 12, 18, 24]}
/>
```

<!-- INSERT:"GeospatialAppBarChartFormattedAxis" -->

### c. Color

React-Vis has many options to [style color](http://uber.github.io/react-vis/#/general-principles/colors). For now, let's just choose another blue

```js
<VerticalBarSeries
  color="#125C77"
  data={pickups}
/>
```

<!-- INSERT:"GeospatialAppBarChartCustomColor" -->

### d. More than bars: lines, scatterplots...

React-Vis has a many forms available for your charts. Here we're going to use LineSeries to show the pickups and a MarkSeries to show the dropoffs:

```js
<XYPlot ...>
  <LineSeries data={pickups} color="#08f" />
  <MarkSeries data={dropoffs} color="#f08" opacity="0.5" size="3" />
</XYPlot>
```
<!-- INSERT:"GeospatialAppBasicLineChart" -->

To learn about various React-Vis series, checkout [their docs](https://uber.github.io/react-vis/series-reference/arc-series).

Here's a link to the [complete code of this step](https://github.com/uber-common/vis-academy/tree/master/src/demos/building-a-geospatial-app/4-basic-charts)

Final charts.js code:

```js
import React from 'react';
import {charts} from './style';

import {
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

export default function Charts({pickups}) {
  if (!pickups) {
    return (<div style={charts}/>);
  }
  return (
    <div style={charts}>
      <h2>Pickups by hour</h2>
      <p>As percentage of all trips</p>
      <XYPlot
        margin={{left: 40, right: 25, top: 10, bottom: 25}}
        height={140}
        width={480}
        yDomain={[0, 1000]}
      >
      <YAxis
        tickFormat={d => (d / 100).toFixed(0) + '%'}
      />
      <VerticalBarSeries
        color="#125C77"
        data={pickups}
      />
      <XAxis
        tickFormat={h => (h % 24) >= 12 ?
          (h % 12 || 12) + 'PM' :
          (h % 12 || 12) + 'AM'
        }
        tickSizeInner={0}
        tickValues={[0, 6, 12, 18, 24]}
      />
      </XYPlot>
    </div>
  );
}
```

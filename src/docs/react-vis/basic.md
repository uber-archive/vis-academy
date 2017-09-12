<!-- INJECT:"AddCharts" heading -->

# Adding Charts with React-Vis

[React-Vis](http://uber.github.io/react-vis) is the Uber library for rendering charts with React.

In React Vis, creating a chart has a nice React-y feeling of assembling components one into another.

## 1. Before we get started - some changes to our app

We're going to need extra data for the charts. 

in your app.js file, change your _processData method by this one: 

```js
  _processData() {
    if (taxiData) {
      this.setState({status: 'LOADED'});
      const data = taxiData.reduce((accu, curr) => {
        const pickupTime = curr.tpep_pickup_datetime || '';
        const dropoffTime = curr.tpep_dropoff_datetime || '';

        const distance = curr.trip_distance;
        const amount = curr.total_amount;

        const pickupHour = Number(pickupTime.slice(11, 13));
        const dropoffHour = Number(dropoffTime.slice(11, 13));

        if (!isNaN(Number(curr.pickup_longitude)) && !isNaN(Number(curr.pickup_latitude))) {
          accu.points.push({
            position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
            hour: pickupHour,
            pickup: true
          });
        }

        if (!isNaN(Number(curr.dropoff_longitude)) && !isNaN(Number(curr.dropoff_latitude))) {
          accu.points.push({
            position: [Number(curr.dropoff_longitude), Number(curr.dropoff_latitude)],
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

      data.pickups = Object.entries(data.pickupObj).map(d => {
        const hour = Number(d[0]);
        return {hour, x: hour + 0.5, y: d[1]};
      });
      data.dropoffs = Object.entries(data.dropoffObj).map(d => {
        const hour = Number(d[0]);
        return {hour, x: hour + 0.5, y: d[1]};
      });
      data.status = 'READY';

      this.setState(data);
    }
  }
```

You can just copy/paste. Nothing rocket science here, we're just creating our dataset.
We're building 3 extra objects: _pickups_, which has the number of pickups by hour, _dropoffs_, which has the tally of dropoffs by hour, and _scatterplot_, which will show how distance and time of trips are correlated. 
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
    return (<div style={charts}>
    </div>);
  }
```

Finally, back in your app.js file, add the following: 

```js
  import Charts from './charts';
```

towards the top of the file with your other imports, and update the render method like so: 

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
            settings={this.state.settings}/>
        </MapGL>
        <Charts {...this.state} />
        <Spinner status={this.state.status} />
      </div>
    );
  }
```
Are you ready? 

## 2. Creating a basic React-vis chart

First, we are going to create a simple bar chart of pickups by hour.

To do this, we are going to use the pickup variable we prepared above. This is an array of objects of the form: {x, y}.
x is going to be the hour, and y is going to be the number of dropoffs we want to plot.

Then, we are going to create our barchart using the following React-Vis components: [XYPlot](http://uber.github.io/react-vis/#/documentation/api-reference/xy-plot), [XAxis](http://uber.github.io/react-vis/#/documentation/api-reference/axes), [YAxis](http://uber.github.io/react-vis/#/documentation/api-reference/axes), and [VerticalBarSeries](http://uber.github.io/react-vis/#/documentation/series-reference/bar-series).

In your charts.js file, update the Charts component as follows:

```js
export default function Charts({pickups}) {
  if (!pickups) {
    return (<div style={charts}/>);
  }
  return (<div style={charts}>
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
  </div>);
}
```

This code produces this output: 
<!-- INSERT:"BarChartBasic" -->

In just 8 lines of React-vis code we have a bar chart with axes!

XYPlot is the wrapper of React-Vis component. It must be given a height and a width, although React-Vis provides a way to make responsive charts as well.

Inside our XYPlot component, we just add the components that we need in the order that we want:

XAxis is our horizontal axis, YAxis is our vertical axis, and VerticalBarSeries is the series of data proper.

## 2. Customize components with props

Every component in React-Vis can be fine tuned. 
In this next session, we're going to work on the appearance of the y-axis. Our objective is to make it go from 0% to 10%. 

Our dataset is based a sample of 10,000 trips on that day. The Y values proper contain an absolute number of pickups - in our sample, there were 434 pickups between 10 and 11 AM, for instance. 434 out of a sample of 10000 is not very useful, but a better way to phrase it is that it represents 4.34% of all the trips. 

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

<!-- INSERT:"BarChartYDomain" -->

*To read more about axes in React-Vis, consult [http://uber.github.io/react-vis/#/documentation/api-reference/axes].*

## 3. Fine tune our chart

**For the rest of the tutorial, you can now jump to the next section.** 

The rest of this document will guide you through further fine-tuning improvements we can do to our chart, as the difference between a good chart and a great chart lie in the details. 

### a. margins

XYPlot has a property, margin, which defines the interior spacing. Its default values are set for larger charts. So let's change this:

```js
<XYPlot
  margin={{left: 40, right: 25, top: 10, bottom: 25}}
  height={140}
  width={480}
>

To read more about margins and other properties of XYPlot, consult http://uber.github.io/react-vis/#/documentation/api-reference/xy-plot.
```

### b. x-axis customization

Right now, our x-axis is not very useful. It shows numbers: 0, 2, 4 ... with ticks on top of them. 
If you created this dataset, you may know those are hours, but that may not be obvious for people reading this chart. 

Also, when plotting time on an x-axis, one should be **extra-careful** because it's so easy to be ambiguous.

In our cases, our columns represent things that happened between midnight and 1:00AM, 1:00AM and 2:00 AM etc. until our last time slot, 11PM to midnight. So our columns correspond to time slots, not precise times. Writing 12AM below a column is ambiguous, because: is this the period _starting_ at 12AM? or _ending_ at 12AM?

For React-vis, the x value of a bar chart corresponds to its center, not to its left-most point. This is why, when preparing the dataset, we made the x values to be 0.5 more than an integer: so that the column can be drawn in between 2 ticks. 

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
<!-- INSERT:"BarChartFormattedAxis" -->

### c. Color 

React-Vis has many options to [style color](http://uber.github.io/react-vis/#/documentation/general-principles/colors). For now, let's just choose another blue - 

```js
<VerticalBarSeries 
  color="#125C77"
  data={pickups} 
/>
```

<!-- INSERT:"BarChartCustomColor" -->

### d. More than bars: lines, scatterplots... 

React-Vis has a many forms available for your charts. Here we're going to use LineSeries to show the pickups and a MarkSeries to show the dropoffs:

```js
<XYPlot ...>
  <LineSeries data={pickups} color="#08f" />
  <MarkSeries data={dropoffs} color="#f08" opacity="0.5" size="3"/>
</XYPlot>
```
<!-- INSERT:"BasicLineChart" -->

To learn about various React-Vis series, consult http://uber.github.io/react-vis/#/documentation/series-reference/arc-series

```

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
  return (<div style={charts}>
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
  </div>);
}
```

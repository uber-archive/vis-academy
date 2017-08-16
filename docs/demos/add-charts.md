<!-- INJECT:"AddCharts" -->

# Adding Charts with React-Vis

[React-Vis](http://uber.github.io/react-vis) is the Uber library for rendering charts with React.

In React Vis, creating a chart has a nice React-y feeling of assembling components one into another.

First, we are going to create a simple bar chart of dropoffs by hour.

To do this, we prepare an array of data of the form: {x, y}. x is going to be the hour, and y is going to be the number of dropoffs we want to plot.

Then, we are going to create our barchart using the following React-Vis components: XYPlot, XAxis, YAxis, VerticalBarSeries.

```js

    <XYPlot
      height={140}
      width={280}
    >
      <XAxis />
      <YAxis />
      <VerticalBarSeries data={pickups} />
    </XYPlot>

```

This code produces this output: 
<!-- INSERT:"BarChartBasic" -->

In just 8 lines of code we have a bar chart with axes!

XYPlot is the wrapper of React-Vis component. It must be given a height and a width, although React-Vis provides a way to make responsive charts as well.

Inside our XYPlot component, we just add the components that we need in the order that we want:

XAxis is our horizontal axis, YAxis is our vertical axis, and VerticalBarSeries is the series of data proper.

## Now iterate:

XYPlot has a property, margin, which defines the interior spacing. Its default values are set for larger charts. So let's change this:

```js
<XYPlot
  margin={{left: 40, right: 20, top: 10, bottom: 20}}
  height={140}
  width={280}
>
```

<!-- INSERT:"BarChartMargins" -->
*See how the bar chart occupies the space better.*

Also, our bar chart values are cut at by the axes. That's because the *x-domain* of the chart, which is what is going to be shown by the chart, is defined by the data.
Again, the dataset is an array of objects of the form: {x: value, y: value}. 
The x value is going to help us position the bars. Since all those bars correspond to an interval in time, for instance between midnight and 1AM, I chose as an x value the center of that interval - ie 0.5 here. I'm taking that decision so that there will be less ambiguity concerning the ticks of the axis.
For instance, the bar to the right of 6AM corresponds to the 5AM-6AM interval, and that to the right corresponds to 6AM-7AM. 

So my x values range from 0.5 to 23.5. However, I'd like to draw an axis that can go from 0 to 24. 
That can be adjusted:

```js
<XYPlot
    xDomain={[0, 24]}
/>
```

<!-- INSERT:"BarChartXDomain" -->
*The bars no longer touch the axis on the left or the side of the chart on the right.*

Let's talk about the Y values. This dataset is based a sample of 10,000 trips on that day. The Y values proper contain an absolute number of pickups - in our sample, there were 434 pickups between 10 and 11 AM, for instance. 434 out of a sample of 10000 is not very useful, but a better way to phrase it is that it represents 4.34% of all the trips. 

We can do that by changing the way the ticks are represented in the axes. 

```js
<YAxis
  tickFormat={(d) => (d / 100).toFixed(0) + '%'}
/>
<XAxis
  tickValues={[0, 6, 12, 18, 24]}
  tickFormat={(d) => (d % 24) >= 12 ? (d % 12 || 12) + 'PM' : (d % 12 || 12) + 'AM'}
/>
```

<!-- INSERT:"BarChartFormattedAxis" -->
*See how the Y-axis ticks now have % and the X-axis ticks are now expressed as times.*

The tickFormat property is a function that will transform the value for a given Y tick into a more legible label.

We can also specify a domain in XYPlot, so these percentages will range from 0 to 10. 

```js
<XYPlot
    yDomain={[0, 1000]}
/>
```

<!-- INSERT:"BarChartYDomain" -->
*Now both the Y-axis and the bars in the chart go from 0 to 10%.*

Finally, let's change the color of the bars so they correspond to the color of the pickups on the map:

```js
<VerticalBarSeries 
  color='#0080FF'
  data={pickups} 
/>
```

<!-- INSERT:"BarChartCustomColor" -->

Final code:
```js
<div style={charts}>
    <h2>Pickups by hour</h2>
    <p>As percentage of all trips</p>
    <XYPlot
      margin={{left: 40, right: 20, top: 10, bottom: 20}}
      height={140}
      width={280}
      xDomain={[0, 24]}
      yDomain={[0, 1000]}
    >
    <YAxis
      tickFormat={(d) => (d / 100).toFixed(0) + '%'}
    />
    <VerticalBarSeries 
      color='#0080FF'
      data={pickups} 
    />
    <XAxis 
    tickPadding={2} tickValues={[0, 6, 12, 18, 24]}
    tickFormat={(d) => (d % 24) >= 12 ? (d % 12 || 12) + 'PM' : (d % 12 || 12) + 'AM'}/>
    </XYPlot>  
  </div>
```

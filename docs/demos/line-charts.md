<!-- INJECT:"LineCharts" -->

# Line Charts

Line charts, in react-vis, are not so different from bar charts.

This time, we want to plot pickups and dropoffs over time.
We prepare two series as arrays of the form {x, y}: where x is the hour, and y is the value (either pickup of dropoffs).

The only difference with our bar chart is that we are going to replace VerticalBarSeries by two LineSeries components:

```js
<XYPlot
    margin={{left: 40, right: 0, top: 0, bottom: 20}}
    height={140}
    width={280}
  >
  <LineSeries data={pickups} color='#0080FF' />
  <LineSeries data={dropoffs} color='#FF0080' />
  <XAxis
    tickValues={[0, 6, 12, 18, 24]}
    tickFormat={(d) => (d % 24) >= 12 ? (d % 12 || 12) + 'PM' : (d % 12 || 12) + 'AM'}
  />
  <YAxis tickFormat={(d) => (d / 100).toFixed(0) + '%'}
  />
</XYPlot>
```
This code produces this chart: 
<!-- INSERT:"LineChartsBasic" -->

Now let's go deeper and add some interaction to that. Wouldn't that be nice if moving the mouse around would give you the value of that precise point?
Each react-vis series has some event handlers built in. So, to that aim, we're going to use one of the event handlers of LineSeries: onNearestX.
When you mouseover on a plot that contains a line chart, onNearestX can pass the element corresponding to the nearest datapoint horizontally. 
You can tie that to actions or anything you like. For this simple component, we're just going to maintain a state in React and update an "hour" property.

```js
class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {hour: null};
  }

...

<LineSeries onNearestX={(d) => this.setState({hour: d.x})} data={pickups} color='#0080FF'/>
<LineSeries data={dropoffs} color='#FF0080'/>
```

<!-- INSERT:"LineChartsInteraction" -->
*Our chart looks exactly the same, but it records mouse movements and holds a state! let's see what we can do with it in the next insert.*

So, whenever we mouseover our line chart, the state of that component will change. 
Note that there's no need to have onNearestX on several lineSeries, especially if their dataset have the same x values. 

To show the user that there's been action, we're going to draw 2 dots on the charts. To do that, we're going to use a MarkSeries. Traditionally, MarkSeries are used for scatterplots, but we can represent as many or as few datapoints as we want.

```js
  const marks = hour === null ? [] :
    [pickups, dropoffs].map((d, i) => ({
      ...d.find(e => e.x === hour),
      color: i ? '#FF0080' : '#0080FF'}));
```

Here, we build the series that we're going to pass to the MarkSeries. If it's an empty array, no series is rendered. Else, I'm going to choose the data point corresponding to the hour for both series, and I'm adding a color to each datapoint.
In our previous examples, color was set at the level of the series for all marks. But we can also set it mark by mark for certain series. 

```js
<MarkSeries data={marks} colorType='literal' size='3'/>
```

To do that, I change the color scale to "literal". That means that the color should be exactly what's in the data - no interpretation or interpolation. Just like for x and y, colors can be assigned using scales, which can be linear (ie colors on a gradient) or categorical (different colors in a palette).
By default, colors are linear, so if we don't specify a scale, react-vis will try to fit them to a gradient. 

We also want the marks to disappear when we no longer mouse over the plot. To do that, we can have an onMouseLeave event on the XYPlot itself. 

```js
 <XYPlot
    ...
    onMouseLeave={()=> {this.setState({hour: null});}}
    ...
  >
```
<!-- INSERT:"LineChartsDynamicMark" -->
*Now mouseing over the chart makes the dots move!*

Note that just as in classic React, you can pass functions to those event handlers as props from higher-level components. So, a mouseover on a function can affect the state of a dashboard that contains several charts, or the store of an app, and cascade down as props to other charts. 

Final code: 

```js
class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {hour: null};
  }

  render() {
    const {dropoffs, pickups} = this.props;
    const {hour} = this.state;

    const marks = hour === null ? [] :
      [pickups, dropoffs].map((d, i) => ({
        ...d.find(e => e.x === hour),
        color: i ? '#FF0080' : '#0080FF'}));
    
    return (<div style={{position: 'relative'}}>
      {[hour === null ? null : <div 
        key='infotip'
        style={{position: 'absolute', top: 10, left: 50}}>
        <span>{`${hour - 0.5}-${hour + 0.5}h: `}</span>
        <span style={{color: '#FF0080'}}>{(marks[0].y / 100).toFixed(2) + '% '}</span>
        <span style={{color: '#0080FF'}}>{(marks[1].y / 100).toFixed(2) + '%'}</span>
      </div>, 
    <XYPlot
      key='chart'
      margin={{left: 40, right: 20, top: 10, bottom: 20}}
      height={140}
      onMouseLeave={()=> {this.setState({hour: null});}}
      width={280}
      xDomain={[0, 24]}
      yDomain={[0, 1000]}
    >
    <YAxis
      tickFormat={(d) => (d / 100).toFixed(0) + '%'}
    />
    <LineSeries onNearestX={(d) => this.setState({hour: d.x})} data={pickups} color='#0080FF'/>
    <LineSeries data={dropoffs} color='#FF0080'/>
    <MarkSeries data={marks} colorType='literal' size='3'/>
    <XAxis 
      tickPadding={2} tickValues={[0, 6, 12, 18, 24]}
      tickFormat={(d) => (d % 24) >= 12 ? (d % 12 || 12) + 'PM' : (d % 12 || 12) + 'AM'}/>
    </XYPlot>]}</div>);
  }
}
```

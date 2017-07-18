<!-- INJECT:"ScatterplotCharts" -->

# Scatterplot Charts

For the scatterplot, since there are many elements to display, we're going to switch from SVG rendering - which is what React-Vis normally does behind the scenes - to Canvas.
So, we are going to use the MarkSeriesCanvas series. We can specify a size property for the whole series.

The usage of the API is the same as with SVG-based components. In fact, we could try MarkSeries instead and it will work just as well, except for a drop in performance.

This time we have passed a title to our axes, and we have also passed them a style property so that it will be shown in our tiny chart.


```js
<XYPlot
  margin={{left: 40, right: 0, top: 0, bottom: 20}}
  height={140}
  width={280}
>
  <MarkSeriesCanvas data={scatterplot} size={2}/>
  <YAxis title="dollars" style={{title: {textAnchor: 'end'}}}/>
  <XAxis title="miles"  style={{title: {textAnchor: 'end'}}}/>
</XYPlot>
```

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

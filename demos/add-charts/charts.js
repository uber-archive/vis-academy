import React from 'react';
import {charts} from './style';

import {XYPlot, VerticalBarSeries, XAxis, YAxis
} from 'react-vis';
export default function Charts({pickups}) {
  if (!pickups) {
    return (<div style={charts}/>);
  }
  return (<div style={charts}>
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
  </div>);
}

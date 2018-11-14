import React from 'react';
import { charts } from './style';

import {
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis
} from 'react-vis';

export default function Charts({
  highlight,
  highlightedHour,
  pickups,
  select,
  selectedHour
}) {
  if (!pickups) {
    return (<div style={charts} />);
  }
  const data = pickups.map(d => {
    let color = '#125C77';
    if (d.hour === selectedHour) {
      color = '#19CDD7';
    }
    if (d.hour === highlightedHour) {
      color = '#17B8BE';
    }
    return { ...d, color };
  });

  return (<div style={charts}>
    <h2>Pickups by hour</h2>
    <p>As percentage of all trips</p>
    <XYPlot
      margin={{ left: 40, right: 25, top: 10, bottom: 25 }}
      height={140}
      width={480}
      yDomain={[0, 1000]}
      onMouseLeave={() => highlight(null)}
    >
      <YAxis
        tickFormat={d => (d / 100).toFixed(0) + '%'}
      />
      <VerticalBarSeries
        colorType="literal"
        data={data}
        onValueMouseOver={d => highlight(d.hour)}
        onValueClick={d => select(d.hour)}
        style={{ cursor: 'pointer' }}
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
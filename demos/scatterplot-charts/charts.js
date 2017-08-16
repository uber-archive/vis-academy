import React, {Component} from 'react';
import {charts, chartsClick} from './style';

import {XYPlot, LineSeries, MarkSeries, MarkSeriesCanvas, VerticalBarSeries, XAxis, YAxis
} from 'react-vis';

export default function Charts(props) {
  const {chartType, subtitle, title, onClick, pickups, dropoffs} = props;
  if (!pickups) {
    return (<div style={charts}/>);
  }
  return (<div style={charts} onClick={onClick}>
    <h2>{title}</h2>
    <p>{subtitle}</p>
    {chartType === 'BAR' ? <BarChart {...props} /> : null}
    {chartType === 'LINE' ? <LineChart {...props} /> : null}
    {chartType === 'SCATTERPLOT' ? <Scatterplot {...props} /> : null}
    <p style={chartsClick}>Click to cycle through available charts</p>
  </div>);
}

function BarChart({pickups}) {
  return (<XYPlot
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
  </XYPlot>);
}

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
    <XAxis
        tickValues={[0, 6, 12, 18, 24]}
        tickFormat={(d) => (d % 24) >= 12 ? (d % 12 || 12) + 'PM' : (d % 12 || 12) + 'AM'}
    />
    <YAxis tickFormat={(d) => (d / 100).toFixed(0) + '%'}
    />
    <LineSeries onNearestX={(d) => this.setState({hour: d.x})} data={pickups} color='#0080FF'/>
    <LineSeries data={dropoffs} color='#FF0080'/>
    <MarkSeries data={marks} colorType='literal' size='3'/>
    </XYPlot>]}</div>);
  }
}

function Scatterplot({scatterplot}) {
  return (<XYPlot
      margin={{left: 40, right: 0, top: 0, bottom: 20}}
      colorRange={['blue', 'black']}
      height={140}
      width={280}
    >
    <MarkSeriesCanvas data={scatterplot} size={2} opacity={0.2}/>
    <YAxis title="dollars" style={{title: {textAnchor: 'end'}}}/>
    <XAxis title="miles"  style={{title: {textAnchor: 'end'}}}/>
    </XYPlot>);
}
import React from 'react';
import {spinner} from './style';

const messages = {
  LOADING: 'Loading data...',
  LOADED: 'Processing data...',
  READY: 'HI!'
}

const speeds = new Array(20).fill(0).map((d, i) => ({speed: 2 - .025 * i, size: 5 + i * 0.2}));

export default function Spinner({status}) {

  return (<div className="spinner" style={{
    opacity: status === 'READY' ? 0 : 1,
    zIndex: 111
  }}>
    {speeds.map((s, i) => (
      <div key={i} style={{
        ...spinner,
        animation: 'spin linear infinite',
        animationDuration: `${s.speed}s`,
        height: s.size,
        width: s.size
      }}/>))}
    <div style={{position: 'absolute', top: 40, left: 40, zIndex: 112}}>
    {messages[status]}</div>
  </div>)
}

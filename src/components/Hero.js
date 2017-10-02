import React from 'react';
import App from '../demos/building-a-geospatial-app/6-linking-it-all/src/app.js';

function Hero() {
  return (<div className="Hero"
    style={{
      color: '#494949',
      height: '35vh',
      overflow: 'hidden',
      padding: 0,
      position: 'relative'
    }}
  >
    <App 
      noControls={true}
      viewport={{
        longitude: -73.97716964761271,
        latitude: 40.62291914445337,
        zoom: 10.745105428567754,
        maxZoom: 16,
        bearing: -31.958762886597924,
        pitch: 36.3576011413799
      }}
    />
    <a
      href="#/building-a-geospatial-app"
      className="btn"
      style={{
        position: 'absolute',
        bottom: '1rem',
        left: '260px',
        transform: 'translate(-50%)'
      }}
    >{'Get started'}</a>
  </div>);
}

export default Hero;

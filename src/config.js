import React from 'react';

export const PROJECT_TYPE = 'github'; // 'github' || 'phab'

export const PROJECT_NAME = 'vis-tutorial';
export const PROJECT_ORG = 'uber-common';
export const PROJECT_URL = `https://github.com/${PROJECT_ORG}/${PROJECT_NAME}`;
export const PROJECT_DESC = 'An introduction to Uber Visualization libraries.';

export const PROJECTS = {
  'deck.gl': 'https://uber.github.io/deck.gl',
  'luma.gl': 'https://uber.github.io/luma.gl',
  'react-map-gl': 'https://uber.github.io/react-map-gl',
  'react-vis': 'https://uber.github.io/react-vis',
};

export const HOME_HEADING = PROJECT_DESC;

export const HOME_RIGHT = (
  <div>

    <h2>Welcome to the visualization tutorials!</h2>

    <p className='m-bottom'>
      In the following pages, we're going to learn how to use 3 of Uber's open source visualization libraries: React Map GL, Deck GL and React Vis. All of these libraries have a different function and work in the React ecosystem. We're going to build an app using each library separately.
    </p>

    <p>
      React Map GL is a React wrapper on Mapbox: it allows you to render and interact with Mapbox maps in React applications.
      Deck GL is an interface to use WebGL in React. With DeckGL, users build layers of visualized elements that they can superimpose. DeckGL works especially well with React Map GL, but is not limited to maps.
      React Vis is Uber's charting library. It provides an abstraction to create, interact and style a variety of charts.
      For the purpose of this tutorial, we're going to use a dataset of taxi pickups and dropoffs in New York, where this information is public.
    </p>

  </div>
);

export const HOME_BULLETS = [{
  text: 'React-friendly',
  img: 'images/icon-react.svg',
}, {
  text: 'Learn the vis stack',
  img: 'images/icon-layers.svg',
}];

export const ADDITIONAL_LINKS = []

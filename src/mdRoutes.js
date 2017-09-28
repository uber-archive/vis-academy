// Setup

import SetupWindows from
  'docs/installing-a-coding-environment/1-install-tools-windows.md';
import SetupMac from
  'docs/installing-a-coding-environment/2-install-tools-mac.md';
import SetupCloning from
  'docs/installing-a-coding-environment/3-cloning.md';

// Building a geospatial app
import GeospatialAppSetup from
  'docs/building-a-geospatial-app/0-setup.md';
import GeospatialAppStartingMap from
  'docs/building-a-geospatial-app/1-starting-with-map.md';

import GeospatialAppMappingSimple from
  'docs/building-a-geospatial-app/mapping/simple.md';
import GeospatialAppMappingScatterplot from
  'docs//building-a-geospatial-app/mapping/scatterplot.md';
import GeospatialAppMappingArc from
  'docs/building-a-geospatial-app/mapping/arc.md';
import GeospatialAppMappingHexagon from
  'docs/building-a-geospatial-app/mapping/hexagon.md';

import GeospatialAppDeckScatterplot from
  'docs/building-a-geospatial-app/2-scatterplot-overlay.md';
import GeospatialAppDeckHexagon from
  'docs/building-a-geospatial-app/3-hexagon-overlay.md';

import GeospatialAppBasicCharts from
  'docs/building-a-geospatial-app/4-basic-charts.md';
import GeospatialAppInteractions from
  'docs/building-a-geospatial-app/5-interactions.md';
import GeospatialAppLinkingAll from
  'docs/building-a-geospatial-app/6-linking-it-all.md';

import GeospatialAppSimpleCharts from
  'docs/building-a-geospatial-app/guidelines/simple.md';
import GeospatialAppHierarchy from
  'docs/building-a-geospatial-app/guidelines/hierarchy.md';
import GeospatialAppTooMuch from
  'docs/building-a-geospatial-app/guidelines/toomuch.md';
import GeospatialAppConfusing from
  'docs/building-a-geospatial-app/guidelines/axes.md';

// graph vis
import setupGraph from 'docs/graph/0-setup.md';
import graphRender from 'docs/graph/1-render.md';
import startGraph from 'docs/graph/2-basic-graph.md';
import layoutEngine from 'docs/graph/3-layout-engine.md';
import interactionHover from 'docs/graph/4-interaction.md';

export default [{
  name: 'Installing a coding environment',
  desc: 'Prepare your machine for the Academy',
  image: 'images/setup/setup.png',
  path: '/installing-a-coding-environment',
  data: [{
    name: 'Installing tools - Windows',
    markdown: SetupWindows
  }, {
    name: 'Installing tools - Mac',
    markdown: SetupMac
  }, {
    name: 'Downloading code examples',
    markdown: SetupCloning
  }]
}, {
  name: 'Building a Geospatial App',
  desc: 'Learn how to create maps, layer data on top of them and draw charts with the Uber vis libraries.',
  image: 'images/geospatial-app/geospatial-app.png', 
  path: '/building-a-geospatial-app',
  data: [
    {
      name: 'Setup',
      markdown: GeospatialAppSetup
    },
    {
      name: '1. Starting with a Map',
      markdown: GeospatialAppStartingMap
    },
    {
      name: '2. Map data overlays - scatterplot',
      markdown: GeospatialAppDeckScatterplot
    },
    {
      name: '3. More data overlays - hexagons',
      markdown: GeospatialAppDeckHexagon
    },
    {
      name: '4. A basic chart',
      markdown: GeospatialAppBasicCharts
    },
    {
      name: '5. Interacting with charts',
      markdown: GeospatialAppInteractions
    },
    {
      name: '6. Linking if all',
      markdown: GeospatialAppLinkingAll
    }, 
    {
      name: 'Data overlays gallery',
      children: [{
        name: 'Mapping types',
        markdown: GeospatialAppMappingSimple,
      }, {
        name: 'Scatterplot',
        markdown: GeospatialAppMappingScatterplot,
      }, {
        name: 'Arc',
        markdown: GeospatialAppMappingArc,
      }, {
        name: 'Hexagon',
        markdown: GeospatialAppMappingHexagon,
      }]
    }, {
      name: 'Visualization Guidelines',
      children: [{
        name: 'Do: Clear simple charts',
        markdown: GeospatialAppSimpleCharts,
      }, {
        name: 'Do: Use hierarchy',
        markdown: GeospatialAppHierarchy,
      }, {
        name: 'Don\'t: Too much to see',
        markdown: GeospatialAppTooMuch,
      }, {
        name: 'Don\'t: Confusing axes',
        markdown: GeospatialAppConfusing,
      }]
    }
  ]
}, {
  name: 'Building a Graph Vis',
  desc: 'Learn how to create a graph visualization with d3-force layout.',
  image: 'images/graph-vis/cover.png', 
  path: '/graph-vis',
  data: [
    {
      name: 'Setup',
      markdown: setupGraph
    },
    {
      name: '1. Graph Render',
      markdown: graphRender
    },
    {
      name: '2. Basic Graph Application',
      markdown: startGraph
    },
    {
      name: '3. Plugin Layout Engine',
      markdown: layoutEngine
    },
    {
      name: '4. Interacting With Graph',
      markdown: interactionHover
    }
  ]
}];


import setup from 'docs/setup.md';
import startingMap from 'docs/starting-with-map.md';

import mappingSimple from 'docs/mapping/simple.md';
import mappingScatterplot from 'docs/mapping/scatterplot.md';
import mappingArc from 'docs/mapping/arc.md';
import mappingHexagon from 'docs/mapping/hexagon.md';

import deckScatterplot from 'docs/deckgl/scatterplot-overlay.md';
import deckHexagon from 'docs/deckgl/hexagon-overlay.md';

import basicCharts from 'docs/react-vis/basic.md';
import interactions from 'docs/react-vis/interactions.md';
import linkingAll from 'docs/react-vis/linking-it-all.md';

import simpleCharts from 'docs/guidelines/simple.md';
import hierarchy from 'docs/guidelines/hierarchy.md';
import tooMuch from 'docs/guidelines/toomuch.md';
import confusing from 'docs/guidelines/axes.md';

export default [{
  name: 'Documentation',
  path: '/documentation',
  data: [
    {
      name: 'Setup',
      markdown: setup
    },
    {
      name: '1. Starting with a Map',
      markdown: startingMap
    },
    {
      name: '2. Map data overlays - scatterplot',
      markdown: deckScatterplot
    },
    {
      name: '3. More data overlays - hexagons',
      markdown: deckHexagon
    },
    {
      name: '4. A basic chart',
      markdown: basicCharts
    },
    {
      name: '5. Interacting with charts',
      markdown: interactions
    },
    {
      name: '6. Linking if all',
      markdown: linkingAll
    }, 
    {
      name: 'Data overlays gallery',
      children: [{
        name: 'Mapping types',
        markdown: mappingSimple,
      }, {
        name: 'Scatterplot',
        markdown: mappingScatterplot,
      }, {
        name: 'Arc',
        markdown: mappingArc,
      }, {
        name: 'Hexagon',
        markdown: mappingHexagon,
      }]
    }, {
      name: 'Visualization Guidelines',
      children: [{
        name: 'Do: Clear simple charts',
        markdown: simpleCharts,
      }, {
        name: 'Do: Use hierarchy',
        markdown: hierarchy,
      }, {
        name: 'Don\'t: Too much to see',
        markdown: tooMuch,
      }, {
        name: 'Don\'t: Confusing axes',
        markdown: confusing,
      }]
    }
  ]
}];


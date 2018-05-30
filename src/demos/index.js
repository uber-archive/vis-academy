// building a geospatial app
import GeospatialAppStartingWithMap from './building-a-geospatial-app/1-starting-with-map/src/app';
import GeospatialAppScatterplotOverlay from './building-a-geospatial-app/2-scatterplot-overlay/src/app';
import GeospatialAppHexagonOverlay from './building-a-geospatial-app/3-hexagon-overlay/src/app';
import GeospatialAppBasicCharts from './building-a-geospatial-app/4-basic-charts/src/app';
import * as GeospatialAppChartExamples from './building-a-geospatial-app/4-basic-charts/src/examples';

import GeospatialAppInteraction from './building-a-geospatial-app/5-interaction/src/app';
import GeospatialAppLinkingItAll from './building-a-geospatial-app/6-linking-it-all/src/app';

import * as guidelines from './building-a-geospatial-app/guidelines';

import GraphLayout from './graph/2-graph-layout/src/app';
import InteractiveGraph from './graph/3-final-version/src/app';

// custom layers
import CombinationLayer from './custom-layers/1-combination-layer/src/app';
import AdaptorLayer from './custom-layers/2-adaptor-layer/src/app';
import CustomShader from './custom-layers/3-custom-shader/src/app';
import CustomAttribute from './custom-layers/4-custom-attribute/src/app';
import CustomUniform from './custom-layers/5-custom-uniform/src/app';

import KeplerglBasic from './kepler.gl/1-basic-keplergl/src/app-root';
import KeplerglLoadData from './kepler.gl/2-load-data/src/app-root';
import KeplerglLoadConfig from './kepler.gl/3-load-config/src/app-root';

export default {

  GeospatialAppStartingWithMap,
  GeospatialAppScatterplotOverlay,
  GeospatialAppHexagonOverlay,
  GeospatialAppBasicCharts,
  ...GeospatialAppChartExamples,
  GeospatialAppInteraction,
  GeospatialAppLinkingItAll,

  ...guidelines,
  
  GraphLayout,
  InteractiveGraph,

  CombinationLayer,
  AdaptorLayer,
  CustomShader,
  CustomAttribute,
  CustomUniform,

  KeplerglBasic,
  KeplerglLoadData,
  KeplerglLoadConfig
}

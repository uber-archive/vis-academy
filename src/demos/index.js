// building a geospatial app
import GeospatialAppStartingWithMap from './building-a-geospatial-app/1-starting-with-map/app';
import GeospatialAppScatterplotOverlay from './building-a-geospatial-app/2-scatterplot-overlay/app';
import GeospatialAppHexagonOverlay from './building-a-geospatial-app/3-hexagon-overlay/app';
import GeospatialAppBasicCharts from './building-a-geospatial-app/4-basic-charts/app';
import * as GeospatialAppChartExamples from './building-a-geospatial-app/4-basic-charts/examples';

import GeospatialAppInteraction from './building-a-geospatial-app/5-interaction/app';
import GeospatialAppLinkingItAll from './building-a-geospatial-app/6-linking-it-all/app';

import * as guidelines from './building-a-geospatial-app/guidelines';

export default {

  GeospatialAppStartingWithMap,
  GeospatialAppScatterplotOverlay,
  GeospatialAppHexagonOverlay,
  GeospatialAppBasicCharts,
  ...GeospatialAppChartExamples,
  GeospatialAppInteraction,
  GeospatialAppLinkingItAll,

  ...guidelines,

}

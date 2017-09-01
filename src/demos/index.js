import StartingWithMap from './starting-with-map/app';
import ScatterplotOverlay from './scatterplot-overlay/app';
import HexagonOverlay from './hexagon-overlay/app';
import AddCharts from './add-charts/app';
import StartingCode from './starting-code/app';
import IntroducingInteraction from './introducing-interaction/app';
import LinkingItAll from './linking-it-all/app';

import * as guidelines from './guidelines';
import * as charts from './charts';

export default {

  StartingCode,
  StartingWithMap,
  ScatterplotOverlay,
  HexagonOverlay,
  AddCharts,
  IntroducingInteraction,
  LinkingItAll,

  ...charts,
  ...guidelines,

}

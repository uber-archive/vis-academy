import {connect} from 'react-redux';
import App from './app';

import {changeViewport, highlight, hover, init, select, updateLayerSettings} from './actions';

const mapDispatchToProps = {
  changeViewport,
  highlight,
  hover,
  init,
  select,
  updateLayerSettings
};

const mapStateToProps = state => {
  return {
    highlightedHour: state.highlightedHour,
    hoveredObject: state.hoveredObject,
    pickups: state.pickups,
    points: state.points,
    ready: state.ready,
    selectedHour: state.selectedHour,
    settings: state.settings,
    viewport: state.viewport,
    x: state.x,
    y: state.y
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

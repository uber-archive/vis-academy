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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

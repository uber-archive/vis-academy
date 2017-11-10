import {handleActions} from 'redux-actions';

import {init, changeViewport, highlight, hover, select, updateLayerSettings} from './actions';

export const initHandler = (state, {payload}) => state;
export const changeViewportHandler = (state, {payload}) => state;
export const highlightHandler = (state, {payload}) => state;
export const hoverHandler = (state, {payload}) => state;
export const selectHandler = (state, {payload}) => state;
export const updateLayerSettingsHandler = (state, {payload}) => state;

export const reducer = handleActions({
  init: initHandler,
  changeViewport: changeViewportHandler,
  highlight: highlightHandler,
  hover: hoverHandler,
  select: selectHandler,
  updateLayerSettings: updateLayerSettingsHandler
}, {});

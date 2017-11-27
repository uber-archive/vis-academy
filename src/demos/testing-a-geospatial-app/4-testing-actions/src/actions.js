import {createAction} from 'redux-actions';

export const init = createAction('INIT');
export const changeViewport = createAction('CHANGE_VIEWPORT');
export const highlight = createAction('HIGHLIGHT');
export const hover = createAction('HOVER');
export const select = createAction('SELECT');
export const updateLayerSettings = createAction('UPDATE_LAYER_SETTINGS');


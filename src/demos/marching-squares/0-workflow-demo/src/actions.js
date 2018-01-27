import {createAction} from 'redux-actions';

// Action Ids
export const UPDATE_CURRENT_STEP = 'UPDATE_CURRENT_STEP';
export const UPDATE_VIEWPORT = 'UPDATE_VIEWPORT';

// Actions
export const updateCurrentStep = createAction(UPDATE_CURRENT_STEP);
export const updateViewport = createAction(UPDATE_VIEWPORT);

import {handleActions} from 'redux-actions';
import {UPDATE_VIEWPORT, UPDATE_CURRENT_STEP} from './actions';
import {allocBuffer, generateRandomData} from './utils';

export const DEFAULT_STATE = {
  width: 0,
  height: 0,

  numCol: 25,
  numRow: 25,

  currentStep: 0,

  pixelBuffer: allocBuffer(25 * 25),
  dataPoints: generateRandomData(100 * 1000)
};

const handleUpdateViewport = (state, {payload}) => ({
  ...state,
  width: payload.width,
  height: payload.height
});

const handleupdateCurrentStep = (state, {payload}) => ({
  ...state,
  currentStep: payload
});

export default handleActions(
  {
    [UPDATE_CURRENT_STEP]: handleupdateCurrentStep,
    [UPDATE_VIEWPORT]: handleUpdateViewport
  },
  DEFAULT_STATE
);

import {handleActions} from 'redux-actions';

import {changeViewport, highlight, hover, init, select, updateLayerSettings} from './actions';

export const changeViewportHandler = (state, {payload}) => ({
  ...state,
  viewport: {
    ...state.viewport,
    ...payload
  }
});

export const highlightHandler = (state, {payload}) => ({
  ...state,
  highlightedHour: payload
});

export const hoverHandler = (state, {payload: {x, y, object}}) => ({
  ...state,
  hoveredObject: object,
  x,
  y
});

export const initHandler = (state, {payload: {data, height, settingsObject, width}}) => {
  return {
  ...state,
  ...processData(data),
  ready: true,
  settings: Object.keys(settingsObject).reduce((accu, key) => ({
      ...accu,
      [key]: settingsObject[key].value
    }), {}),
  viewport: {
    ...state.viewport,
    height,
    width
  }};
};

export const selectHandler = (state, {payload}) => ({
  ...state,
  selectedHour: payload === state.selectedHour ? null : payload
});

export const updateLayerSettingsHandler = (state, {payload}) => ({
  ...state,
  settings: payload
});

export const reducer = handleActions({
  [init]: initHandler,
  [changeViewport]: changeViewportHandler,
  [highlight]: highlightHandler,
  [hover]: hoverHandler,
  [select]: selectHandler,
  [updateLayerSettings]: updateLayerSettingsHandler
}, {
  ready: false,
  selectedHour: null,
  viewport: {
    width: 0,
    height: 0,
    longitude: -74,
    latitude: 40.7,
    zoom: 11,
    maxZoom: 16
  }
});

export function processData(inputData) {
  const data = inputData.reduce((accu, curr) => {

    const pickupHour = new Date(curr.pickup_datetime).getUTCHours();
    const dropoffHour = new Date(curr.dropoff_datetime).getUTCHours();

    const pickupLongitude = Number(curr.pickup_longitude);
    const pickupLatitude = Number(curr.pickup_latitude);

    if (!isNaN(pickupLongitude) && !isNaN(pickupLatitude)) {
      accu.points.push({
        position: [pickupLongitude, pickupLatitude],
        hour: pickupHour,
        pickup: true
      });
    }

    const dropoffLongitude = Number(curr.dropoff_longitude);
    const dropoffLatitude = Number(curr.dropoff_latitude);

    if (!isNaN(dropoffLongitude) && !isNaN(dropoffLatitude)) {
      accu.points.push({
        position: [dropoffLongitude, dropoffLatitude],
        hour: dropoffHour,
        pickup: false
      });
    }

    const prevPickups = accu.pickupObj[pickupHour] || 0;
    const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

    accu.pickupObj[pickupHour] = prevPickups + 1;
    accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

    return accu;
  }, {
    points: [],
    pickupObj: {},
    dropoffObj: {}
  });

  data.pickups = Object.entries(data.pickupObj).map(([hour, count]) => {
    return {hour: Number(hour), x: Number(hour) + 0.5, y: count};
  });
  data.dropoffs = Object.entries(data.dropoffObj).map(([hour, count]) => {
    return {hour: Number(hour), x: Number(hour) + 0.5, y: count};
  });

  return data;
}

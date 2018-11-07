// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {combineReducers} from 'redux';
import {handleActions, createAction} from 'redux-actions';
import {routerReducer} from 'react-router-redux';
import keplerGlReducer, {combineUpdaters} from 'kepler.gl/reducers';
import Processor from 'kepler.gl/processors';
import {withTasks} from 'react-palm/tasks';
import Task from 'react-palm/tasks';
import {DEFAULT_LOADING_METHOD, LOADING_METHODS} from './constants';
import {searchPlacesByText} from './google-places-service';

// ACTIONS
const SET_LOADING_METHOD = 'SET_LOADING_METHOD';
export const setLoadingMethod = createAction(SET_LOADING_METHOD);

const SEARCH_PLACES = 'SEARCH_PLACES';
export const searchPlacesByQuery = createAction(SEARCH_PLACES);

const SEARCH_PLACES_SUCCESS = 'SEARCH_PLACES_SUCCESS';
export const searchPlacesSuccess = createAction(SEARCH_PLACES_SUCCESS);

const SEARCH_PLACES_ERROR = 'SEARCH_PLACES_ERROR';
export const searchPlacesError = createAction(SEARCH_PLACES_ERROR);


// TASKS
// Google Places tasks
export const getGooglePlacesTask = Task.fromPromise(
  (query, radius, location) =>
    searchPlacesByText(query, radius, location).then(data => Promise.resolve({data, query, radius, location})),
  'GET_GOOGLE_PLACES_TASK'
);

// INITIAL_APP_STATE
const initialAppState = {
  appName: 'example',
  loaded: false,
  loadingMethod: DEFAULT_LOADING_METHOD,
  currentOption: DEFAULT_LOADING_METHOD.options[0],
  previousMethod: null,
};

const reducers = combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer,
  app: handleActions({
    [SET_LOADING_METHOD]: (state, action) => ({
      ...state,
      previousMethod: state.loadingMethod,
      loadingMethod: LOADING_METHODS.find(({id}) => id === action.payload)
    }),
    [SEARCH_PLACES]: (state, action) => {
      const {query, radius, location} = action.payload;
      const tasks = [
        getGooglePlacesTask(query, radius, location).bimap(
          searchPlacesSuccess,
          searchPlacesError
        )
      ];
      return withTasks(state, tasks);
    },
    [SEARCH_PLACES_ERROR]: state => state
  }, initialAppState),
  routing: routerReducer
});

const composedUpdaters = {
  [SEARCH_PLACES_SUCCESS]: (state, action) => {
    console.log(action);

    const {data, query} = action.payload;
    const dataset = {
      data: Processor.processRowObject(data),
      info: {
        id: 'places',
        label: query
      }
    };

    const keplerGlInstance = combineUpdaters.addDataToMapComposed(
      state.keplerGl.map, // "map" is the id of your kepler.gl instance
      {
        payload: {
          datasets: [dataset]
        }
      }
    );

    return {
      ...state,
      keplerGl: {
        ...state.keplerGl, // in case you keep multiple instances
        map: keplerGlInstance
      }
    };
  },
};

const composedReducer = (state, action) => {
  if (composedUpdaters[action.type]) {
    return composedUpdaters[action.type](state, action);
  }
  return reducers(state, action);
};

export default composedReducer;

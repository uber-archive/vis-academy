In this step we are going to cover a more advanced example of integrating Kepler.gl into your application.
For this particular example, we can start from [step-1](1-import-keplergl.md) code base.
As part of this tutorial we are going to cover the following cases:
- Extend the data modal dialog to extend data source functionality and allow users to provide Google Places API params using Kepler.gl dependency injection capabilities.
- Perform async operation to fetch locations through Google Place API __textsearch__.
- Use Kepler.gl Redux APIs to capture and inject data onto our Map.


## Extend Data Modal Dialog
### Creating new data modal dialog
In order to extend Kepler.gl data source capability we are going to override the existing data modal dialog
by creating a new modal dialog react component.

The new Google Places modal dialog will provide the ability to input parameters to
perform __textsearch__ API call.
For the purpose of this tutorial, we are going to collect the following infor from the user:
- Query
- Radius
- Location
and pass them to Google textsearch API.

#### Google Places Modal Dialog
Create a new file `load-google-places-modal.js` within `src/`. This file will contain all UI components to display
to capture user's input for our API call.

After you created the file, you can copy and paste the content from
[load-google-places-modal.js](../../demos/kepler.gl/4-integrate-google-places/src/load-google-places-modal.js)

#### Data Modal new component
In this part we are going to create the component that will override Kepler.gl data modal dialog and define few constants.

Let's start creating the new file which will hold some default values for our application. Create a new file `constants.js`
and copy the content from [constants.js](../../demos/kepler.gl/4-integrate-google-places/src/constants.js)

Create a new file `load-data-model.js` and copy the content from
[load-data-modal.js](../../demos/kepler.gl/4-integrate-google-places/src/load-data-modal.js)

This new file will completely override the data modal Kepler.gl UI.

### Create new dependency injection factory to override Kepler.gl behavior
In this section we are going to take advantage of the flexible Kepler.gl dependency injection capabilities. In fact, we are going to override the
load data modal factory.

In order to override the factory, we are going to create a new file `factories.js` and copy the content from
[factories.js](../../demos/kepler.gl/4-integrate-google-places/src/factories.js)

By using the new factory we are going to also inject redux state and new actions onto the new created react components.

## Perform async operation
In this section we are going to cover how to interact with Google Places APIs. We are going to group the necessary methods
to interact with Google Places in a single file.

### Create Google Places Service
Create a new file `google-places-service.js` and copy the content from
[factories.js](../../demos/kepler.gl/4-integrate-google-places/src/google-places-service.js).

Make sure you update the __GOOGLE_API_KEY__ with your own Google API key
```js
GoogleMapsLoader.KEY = '[GOOGLE_API_KEY]';
```

The new file will provide an interface to interact with __textsearch__ API and process data in order to make
Google API response more suitable for Kepler.gl usage.

## Enhance Redux store to handle side effects
In order to populate Redux store with Google Places data we need to be able to handle side effects (async) in redux
and inject data into Kepler.gl Redux store.

In this section we are showing [react-palm](https://github.com/btford/react-palm) ability to handle async operations and use Kepler.gl redux API (combineUpdaters)
to interact with Kepler.gl Redux instance.

Customize the `reducers.js` file by copying the content from
[factories.js](../../demos/kepler.gl/4-integrate-google-places/src/reducers.js).

### Use [React-Palm](https://github.com/btford/react-palm) `to handle Redux side effects (async operations)
As part of our reducers we are going to pay attention to:
```js
import {withTasks} from 'react-palm/tasks';

// TASKS
// Google Places tasks
export const getGooglePlacesTask = Task.fromPromise(
  (query, radius, location) =>
    searchPlacesByText(query, radius, location).then(data => Promise.resolve({data, query, radius, location})),
  'GET_GOOGLE_PLACES_TASK'
);


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
```

### Use Kepler.gl Redux API to interact with Map redux Instance
In order to interact with Kepler.gl redux instance we need to import the following

```js
import {combineUpdaters} from 'kepler.gl/reducers';
```

Once we are ready to use __combineUpdaters we are going to create a combineUpdaters which will give us
access to Kepler.gl instance:

```js
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
```

In the above section we are going to read the data from our `getGooglePlacesTask` call and process it before they are
injected into Kepler.gl map using _combineUpdaters.addDataToMapComposed__.


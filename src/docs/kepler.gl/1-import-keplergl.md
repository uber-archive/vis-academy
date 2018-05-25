<ul class='insert learning-objectives'>
  <li>Create a Kepler.gl instance</li>
</ul>

# What Will We Do
In this step, we will create a visualization map by importing [Kepler.gl](http://kepler.gl) react and redux components.
We are going to edit two existing files: `reducers.js`, `app.js`. We are going to apply the following changes:
- `reducers.js`: import Kepler.gl redux component to handle the map state and actions
- `app.js`: import Kepler.gl react component (aka map) and Mapbox API Token

Let's get your hands on kepler.gl implementation by following steps:

## 1. Import Kepler.gl Redux component
Open `reducers.js` in `src/` folder. We are going to perform to perform two changes in this.

First, import Kepler.gl reducer by adding in the import section of the file the following snippet:
```js
import keplerGlReducer from 'kepler.gl/reducers';
```

The second step to perform is to add the reducer to our list of reducers by applying the following changes:
```js
const reducers = combineReducers({
  app: handleActions({
    // empty
  }, initialAppState),
  routing: routerReducer
});
```
Let's now add `keplerGlReducer`
```js
const reducers = combineReducers({
  // mount keplerGl reducer
  keplerGl: keplerGlReducer,
  app: handleActions({
    // empty
  }, initialAppState),
  routing: routerReducer
});
```

The above changes will make sure Kepler.gl react component will be able to store its state and handle action handlers accordingly.

## 2. Import Kepler.gl react and set Mapbox Api token
For this part, we are going to modify `app.js` in `src/`
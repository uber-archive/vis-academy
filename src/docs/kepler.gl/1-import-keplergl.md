<!-- INJECT:"KeplerglBasic" heading -->

<ul class='insert learning-objectives'>
  <li>Create a Kepler.gl instance</li>
</ul>

# What Will We Do
In this step, we will create a visualization map by importing [Kepler.gl](http://kepler.gl) react and redux components.
We are going to edit two existing files: `reducers.js`, `app.js`. We are going to apply the following changes:
- `reducers.js`: import Kepler.gl redux component to handle the map state and actions
- `app.js`: import Kepler.gl react component (aka map) and Mapbox API Token

Let's get your hands on kepler.gl implementation by following steps:

## 1. Import Kepler.gl
Open `reducers.js` in `src/` folder. We are going to perform to perform two changes in this.

First, import Kepler.gl reducer by adding in the import section of the file the following snippet:
```js
import keplerGlReducer from 'kepler.gl/reducers';
```

The second step to perform is to add the reducer to our list of reducers by applying the following changes:

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
Checkout the complete code at [this link](https://github.com/uber-common/vis-academy/blob/master/src/demos/kepler.gl/1-basic-keplergl/src/reducers.js)

## 2. Import Kepler.gl react component
For this part, we are going to modify `app.js` in `src/`. Currently our `app.js` only displays an H2 html tag and we are 
going to replace that tag with a kepler.gl react component.

Now let's focus on bringing in the actual map and in order to do so, we are going to import the Kepler.gl react component and use it in the app.js `render function`.
For the purpose of this code we are also going to import `Autosizer` which will be really helpful to handle window resize actions.
In the import section add the following lines
```js
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';
```
The next step is to use the new imported Kepler.gl react and Autosizer components onto the `render` method by applying the following changes
```js
  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
```

the above snippet will create a map instance of kepler which use `map` as id. The __id__ is really important because it will also be used as
key in Kepler.gl redux store to keep the state of the instance updated.
Checkout the complete code at [this link](https://github.com/uber-common/vis-academy/blob/kepler.gl/src/demos/kepler.gl/1-basic-keplergl/src/app.js)

Next, you can head to the next step:
[Load Data into Kepler.gl](#/kepler.gl/2-load-data).
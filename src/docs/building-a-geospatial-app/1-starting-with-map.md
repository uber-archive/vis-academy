<!-- INJECT:"GeospatialAppStartingWithMap" heading -->

<ul class='insert learning-objectives'>
<li>Create a map in a React application,</li>
<li>Add interaction to the map (zoom, pan, resize window)</li>
</ul>

# Starting With a Map

[react-map-gl](https://github.com/uber/react-map-gl) is a `React` wrapper around
the powerful `MapboxGL` mapping library. `react-map-gl` makes it super easy to
drop a mapping component into your application.

Checkout the complete code for this step
[here](https://github.com/uber-common/vis-academy/tree/master/demos/building-a-geospatial-app/1-starting-with-map).

## 1. Start with a bare React Component

**HOLD UP!!!** If you got here without reading the **Setup** step, it is
highly recommended that you do so, or your application might not work.
[GO HERE]((#/building-a-geospatial-app/0-setup.md) and go through it now.

The app component in the starting code above currently looks like this:
```js
...
export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Empty App, Edit Me!</div>
    );
  }

}
```
The next steps of this tutorial will only refer to parts of the outline shown
above, and not the whole thing.

## 2. Adding Default Viewport State

`react-map-gl` requires a viewport that specifies the dimension, location, and
basic settings of the map, so let's give ourselves a set of defaults:
```js
...
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16
      }
    };
  }

}
```
We set the viewport object on component state because `react-map-gl` leaves
the control of the viewport to the user. We will have to update this viewport
manually and pass it back into `react-map-gl` if we want to change it.

## 3. Adding the Map Component

Now that we have a viewport object, let's add the actual map component.
`react-map-gl` makes this extremely easy.
```js
import MapGL from 'react-map-gl';

export default class App extends Component {

  render() {
    return (
      <div>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          // This is needed to use mapbox styles
          mapboxApiAccessToken={MAPBOX_TOKEN}>
        </MapGL>
      </div>
    );
  }

}
```

## 4. `onViewportChange` Callback

Remember that `react-map-gl` leaves maintaining the viewport to the user. It would
be super tedious if you had to implement the event handling yourself.

Luckily, `react-map-gl` provides a callback that we can use to update our viewport.
This `onViewportChange` callback will be called with the updated viewport
every time the user interacts with the map (panning, zooming, rotating, etc.)

For a truly interactive map, let's add the callback and update our state. We
already passed in the callback when we defined the component so now we just
need to define it.
```js
export default class App extends Component {

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

}
```

Now that we have defined the callback. Let's pass it into the react-map-gl component
```js
return (
  <div>
    <MapGL
      // ...
      // Callback for viewport changes, addressed below
      onViewportChange={viewport => this._onViewportChange(viewport)}
      // ...
      />
  </div>
);
```

## 5. Adding Polish

We now have a fully functional map, and we could stop here. But what happens
when you resize the window? If you do it right now, you'll notice that the map
stays the same size. That's a terrible user experience, and we wouldn't want that.

Let's quickly add a resize handler that updates our viewport with the new dimension
```js
export default class App extends Component {

  constructor(props) {
    //...
    this._resize = this._resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

}
```
We leverage the `onViewportChange` callback to make sure there's only one place
where viewport state is actually being updated.

<ul class='insert takeaways'>
<li>We can use the ReactMapGL's MapGL component to use a map in React.</li>
<li>MapGL behaves just as another React component with props and callbacks.</li>
<li>Basic settings of the map are stored in the __viewport__ prop.</li>
<li>the __onViewportChange__ prop can be used to update the viewport when a user interacts with the map.</li>
</ul>

## 6. Completed Code

Our completed component [app.js](https://github.com/uber-common/vis-academy/blob/master/src/demos/building-a-geospatial-app/1-starting-with-map/app.js) should now look like this:

```js
/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        maxZoom: 16
      }
    };
    this._resize = this._resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    return (
      <div>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          onViewportChange={viewport => this._onViewportChange.bind(viewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
        </MapGL>
      </div>
    );
  }
}
```

That's all you need to render a map and make it interactive!
Let's dig a bit into what each one of those properties does.

## Properties

##### `width, height, longitude, latitude, zoom` {Number} (required)
These are the `viewport` properties and indicate the starting point of
your map.

##### `mapStyle` {String | Object | Immutable.Map}
This is the map style, either as a URL string or a full style object.

#### `onViewportChange` {Function}
Callback that will be called whenever the map updates (i.e. during interaction).
You **must** implement this and update the component with the new `viewport`
properties for a truly interactive map experience.

#### `mapboxApiAccessToken` {String}
The `MapboxGL` token required if you're trying to load a `mapStyle` that uses
mapbox data - which is any of their default styles.
[More Info](https://www.mapbox.com/help/create-api-access-token/)

For more detail information about `react-map-gl`,
[visit its Github](https://github.com/uber/react-map-gl).

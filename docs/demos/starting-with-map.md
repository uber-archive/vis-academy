<!-- INJECT:"StartingWithMap" -->

# Starting With a Map

[react-map-gl](https://github.com/uber/react-map-gl) is a `React` wrapper around
the powerful `MapboxGL` mapping library. `react-map-gl` makes it super easy to
drop a mapping component into your application.

Checkout the complete code for this step
[here](https://github.com/abmai/vis-tutorial/tree/master/demos/starting-with-map).

## 1. Start with a bare React Component

Checkout the starting code here
[here](https://github.com/abmai/vis-tutorial/tree/master/demos/starting-code).

The app component in the starting code above currently looks like this:
```js
import React, {Component} from 'react';

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div />
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
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 500,
        height: 500,
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

## 4. Adding the Map Component

Now that we have a viewport object, let's add the actual map component.
`react-map-gl` makes this extremely easy.
```js
import MapGL from 'react-map-gl';

export default class App extends Component {

  render() {
    const {viewport} = this.state;
    return (
      <div>
        <MapGL
          {...viewport}
          // Callback for viewport changes, addressed below
          onViewportChange={this._onViewportChange.bind(this)}
          // This is needed to use mapbox styles
          mapboxApiAccessToken={MAPBOX_TOKEN} />
      </div>
    );
  }

}
```

## 3. `onViewportChange` Callback

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

## 4. Adding Polish

We now have a fully functional map, and we could stop here. But what happens
when you resize the window? If you do it right now, you'll notice that the map
stays the same size. That's a terrible user experience, and we wouldn't want that.

Let's quickly add a resize handler that updates our viewport with the new dimension
```js
export default class App extends Component {

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth
    });
  }

}
```
We leverage the `onViewportChange` callback to make sure there's only one place
where viewport state is actually being updated.

## 5. Completed Code

Our completed component should now look like this:
```js
import React, {Component} from 'react';
import MapGL from 'react-map-gl';

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

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
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
    const {viewport} = this.state;
    return (
      <div>
        <MapGL
          {...viewport}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN} />
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

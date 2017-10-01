<!-- INJECT:"CombinationLayer" heading -->

<ul class='insert learning-objectives'>
<li>Create a custom CompositeLayer that renders multiple primitive layers.</li>
</ul>

# Combination Layer

Checkout the complete code for this step
[here](https://github.com/uber-common/vis-academy/tree/master/demos/custom-layers/1-combination-layer).

## 0. Overview of the code structure

Your starting point is the `vis-academy/src/demos/custom-layers/starting-code/src` folder. It should contain the following files:

- `app.js`: A basic app template that loads source data, renders the `DeckGLOverlay` component inside a map, handles window resize and user interactions.
- `deckgl-overlay.js`: A component that renders deck.gl with a ScatterplotLayer.
- `helpers.js`: Several functions that will prove handy as we walk through the exercises.

You do not have to worry about `app.js`; its purpose is to take care of the chore for you. All our work will go into `deckgl-overlay.js` and new files in this folder.

## 1. Create a custom CompositeLayer

Create a new file under the `src` folder and name it `taxi-layer.js`. We invision this layer to be able to visualize any taxi pickup/dropoff data.

We are going to inherit deck.gl's CompositeLayer class, which makes a layer that renders other layer(s).

```js
import DeckGL, {CompositeLayer} from 'deck.gl';

export default class TaxiLayer extends CompositeLayer {
  renderLayers() {
    // Create sublayers here
    return [];
  }
}
```

`defaultProps` is where you declare the default prop values of this layer. It is optional, but it will help document what props this layer expects, and reduce errors when you forget to define a prop when using this layer.

`renderLayers` is a method of CompositeLayer that gets called during deck.gl's render cycle. It is expected to return an array of layers, just like those you pass to DeckGL's `layers` prop.


## 2. Using your custom layer

Let's test out our shiny new layer! In `deckgl-overlay.js`, we can use this layer by importing it from its file:

```js
import TaxiLayer from './taxi-layer';

// render() function
// Instead of ScatterplotLayer...
    const layers = [
      new TaxiLayer({
        id: 'taxi-trips',
        data: this.props.data
      })
    ];
```

One of the first things you should consider when creating a new layer is: what props does it accept? How much can the user control the output?

A typical taxi pickup/dropoff dataset contains pickup and dropoff locations. To make this layer reusable - i.e. work with any format of raw data, we want to allow the user to define accessors for the locations, something like:

```js
    new TaxiLayer({
      id: 'taxi-trips',
      data: this.props.data,
      getPickupLocation: d => [d.pickup_longitude, d.pickup_latitude],
      getDropoffLocation: d => [d.dropoff_longitude, d.dropoff_latitude]
    });
```

We also want users to be able to customize the visualization such as colors, so we'll create props for those:
```js
    new TaxiLayer({
      id: 'taxi-trips',
      data: this.props.data,
      pickupColor: [0, 128, 255],
      dropoffColor: [255, 0, 128],
      getPickupLocation: d => [d.pickup_longitude, d.pickup_latitude],
      getDropoffLocation: d => [d.dropoff_longitude, d.dropoff_latitude]
    });
```


## 3. Render something

Now that we have the skeleton of a layer, let's render something with it!

Simply return two scatterplot layers in the `renderLayers` method:
```js
import DeckGL, {CompositeLayer, ScatterplotLayer} from 'deck.gl';

export default class TaxiLayer extends CompositeLayer {
  renderLayers() {
    return [
      new ScatterplotLayer({
        id: `${this.props.id}-pickup`,
        data: this.props.data,
        getPosition: this.props.getPickupLocation,
        getColor: d => this.props.pickupColor,
        radiusScale: 40
      }),
      new ScatterplotLayer({
        id: `${this.props.id}-dropoff`,
        data: this.props.data,
        getPosition: this.props.getDropoffLocation,
        getColor: d => this.props.dropoffColor,
        radiusScale: 40
      })
    ]
  }
}
```

Note that we're passing the props of this layer to the sublayers by mapping them to the prop names the ScatterplotLayer recognizes. The only exception is the `id` prop, because layer ids much be unique, we create them by appending suffix to the user defined id.

Run the app -- it should render both pickup and dropoff locations now.


## 4. Experiment with what you can do

Now you know that you can render any layer from the `TaxiLayer.renderLayer` method. You are free to experiment with what you can do.

For example, adding an arc connecting the pickup and dropoff locations:

```js
import DeckGL, {CompositeLayer, ScatterplotLayer, ArcLayer} from 'deck.gl';

export default class TaxiLayer extends CompositeLayer {
  renderLayers() {
    const {id, data, pickupColor, dropoffColor, radiusScale, getPickupLocation, getDropoffLocation} = this.props;

    return [
      ...
      new ArcLayer({
        id: `${this.props.id}-arc`,
        data: this.props.data,
        getSourcePosition: this.props.getPickupLocation,
        getTargetPosition: this.props.getDropoffLocation,
        getSourceColor: d => this.props.pickupColor,
        getTargetColor: d => this.props.dropoffColor,
        strokeWidth: 2
      })
    ];
  }
}
```

You can now head to the next step:
[Adaptor Layer](#/custom-layers/2-adaptor-layer)

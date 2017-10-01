<!-- INJECT:"AdaptorLayer" heading -->

<ul class='insert learning-objectives'>
<li>Create a custom CompositeLayer that processes data.</li>
</ul>

# Adaptor Layer

As you have seen rendering 10,000 arcs on screen does not provide any visual clarity. We very rarely want to visualize raw data as is. In this case, let's try clustering the pickup/dropoff locations into fewer points.

To demonstrate, I have implemented a function called `clusterPoints` in the `helpers.js`. Given a data array and one or more position accessors, it adds the centroid of the cluster to each datum. There are many JavaScript libraries that implement popular visualization algorithms. In this exercise, we will focus on how to plug such modules into deck.gl's layer lifecycle.

## 1. Create a new CompositeLayer

Create a new file under the `src` folder and name it `taxi-cluster-layer.js`. 

```js
import DeckGL, {CompositeLayer} from 'deck.gl';
import TaxiLayer from './taxi-layer';

export default class TaxiClusterLayer extends CompositeLayer {
  renderLayers() {
    // Create sublayers
    return [
      new TaxiLayer({
        ...this.props
      });
    ];
  }
}

TaxiClusterLayer.layerName = 'TaxiClusterLayer';
```

That's right, you can render a CompositeLayer inside a CompositeLayer!

Now head over to `deckgl-overlay.js` and replace the TaxiLayer we've been using with this new layer:

```js
// Instead of importing from taxi-layer...
import TaxiClusterLayer from './taxi-cluster-layer';

// render() function
// Instead of TaxiLayer...
    const layers = [
      new TaxiClusterLayer({
        // Same props as before
      })
    ];
```

It should render exactly the same.

## 2. Plug in data processing

We are going to override CompositeLayer's  `updateState` lifecycle method.
This method is called every time some of this layer props change.

```js
export default class TaxiClusterLayer extends CompositeLayer {
  updateState({oldProps, props}) {
    if (oldProps.data !== props.data) {
      // TODO: data changed, recalculate cluster
    }
  }
}
```

Here we checked if the `data` prop has changed. If so, we will call the pre-defined clustering function to process the new data. It will return a copy of the data array with two new fields: `pickup_cluster` and `dropoff_cluster`.

```js
// Import our own data processing module
import {clusterPoints} from './helpers';

export default class TaxiClusterLayer extends CompositeLayer {
  updateState({oldProps, props}) {
    if (oldProps.data !== props.data) {
      // data changed, recalculate cluster
      const clusteredData = clusterPoints(props.data, {
        pickup_cluster: props.getPickupLocation,
        dropoff_cluster: props.getDropoffLocation
      });

      // TODO: save the processed data somewhere
    }
  }
}
```

After clustering, we want the layer to remember the processed data so that we don't have to do it again. 


## 3. Save the processed data

In deck.gl, each layer remembers stuff from previous render cycles via the `state` object. Inside a layer's methods, if we call:
```js
this.setState({
  message: 'I remember!'
});
```
Then later, we can retrieve that info by accessing:
```js
this.state.message; // returns 'I remember!'
```

In this example, we will save `clusteredData` to the layer state so that it can be accessed in the `renderLayers` method in follwing up render cycles.
Here's the full code of the `updateState` method:
```js
  updateState({oldProps, props}) {
    if (oldProps.data !== props.data) {
      // data changed, recalculate cluster
      const clusteredData = clusterPoints(props.data, {
        pickup_cluster: props.getPickupLocation,
        dropoff_cluster: props.getDropoffLocation
      });

      // save processed data to layer state
      this.setState({clusteredData});
    }
  }
```


## 4. Render the processed data

Finally, in `renderLayers`, instead of using the user provided props, we want to use the clustered position that we calculated:

```js
  renderLayers() {
    // Create sublayers
    return [
      new TaxiLayer({
        ...this.props,
        data: this.state.clusteredData,
        getPickupLocation: d => d.pickup_cluster,
        getDropoffLocation: d => d.dropoff_cluster
      });
    ];
  }
```

Try the app in your broser now. The arcs look a lot cleaner!

You can now head to the next step:
[Custom Shader](#/custom-layers/3-custom-shader)

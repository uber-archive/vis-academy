<!-- INJECT:"AdaptorLayer" heading -->

<ul class='insert learning-objectives'>
<li>Create a custom CompositeLayer that processes data.</li>
</ul>

# Adaptor Layer

## 1. Create a new CompositeLayer

As you have seen rendering 10,000 arcs on screen does not provide any visual clarity. We very rarely want to visualize raw data as is. In this case, let's try clustering the pickup/dropoff locations into fewer points.

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
import TaxiLayer from './taxi-cluster-layer';
```

It should render exactly the same.

## 2. Plug in data processing

We are going to override CompositeLayer's  `updateState` lifecycle method.
This method is called every time some of this layer props change.

```js
export default class TaxiClusterLayer extends CompositeLayer {
  updateState({oldProps, props}) {
    if (oldProps.data !== props.data) {
      // data changed, recalculate cluster
      const {data, getPickupLocation, getDropoffLocation} = props;
      const clusteredData = data.map(d => ({...d}));

      // TODO: manipulate data points here

      this.setState({clusteredData});
    }
  }
}
```

Here we checked if the `data` prop has changed. If so, we clone the data points into a new array to be processed. We save the processed data into the layer's state by calling `this.setState`, so we won't have to do it again.

Now in `renderLayers`, instead of using the user provided data, we are going to use the processed data:

```js
  renderLayers() {
    // Create sublayers
    return [
      new TaxiLayer({
        ...this.props,
        data: this.state.clusteredData
      });
    ];
  }
```

## 3. Clustering with turf.js

[turf.js](http://turfjs.org) is an awesome library that performs common geospatial calculations. We will use it to help cluster our points.

In your console:
```
npm install @turf/turf --save
# or
yarn add @turf/turf
```
This will install turf for this project.

Now in `taxi-cluster-layer.js`, import some functions from turf:

```js
import turf from '@turf/helpers';
import clustersKmeans from '@turf/clusters-kmeans';
```

Insert the following to replace the `TODO` item inside `updateState`:

```js
    // Collect pickup and dropoff points into one array
    const pickupPoints = data.map((d, index) =>
      turf.point(getPickupLocation(d), {pickup: index}));

    const dropoffPoints = data.map((d, index) =>
      turf.point(getDropoffLocation(d), {dropoff: index}));

    const allPoints = turf.featureCollection(pickupPoints.concat(dropoffPoints));

    // Calculate clusters using K-means: https://en.wikipedia.org/wiki/K-means_clustering)
    clustersKmeans(allPoints).features
    .forEach(p => {
      const {pickup, dropoff, centroid} = p.properties;
      if (pickup !== undefined) {
        clusteredData[pickup].pickup_cluster_centroid = centroid;
      } else {
        clusteredData[dropoff].dropoff_cluster_centroid = centroid;
      }
    });
```
This code adds `pickup_cluster_centroid` and `dropoff_cluster_centroid` fields to the data points.

## 4. Replace accessors

Finally, in `renderLayers`, instead of using the user provided position accessors, we want to use the clustered position that we calculated:

```js
  renderLayers() {
    // Create sublayers
    return [
      new TaxiLayer({
        ...this.props,
        data: this.state.clusteredData,
        getPickupLocation: d => d.pickup_cluster_centroid,
        getDropoffLocation: d => d.dropoff_cluster_centroid
      });
    ];
  }
```

Try the app in your broser now. The arcs look a lot cleaner!

You can now head to the next step:
[Custom Shader](#/custom-layers/3-custom-shader)

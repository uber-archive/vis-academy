import DeckGL, {CompositeLayer} from 'deck.gl';
import TaxiLayer from './taxi-layer';

// turfjs.org
import turf from '@turf/helpers';
import clustersKmeans from '@turf/clusters-kmeans';

export default class TaxiClusterLayer extends CompositeLayer {

  updateState({oldProps, props}) {
    super.updateState(...arguments);

    if (oldProps.data !== props.data) {
      // data changed, recalculate cluster
      const {data, getPickupLocation, getDropoffLocation} = props;
      const clusteredData = data.map(d => ({...d}));

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

      this.setState({clusteredData});
    }
  }

  renderLayers() {
    return [
      new TaxiLayer({
        ...this.props,
        data: this.state.clusteredData,
        getPickupLocation: d => d.pickup_cluster_centroid,
        getDropoffLocation: d => d.dropoff_cluster_centroid
      })
    ];
  }

}

TaxiClusterLayer.layerName = 'TaxiClusterLayer';

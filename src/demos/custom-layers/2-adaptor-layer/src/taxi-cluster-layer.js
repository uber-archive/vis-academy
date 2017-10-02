import DeckGL, {CompositeLayer} from 'deck.gl';
import TaxiLayer from './taxi-layer';

import {clusterPoints} from './helpers';

export default class TaxiClusterLayer extends CompositeLayer {

  updateState({oldProps, props}) {
    super.updateState(...arguments);

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

  renderLayers() {
    return [
      new TaxiLayer({
        ...this.props,
        data: this.state.clusteredData,
        getPickupLocation: d => d.pickup_cluster,
        getDropoffLocation: d => d.dropoff_cluster
      })
    ];
  }

}

TaxiClusterLayer.layerName = 'TaxiClusterLayer';

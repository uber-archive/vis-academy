import DeckGL, {CompositeLayer, ScatterplotLayer, ArcLayer} from 'deck.gl';

const defaultProps = {
  radiusScale: 40,
  pickupColor: [255, 0, 0],
  dropoffColor: [0, 0, 255],
  getPickupLocation: d => d.pickup,
  getDropoffLocation: d => d.dropoff
};

export default class TaxiLayer extends CompositeLayer {

  renderLayers() {
    const {id, data, pickupColor, dropoffColor, radiusScale, getPickupLocation, getDropoffLocation} = this.props;

    return [
      new ScatterplotLayer({
        id: `${id}-pickup`,
        data,
        getPosition: getPickupLocation,
        getColor: d => pickupColor,
        radiusScale
      }),
      new ScatterplotLayer({
        id: `${id}-dropoff`,
        data,
        getPosition: getDropoffLocation,
        getColor: d => dropoffColor,
        radiusScale
      }),
      new ArcLayer({
        id: `${id}-arc`,
        data,
        opacity: 0.3,
        getSourcePosition: getPickupLocation,
        getTargetPosition: getDropoffLocation,
        getSourceColor: d => pickupColor,
        getTargetColor: d => dropoffColor,
        strokeWidth: 2
      })
    ];
  }

}

TaxiLayer.layerName = 'TaxiLayer';
TaxiLayer.defaultProps = defaultProps;

import GoogleMapsLoader from 'google-maps'; // only for common js environments

GoogleMapsLoader.KEY = '[GOOGLE_API_KEY]';
GoogleMapsLoader.LIBRARIES = ['places'];

const DEFAULT_LOCATION = [0, 0];

/**
 * This method will flatten out the google places result
 * so kepler will automatically detect lat/lng. It will also
 * filter out certain properties
 * TODO:
 * - icons are not loaded correctly
 * - price_level is crashing type-analyzer
 * @param results list of points from google places [https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=GOOGLE_API_KEY]
 * @returns {*}
 */
const processResults = results => results.map(result => {
  // we need to remore price_level because some rows have null values and it's creating
  // an exception with type-analizer: utils.js:58 (return RegexList[regexId].test(value.toString());)
  /* eslint-disable no-unused-vars */

  const {price_level, ...rest} = result;
  /* eslint-enable no-unused-vars */

  return {
    ...rest,
    // we need to call the function otherwise it will crash the kepler parsing method
    lat: result.geometry.location.lat(),
    lng: result.geometry.location.lng()
  };
});

/**
 * This method will return a promise to fetch places using google places API
 * @param query the search query to filter places
 * @param radius OPTIONAL the radius used for the search
 * @param location OPTIONAL the location to search around
 * @returns {Promise<any>}
 */
export function searchPlacesByText(query = '', radius = '500', location = DEFAULT_LOCATION) {
  return new Promise((resolve, reject) => {
    GoogleMapsLoader.load(google => {

      const validatedLocation = location && location.length === 2 ?
        location : DEFAULT_LOCATION;

      const center = new google.maps.LatLng(...validatedLocation);
      const request = {
        location: center,
        radius,
        query
      };
      const service = new google.maps.places.PlacesService(document.createElement('div'));

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(processResults(results));
          return;
        }
        reject(results);
        return;
      })
    });
  });
}

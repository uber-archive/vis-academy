import turf from '@turf/helpers';
import clustersKmeans from '@turf/clusters-kmeans';

/**
 * Clusters points
 * @param data {array} - source data
 * @param accessors {object} - key to accessor mapping.
 *   keys will be used to add results back to the datum.
 *   accessor should return a [longitude, latitude] pair.
 */
export function clusterPoints(data, accessors) {
  const clusteredData = data.map(d => ({...d}));

  const allPoints = [];

  data.forEach((d, index) => {
    for (const key in accessors) {
      const p = turf.point(accessors[key](d), {index, key});
      allPoints.push(p);
    }
  });

  // Calculate clusters using K-means: https://en.wikipedia.org/wiki/K-means_clustering)
  clustersKmeans(turf.featureCollection(allPoints)).features
  .forEach(p => {
    const {index, key, centroid} = p.properties;
    clusteredData[index][key] = centroid;
  });

  return clusteredData;
}

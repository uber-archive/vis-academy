import {LoadDataModalFactory} from 'kepler.gl/components';
import LoadDataModal from './load-data-model';
import {withState} from 'kepler.gl/components';

import {
  searchPlacesByQuery,
  setLoadingMethod
} from './reducers';

export const CustomLoadDataModalFactory = () =>
  withState(
    [],
    state => ({...state.app}),
    {
      onSetLoadingMethod: setLoadingMethod,
      searchPlacesByQuery: searchPlacesByQuery
    }
  )(LoadDataModal);

export function replaceLoadDataModal() {
  return [LoadDataModalFactory, CustomLoadDataModalFactory];
}

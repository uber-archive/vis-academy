import {text} from 'd3-request';

const loadContentSuccess = (name, content) => {
  const payload = {};
  payload[name] = content;
  return {type: 'LOAD_CONTENT', payload};
};

const loadContentStart = (name) => loadContentSuccess(name, '');

export const loadContent = (filename) => {
  return (dispatch, getState) => {
    const {contents} = getState();
    if (filename in contents) {
      // already loaded
      return;
    }

    dispatch(loadContentStart(filename));
    text(filename, (error, response) => {
      dispatch(loadContentSuccess(filename, error ? error.target.response : response));
    });

  };
};

export const toggleMenu = isOpen => ({type: 'TOGGLE_MENU', isOpen});
export const setHeaderOpacity = opacity => ({type: 'SET_HEADER_OPACITY', opacity});

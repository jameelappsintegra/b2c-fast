import axios from 'axios';
import * as actionTypes from '../actions/types';

export function commonFetch(options) {
  const { URL, type, ...rest } = options;
  return async (dispatch) => {
    await axios(URL, { ...rest })
      .then((responseData) => {
        dispatch({ type, payload: responseData?.data || [] });
      })
      .catch((error) => {
        console.log('API Error', error);
        if (type === actionTypes.FAQS_CONTENT) {
          dispatch({ type, payload: {} });
        }
      });
  };
}

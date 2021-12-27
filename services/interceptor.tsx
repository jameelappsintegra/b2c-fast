/* eslint-disable no-param-reassign */
import Axios from 'axios';
import * as https from 'https';
import Cookies from 'js-cookie';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/authConfig';

const myMsal = new PublicClientApplication(msalConfig);

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/* Function to validate|prepare|modify error object */
const prepareErrorObject = (error) => {
  let err = (error?.response?.data ?? error) || new Error('Network Error');

  if (typeof err === 'object') {
    err.timestamp = Date.now();
    err.config = error?.config;
  } else {
    err = {};
    err.message = 'Something went wrong.';
    err.timestamp = Date.now();
  }
  return err;
};
export default {
  setupInterceptors: (store) => {
    // Requests interceptor
    Axios.interceptors.request.use(
      (config) => {
        console.log(config.url);
        config.httpsAgent = httpsAgent;

        config.headers.common['X-Content-Type-Options'] = 'nosniff';
        config.headers.common['Accept-Language'] = store?.getState()?.storeReducer?.isArabic ? 'ar' : 'en';

        config.withCredentials = false;

        let idTokenMyAccount;

        // const currentAccounts: any = myMsal.getAllAccounts();

        idTokenMyAccount = sessionStorage.getItem('idTokenMyAccount') || '';

        // if (config.headers['Server-Call'] != 'Y') {
        config.headers.common['Authorization'] = `Bearer ${
          idTokenMyAccount || Cookies.get('AUTH_TOKEN', { path: '/' })
        }`;
        // }

        return config;
      },
      (error) => {
        return Promise.reject(error ? error['response'] : null);
      },
    );

    // Response interceptor
    Axios.interceptors.response.use(
      (response) => {
        const { data = [] } = response;
        if (response && response?.status >= 400) {
          const err = prepareErrorObject(data);
        }
        return response;
      },
      (error) => {
        const errorData =
          error && error != null
            ? error
            : {
                // tslint:disable-next-line: ter-indent
                response: {
                  data: [],
                  status: 404,
                  code: 404,
                  message: 'Error to get response',
                },
                // tslint:disable-next-line: ter-indent
              };
        const err = prepareErrorObject(errorData);

        return Promise.reject(errorData['response']);
      },
    );
  },
};

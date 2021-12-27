import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export const initializeStore = (initialState = {}) => {
  const middleWare = bindMiddleware([thunkMiddleware]);
  const store = createStore(rootReducer, initialState, middleWare);
  return { store };
};

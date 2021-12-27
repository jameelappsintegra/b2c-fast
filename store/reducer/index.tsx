import { combineReducers } from 'redux';
import storeReducer from './reducer';

const rootReducer = combineReducers({
  storeReducer,
});

export default rootReducer;

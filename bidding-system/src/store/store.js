import {createStore,combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import * as nav from './nav/reducer';
let store = createStore(
    combineReducers({
        ...nav,
    }),
    applyMiddleware(thunk)
);

export default store;
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import Reducers from './reducers';
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';

const history = createBrowserHistory();

const store = createStore(
    combineReducers({
        ...Reducers,
        router: connectRouter(history)
    }),
    {},
    compose(applyMiddleware(
        ReduxThunk,
        routerMiddleware(history)
    ))
);

ReactDOM.render(<Provider store={store}><App history={history}/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

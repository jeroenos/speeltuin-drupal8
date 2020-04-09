import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { StoreState, ViewMode } from './types/index';
import { AppAction, fetchData, restoreFilter } from './actions/index';
import { Map, List } from 'immutable';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
    proj4: any;
    L: any;
    Drupal: any;
    jQuery: any;
  }
}

const { Drupal, jQuery } = window;

(function ($) {
  Drupal.behaviors.tzoList = {
      attach: async function (context: any, settings: any) {
        const preloadedState = {
          themaId: settings.tzoList.thema_id,
          viewMode: ViewMode.List,
          filter: {
            title: '',
            address: '',
          },
          verdicts: Map(),
          filteredData: List()
        }

        const store = createStore<StoreState, AppAction, any, any>(
          rootReducer,
          preloadedState,
          composeWithDevTools(
            applyMiddleware(thunkMiddleware)
          )
        );

        ReactDOM.render(
          <Provider store={store}>
            <App />
          </Provider>,
          document.getElementById('tzo-list') as HTMLElement
        );

        await store.dispatch(restoreFilter());
        await store.dispatch(fetchData(settings.tzoList.thema_id));
      }
  }
}(jQuery));

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger'; // createLogger可以生成日志中间件logger
import { logger, router, reduxRouterMiddleware } from './middleware';
import rootReducer from './reducers';
import Immutable from 'immutable';
const nextReducer = require('./reducers');

export default function configure() {
  const create = window.devToolsExtension ?
    window.devToolsExtension()(createStore) :
    createStore;

  const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    reduxRouterMiddleware,
    // createLogger(),
    logger,
    router,
  )(create);
  const initialState = Immutable.Map();
  const store = createStoreWithMiddleware(rootReducer, initialState);

  // 热替换选项
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}

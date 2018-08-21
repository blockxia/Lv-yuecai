import { routerMiddleware } from 'react-router-redux';
import logger from './logger';
import router from './router';
import { browserHistory } from 'react-router';

const reduxRouterMiddleware = routerMiddleware(browserHistory);

export {
  reduxRouterMiddleware,
  logger,
  router,
};

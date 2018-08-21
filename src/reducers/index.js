import { combineReducers } from 'redux-immutable';
import account from './account.js';
import userInfo from './userInfo.js';
import locales from './locales.js';
import header from './header.js';
import catlogs from './catlogs.js';
import sliderBar from './sliderBar.js';
import country from './country.js';
import addressSearch from './addressSearch';
import addressSearchInit from './addressSearchInit';
import employees from './Settings/employees.js';
import roles from './Settings/roles.js';
import routing from './reactRouterRedux'
import platformNotice from './PlatformNotice/platformNotice';
import order from './order';
import afterSales from './afterSales';
import app from './app';
import homePage from './HomePage/homePage';
import settlementPage from './SettlementPage/settlementPage';
import search from './search';
import itemDetail from './itemDetail';
import bankPlat from './PlatformSetting/bankPlat';
import personalProfile from './PlatformSetting/personalProfile';
import invoiceMsg from './PlatformSetting/invoiceMsg';
import shoppingCart from './ShoppingCart/shoppingCart';
import addressInfo from "./PlatformSetting/address";
export default combineReducers({
  routing,
  account,
  userInfo,
  locales,
  header,
  catlogs,
  sliderBar,
  country,
  addressSearch,
  addressSearchInit,
  employees,
  roles,
  platformNotice,
  app,
  order,
  afterSales,
  homePage,
  settlementPage,
  search,
  itemDetail,
  bankPlat,
  invoiceMsg,
  shoppingCart,
  addressInfo,
  personalProfile
});

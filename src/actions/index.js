/**
 * @authors huyifan
 * @date    2018-03-23
 * @module  action
 */

import * as account from './account'
import * as changePassword from './changePassword'
import * as header from './header'
import * as locales from './locales'
import * as logout from './logout'
import * as newPopAddress from './newPopAddress'
import * as sliderBar from './sliderBar'
import * as userInfo from './userInfo'

export default {
  ...account,
  ...changePassword,
  ...header,
  ...locales,
  ...logout,
  ...newPopAddress,
  ...sliderBar,
  ...userInfo
}
import Cookies from 'js-cookie'

const TokenKey = 'rz_token'
const timeKey = 'rz_timestamp_key'

// 获取 token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 储存 token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除 token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}

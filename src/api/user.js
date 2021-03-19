import request from '@/utils/request'
/**
* 登录
*/
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}
/**
 * 获取员工基本信息 (获取用户头像)
 */
export function getUserDetailById(id) {
  return request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
}
export function logout() {
}

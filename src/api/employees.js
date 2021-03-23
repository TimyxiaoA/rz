/**
 * 员工管理 接口模块封装
 */

import request from '@/utils/request'

/*
* 获取员工简单列表
*/
export function getEmployeeSimple() {
  return request({
    method: 'GET',
    url: '/sys/user/simple'
  })
}

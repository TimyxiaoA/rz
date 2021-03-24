/**
 * 员工管理 接口模块封装
 */

import request from '@/utils/request'

/*
 * 获取所有角色列表
 */
export function getRoleList(params) {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

/*
 * 根据id获取公司信息
 **/
export function getCompanyInfo(companyId) {
  return request({
    method: 'GET',
    url: `/company/${companyId}`
  })
}

/*
 *  删除角色
 **/
export function deleteRole(id) {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

/*
*  根据ID获取当前角色详情
*/
export function getRoleDetails(id) {
  return request({
    method: 'GET',
    url: `/sys/role/${id}`
  })
}

/*
*  根据 ID更新当前角色信息
*/
export function editRole(data) {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

/*
*  添加角色
*/
export function addRole(data) {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}

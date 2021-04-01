/**
 * 权限管理 接口模块封装
 */

import request from '@/utils/request'

// 获取权限
export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}
// 新增权限
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}

// 根据ID更新权限点详情
export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'PUT',
    data
  })
}

// 根据id删除权限点
export function delPermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'DELETE'
  })
}
// 根据ID获取权限点详情
export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

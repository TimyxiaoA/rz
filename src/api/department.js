/**
 * 组织架构 接口模块封装
 */

import request from '@/utils/request'

/*
* 查询企业的部门列表
*/
export function getDepartments() {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

/*
* 根据ID删除部门
*/
export function delDepartments(id) {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

/*
* 根据 PID添加子部门
*/
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: `/company/department`,
    data
  })
}

/*
* 根据 ID查询某个部门的详情
*/
export function getDepartDetail(id) {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}

/*
* 根据 ID修改部门详情
*/
export function editDepartments(data) {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}

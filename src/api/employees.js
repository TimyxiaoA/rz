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

/*
* 获取员工综合列表
*/
export function getEmployeeList(params) {
  return request({
    method: 'GET',
    url: '/sys/user',
    params
  })
}

/*
* 新增员工
*/
export function addEmployee(data) {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

/*
* 删除员工
*/
export function delEmployee(id) {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

/*
 *  批量导入员工的接口
 **/
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/*
 * 保存员工的基本信息
 **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/*
 *  读取用户详情的基础信息
 **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/*
 *  更新用户详情的基础信息
 **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}

/*
 * 获取用户的岗位信息
 **/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/*
 * 保存岗位信息
**/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}

/*
 * 给员工分配角色
**/
export function assignRoles(data) {
  return request({
    url: `/sys/user/assignRoles`,
    method: 'PUT',
    data
  })
}

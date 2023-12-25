import { request } from '../network/request';
export function findMenu(data: any) {
	return request({
		url: '/koa/menu/findMenu',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function addMenu(data: any) {
	return request({
		url: '/koa/menu/addMenu',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function editMenu(data: any) {
	return request({
		url: '/koa/menu/editMenu',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findUserRoles(data: any) {
	return request({
		url: '/koa/users/findUserRoles ',
		method: 'post',
		data,
		showLoading: true,
	});
}
// 角色查询对应的菜单列表
export function findMenusForRoles(data: any) {
	return request({
		url: '/koa/users/findMenusForRoles ',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function addRole(data: any) {
	return request({
		url: '/koa/users/addRole',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function editRole(data: any) {
	return request({
		url: '/koa/users/editRole',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function delRole(data: any) {
	return request({
		url: '/koa/users/delRole',
		method: 'post',
		data,
		showLoading: true,
	});
}
// 更换角色权限
export function changeRolePermissions(data: any) {
	return request({
		url: '/koa/users/changeRolePermissions',
		method: 'post',
		data,
		showLoading: true,
	});
}
// 新增用户
export function addUser(data: any) {
	return request({
		url: '/koa/users/addUser',
		method: 'post',
		data,
		showLoading: true,
	});
}
// 修改用户
export function editUser(data: any) {
	return request({
		url: '/koa/users/editUser',
		method: 'post',
		data,
		showLoading: true,
	});
}

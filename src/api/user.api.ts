import { request } from '../network/request';
const prefix = '/koa';
export function adminLogin(data: any) {
	return request({
		url: prefix + '/users/admin_login',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findLoginRecord(data: any) {
	return request({
		url: prefix + '/users/findLoginRecord',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findUserRecord(data: any) {
	return request({
		url: prefix + '/users/findUserRecord',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function resetPassword(data: any) {
	return request({
		url: prefix + '/users/resetPassword',
		method: 'post',
		data,
		showLoading: true,
	});
}

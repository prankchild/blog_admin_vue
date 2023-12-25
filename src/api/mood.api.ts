import { request } from '../network/request';
const prefix = '/koa';
export function addMood(data: any) {
	return request({
		url: prefix + '/mood/addMood',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findMood(data: any) {
	return request({
		url: prefix + '/mood/findMood',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function updateMood(data: any) {
	return request({
		url: prefix + '/mood/updateMood',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function delMood(data: any) {
	return request({
		url: prefix + '/mood/delMood',
		method: 'post',
		data,
		showLoading: true,
	});
}

import { request } from '../network/request';
const prefix = '/koa';
export function findMessage(data: any) {
	return request({
		url: prefix + '/message/findMessage',
		method: 'post',
		data,
		showLoading: true,
	});
}

export function delMessage(data: any) {
	return request({
		url: prefix + '/message/delMessage',
		method: 'post',
		data,
		showLoading: true,
	});
}

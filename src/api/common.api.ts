import axios from 'axios';
import { request } from '../network/request';
export function upload(data: any) {
	return request({
		url: '/koa/common/upload',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function systemInfo(data: any) {
	return request({
		url: '/koa/common/getClientIP',
		method: 'get',
		data,
		showLoading: true,
	});
}
// export function systemInfo(data: any) {
// 	return new Promise((resolve, reject) => {
// 		axios
// 			.get('https://restapi.amap.com/v3/ip?ip=114.247.50.2&output=xml&key=7c4a2c5b32b0df59fc2382f7e947191e')
// 			.then((res) => {
// 				resolve(res);
// 			})
// 			.catch((err) => {
// 				reject(err);
// 			});
// 	});
// }
export function addCommonMainKey(data: any) {
	return request({
		url: '/koa/common/addCommonMainKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function addCommonChildKey(data: any) {
	return request({
		url: '/koa/common/addCommonChildKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findCommonMainKey(data: any) {
	return request({
		url: '/koa/common/findCommonMainKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findCommonChildKey(data: any) {
	return request({
		url: '/koa/common/findCommonChildKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function delCommonMainKey(data: any) {
	return request({
		url: '/koa/common/delCommonMainKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function delCommonChildKey(data: any) {
	return request({
		url: '/koa/common/delCommonChildKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function editCommonMainKey(data: any) {
	return request({
		url: '/koa/common/editCommonMainKey',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function editCommonChildKey(data: any) {
	return request({
		url: '/koa/common/editCommonChildKey',
		method: 'post',
		data,
		showLoading: true,
	});
}

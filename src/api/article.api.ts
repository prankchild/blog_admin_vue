import { request } from '../network/request';
const prefix = '/koa';
export function findArticleLabel(data: any) {
	return request({
		url: prefix + '/article/findArticleLabel',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function addArticle(data: any) {
	return request({
		url: prefix + '/article/addArticle',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function updateArticle(data: any) {
	return request({
		url: prefix + '/article/updateArticle',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function findArticle(data: any) {
	return request({
		url: prefix + '/article/findArticles',
		method: 'post',
		data,
		showLoading: true,
	});
}
export function addArticleLabel(data: any) {
	return request({
		url: prefix + '/article/addArticleLabel',
		method: 'post',
		data,
		showLoading: true,
	});
}

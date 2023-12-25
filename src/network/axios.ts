// import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCommonStore } from '@/store/modules/common';
import { useRouter } from 'vue-router';
class Request {
	private baseUrl = '';

	private request(opts: {}) {
		const instance: AxiosInstance = axios.create({
			baseURL: this.baseUrl,
			timeout: 3000,
		});
		this.setInterceptors(instance);
		return instance(opts);
	}
	// 拦截器
	private setInterceptors(instance: AxiosInstance) {
		// 请求拦截器
		instance.interceptors.request.use((config) => {
			const token = localStorage.getItem('authorization');
			if (token && config.headers) {
				config.headers['Authorization'] = token;
			}
			// 地址为上传地址
			if (config['url'].indexOf('upload') !== -1) {
				config.headers['Content-Type'] = 'multipart/form-data';
			}
			return config;
		});
		// 响应拦截器
		instance.interceptors.response.use(
			(res: AxiosResponse) => {
				const { code, message } = res.data;
				if (code === 0) {
					console.log(res.data, `res.data`);

					return Promise.resolve(res.data);
				}
				ElMessage.error(message);
				return Promise.reject(message);
			},
			(err) => {
				const commonStore = useCommonStore();
				const { message, code } = err.response.data;
				if (code === '10102' || code == '10101') {
					const router = useRouter();
					commonStore.tagsViewList = [];
					localStorage.removeItem('authorization');
					localStorage.removeItem('userInfo');
					commonStore.tagsViewList = [];
					commonStore.removeUserInfo();
					commonStore.hasDynamicRouter = false;
					commonStore.menuInfoList.forEach((item: { menu_name: string }) => {
						router.removeRoute(item.menu_name);
					});
				}
				ElMessage.error(message);
				return Promise.reject(err.response.data);
			}
		);
	}
	// 封装get请求
	public get(url: string, options?: AxiosRequestConfig) {
		return this.request({
			url,
			method: 'get',
			params: options,
		});
	}
	// 封装post请求
	public post(url: string, options: AxiosRequestConfig) {
		return this.request({
			url,
			method: 'post',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: options,
		});
	}
}
export default new Request();

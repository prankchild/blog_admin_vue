import { defineStore } from 'pinia';
import api from '@/api';
// 记录表
export const useRecordStore = defineStore({
	id: 'recordStore',
	state: () => ({
		// 登录网页枚举值
		loginSystemList: [],
	}),
	getters: {},
	actions: {
		async getLoginSystemList() {
			if (!this.loginSystemList.length) {
				api.findCommonChildKey({ main_key: 'LOGIN_SYSTEM' }).then((res: any) => {
					this.loginSystemList = res.result.data;
				});
			}
		},
	},
});

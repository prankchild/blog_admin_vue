import { defineStore } from 'pinia';
import api from '@/api';
// 记录表
export const useMenuStore = defineStore({
	id: 'menuStore',
	state: () => ({
		// 菜单类型枚举值
		menuTypeList: [],
		// 菜单列表
		menuList: [],
	}),
	getters: {},
	actions: {
		async getMenuTypeList() {
			if (!this.menuTypeList.length) {
				api.findCommonChildKey({ main_key: 'MENU_TYPE' }).then((res: any) => {
					this.menuTypeList = res.result.data;
				});
			}
		},
		async getMenuList() {
			if (!this.menuList.length) {
				api.findMenu().then((res: any) => {
					this.menuList = res.result.menuList;
				});
			}
		},
		saveMenuList(menuList: any) {
			this.menuList = menuList;
		},
	},
});

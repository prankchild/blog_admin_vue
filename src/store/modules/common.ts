import { defineStore } from 'pinia';
import { getBrowserAndOsInfo } from '@/utils/record';
import api from '@/api';
import lodash from 'lodash';
interface CommonState {
	isOpenAside: boolean;
	tagsViewList: Array<tagsViewType>;
	userInfo: userInfoType;
	systemInfo: systemInfo;
	loginSystemList: loginSystemList[];
	userRoleList: ruleFormType[];
	menuInfoList: [];
	hasDynamicRouter: boolean;
	removeRouteList: [];
}
interface tagsViewType {
	name: string;
	path: string;
	metaName: string;
}
interface userInfoType {
	name?: string;
	avatar?: string;
	introduce?: string;
	email?: string;
	id?: number;
}
interface systemInfo {
	browser: string;
	system: string;
	city: string;
	province: string;
}
interface loginSystemList {
	child_key?: string;
	child_value?: string;
	createdAt?: string;
	id?: number;
	main_key?: string;
	sort?: string;
	updatedAt?: string;
}
interface ruleFormType {
	action_user_id?: string;
	available_range?: string[];
	createdAt?: string;
	id?: number;
	role_code?: string;
	role_describe?: string;
	role_name?: string;
	role_status?: number;
	updatedAt?: string;
	user_name?: string;
}
export const useCommonStore = defineStore('common', {
	// 推荐使用 完整类型推断的箭头函数
	state: (): CommonState => ({
		// 侧边菜单栏开关
		isOpenAside: true,
		// keep-alive缓存数组
		tagsViewList: [],
		// 用户数据
		userInfo: {},
		// 系统信息
		systemInfo: {
			browser: '',
			system: '',
			city: '',
			province: '',
		},
		// 登录系统字典
		loginSystemList: [],
		// 用户角色枚举
		userRoleList: [],
		// 菜单
		menuInfoList: [],
		// 是否已经获取动态路由
		hasDynamicRouter: false,
		// 动态路由返回的回调，删除动态路由时用到
		removeRouteList: [],
	}),
	actions: {
		changeOpenAside(bol: boolean) {
			this.isOpenAside = bol;
		},
		setTagsViewList(tagsView: tagsViewType) {
			this.tagsViewList.push(tagsView);
		},
		removeTagsViewList(index: number) {
			this.tagsViewList.splice(index, 1);
		},
		setUserInfo(userInfo: userInfoType) {
			this.userInfo = userInfo;
		},
		removeUserInfo() {
			this.userInfo = {};
			localStorage.removeItem('userInfo');
		},
		async saveSystemInfo() {
			if (!this.systemInfo.browser) {
				// 获取IP地址和定位
				const res = await api.systemInfo();
				// 获取操作系统和浏览器参数
				getBrowserAndOsInfo.init();
				const OSInfo = getBrowserAndOsInfo.getOS();
				const BrowserInfo = getBrowserAndOsInfo.getBrowser();
				this.systemInfo = {
					browser: BrowserInfo.browser + ' ' + BrowserInfo.version,
					system: OSInfo.name + ' ' + OSInfo.version,
					...res.result,
				};
			}
		},
		async getLoginSystemList() {
			if (!this.loginSystemList.length) {
				api.findCommonChildKey({ main_key: 'LOGIN_SYSTEM' }).then((res: { result: { data: loginSystemList[] } }) => {
					this.loginSystemList = res.result.data;
				});
			}
		},
		async getUserRoleList() {
			if (!this.userRoleList.length) {
				api.findUserRoles().then((res: { result: { data: ruleFormType[] } }) => {
					this.userRoleList = res.result.data;
				});
			}
		},
		saveMenuInfoList(menuInfoList: []) {
			// 权限路由权限菜单
			this.menuInfoList = menuInfoList;
			// 获取到路由之后保存到localStorage
			const localMenuInfoList: string = JSON.stringify(this.menuInfoList);
			localStorage.setItem('menuInfoList', localMenuInfoList);
		},
		// 从localStorage获取到菜单配置
		getLocalMenuInfoList() {
			if (!this.menuInfoList.length) {
				const localMenuInfoList = localStorage.getItem('menuInfoList');
				this.menuInfoList = JSON.parse(localMenuInfoList as string);
			}
		},
		saveRemoveRouteList(list: () => void[]) {
			this.removeRouteList = list;
		},
	},
});
const getTreeList = (menuList: any): any => {
	const parents = lodash.cloneDeep(menuList).filter((menu: { parent_menu_id: number }) => menu.parent_menu_id === 0);
	const children = lodash.cloneDeep(menuList).filter((menu: { parent_menu_id: number }) => menu.parent_menu_id !== 0);
	treeData(parents, children);
	function treeData(parents: any, children: any) {
		for (let index = 0; index < parents.length; index++) {
			for (let subIndex = 0; subIndex < children.length; subIndex++) {
				if (parents[index].id === children[subIndex].parent_menu_id) {
					if (parents[index].children) {
						parents[index].children.push(...treeData([children[subIndex]], children));
					} else {
						parents[index].children = [...treeData([children[subIndex]], children)];
					}
				}
			}
		}
		return parents;
	}
	return parents;
};

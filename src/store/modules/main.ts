import { defineStore } from 'pinia';
import { getBrowserAndOsInfo } from '@/utils/record';
import api from '@/api';
interface MainState {
	isOpenAside: boolean;
	tagsViewList: Array<tagsViewType>;
	userInfo: userInfoType;
	systemInfo: systemInfo;
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
}
interface systemInfo {
	browser?: string;
	system?: string;
}
export const useMain = defineStore('main', {
	// 推荐使用 完整类型推断的箭头函数
	state: (): MainState => ({ isOpenAside: true, tagsViewList: [], userInfo: {}, systemInfo: {} }),
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
			if (!Object.values(this.systemInfo).length) {
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
	},
});

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { NextLoading } from '@/utils/loading';
import { useCommonStore } from '@/store/modules/common';
import lodash from 'lodash';
/**
 * @name permission
 * @description 全局路由过滤、权限过滤
 */

import router from './index';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useRouterStore } from '@/store/modules/router';
router.beforeEach(async (to: RouteLocationNormalized, _, next) => {
	// 虚拟进度条
	NProgress.configure({ showSpinner: false });
	NProgress.start();
	if (window.nextLoading === undefined) NextLoading.start();
	const hasToken = localStorage.getItem('authorization');
	const userInfo = localStorage.getItem('userInfo');
	const menuInfoList = localStorage.getItem('menuInfoList');
	// 新增路由
	if (hasToken && userInfo && menuInfoList) {
		const commonStore = useCommonStore();
		// const routesStore = useRouterStore();
		// 判断是否已经添加路由
		if (!commonStore.hasDynamicRouter) {
			// 从localStorage获取到菜单数据
			commonStore.getLocalMenuInfoList();
			// 把菜单数据转化为路由数组
			const dynamicRouter = generateRouter(commonStore.menuInfoList);
			// 把路由塞入到router
			await dynamicRouter.forEach((route) => router.addRoute('Layout', route));
			commonStore.hasDynamicRouter = true;
			// 重新触发导航
			router.replace(to);
		}
		if (!Object.values(commonStore.userInfo).length) {
			commonStore.setUserInfo(JSON.parse(userInfo));
		}
		if (to.path === '/login') {
			next({ path: '/home' });
			NProgress.done();
			NextLoading.done();
		} else {
			next();
			NProgress.done();
			NextLoading.done();
		}
	} else {
		// 未登录
		if (to.path === '/login') {
			next();
			NProgress.done();
			NextLoading.done();
		} else {
			next('/login');
			NProgress.done();
			NextLoading.done();
		}
	}
});
// 路由加载后
router.afterEach(() => {
	NProgress.done();
	NextLoading.done();
});
interface routerType {
	id?: number;
	menu_component?: string;
	menu_redirect?: string;
	menu_cn_name?: string;
	menu_code?: string;
	menu_describe?: null;
	menu_icon?: null;
	menu_meta?: string;
	menu_name?: string;
	menu_path?: string;
	menu_status?: string;
	menu_type?: string;
	parent_menu_id?: number;
	children?: Array<routerType>;
}
export const formatRouteTree = (routerList: routerType[]) => {
	console.log(routerList, `routerList`);

	const parents = routerList.filter((routerInfo: routerType) => routerInfo.parent_menu_id === 0);
	// 筛选页面
	const children = routerList.filter((routerInfo: routerType) => routerInfo.parent_menu_id !== 0);
	dataToTree(parents, children);
	return parents;
	function dataToTree(parents: routerType[], children: routerType[]) {
		parents.map((parent: routerType) => {
			children.map((child: routerType, index: number) => {
				const _children: routerType[] = lodash.cloneDeep(children);
				_children.splice(index, 1);
				dataToTree([child], _children);
				if (child.parent_menu_id === parent.id) {
					if (parent.children) {
						parent.children.push(child);
					} else {
						parent.children = [child];
					}
				}
			});
		});
	}
};

const modules = import.meta.glob('../views/**/**/**.vue');

export const generateRouter = (routerList: routerType[]) => {
	const newRoutes = [];
	for (let index = 0; index < routerList.length; index++) {
		const route = routerList[index];
		if (route.menu_type === 'MENU_TYPE_PAGE') {
			const _route: RouteRecordRaw = {
				path: route.menu_path as string,
				name: route.menu_name,
				meta: { name: route.menu_cn_name },
				component: modules[`${route.menu_component}`],
			};
			// _route.component = defineAsyncComponent(() => import(/* @vite-ignore */ route.menu_component as string));
			// /* @vite-ignore */
			// _route.component = modules[`${route.menu_component}`];
			if (!route.menu_component) {
				_route.redirect = route.menu_redirect;
			}
			// router.addRoute(path, _route);
			if (route.children) {
				_route.children = generateRouter(route.children);
			}
			newRoutes.push(_route);
		}
	}
	return newRoutes;
};

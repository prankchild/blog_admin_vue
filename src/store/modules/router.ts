import { generateRouter, formatRouteTree } from '@/router/permission';
import { defineStore } from 'pinia';
export const useRouterStore = defineStore({
	id: 'router',
	state: () => ({
		routes: [],
		hasAuth: false,
	}),
	getters: {},
	actions: {
		// 登录的保存
		saveRoutes(routes: any) {
			const treeRoutes = formatRouteTree(routes);
			localStorage.setItem('routesInfo', JSON.stringify(treeRoutes));
			const standardRoutes = generateRouter(treeRoutes);
			this.routes = standardRoutes;
		},
		// 进入页面的保存
		addRoutes() {
			const routes = JSON.parse(localStorage.getItem('routesInfo'));
			if (routes && routes.length > 0) {
				const treeRoutes = formatRouteTree(routes);
				const standardRoutes = generateRouter(treeRoutes);
				this.routes = standardRoutes;
				// this.routes = routes;
				// console.log(this.routes, `this.routes`);
			}
		},
	},
});

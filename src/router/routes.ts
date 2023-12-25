import { RouteRecordRaw } from 'vue-router';
export const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/login.vue'),
		meta: { name: 'login' },
	},
	{
		path: '/',
		name: 'Layout',
		redirect: '/home',
		component: () => import('@/layout/layout.vue'),
		meta: { name: 'layout' },
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('@/views/home/homeManage.vue'),
				meta: { name: '首页' },
			},
			// {
			// 	path: '/basicInformation',
			// 	name: 'basicInformation',
			// 	redirect: '/basicInformation/dictionariesManagement',
			// 	meta: { name: '基础信息管理' },
			// 	children: [
			// 		{
			// 			path: '/basicInformation/dictionariesManagement',
			// 			name: 'dictionariesManagement',
			// 			component: () => import('@/views/basicInformation/dictionariesManagement/DictionariesManagement.vue'),
			// 			meta: { name: '字典管理' },
			// 		},
			// 		{
			// 			path: '/basicInformation/userInformation',
			// 			name: 'userManagement',
			// 			component: () => import('@/views/basicInformation/userManagement/UserManagement.vue'),
			// 			meta: { name: '用户管理' },
			// 		},
			// 		{
			// 			path: '/basicInformation/roleManagement',
			// 			name: 'roleManagement',
			// 			component: () => import('@/views/basicInformation/roleManagement/RoleManagement.vue'),
			// 			meta: { name: '角色管理' },
			// 		},
			// 		{
			// 			path: '/basicInformation/menuManagement',
			// 			name: 'menuManagement',
			// 			component: () => import('@/views/basicInformation/menuManagement/MenuManagement.vue'),
			// 			meta: { name: '菜单管理' },
			// 		},
			// 	],
			// },
			// {
			// 	path: '/record',
			// 	name: 'record',
			// 	redirect: '/record/login_record',
			// 	meta: { name: '记录表' },
			// 	children: [
			// 		{
			// 			path: '/record/login_record',
			// 			name: 'login_record',
			// 			component: () => import('@/views/record/loginRecord/index.vue'),
			// 			meta: { name: '登录记录表' },
			// 		},
			// 	],
			// },
			// {
			// 	path: '/mood',
			// 	name: 'moodManage',
			// 	redirect: '/mood/moodList',
			// 	meta: { name: '心情状态' },
			// 	children: [
			// 		{
			// 			path: '/mood/moodList',
			// 			name: 'moodList',
			// 			component: () => import('@/views/mood/moodList/index.vue'),
			// 			meta: { name: '心情列表' },
			// 		},
			// 	],
			// },
			// {
			// 	path: '/article',
			// 	name: 'articleManage',
			// 	redirect: '/article/addArticle',
			// 	meta: { name: '文章管理' },
			// 	children: [
			// 		{
			// 			path: '/article/addArticle',
			// 			name: 'addArticle',
			// 			component: () => import('@/views/article/addArticle/index.vue'),
			// 			meta: { name: '发表文章' },
			// 		},
			// 		{
			// 			path: '/article/articleManage',
			// 			name: 'articleManage',
			// 			component: () => import('@/views/article/articleManage/index.vue'),
			// 			meta: { name: '文章列表' },
			// 		},
			// 		{
			// 			path: '/article/updateArticle/:id',
			// 			name: 'updateArticle',
			// 			component: () => import('@/views/article/addArticle/index.vue'),
			// 			meta: { name: '编辑文章', notDisplay: true },
			// 		},
			// 		{
			// 			path: '/article/labelManage',
			// 			name: 'labelManage',
			// 			component: () => import('@/views/article/labelManage/index.vue'),
			// 			meta: { name: '标签管理' },
			// 		},
			// 	],
			// },
			// {
			// 	path: '/message',
			// 	name: 'messageManage',
			// 	redirect: '/message/messageList',
			// 	meta: { name: '留言管理' },
			// 	children: [
			// 		{
			// 			path: '/message/messageList',
			// 			name: 'message_List',
			// 			component: () => import('@/views/message/messageList/index.vue'),
			// 			meta: { name: '留言列表' },
			// 		},
			// 	],
			// },
			// {
			// 	path: '/about',
			// 	name: 'aboutManage',
			// 	redirect: '/about/aboutManage',
			// 	meta: { name: '个人中心' },
			// 	children: [
			// 		{
			// 			path: '/about/aboutManage',
			// 			name: 'aboutManage',
			// 			component: () => import('@/views/about/aboutManage.vue'),
			// 			meta: { name: '个人中心管理' },
			// 		},
			// 	],
			// },
		],
	},
];

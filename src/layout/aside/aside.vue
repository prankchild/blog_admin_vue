<template>
	<div class="bl-aside" :style="`width:${asideWidth}`">
		<div class="logo-container">
			<span class="logo-text">boluo</span>
		</div>
		<div class="menu">
			<el-menu
				router
				background-color="#273352"
				text-color="#fff"
				active-text-color="#409eff"
				:default-active="getDefaultActive()"
				class="el-menu-vertical-demo"
				:collapse="!commonStore.isOpenAside"
				:collapse-transition="false"
			>
				<template v-for="item in menuList" :key="item.menu_path">
					<el-menu-item v-if="!item.children" :index="item.menu_path">
						<SvgIcon v-if="item.menu_icon" :name="item.menu_icon" class="search-expanded-icon" style="width: 20px; height: 20px" />
						<template #title>
							<span class="menu-name" :style="{ 'padding-left': item.menu_icon ? '8px' : '0' }">{{ item.menu_cn_name }}</span>
						</template>
					</el-menu-item>
					<el-sub-menu v-else :index="item.menu_path">
						<template #title>
							<SvgIcon v-if="item.menu_icon" :name="item.menu_icon" class="search-expanded-icon" style="width: 20px; height: 20px" />
							<span class="menu-name" :style="{ 'padding-left': item.menu_icon ? '8px' : '0' }">{{ item.menu_cn_name }}</span>
						</template>
						<el-menu-item-group v-for="subItem in item.children" :key="subItem.menu_path">
							<el-menu-item :index="subItem.menu_path">
								<span class="span-title">{{ subItem.menu_cn_name }}</span>
							</el-menu-item>
						</el-menu-item-group>
					</el-sub-menu>
				</template>
			</el-menu>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/store/modules/common';
const commonStore = useCommonStore();
const router = useRouter();

const asideWidth = ref('220px');
// 监听侧边栏开关
commonStore.$subscribe((mutation: any, state: any) => {
	if (commonStore.isOpenAside) {
		asideWidth.value = '220px';
	} else {
		asideWidth.value = '56px';
	}
});
// 获取侧边栏的数据
const menuList = computed(() => {
	let menuNewList = [];
	const home = { menu_name: 'home', menu_path: '/home', menu_cn_name: '首页', menu_icon: 'large-screen' };
	if (commonStore.menuInfoList) {
		menuNewList = [home, ...commonStore.menuInfoList];
	} else {
		menuNewList = [home];
	}
	return menuNewList;
});
const getDefaultActive = () => router.currentRoute.value.fullPath;
onMounted(() => {
	getAsideMenuList();
});
const asideMenuList = ref();
const getAsideMenuList = () => {
	const routesInfo = JSON.parse(localStorage.getItem('routesInfo') as string);
	const home = { menu_name: 'home', menu_path: '/home', menu_cn_name: '首页' };
	if (routesInfo) {
		asideMenuList.value = [home, ...routesInfo];
	} else {
		asideMenuList.value = [home];
	}
};
</script>
<style scoped lang="scss">
.bl-aside {
	height: 100vh;
	background: #273352;
	overflow: hidden;
	position: relative;
	z-index: 1000;
	transition: all 0.3s;
	.logo-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		margin: 10px 0;
		.logo-text {
			font-size: 18px;
			font-weight: 700;
			color: #fff;
		}
	}
}
.el-menu-item {
	border-radius: 5px;
}
.span-title {
	width: 100%;
	padding-left: 15px;
}
</style>

<template>
	<div class="bl-header">
		<div class="bl-navbars">
			<div class="aside-icon">
				<div class="icon">
					<el-icon v-if="commonStore.isOpenAside" :size="20" color="#333" @click="changeOpenAside">
						<Fold />
					</el-icon>
					<el-icon v-else :size="20" color="#333" @click="changeOpenAside">
						<Expand />
					</el-icon>
				</div>
			</div>
			<!--  面包屑  -->
			<div class="crumbs">
				<div class="crumbs-container">
					<el-breadcrumb separator="/">
						<el-breadcrumb-item v-for="item in crumbsList" :to="item.path">
							{{ item.meta.name }}
						</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
			</div>
			<div class="header-right">
				<!-- 全屏 -->
				<div class="screen-full">
					<el-icon :size="17" @click="onScreenFullClick"><FullScreen /></el-icon>
				</div>
				<!--  个人中心  -->
				<div class="personal-center">
					<el-dropdown>
						<span class="el-dropdown-link">
							<div class="header-user-info">
								<el-avatar :size="30" :src="commonStore.userInfo.avatar" />
								<span>{{ commonStore.userInfo.name }}</span>
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</div>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item divided><div @click="exit()">退出登录</div></el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</div>
			</div>
		</div>
		<tagsView />
	</div>
</template>

<script setup lang="ts">
import screenfull from 'screenfull';
import tagsView from '@/layout/tagsView/tagsView.vue';
import { useCommonStore } from '@/store/modules/common';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import lodash from 'lodash';
const commonStore = useCommonStore();

const changeOpenAside = () => {
	commonStore.changeOpenAside(!commonStore.isOpenAside);
};
// 获取面包屑
const router = useRouter();
const crumbsList = computed(() => {
	const array = [];
	const { matched } = router.currentRoute.value;
	for (let i = 1; i < matched.length; i++) {
		array.push(lodash.cloneDeep(matched[i]));
	}
	return array;
});
const exit = () => {
	localStorage.removeItem('authorization');
	localStorage.removeItem('userInfo');
	commonStore.tagsViewList = [];
	commonStore.removeUserInfo();
	commonStore.hasDynamicRouter = false;
	commonStore.menuInfoList.forEach((item: { menu_name: string }) => {
		router.removeRoute(item.menu_name);
	});
	router.push('/login');
};
const isScreenfull = ref(false);
const onScreenFullClick = () => {
	screenfull.toggle();
	// if (!isScreenfull) {
	// } else {
	// }
};
</script>
<style scoped lang="scss">
.bl-header {
	width: 100%;
	// width: calc(100vw - 260px);
	.bl-navbars {
		height: 50px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #e6e6e6;
		.aside-icon {
			padding-left: 10px;
			cursor: pointer;
			.icon {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
.crumbs {
	.crumbs-container {
		display: flex;
		align-items: center;
		height: 100%;
		margin-left: 10px;
	}
}

.header-right {
	display: flex;
	margin-left: auto;
	.screen-full {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 15px;
	}
	.personal-center {
		margin-right: 20px;
		.header-user-info {
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			.el-avatar {
				margin-right: 5px;
			}
			span {
				font-size: 14px;
				font-weight: 600;
				margin-right: 5px;
			}
		}
	}
}
</style>

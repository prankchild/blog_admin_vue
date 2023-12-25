<template>
	<main class="main" style="padding: 5px 20px 5px 10px" :class="showClose ? 'close_aside' : ''">
		<router-view v-slot="{ Component }" :key="router.currentRoute.value.fullPath">
			<transition name="fade" enter-active-class="animate__animated animate__fadeInLeft">
				<keep-alive :include="getKeepAliveNameList">
					<component :is="Component" />
				</keep-alive>
			</transition>
		</router-view>
	</main>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/store/modules/common';
import { computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
console.log(router, `router`);

const commonStore = useCommonStore();
type keepAliveNameType = string;
interface tagsViewType {
	name: string;
	path: string;
	metaName: string;
}
const getKeepAliveNameList = computed(() => {
	const nameArr: Array<keepAliveNameType> = [];
	if (commonStore.tagsViewList.length) {
		commonStore.tagsViewList.forEach((tag: tagsViewType) => {
			nameArr.push(tag.name);
		});
	}
	console.log(nameArr, `nameArr`);

	return nameArr;
});
const showClose = ref(false);
watch(
	() => commonStore.isOpenAside,
	(newVal) => {
		if (!newVal) {
			showClose.value = true;
		} else {
			showClose.value = false;
		}
	}
);
</script>

<style scoped lang="scss">
.main {
	display: block;
	width: calc(100vw - 220px);
	//overflow-x: hidden;
	background: #f7f9fb;
}
.close_aside {
	width: calc(100vw - 58px);
}
</style>

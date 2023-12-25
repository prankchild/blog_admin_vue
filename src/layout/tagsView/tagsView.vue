<template>
	<div class="navbars-tagsview">
		<el-scrollbar>
			<ul class="scrollbar-flex-content">
				<li v-for="(item, index) in commonStore.tagsViewList" :key="item.path" class="scrollbar-tags-item">
					<el-tag
						@click.stop="refreshCurrentTagsView(item)"
						:type="getTagType(item, index)"
						:closable="getShowClose(item, index)"
						@close="closeCurrentTagsView(item)"
					>
						{{ item.metaName }}
					</el-tag>
				</li>
			</ul>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/store/modules/common';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const commonStore = useCommonStore();
interface tagsViewType {
	name: string;
	path: string;
	metaName: string;
}
const refreshCurrentTagsView = (tagsView: tagsViewType) => {
	router.push(tagsView.path);
};
const closeCurrentTagsView = (tagsView: tagsViewType) => {
	const idx = commonStore.tagsViewList.findIndex((tag) => tagsView.name === tag.name);
	if (idx !== -1) {
		if (tagsView.name === router.currentRoute.value.name) {
			router.push(commonStore.tagsViewList[idx - 1].path);
		}
		commonStore.removeTagsViewList(idx);
	}
};
watch(
	() => router.currentRoute.value,
	(newVal) => {
		const idx = commonStore.tagsViewList.findIndex((tag) => newVal.name === tag.name);
		if (idx === -1) {
			const tag: tagsViewType = { name: String(newVal.name), path: String(newVal.path), metaName: String(newVal.meta.name) };
			commonStore.setTagsViewList(tag);
		}
	},
	{ immediate: true, deep: true }
);
// 计算属性
const getShowClose = computed(() => (tagsView: tagsViewType, index: number) => {
	if (commonStore.tagsViewList.length > 1) {
		return true;
	} else if (commonStore.tagsViewList.length === 1) {
		if (index === 0) {
			return false;
		}
	}
});
const getTagType = computed(() => (tagsView: tagsViewType, index: number) => {
	if (tagsView.name === router.currentRoute.value.name) {
		return 'success';
	} else {
		return '';
	}
});
</script>
<style scoped lang="scss">
.navbars-tagsview {
	height: 35px;
	background: #f8f8f8;
	border-bottom: 1px solid #eee;
	width: 100%;
}
.scrollbar-flex-content {
	margin-left: 10px;
	display: flex;
	height: 35px;
	.scrollbar-tags-item {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 5px;
		.el-tag {
			padding: 0 8px;
			cursor: pointer;
		}
	}
}
</style>

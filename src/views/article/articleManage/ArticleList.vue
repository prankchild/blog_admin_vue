<template>
	<div>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Search>
				<search-item label="关键词">
					<el-input v-model="state.tableData.param.keyword" />
				</search-item>
				<search-item label="文章类型">
					<el-input v-model="state.tableData.param.keyword" />
				</search-item>
				<search-item label="文章标签">
					<el-input v-model="state.tableData.param.keyword" />
				</search-item>
				<template #button>
					<el-button size="default" style="width: 80px" type="primary">发布文章</el-button>
					<el-button size="default" style="width: 80px" type="primary">查询</el-button>
				</template>
			</Search>
			<el-card v-loading="state.tableData.loading" shadow="hover">
				<Table :data="state.tableData.data" border height="calc(100vh - 300px)">
					<template v-for="(col, index) in columns" :key="index">
						<el-table-column
							:prop="col.key"
							:label="col.title"
							:width="col.width"
							:show-overflow-tooltip="col.overflow ? col.overflow : false"
							min-width="100"
							align="center"
							:fixed="col.fixed"
						>
							<template #default="{ row }">
								<template v-if="col.key === 'cover'">
									<!--     文章类型(1--原创，2--转载，3--翻译)       -->
									<viewer :images="[row.cover]">
										<img class="table-image" :src="row.cover" />
									</viewer>
								</template>
								<template v-if="col.key === 'type'">
									<!--     文章类型(1--原创，2--转载，3--翻译)       -->
									{{ getTypeName(row.type) }}
								</template>
								<template v-if="col.key === 'label'">
									<el-tag class="label-span" v-for="item in getLabelName(row.label)" style="margin: 0 3px" :key="item">{{ item }}</el-tag>
								</template>
								<template v-if="col.key === 'isTop'">
									<el-switch v-model="row.isTop" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66" />
								</template>
								<template v-if="col.key === 'isOpen'">
									<el-switch v-model="row.isOpen" :active-value="1" :inactive-value="0" />
								</template>
								<template v-if="col.key === 'draft'">
									{{ getDraft(row.draft) }}
								</template>
								<template v-if="col.key === 'action'">
									<el-button type="primary" size="small" @click="update(row)">编辑</el-button>
									<el-button type="danger" size="small">删除</el-button>
								</template>
							</template>
						</el-table-column>
					</template>
				</Table>
			</el-card>

			<Pagination
				@current-change="onHandleCurrentChange"
				class="mt15"
				v-model:current-page="state.tableData.param.page"
				v-model:page-size="state.tableData.param.limit"
				:total="state.tableData.total"
			>
			</Pagination>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const state = reactive({
	tableData: {
		param: {
			limit: 8,
			page: 1,
			keyword: null,
		},
		data: [],
		total: 10,
		loading: false,
	},
});
const columns = ref([
	{
		title: '封面',
		key: 'cover',
		slot: 'cover',
		width: '160',
	},
	{
		title: '标题',
		key: 'title',
		slot: 'title',
		width: '300',
		overflow: true,
	},
	{
		title: '类型',
		key: 'type',
		slot: 'type',
	},
	{
		title: '标签',
		key: 'label',
		slot: 'label',
		overflow: false,
		width: '260',
	},
	{
		title: '置顶',
		key: 'isTop',
		slot: 'isTop',
	},
	{
		title: '是否公开',
		key: 'isOpen',
		slot: 'isOpen',
	},
	{
		title: '是否为草稿',
		key: 'draft',
		slot: 'draft',
	},
	{
		title: '发布时间',
		key: 'createdAt',
		slot: 'createdAt',
		width: '180',
	},
	{
		title: '操作',
		key: 'action',
		slot: 'action',
		width: '220',
		fixed: 'right',
	},
]);
const getArticle = async () => {
	const result = await api.findArticle(state.tableData.param);
	if (result.code === 0) {
		state.tableData.data = result.result.data;
		state.tableData.total = result.result.total;
	}
};
const init = () => {
	getArticle();
};
const onHandleCurrentChange = () => {
	getArticle();
};
// 计算属性
const getLabelName = computed(() => (array: any) => {
	const labelName: any = [];
	if (array && array.length) {
		array.forEach((item: any) => {
			labelName.push(item['blog_article_labels'][0]['labelName']);
		});
	}
	return labelName;
});
const getTypeName = computed(() => (id: number) => {
	if (id === 1) {
		return '原创';
	} else if (id === 2) {
		return '转载';
	} else if (id === 3) {
		return '翻译';
	}
	return '暂无数据';
});
const getDraft = computed(() => (id: number) => {
	if (id === 1) {
		return '是';
	}
	return '否';
});
onMounted(() => {
	init();
});
const update = (row: any) => {
	router.push({ name: 'updateArticle', params: { id: row.id } });
};
</script>
<style scoped lang="scss"></style>

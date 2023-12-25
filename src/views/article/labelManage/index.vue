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
					<el-button size="default" style="width: 80px" color="#2a42b3">查询</el-button>
					<el-button color="#2a42b3" style="width: 80px" @click="addLabel">新增标签</el-button>
				</template>
			</Search>
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
							<template v-if="col.key === 'labelName'">
								<el-tag>{{ row.labelName }}</el-tag>
							</template>
							<template v-if="col.key === 'action'">
								<el-button type="primary" size="small" @click="update(row)">编辑</el-button>
								<el-button type="danger" size="small">删除</el-button>
							</template>
						</template>
					</el-table-column>
				</template></Table
			>
			<Pagination
				@current-change="onHandleCurrentChange"
				class="mt15"
				v-model:current-page="state.tableData.param.page"
				v-model:page-size="state.tableData.param.limit"
				:total="state.tableData.total"
			>
			</Pagination>
		</el-card>
		<add-edit ref="addEditRef" @submit="getTableData()" :params="state.params" />
	</div>
</template>

<script setup lang="ts" name="labelManage">
import { onMounted, reactive, ref } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import addEdit from '@/views/article/labelManage/components/add-edit.vue';
const state = reactive({
	tableData: {
		param: {
			limit: 10,
			page: 1,
			keyword: null,
		},
		data: [],
		total: 10,
	},
	params: {},
});
const columns = ref([
	{
		title: '标签ID',
		key: 'id',
		slot: 'id',
	},
	{
		title: '标签名称',
		key: 'labelName',
		slot: 'labelName',
		overflow: true,
	},
	{
		title: '创建时间',
		key: 'createdAt',
		slot: 'createdAt',
	},
	{
		title: '操作',
		key: 'action',
		slot: 'action',
		width: '220',
		fixed: 'right',
	},
]);
const getTableData = async () => {
	const { result, code } = await api.findArticleLabel(state.tableData.param);
	if (code === 0) {
		state.tableData.data = result.data;
		state.tableData.total = result.total;
	}
};
const init = () => {
	getTableData();
};
const addEditRef = ref();
const addLabel = () => {
	state.params.edit = false;
	addEditRef.value.openDialog();
};
onMounted(() => {
	init();
});
const onHandleCurrentChange = () => {
	getTableData();
};
const update = (row: any) => {
	state.params.edit = true;
	state.params.ruleForm = row;
	addEditRef.value.openDialog();
};
</script>
<style scoped lang="scss"></style>

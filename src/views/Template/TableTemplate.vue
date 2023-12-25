<template>
	<div>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Search>
				<search-item label="关键信息">
					<el-input v-model="state.tableData.param.keyword" clearable placeholder="请输入关键信息" style="width: 230px" />
				</search-item>
				<template #button>
					<el-button size="default" style="width: 80px" color="#2a42b3" @click="getTableData()">查询</el-button>
				</template>
			</Search>
			<Table :data="state.tableData.data" border height="calc(100vh - 340px)">
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
						<template #default="{ row }"> </template>
					</el-table-column> </template
			></Table>
		</el-card>
		<Pagination
			@current-change="onHandleCurrentChange"
			class="mt15"
			v-model:current-page="state.tableData.param.page"
			v-model:page-size="state.tableData.param.limit"
			:total="state.tableData.total"
		>
		</Pagination>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, Ref } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import { columnsType } from '@/types/common';
const state = reactive({
	tableData: {
		param: {
			limit: 10,
			page: 1,
			keyword: null,
		},
		data: [],
		total: 10,
		loading: false,
	},
});
const columns: Ref<Array<columnsType>> = ref([
	{
		title: '操作',
		key: 'action',
		slot: 'action',
		width: '220',
		fixed: 'right',
	},
]);
const getTableData = async () => {
	console.log(1);
};
const onHandleCurrentChange = () => {
	getTableData();
};
const init = () => {
	getTableData();
};
onMounted(() => {
	init();
});
</script>
<style scoped lang="scss"></style>

<template>
	<div class="main_key_container">
		<Search @expanded-change="editTable">
			<search-item label="关键词">
				<el-input v-model="state.tableData.param.keyword" clearable />
			</search-item>
			<template #button>
				<el-button size="default" style="width: 80px" color="#2a42b3" @click="add">新增字典</el-button>
				<el-button size="default" style="width: 80px" color="#2a42b3" @click="getTableData()">查询</el-button>
			</template>
		</Search>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Table :data="state.tableData.data" border :height="tableHeight">
				<template v-for="(col, index) in columns" :key="index">
					<el-table-column :prop="col.key" :label="col.title" :width="col.width" min-width="100" align="center" :fixed="col.fixed">
						<template #default="{ row }">
							<template v-if="col.key === 'action'">
								<el-button type="primary" size="small" @click="toDetail(row)">详情</el-button>
								<el-button type="primary" size="small" @click="editBtn(row)">编辑</el-button>
								<el-button type="danger" size="small" @click="delBtn(row)">删除</el-button>
							</template>
						</template>
					</el-table-column>
				</template></Table
			>
		</el-card>
		<Pagination
			@current-change="onHandleCurrentChange"
			class="mt15"
			v-model:current-page="state.tableData.param.page"
			v-model:page-size="state.tableData.param.limit"
			:total="state.tableData.total"
		>
		</Pagination>
		<add-edit ref="addEditRef" :params="state.addEditParams" @submit="onSubmit()" />
	</div>
</template>

<script setup lang="ts" name="moodList">
import { onMounted, reactive, ref } from 'vue';
import Search from '@/components/common/Search.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import api from '@/api';
import lodash from 'lodash';
import addEdit from './AddEditDialog.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
interface ruleFormType {
	createdAt?: string;
	id?: number;
	main_key?: string;
	main_value?: string;
	updatedAt?: string;
}
const addEditRef = ref();
const state = reactive({
	tableData: {
		param: {
			limit: 10,
			page: 1,
			keyword: '',
		},
		data: [],
		total: 10,
		loading: false,
	},
	addEditParams: {},
	lookParams: {},
});
const columns = ref([
	{
		title: '主键',
		key: 'main_key',
		slot: 'main_key',
	},
	{
		title: '主值',
		key: 'main_value',
		slot: 'main_value',
	},
	{
		title: '操作',
		key: 'action',
		slot: 'action',
		width: '250',
		fixed: 'right',
	},
]);
const getTableData = async () => {
	const { result, code } = await api.findCommonMainKey(state.tableData.param);
	if (code === 0) {
		state.tableData.data = result.data;
		state.tableData.total = result.total;
	}
};
const init = () => {
	getTableData();
};
const emit = defineEmits(['toDetail']);
const toDetail = (row: any) => {
	emit('toDetail', row);
};
onMounted(() => {
	init();
});
// 修改table高度
const tableHeight = ref('calc(100vh - 350px)');
const editTable = (bol: boolean) => {
	if (bol) {
		tableHeight.value = `calc(100vh - 350px)`;
	} else {
		tableHeight.value = `calc(100vh - 280px)`;
	}
};
const onHandleCurrentChange = () => {
	getTableData();
};
const add = () => {
	state.addEditParams = {};
	addEditRef.value.openDialog();
};
const editBtn = (ruleForm: ruleFormType) => {
	const params = lodash.cloneDeep(ruleForm);
	console.log(params, `params`);
	state.addEditParams = params;
	addEditRef.value.openDialog();
};
const delBtn = (ruleForm: ruleFormType) => {
	ElMessageBox.confirm('是否确定要删除该主键，如若删除，关系子键则会全部删除！', '提示', {
		confirmButtonText: '确认删除',
		cancelButtonText: '取消',
		type: 'error',
	}).then(async () => {
		const { message, code } = await api.delCommonMainKey({ main_key: ruleForm.main_key });
		if (code === 0) {
			ElMessage.success('删除成功');
			getTableData();
			emit('toDetail', {});
			return;
		}
		ElMessage.error(message);
	});
};
const onSubmit = () => {
	getTableData();
	emit('toDetail', {});
};
</script>
<style scoped lang="scss">
.main_key_container {
	flex: 1;
}
.table-avatar {
	width: 48px;
	height: 48px;
}
.link {
	color: #409eff;
	cursor: pointer;
	font-size: 16px;
}
</style>

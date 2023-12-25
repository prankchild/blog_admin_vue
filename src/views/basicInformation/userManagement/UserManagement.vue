<template>
	<div>
		<Search @expanded-change="editTable">
			<search-item label="关键信息">
				<el-input v-model="state.tableData.param.keyword" clearable placeholder="请输入用户名或用户ID或邮箱" style="width: 230px" />
			</search-item>
			<template #button>
				<el-button size="default" style="width: 80px" color="#2a42b3" @click="getTableData()">查询</el-button>
				<el-button color="#2a42b3" style="width: 80px" @click="addUserBtn">新增用户</el-button>
			</template>
		</Search>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Table :data="state.tableData.data" border :height="tableHeight">
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
							<template v-if="col.key === 'email'">
								<el-tag style="padding: 0 10px">{{ row['email'] }}</el-tag>
							</template>
							<template v-if="col.key === 'avatar'">
								<viewer :images="[row['avatar']]">
									<img class="table-avatar" :src="row['avatar']" />
								</viewer>
							</template>
							<template v-if="col.key === 'role_code'">
								{{ roleName(row) }}
							</template>
							<template v-if="col.key === 'status'">
								<span v-if="Number(row.status) === 0">关闭</span>
								<span v-if="Number(row.status) === 1">开启</span>
							</template>
							<template v-if="col.key === 'action'">
								<el-button type="primary" size="small" @click="resetPwdBtn(row)">重置密码</el-button>
								<el-button type="primary" size="small" @click="editUserBtn(row)">编辑</el-button>
								<el-button type="danger" size="small" @click="delUserBtn(row)">删除</el-button>
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
		<add-edit-dialog ref="addEditDialogRef" @on-submit="getTableData()" />
		<reset-pwd-dialog ref="resetPwdDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, Ref, computed } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import AddEditDialog from './components/AddEditDialog.vue';
import ResetPwdDialog from './components/ResetPwdDialog.vue';
import { useCommonStore } from '@/store/modules/common';
import api from '@/api';
import { columnsType } from '@/types/common';
const addEditDialogRef = ref();
const resetPwdDialogRef = ref();
const commonStore = useCommonStore();
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
	addEditParams: {},
});
const tableHeight = ref('calc(100vh - 350px)');
// 修改table高度
const editTable = (bol: boolean) => {
	if (bol) {
		tableHeight.value = `calc(100vh - 350px)`;
	} else {
		tableHeight.value = `calc(100vh - 280px)`;
	}
};
const columns: Ref<Array<columnsType>> = ref([
	{
		title: '用户ID',
		key: 'id',
		slot: 'id',
		width: '70',
	},
	{
		title: '头像',
		key: 'avatar',
		slot: 'avatar',
		width: '120',
	},
	{
		title: '邮箱',
		key: 'email',
		slot: 'email',
	},
	{
		title: '用户名',
		key: 'name',
		slot: 'name',
	},

	{
		title: '用户状态',
		key: 'status',
		slot: 'status',
	},
	{
		title: '用户角色',
		key: 'role_code',
		slot: 'role_code',
	},
	{
		title: '注册时间',
		key: 'createdAt',
		slot: 'createdAt',
	},
	{
		title: '最后登录时间',
		key: 'last_login_time',
		slot: 'last_login_time',
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
	const { result, code } = await api.findUserRecord(state.tableData.param);
	if (code === 0) {
		state.tableData.data = result.data;
		state.tableData.total = result.total;
	}
};
const init = () => {
	getTableData();
	commonStore.getUserRoleList();
};
onMounted(() => {
	init();
});
const delUserBtn = () => {
	console.log(1);
};
const onHandleCurrentChange = () => {
	getTableData();
};
const editUserBtn = (ruleForm: any) => {
	state.addEditParams = { add: false, ruleForm };
	addEditDialogRef.value.openDialog(state.addEditParams);
};
const addUserBtn = () => {
	state.addEditParams = { add: true };
	addEditDialogRef.value.openDialog(state.addEditParams);
};
const resetPwdBtn = (ruleForm: any) => {
	resetPwdDialogRef.value.openDialog(ruleForm);
};
const roleName = computed(() => (row: { role_code: string }) => {
	const idx = commonStore.userRoleList.findIndex((item) => item.role_code === row.role_code);

	if (idx !== -1) {
		return commonStore.userRoleList[idx]['role_name'];
	}
	return '';
});
</script>
<style scoped lang="scss">
.table-avatar {
	width: 40px;
	height: 40px;
}
</style>

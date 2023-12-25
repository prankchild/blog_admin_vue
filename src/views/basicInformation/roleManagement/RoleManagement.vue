<template>
	<div>
		<Search @expanded-change="editTable">
			<search-item label="状态">
				<el-select v-model="state.tableData.param.role_status" placeholder="请选择状态" style="width: 230px" clearable>
					<el-option label="开启" :value="1" />
					<el-option label="关闭" :value="0" />
				</el-select>
			</search-item>
			<search-item label="可用范围">
				<el-select v-model="state.tableData.param.available_range" placeholder="请选择可用范围" style="width: 230px" clearable>
					<el-option v-for="item in commonStore.loginSystemList" :key="item.child_key" :label="item.child_value" :value="item.child_key" />
				</el-select>
			</search-item>
			<search-item label="角色名称">
				<el-input v-model="state.tableData.param.role_name" clearable placeholder="请输入角色名称" style="width: 230px" />
			</search-item>
			<template #button>
				<el-button size="default" style="width: 80px" color="#2a42b3" @click="getTableData()">查询</el-button>
				<el-button size="default" style="width: 80px" color="#2a42b3" @click="addRoleBtn()">新增角色</el-button>
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
							<template v-if="col.key === 'available_range'">
								{{ availableRangeName(row) }}
							</template>
							<template v-if="col.key === 'role_status'">
								<span v-if="Number(row.role_status) === 0">关闭</span>
								<span v-if="Number(row.role_status) === 1">开启</span>
							</template>
							<template v-if="col.key === 'action'">
								<el-button type="primary" size="small" @click="permissionSettingsBtn(row)">权限设置</el-button>
								<el-button type="primary" size="small" @click="editRoleBtn(row)">编辑</el-button>
								<el-button type="danger" size="small" @click="delBtn(row)">删除</el-button>
							</template>
						</template>
					</el-table-column>
				</template>
			</Table>
		</el-card>

		<Pagination
			@current-change="getTableData"
			class="mt15"
			v-model:current-page="state.tableData.param.page"
			v-model:page-size="state.tableData.param.limit"
			:total="state.tableData.total"
		>
		</Pagination>
		<permission-settings ref="permissionSettingsRef" @on-submit="getTableData()" />
		<add-edit-dialog ref="addEditDialogRef" @on-submit="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="RoleManagement">
import { computed, onMounted, reactive, ref, Ref } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import { columnsType } from '@/types/common';
import PermissionSettings from '@/views/basicInformation/roleManagement/components/PermissionSettings.vue';
import AddEditDialog from './components/AddEditDialog.vue';
import { useMenuStore } from '@/store/modules/menu';
import { useCommonStore } from '@/store/modules/common';
import lodash from 'lodash';
import { ElMessage, ElMessageBox } from 'element-plus';
const menuStore = useMenuStore();
const commonStore = useCommonStore();
const permissionSettingsRef = ref();
const addEditDialogRef = ref();
const state = reactive({
	tableData: {
		param: {
			limit: 10,
			page: 1,
			role_status: null,
			available_range: null,
			role_name: null,
		},
		data: [],
		total: 10,
		loading: false,
	},
	addEditParams: {},
});
const columns: Ref<Array<columnsType>> = ref([
	{
		title: '角色名称',
		key: 'role_name',
		slot: 'role_name',
	},
	{
		title: '可用范围',
		key: 'available_range',
		slot: 'available_range',
	},
	{
		title: '状态',
		key: 'role_status',
		slot: 'role_status',
	},
	{
		title: '编辑人',
		key: 'user_name',
		slot: 'user_name',
	},
	{
		title: '编辑时间',
		key: 'updatedAt',
		slot: 'updatedAt',
	},
	{
		title: '操作',
		key: 'action',
		slot: 'action',
		width: '280',
		fixed: 'right',
	},
]);
const getTableData = async () => {
	const { result, code } = await api.findUserRoles(state.tableData.param);
	if (code === 0) {
		state.tableData.data = result.data;
		state.tableData.total = result.total;
	}
};
const tableHeight = ref('calc(100vh - 350px)');
// 修改table高度
const editTable = (bol: boolean) => {
	if (bol) {
		tableHeight.value = `calc(100vh - 350px)`;
	} else {
		tableHeight.value = `calc(100vh - 280px)`;
	}
};
const permissionSettingsBtn = (row: any) => {
	console.log(row, `row`);

	permissionSettingsRef.value.openDialog(lodash.cloneDeep(row));
};
const init = () => {
	getTableData();
	menuStore.getMenuList();
	commonStore.getLoginSystemList();
};
const addRoleBtn = () => {
	state.addEditParams = { add: true };
	addEditDialogRef.value.openDialog(state.addEditParams);
};
interface ruleFormType {
	action_user_id?: string;
	available_range?: string[];
	createdAt?: string;
	id?: number;
	role_code?: string;
	role_describe?: string;
	role_name?: string;
	role_status?: number;
	updatedAt?: string;
	user_name?: string;
}
const editRoleBtn = (ruleForm: ruleFormType) => {
	state.addEditParams = { add: false, ruleForm };
	addEditDialogRef.value.openDialog(state.addEditParams);
};
const delBtn = (ruleForm: ruleFormType) => {
	ElMessageBox.confirm('是否确定要删除该角色', '提示', {
		confirmButtonText: '确认删除',
		cancelButtonText: '取消',
		type: 'error',
	}).then(async () => {
		const { message, code } = await api.delRole({ role_code: ruleForm.role_code });
		if (code === 0) {
			ElMessage.success('删除成功');
			getTableData();
			return;
		}
		ElMessage.error(message);
	});
};
const availableRangeName = computed(() => (row: { available_range: string[] }) => {
	let str = '';
	if (row['available_range'] && row['available_range'].length) {
		const R = row['available_range'];
		for (const key in R) {
			const idx = commonStore.loginSystemList.findIndex((item) => item.child_key === R[key]);
			if (idx !== -1) {
				str += commonStore.loginSystemList[idx]['child_value'] + ',';
			}
		}
	}
	if (str.length) {
		str = str.substr(0, str.length - 1);
	}
	return str;
});
onMounted(() => {
	init();
});
</script>
<style scoped lang="scss"></style>

<template>
	<div>
		<Search>
			<template #button>
				<el-button size="default" style="width: 80px" color="#2a42b3" @click="addMenuBtn()">新增菜单</el-button>
			</template>
		</Search>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Table :data="state.tableData.data" border height="calc(100vh - 260px)" row-key="id" :default-expand-all="false">
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
							<template v-if="col.key === 'menu_type'">
								{{ menuTypeName(row) }}
							</template>
							<template v-if="col.key === 'menu_status'">
								<span v-if="Number(row.menu_status) === 0">关闭</span>
								<span v-if="Number(row.menu_status) === 1">开启</span>
							</template>
							<template v-if="col.key === 'action'">
								<el-button type="primary" size="small" @click="editBtn(row, index)">编辑</el-button>
								<el-button type="danger" size="small" @click="delBtn(row, index)">删除</el-button>
							</template>
						</template>
					</el-table-column>
				</template></Table
			>
		</el-card>

		<add-edit-dialog ref="addEditDiaLogRef" @on-submit="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="MenuManagement">
import { computed, onMounted, reactive, ref, Ref } from 'vue';
import AddEditDialog from './components/AddEditDialog.vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import api from '@/api';
import { columnsType } from '@/types/common';
import { useMenuStore } from '@/store/modules/menu';
const menuStore = useMenuStore();
const addEditDiaLogRef = ref();
const state = reactive({
	tableData: {
		param: {
			keyword: null,
		},
		data: [],
		loading: false,
	},
	addEditParams: {},
});
const columns: Ref<Array<columnsType>> = ref([
	{
		type: 'index',
		width: '50',
	},
	{
		title: '菜单名称',
		key: 'menu_cn_name',
		slot: 'menu_cn_name',
	},
	{
		title: '菜单类型',
		key: 'menu_type',
		slot: 'menu_type',
	},
	{
		title: '排序',
		key: 'menu_sort',
		slot: 'menu_sort',
	},
	{
		title: '状态',
		key: 'menu_status',
		slot: 'menu_status',
	},
	{
		title: '更新时间',
		key: 'updatedAt',
		slot: 'updatedAt',
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
	const { result, code } = await api.findMenu();
	if (code === 0) {
		state.tableData.data = result.menuList;
		menuStore.saveMenuList(result.menuList);
	}
};
const onHandleCurrentChange = () => {
	getTableData();
};
const init = () => {
	getTableData();
	menuStore.getMenuTypeList();
};
const addMenuBtn = (): void => {
	state.addEditParams = { add: true };
	addEditDiaLogRef.value.openDialog(state.addEditParams);
};
const editBtn = (row: any, index: number): void => {
	state.addEditParams = { add: false, ruleForm: row, index };
	addEditDiaLogRef.value.openDialog(state.addEditParams);
};
const delBtn = () => {};
onMounted(() => {
	init();
});
// 获取页面类型
const menuTypeName = computed(() => (row: { menu_type: string }): string => {
	const idx = menuStore.menuTypeList.findIndex((item: { child_key: string }) => item.child_key === row.menu_type);
	if (idx !== -1) {
		return menuStore.menuTypeList[idx].child_value;
	}
	return '';
});
</script>
<style scoped lang="scss"></style>

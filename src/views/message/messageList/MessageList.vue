<template>
	<div>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Search>
				<search-item label="关键词">
					<el-input v-model="state.tableData.param.keyword" clearable placeholder="请输入关键词" />
				</search-item>
				<search-item label="模块">
					<el-select v-model="state.tableData.param.module" class="m-2" placeholder="请选择留言模块" clearable>
						<el-option v-for="item in moduleList" :key="item.value" :label="item.name" :value="item.value" />
					</el-select>
				</search-item>
				<template #button>
					<el-button size="default" style="width: 80px" color="#2a42b3" @click="getTableData()">查询</el-button>
					<el-button color="#2a42b3" style="width: 80px" @click="deleteWarning(state.multipleSelection)">批量删除</el-button>
				</template>
			</Search>
			<Table
				:data="state.tableData.data"
				height="calc(100vh - 340px)"
				border
				row-key="id"
				:tree-props="{ children: 'children' }"
				@selection-change="handleSelectionChange"
			>
				<template v-for="(col, index) in columns" :key="index">
					<el-table-column
						:prop="col.key"
						:label="col.title"
						:width="col.width"
						:show-overflow-tooltip="col.overflow ? col.overflow : false"
						min-width="100"
						align="center"
						:fixed="col.fixed"
						:type="col.type"
					>
						<template #default="{ row }">
							<template v-if="col.key === 'email'">
								<el-tag>{{ row['user'][0]['email'] }}</el-tag>
							</template>
							<template v-if="col.key === 'avatar'">
								<viewer :images="[row.user[0]['avatar']]">
									<img class="table-avatar" :src="row.user[0]['avatar']" />
								</viewer>
							</template>
							<template v-if="col.key === 'user_name'">
								<span>{{ row.user[0].name || '' }}</span>
							</template>
							<template v-if="col.key === 'module'">
								<span>{{ getModuleName(row) }}</span>
							</template>
							<template v-if="col.key === 'action'">
								<el-button type="danger" size="small" @click="deleteWarning([row.id])">删除</el-button>
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
	</div>
</template>

<script setup lang="ts" name="messageList">
import { computed, onMounted, reactive, ref, Ref } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import { messageType } from '@/types/messageType';
import { columnsType } from '@/types/common';
import { ElMessage, ElMessageBox } from 'element-plus';
interface stateType {
	tableData: tableDataType;
	multipleSelection: Array<number>;
}
interface tableDataType {
	param: paramType;
	total: number;
	loading: boolean;
	data: Array<messageType>;
}
interface paramType {
	limit: number;
	page: number;
	keyword: string | null;
	module: number | null;
}
const state: stateType = reactive({
	tableData: {
		param: {
			limit: 10,
			page: 1,
			keyword: null,
			module: null,
		},
		data: [],
		total: 10,
		loading: false,
	},
	multipleSelection: [],
});
const columns: Ref<Array<columnsType>> = ref([
	{
		type: 'selection',
		width: '55',
	},
	{
		title: '留言ID',
		key: 'id',
		slot: 'id',
		width: '100',
	},
	{
		title: '用户名称',
		key: 'user_name',
		slot: 'user_name',
		width: '100',
	},
	{
		title: '用户头像',
		key: 'avatar',
		slot: 'avatar',
		width: '120',
	},

	{
		title: '留言内容',
		key: 'content',
		slot: 'content',
	},
	{
		title: '父ID',
		key: 'parent_id',
		slot: 'parent_id',
		width: '100',
	},
	{
		title: '模块',
		key: 'module',
		slot: 'module',
		width: '100',
	},
	{
		title: '留言时间',
		key: 'createdAt',
		slot: 'createdAt',
		width: '200',
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
	const { result, code } = await api.findMessage(state.tableData.param);
	if (code === 0) {
		state.tableData.data = result.data;
		state.tableData.total = result.total;
	}
};
const deleteWarning = (value: Array<number>) => {
	if (!value.length) {
		ElMessage.error(`请先选择数据`);
		return;
	}
	ElMessageBox.confirm('删除该留言会对其子留言一并删除，请问是否要删除该数据？', '警告', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'error',
	}).then(() => {
		deleteData(value);
	});
};
const deleteData = async (value: Array<number>) => {
	const { message, code } = await api.delMessage({ id: value });
	if (code === 0) {
		ElMessage.success(`删除成功`);
		getTableData();
	} else {
		ElMessage.error(message);
	}
};
const init = () => {
	getTableData();
};
onMounted(() => {
	init();
});
const onHandleCurrentChange = () => {
	getTableData();
};
const handleSelectionChange = (val: Array<messageType>) => {
	state.multipleSelection = val.map((item) => Number(item.id));
	console.log(state.multipleSelection, `state.multipleSelection`);
};
const getModuleName = computed(() => (row: messageType) => {
	if (row.module === 1) {
		return '文章';
	} else if (row.module === 2) {
		return '心情';
	} else if (row.module === 3) {
		return '留言板';
	} else {
		return '';
	}
});
// 模块列表
const moduleList = ref([
	{ name: '文章', value: 1 },
	{ name: '心情', value: 2 },
	{ name: '留言板', value: 3 },
]);
</script>
<style scoped lang="scss">
.table-avatar {
	width: 32px;
	height: 32px;
}
</style>

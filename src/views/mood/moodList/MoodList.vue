<template>
	<div>
		<el-card v-loading="state.tableData.loading" shadow="hover">
			<Search>
				<search-item label="关键词">
					<el-input v-model="state.tableData.param.keyword" clearable />
				</search-item>
				<template #button>
					<el-button size="default" style="width: 80px" color="#2a42b3" @click="add">发布心情</el-button>
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
						<template #default="{ row }">
							<template v-if="col.key === 'like'">
								<span class="link" @click="toLook(row, 'like')">{{ row.like.length }}</span>
							</template>
							<template v-if="col.key === 'message'">
								<span class="link" @click="toLook(row, 'message')">{{ row.message.length }}</span>
							</template>
							<template v-if="col.key === 'isOpen'">
								<span
									><el-switch v-model="row.isOpen" :active-value="1" :inactive-value="0" @change="(val) => switchChange('isOpen', val, row)"
								/></span>
							</template>
							<template v-if="col.key === 'isTop'">
								<span
									><el-switch
										v-model="row.isTop"
										:active-value="1"
										:inactive-value="0"
										@change="(val) => switchChange('isTop', val, row)"
										style="--el-switch-on-color: #13ce66"
								/></span>
							</template>
							<template v-if="col.key === 'action'">
								<el-button type="primary" size="small" @click="update(row, index)">编辑</el-button>
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
		<add-edit ref="addEditRef" :params="state.addEditParams" @submit="getTableData()" />
		<look-data ref="lookDataRef" :params="state.lookParams" />
	</div>
</template>

<script setup lang="ts" name="moodList">
import { onMounted, reactive, ref } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import addEdit from './components/add-edit.vue';
import { ElMessage } from 'element-plus';
import lookData from './components/look-data.vue';
import lodash from 'lodash';
import { moodType } from '@/types/moodType';
const addEditRef = ref();
const lookDataRef = ref();
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
	lookParams: {},
});
const columns = ref([
	{
		title: 'ID',
		key: 'id',
		slot: 'id',
	},
	{
		title: '内容',
		key: 'content',
		slot: 'content',
	},
	{
		title: '公开',
		key: 'isOpen',
		slot: 'isOpen',
	},
	{
		title: '置顶',
		key: 'isTop',
		slot: 'isTop',
	},
	{
		title: '点赞次数',
		key: 'like',
		slot: 'like',
	},
	{
		title: '留言',
		key: 'message',
		slot: 'message',
	},
	{
		title: '发布时间',
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
	const { result, code } = await api.findMood(state.tableData.param);
	if (code === 0) {
		state.tableData.data = result.data;
		state.tableData.total = result.total;
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
const add = () => {
	state.addEditParams = {};
	addEditRef.value.openDialog();
};
const update = (row: moodType, index: number) => {
	interface ParamsType extends moodType {
		paramsIndex?: number;
	}
	const params: ParamsType = lodash.cloneDeep(row);
	params.paramsIndex = index;
	params.images = JSON.parse(params.images);
	console.log(params, `params`);
	state.addEditParams = params;
	addEditRef.value.openDialog();
};
const switchChange = (name: string, val: number, row: any) => {
	updateOpenAndTop(name, val, row);
};
const updateOpenAndTop = async (name: string, val: number, row: any) => {
	const { code, message } = await api.updateMood({ [name]: val, id: row.id });
	if (code === 0) {
		ElMessage.success(message);
	} else {
		ElMessage.success(message);
	}
};
const toLook = (row: moodType, name: string) => {
	interface ParamsType extends moodType {
		option?: string;
	}
	const params: ParamsType = lodash.cloneDeep(row);
	params.option = name;
	state.lookParams = params;
	lookDataRef.value.openDialog();
	console.log(state.lookParams, `state.tableData.lookParams`);
};
</script>
<style scoped lang="scss">
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

<template>
	<div>
		<Search>
			<search-item label="用户名">
				<el-input v-model="state.tableData.param.user_name" />
			</search-item>
			<search-item label="登录网站">
				<el-input v-model="state.tableData.param.link" />
			</search-item>
			<template #button>
				<el-button size="default" style="width: 80px" color="#2a42b3">查询</el-button>
				<el-button color="#2a42b3" style="width: 80px">新增标签</el-button>
			</template>
		</Search>
		<el-card v-loading="state.tableData.loading" shadow="hover">
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
							<template v-if="col.key === 'email'">
								<el-tag style="padding: 0 10px">{{ row['email'] }}</el-tag>
							</template>
							<template v-if="col.key === 'avatar'">
								<viewer :images="[row['avatar']]">
									<img class="table-avatar" :src="row['avatar']" />
								</viewer>
							</template>
							<template v-if="col.key === 'city'">
								<span>{{ row.city }}</span>
								<!-- <span class="span-link" @click="openMapDialog(row)">查看地址</span> -->
							</template>
							<template v-if="col.key === 'link'">
								<span>{{ loginSystemName(row) }}</span>
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
		<!-- <Map ref="mapRef" :params="mapParams"></Map> -->
	</div>
</template>

<script setup lang="ts" name="loginRecord">
import { computed, onMounted, reactive, ref, Ref } from 'vue';
import Search from '@/components/common/Search.vue';
import SearchItem from '@/components/common/SearchItem.vue';
import Table from '@/components/common/Table.vue';
import Pagination from '@/components/common/Pagination.vue';
import api from '@/api';
import { columnsType } from '@/types/common';
import { useRecordStore } from '@/store/modules/record';
// import Map from './components/map.vue';
const recordStore = useRecordStore();
const state = reactive({
	tableData: {
		param: {
			limit: 10,
			page: 1,
			user_name: null,
			link: null,
		},
		data: [],
		total: 10,
		loading: false,
	},
});
const columns: Ref<Array<columnsType>> = ref([
	{
		title: '用户名',
		key: 'user_name',
		slot: 'user_name',
		width: '100',
	},
	// {
	// 	title: '用户ID',
	// 	key: 'id',
	// 	slot: 'id',
	// 	width: '70',
	// },
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
		title: '登录页面',
		key: 'link',
		slot: 'link',
	},
	{
		title: '地址',
		key: 'city',
		slot: 'city',
	},
	{
		title: '登录IP',
		key: 'clientIP',
		slot: 'clientIP',
	},
	{
		title: '浏览器',
		key: 'browser',
		slot: 'browser',
	},
	{
		title: '操作系统',
		key: 'operating_system',
		slot: 'operating_system',
		width: '200',
	},
	{
		title: '登录时间',
		key: 'createdAt',
		slot: 'createdAt',
	},
]);
const getTableData = async () => {
	const { result, code } = await api.findLoginRecord(state.tableData.param);
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
	// 获取登录网站的枚举值
	recordStore.getLoginSystemList();
});
// 计算属性获取对应的登录网站的名称
const loginSystemName = computed(() => (row: any) => {
	if (row.link && recordStore.loginSystemList.length > 0) {
		const idx = recordStore.loginSystemList.findIndex((item: any) => item.child_key === row.link);
		if (idx !== -1) {
			return recordStore.loginSystemList[idx] && recordStore.loginSystemList[idx].child_value;
		}
	}
	return '';
});
const onHandleCurrentChange = () => {
	getTableData();
};
const update = () => {};
</script>
<style scoped lang="scss">
.table-avatar {
	width: 48px;
	height: 48px;
}
</style>

<template>
	<el-dialog v-model="dialogVisible" title="查看数据" width="50%">
		<Table :data="state.tableData.data" border>
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
					</template>
				</el-table-column>
			</template>
		</Table>
	</el-dialog>
</template>

<script setup lang="ts" name="lookData">
import { computed, reactive, ref, watch, defineProps } from 'vue';
import { columnsType } from '@/types/common';
import Table from '@/components/common/Table.vue';
import { moodType } from '@/types/moodType';
interface ParamsType extends moodType {
	option?: string;
}
const props = defineProps({
	params: {
		type: Object as () => ParamsType,
		default: {},
	},
});
const state = reactive({
	tableData: {
		data: [],
	},
});
const columns = computed(() => {
	const messageColumns: Array<columnsType> = [
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
			title: '留言时间',
			key: 'createdAt',
			slot: 'createdAt',
			width: '200',
		},
	];
	const likeColumns: Array<columnsType> = [
		{
			title: '点赞ID',
			key: 'id',
			slot: 'id',
		},
		{
			title: '用户名称',
			key: 'user_name',
			slot: 'user_name',
		},
		{
			title: '用户头像',
			key: 'avatar',
			slot: 'avatar',
		},
		{
			title: '点赞时间',
			key: 'createdAt',
			slot: 'createdAt',
		},
	];
	if (props.params.option === 'message') {
		return messageColumns;
	} else if (props.params.option === 'like') {
		return likeColumns;
	}
	return [];
});
watch(props, (newVal: { params: { option: string } }) => {
	// console.log(newVal, `8888`);
	state.tableData.data = newVal['params'][newVal.params.option];
});
const dialogVisible = ref(false);
const openDialog = () => {
	dialogVisible.value = true;
};
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.table-avatar {
	width: 32px;
	height: 32px;
}
</style>

<template>
	<el-dialog v-model="dialogVisible" :title="state.options.title" width="20%">
		<div>
			<el-tree
				ref="treeRef"
				:data="state.tableList"
				show-checkbox
				default-expand-all
				node-key="menu_code"
				highlight-current
				:props="defaultProps"
				:default-checked-keys="state.checkedList"
				@check-change="handleCheckChange"
			/>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onCancel">取消</el-button>
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import api from '@/api';
import { watch, ref, reactive, defineExpose } from 'vue';
import { useMenuStore } from '@/store/modules/menu';
import { ElMessage } from 'element-plus';
import lodash from 'lodash';
const menuStore = useMenuStore();

const emit = defineEmits(['onSubmit']);
interface StateType {
	options: {
		title: string;
	};
	checkedList: number[];
	resultCheckedList: string[];
	tableList: number[];
	params: paramsType;
}
interface paramsType {
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
const state = reactive<StateType>({
	options: {
		title: '权限设置',
	},
	checkedList: [],
	params: {},
	resultCheckedList: [],
	tableList: [],
});
const defaultProps = {
	children: 'children',
	label: 'menu_cn_name',
};
const dialogVisible = ref<boolean>(false);
const init = () => {
	state.tableList = menuStore.menuList;
};
const findMenusForRoles = async (role_code: string) => {
	const { code, result } = await api.findMenusForRoles({ role_code });
	if (code === 0) {
		state.checkedList = organizeData(result.menuTreeList);
		// console.log(, `排序`);
	}
};
// 勾选的时候返回的数据
const handleCheckChange = (data: { menu_code: string; children: { menu_code: string }[] }, checked: boolean, indeterminate: boolean) => {
	console.log(data, checked, indeterminate);
	// 新增的
	// 当前节点没有子元素并且checked为true
	if (indeterminate === false && !data.children && checked === true) {
		// 先判断该数组有无该元素
		const idx = state.resultCheckedList.findIndex((item: string) => item === data.menu_code);
		if (idx === -1) {
			state.resultCheckedList.push(data.menu_code);
		}
	}
	// 当前节点有子元素并且checked为false,并且子元素被勾选indeterminate
	if (indeterminate === true && data.children) {
		// 先判断该数组有无该元素
		const idx = state.resultCheckedList.findIndex((item: string) => item === data.menu_code);
		if (idx === -1) {
			state.resultCheckedList.push(data.menu_code);
		}
	}
	// 当前节点有子元素并且checked为false,并且子元素被勾选indeterminate 为 false 当本身是true
	if (indeterminate === false && data.children && checked === true) {
		// 先判断该数组有无该元素
		const idx = state.resultCheckedList.findIndex((item: string) => item === data.menu_code);
		if (idx === -1) {
			state.resultCheckedList.push(data.menu_code);
		}
	}
	// 取消的
	// 当前节点没有子元素并且checked为false
	// 当前节点有子元素并且checked为false且indeterminate 为 false
	if (indeterminate === false && checked === false) {
		// 先判断该数组有无该元素
		const idx = state.resultCheckedList.findIndex((item: string) => item === data.menu_code);
		if (idx !== -1) {
			state.resultCheckedList.splice(idx, 1);
		}
	}
};
interface MenuType {
	createdAt: string;
	id: number;
	menu_cn_name: string;
	menu_code: string;
	menu_component: null;
	menu_describe: null;
	menu_icon: string;
	menu_meta: null;
	menu_name: string;
	menu_path: string;
	menu_redirect: string;
	menu_sort: 1;
	menu_status: string;
	menu_type: string;
	parent_menu_id: number;
	updatedAt: string;
	children: MenuType;
}
// 当有数据的时候对数据进行处理
const organizeData = (originalList: MenuType[]) => {
	const resultList: MenuType[] = [];
	if (originalList.length) {
		// 先把没有子元素的勾选上
		originalList.filter((item: MenuType) => {
			if (!item.children) {
				resultList.push(item.menu_code);
			}
		});
		// 把有子元素的对其父元素进行去除
		const parents = originalList.filter((item: MenuType) => {
			if (item.children) {
				return item;
			}
		});
		removeParent(parents, resultList);
	}
	return resultList;
};
const removeParent = (parents: MenuType[], resultList: MenuType[]): void => {
	for (let index = 0; index < parents.length; index++) {
		if (parents[index].children) {
			removeParent(parents[index].children, resultList);
		} else {
			resultList.push(parents[index].menu_code);
		}
	}
};
const onCancel = () => {
	dialogVisible.value = false;
};
const onSubmit = async () => {
	const { message, code } = await api.changeRolePermissions({ role_code: state.params.role_code, menuCodeList: state.resultCheckedList });
	if (code === 0) {
		ElMessage.success('修改权限成功！');
		dialogVisible.value = false;
		emit('onSubmit');
	} else {
		ElMessage.error(message);
	}
};
const openDialog = (e: paramsType) => {
	dialogVisible.value = true;
	if (e) {
		state.params = e;
		findMenusForRoles(e.role_code as string);
	}
};
watch(dialogVisible, (newVal) => {
	if (newVal) {
		init();
	} else {
		state.resultCheckedList = [];
		state.checkedList = [];
		state.tableList = [];
	}
});
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss"></style>

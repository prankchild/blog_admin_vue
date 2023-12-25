<template>
	<el-dialog v-model="dialogVisible" :title="state.options.title" width="30%">
		<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
			<el-form-item label="菜单名称" prop="menu_cn_name">
				<el-input v-model="state.ruleForm.menu_cn_name" placeholder="请输入菜单名称" />
			</el-form-item>
			<el-form-item label="菜单类型" prop="menu_type">
				<el-select v-model="state.ruleForm.menu_type" class="m-2" placeholder="请选择菜单类型" clearable style="width: 100%">
					<el-option v-for="item in menuStore.menuTypeList" :key="item.child_key" :label="item.child_value" :value="item.child_key" />
				</el-select>
			</el-form-item>
			<el-form-item label="上级菜单" prop="parent_menu_id" placeholder="请选择上级菜单">
				<el-cascader
					placeholder="请选择上级菜单"
					v-model="state.ruleForm.parent_menu_id"
					:options="menuStore.menuList"
					:props="{ checkStrictly: true, value: 'id', label: 'menu_cn_name' }"
					clearable
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="菜单编号" prop="menu_code">
				<el-input v-model="state.ruleForm.menu_code" placeholder="菜单编号会自动生成" disabled />
			</el-form-item>
			<el-form-item label="跳转路径" prop="menu_path">
				<el-input v-model="state.ruleForm.menu_path" placeholder="请输入跳转路径" />
			</el-form-item>
			<el-form-item label="菜单重定向地址" prop="menu_redirect">
				<el-input v-model="state.ruleForm.menu_redirect" placeholder="请输入菜单重定向地址" />
			</el-form-item>
			<el-form-item label="菜单组件地址" prop="menu_component">
				<el-input v-model="state.ruleForm.menu_component" placeholder="请输入菜单组件地址" />
			</el-form-item>
			<el-form-item label="菜单顺序" prop="menu_sort">
				<el-input-number v-model="state.ruleForm.menu_sort" style="width: 100%" placeholder="请输入菜单顺序" />
			</el-form-item>
			<el-form-item label="菜单状态" prop="menu_status">
				<el-switch v-model="state.ruleForm.menu_status" :width="50" style="--el-switch-on-color: #2a42b3" active-value="1" inactive-value="0" />
			</el-form-item>
			<el-form-item label="菜单描述" prop="menu_describe">
				<el-input v-model="state.ruleForm.menu_describe" placeholder="请输入菜单描述" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onCancel">取消</el-button>
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { watch, ref, reactive, defineExpose } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useMenuStore } from '@/store/modules/menu';
import lodash from 'lodash';
import api from '@/api';
const menuStore = useMenuStore();
const ruleFormRef = ref();
// const props = defineProps({
// 	params: {
// 		type: Object,
// 		default: {},
// 	},
// });
const emit = defineEmits(['onSubmit']);
const state = reactive<{ options: OptionsType; ruleForm: RuleFormType; parentParams: ParentParamsType }>({
	options: {
		title: '新增菜单',
	},
	ruleForm: {},
	parentParams: {
		add: false,
		ruleForm: {},
	},
});
interface ParentParamsType {
	add: boolean;
	ruleForm: RuleFormType;
}
interface OptionsType {
	title?: string;
}
interface RuleFormType {
	id?: number;
	menu_name?: string;
	menu_type?: string;
	parent_menu_id?: number | string;
	menu_path?: string;
	menu_cn_name?: string;
	menu_describe?: string;
	menu_component?: string;
	menu_redirect?: string;
	menu_status?: string;
	menu_code?: string;
	menu_icon?: string;
	menu_sort?: string;
}
const dialogVisible = ref<boolean>(false);
const rules = reactive<FormRules>({
	menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
	menu_type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
	menu_sort: [{ required: true, message: '请输入菜单顺序', trigger: 'blur' }],
	menu_status: [{ required: true, message: '请选择菜单状态', trigger: 'blur' }],
});
const init = () => {
	if (state.parentParams.add) {
		state.ruleForm = {};
		state.options.title = '新增菜单';
	} else {
		state.options.title = '编辑菜单';
		state.ruleForm = lodash.cloneDeep(state.parentParams.ruleForm);
	}
};
const onCancel = () => {
	dialogVisible.value = false;
};
const onSubmit = async () => {
	await ruleFormRef.value.validate((valid: boolean) => {
		if (valid) {
			if (state.parentParams.add) {
				addSubmit();
			} else {
				updateSubmit();
			}
		} else {
			ElMessage.error(`请填写必填数据项！`);
		}
	});
};
const addSubmit = async () => {
	const { code, message } = await api.addMenu(state.ruleForm);
	if (code === 0) {
		ElMessage.success(`新增菜单成功！`);
		dialogVisible.value = false;
		emit('onSubmit');
	} else {
		ElMessage.error(message);
	}
};
const updateSubmit = async () => {
	const { code, message } = await api.editMenu(state.ruleForm);
	if (code === 0) {
		ElMessage.success(`修改菜单成功！`);
		dialogVisible.value = false;
		emit('onSubmit');
	} else {
		ElMessage.error(message);
	}
};
const openDialog = (params: ParentParamsType) => {
	state.parentParams = params;
	dialogVisible.value = true;
};
watch(dialogVisible, (newVal) => {
	if (newVal) {
		init();
		menuStore.getMenuTypeList();
	}
});
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss"></style>

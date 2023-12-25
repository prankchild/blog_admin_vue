<template>
	<el-dialog v-model="dialogVisible" :title="state.options.title" width="30%">
		<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
			<el-form-item label="角色名称" prop="role_name">
				<el-input v-model="state.ruleForm.role_name" placeholder="请输入角色名称" />
			</el-form-item>
			<el-form-item label="角色状态" prop="role_status">
				<el-switch v-model="state.ruleForm.role_status" :width="50" style="--el-switch-on-color: #2a42b3" :active-value="1" :inactive-value="0" />
			</el-form-item>
			<el-form-item label="可用范围" prop="available_range">
				<el-select v-model="state.ruleForm.available_range" class="m-2" placeholder="请选择可用范围" style="width: 100%" multiple>
					<el-option v-for="item in commonStore.loginSystemList" :key="item.child_key" :label="item.child_value" :value="item.child_key" />
				</el-select>
			</el-form-item>
			<el-form-item label="角色编码" prop="role_code">
				<el-input v-model="state.ruleForm.role_code" placeholder="请输入角色编码" />
			</el-form-item>
			<el-form-item label="角色描述" prop="role_describe">
				<el-input v-model="state.ruleForm.role_describe" placeholder="请输入角色描述" />
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
import { ElMessage, FormRules } from 'element-plus';
import { useCommonStore } from '@/store/modules/common';
import lodash from 'lodash';
import api from '@/api';
const commonStore = useCommonStore();
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
	role_name?: string;
	role_status?: string;
	available_range?: string;
	role_code?: string;
	role_describe?: string;
	action_user_id?: number;
}
const dialogVisible = ref<boolean>(false);
const rules = reactive<FormRules>({
	role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
	role_status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
	available_range: [{ required: true, message: '请选择可用范围', trigger: 'blur' }],
	role_code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
});
const init = () => {
	if (state.parentParams.add) {
		state.ruleForm = {};
		state.ruleForm.action_user_id = commonStore.userInfo.id;
		state.options.title = '新增角色';
	} else {
		state.options.title = '编辑角色';
		state.ruleForm = lodash.cloneDeep(state.parentParams.ruleForm);
		state.ruleForm.action_user_id = commonStore.userInfo.id;
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
	const { code, message } = await api.addRole(state.ruleForm);
	if (code === 0) {
		ElMessage.success(`新增角色成功！`);
		dialogVisible.value = false;
		emit('onSubmit');
	} else {
		ElMessage.error(message);
	}
};
const updateSubmit = async () => {
	const { code, message } = await api.editRole(state.ruleForm);
	if (code === 0) {
		ElMessage.success(`修改角色成功！`);
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
		commonStore.getLoginSystemList();
	}
});
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss"></style>

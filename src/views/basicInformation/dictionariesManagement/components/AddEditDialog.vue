<template>
	<Dialog ref="dialogRef" :title="state.options.title" width="30%" @submit="submit" @cancel="cancel">
		<div class="dialog-container">
			<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" label-width="120px">
				<el-form-item label="主键" prop="main_key">
					<el-input v-model="state.ruleForm.main_key" style="width: 100%" :disabled="Boolean(isMain.length)" />
				</el-form-item>
				<el-form-item v-if="!isMain" label="主值" prop="main_value">
					<el-input v-model="state.ruleForm.main_value" />
				</el-form-item>
				<el-form-item v-if="isMain" label="子键" prop="child_key">
					<el-input v-model="state.ruleForm.child_key" style="width: 100%" />
				</el-form-item>
				<el-form-item v-if="isMain" label="子值" prop="child_value">
					<el-input v-model="state.ruleForm.child_value" />
				</el-form-item>
				<el-form-item v-if="isMain" label="排序" prop="sort">
					<el-input-number v-model="state.ruleForm.sort" style="width: 100%" />
					<!-- <el-input v-model="state.ruleForm.sort" /> -->
				</el-form-item>
			</el-form>
		</div>
	</Dialog>
</template>

<script setup lang="ts" name="moodAddEditModel">
import api from '@/api';
import Dialog from '@/components/common/Dialog.vue';
import { ElMessage, FormRules } from 'element-plus';
import { reactive, ref, nextTick } from 'vue';

const dialogRef = ref();

interface ruleFormType {
	id: null | number;
	main_key: null | string;
	main_value: null | string;
	child_key: null | string;
	child_value: null | string;
	sort: null | string | number;
}

interface stateType {
	options: optionsType;
	ruleForm: ruleFormType;
}
interface optionsType {
	title: string;
}
const props = defineProps({
	params: {
		type: Object,
		default: () => {},
	},
	isMain: {
		type: String,
		default: '',
	},
});
const state = reactive<stateType>({
	options: {
		title: '新增字典',
	},
	ruleForm: {
		id: null,
		main_key: null,
		main_value: null,
		child_key: null,
		child_value: null,
		sort: null,
	},
});
const rules = reactive<FormRules>({
	main_key: [{ required: true, message: '请填写主键', trigger: 'blur' }],
	main_value: [{ required: true, message: '请填写主值', trigger: 'blur' }],
	child_key: [{ required: true, message: '请填写主键', trigger: 'blur' }],
	child_value: [{ required: true, message: '请填写主值', trigger: 'blur' }],
	sort: [{ required: true, message: '请填写主值', trigger: 'blur' }],
});
const openDialog = () => {
	dialogRef.value.openDialog();
	init();
};
const init = () => {
	nextTick(() => {
		// 判断新增还是编辑
		if (Object.values(props.params).length) {
			state.options.title = '编辑字典';
			for (const key in state.ruleForm) {
				if (props.params[key] || props.params[key] === 0) {
					state.ruleForm[key] = props.params[key];
				}
			}
		} else {
			state.options.title = '新增字典';
			state.ruleForm = {
				id: null,
				main_key: null,
				main_value: null,
				child_key: null,
				child_value: null,
				sort: null,
			};
			if (props.isMain) {
				state.ruleForm.main_key = props.isMain;
			}
		}
	});
};
const closeDialog = () => {
	dialogRef.value.closeDialog();
};
const emit = defineEmits(['submit']);
const ruleFormRef = ref();
const submit = async () => {
	await ruleFormRef.value.validate(async (valid: boolean) => {
		if (valid) {
			let opt = 'add';
			// 判断编辑还是新增
			if (Object.values(props.params).length) {
				opt = 'edit';
			}
			// 判断主键还是子键
			props.isMain ? (opt = opt + `CommonChildKey`) : (opt = opt + `CommonMainKey`);
			console.log(opt, `opt`);

			const { code, message } = await api[opt](state.ruleForm);
			if (code === 0) {
				ElMessage.success(message);
				dialogRef.value.closeDialog();
				emit('submit');
			}
		} else {
			ElMessage.error(`请输入必填项`);
		}
	});
};
const cancel = () => {
	closeDialog();
};
defineExpose({
	openDialog,
	closeDialog,
});
</script>
<style scoped lang="scss"></style>

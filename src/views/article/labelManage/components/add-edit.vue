<template>
	<Dialog ref="dialogRef" :title="state.options.title" width="20%" @submit="submit">
		<el-form :rules="rules" ref="ruleFormRef" :model="state.ruleForm">
			<el-form-item label="标签名称" prop="labelName">
				<el-input v-model="state.ruleForm.labelName" />
			</el-form-item>
		</el-form>
	</Dialog>
</template>

<script setup lang="ts">
import api from '@/api';
import Dialog from '@/components/common/Dialog.vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue-demi';
const dialogRef = ref();
const ruleFormRef = ref();
const props = defineProps({
	params: {
		type: Object,
		default: () => {},
	},
});
const state = reactive({
	options: {
		title: '新增标签',
	},
	ruleForm: {
		labelName: '',
		id: null,
	},
});
const rules = ref<FormRules>({
	labelName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
});
const openDialog = () => {
	dialogRef.value.openDialog();
	init();
};
const init = () => {
	if (props.params && props.params.edit) {
		state.options.title = '编辑标签';
		for (const key in state.ruleForm) {
			state.ruleForm[key] = props.params.ruleForm[key];
		}
	}
};
const closeDialog = () => {
	dialogRef.value.closeDialog();
};
const submit = async () => {
	console.log(ruleFormRef, `ruleFormRef`);
	await ruleFormRef.value.validate((valid) => {
		if (valid) {
			addArtileLabel();
		}
	});
};
const emit = defineEmits(['submit']);
const addArtileLabel = async () => {
	const { code, result, message } = await api.addArticleLabel(state.ruleForm);
	if (code === 0) {
		ElMessage.success(message);
		dialogRef.value.closeDialog();
		emit('submit');
	} else {
		ElMessage.error(message);
	}
};
defineExpose({
	openDialog,
	closeDialog,
});
</script>
<style scoped lang="scss"></style>

<template>
	<el-dialog v-model="dialogVisible" title="重置密码" width="20%">
		<el-form
			ref="ruleFormRef"
			:model="state.ruleForm"
			:rules="rules"
			label-width="60px"
			class="demo-ruleForm"
			status-icon
			:hide-required-asterisk="true"
		>
			<el-form-item label="密码" prop="password">
				<el-input v-model="state.ruleForm.password" type="password" show-password />
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

<script setup lang="ts" name="resetPwdDialog">
import { watch, ref, reactive, defineExpose } from 'vue';
import { ElMessage, FormRules } from 'element-plus';
import api from '@/api';
const ruleFormRef = ref();
const state = reactive({
	ruleForm: {
		id: '',
		password: '',
	},
});
const dialogVisible = ref<boolean>(false);
const rules = reactive<FormRules>({
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});
const onCancel = () => {
	dialogVisible.value = false;
};
const onSubmit = async () => {
	await ruleFormRef.value.validate(async (valid: boolean) => {
		if (valid) {
			const { message, code } = await api.resetPassword(state.ruleForm);
			if (code === 0) {
				ElMessage.success(message);
				dialogVisible.value = false;
			} else {
				ElMessage.error(message);
			}
		} else {
			ElMessage.error(`请填写必填数据项！`);
		}
	});
};
const openDialog = (ruleForm: { id: number }) => {
	dialogVisible.value = true;
	state.ruleForm.id = ruleForm.id;
};
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss"></style>

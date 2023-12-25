<template>
	<el-dialog v-model="dialogVisible" :title="state.options.title" width="30%">
		<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
			<el-form-item label="Activity name" prop="name">
				<el-input v-model="state.ruleForm.name" />
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
const ruleFormRef = ref();
const props = defineProps({
	params: {
		type: Object,
		default: {},
	},
});
const state = reactive({
	options: {
		title: '新增菜单',
	},
	ruleForm: {},
});
const dialogVisible = ref<boolean>(false);
const rules = reactive<FormRules>({
	name: [{ required: true, message: 'Please input Activity name', trigger: 'blur' }],
});
const init = () => {
	if (props.params.add) {
		state.options.title = '新增菜单';
	} else {
		state.options.title = '编辑菜单';
	}
};
const onCancel = () => {
	dialogVisible.value = false;
};
const onSubmit = async () => {
	await ruleFormRef.value.validate((valid: boolean) => {
		if (valid) {
			console.log('submit!');
		} else {
			ElMessage.error(`请填写必填数据项！`);
		}
	});
};
const openDialog = () => {
	dialogVisible.value = true;
};
watch(dialogVisible, (newVal) => {
	if (newVal) {
		init();
	}
});
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss"></style>

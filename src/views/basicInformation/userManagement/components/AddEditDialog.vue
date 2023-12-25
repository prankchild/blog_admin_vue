<template>
	<el-dialog v-model="dialogVisible" :title="state.options.title" width="30%">
		<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
			<el-form-item label="用户名称" prop="name">
				<el-input v-model="state.ruleForm.name" placeholder="请输入用户名称" />
			</el-form-item>
			<el-form-item label="用户邮箱" prop="email">
				<el-autocomplete
					v-model="state.ruleForm.email"
					style="width: 100%"
					:fetch-suggestions="querySearch"
					:trigger-on-focus="false"
					clearable
					placeholder="请输入用户邮箱"
					@select="handleSelect"
				/>
			</el-form-item>
			<el-form-item v-if="state.parentParams.add" label="用户密码" prop="password">
				<el-input v-model="state.ruleForm.password" type="password" show-password clearable placeholder="请输入用户密码" />
			</el-form-item>
			<el-form-item label="用户角色" prop="role_code">
				<el-select v-model="state.ruleForm.role_code" class="m-2" placeholder="请选择菜单类型" clearable style="width: 100%">
					<el-option v-for="item in commonStore.userRoleList" :key="item.role_code" :label="item.role_name" :value="item.role_code" />
				</el-select>
			</el-form-item>
			<el-form-item label="用户状态" prop="status">
				<el-switch v-model="state.ruleForm.status" :width="50" style="--el-switch-on-color: #2a42b3" :active-value="1" :inactive-value="0" />
			</el-form-item>
			<el-form-item label="用户介绍" prop="introduce">
				<el-input v-model="state.ruleForm.introduce" placeholder="请输入用户介绍" />
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
	email?: string;
	name?: string;
	phone?: string;
	password?: string;
	introduce?: string;
	role_code?: number;
	status?: number;
}
const dialogVisible = ref<boolean>(false);
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
	password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
	email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
	role_code: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
	status: [{ required: true, message: '请选择用户状态', trigger: 'blur' }],
});
const init = () => {
	if (state.parentParams.add) {
		state.ruleForm = {};
		state.options.title = '新增用户';
	} else {
		state.options.title = '编辑用户';
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
	const { code, message } = await api.addUser(state.ruleForm);
	if (code === 0) {
		ElMessage.success(`新增用户成功！`);
		dialogVisible.value = false;
		emit('onSubmit');
	} else {
		ElMessage.error(message);
	}
};
const updateSubmit = async () => {
	const { code, message } = await api.editUser(state.ruleForm);
	if (code === 0) {
		ElMessage.success(`修改用户成功！`);
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
		commonStore.getUserRoleList();
		restaurants.value = loadAll();
	}
});
interface RestaurantItem {
	value: string;
	link: string;
}
const restaurants = ref<RestaurantItem[]>([]);
const querySearch = (queryString: string, cb: any) => {
	const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value;
	// call callback function to return suggestions
	cb(results);
};
const createFilter = (queryString: string) => {
	return (restaurant: RestaurantItem) => {
		return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
	};
};
const loadAll = () => {
	return [
		{ value: '@qq.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@126.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@163.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@139.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@sohu.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@aliyun.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@189.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@gmail.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@sina.com', link: 'https://github.com/vuejs/vue' },
		{ value: '@outlook.com', link: 'https://github.com/vuejs/vue' },
	];
};

const handleSelect = (item: RestaurantItem) => {
	console.log(item);
};

defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss"></style>

<template>
	<div class="user-login animate__animated animate__fadeInRightBig">
		<h1>登录</h1>
		<el-form :rules="rules" :model="ruleForm" ref="ruleFormRef" :hide-required-asterisk="true">
			<el-form-item label="邮箱：" prop="email" class="input-item">
				<el-input v-model="ruleForm['email']" />
			</el-form-item>
			<el-form-item label="密码：" prop="password" class="input-item">
				<el-input v-model="ruleForm['password']" type="password" show-password />
			</el-form-item>
			<el-form-item prop="name">
				<div class="operation">
					<el-checkbox v-model="ruleForm.checked1" label="记住我" size="default" />
					<span class="forgot">忘记密码？</span>
				</div>
			</el-form-item>
			<el-form-item>
				<SliderVertify />
			</el-form-item>
			<el-form-item>
				<el-button class="login-btn" :loading="false" color="#2a42b3" @click="onLogin()"> 登录 </el-button>
			</el-form-item>
			<el-form-item v-if="false">
				<div class="other-btn-container">
					<el-button type="default" class="other-btn-item" @click="otherBtnChange(2)"> 手机登录 </el-button>
					<el-button type="default" class="other-btn-item" @click="otherBtnChange(3)"> 二维码登录 </el-button>
				</div>
			</el-form-item>
		</el-form>
		<verify-code ref="verifyCodeRef" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { useCommonStore } from '@/store/modules/common';
import { ElMessage, FormRules } from 'element-plus';
import lodash from 'lodash';
import VerifyCode from './VerifyCode.vue';
import { useRouterStore } from '@/store/modules/router';
const commonStore = useCommonStore();
const emit = defineEmits(['phoneChange', 'codeChange']);
const ruleForm = reactive({ email: '', password: '' });
const ruleFormRef = ref();
const verifyCodeRef = ref();
const otherBtnChange = (value: number) => {
	if (value === 2) {
		emit('phoneChange');
	} else {
		emit('codeChange');
	}
};
const rules = reactive<FormRules>({
	email: [{ required: true, message: '请输入您的邮箱', trigger: 'blur' }],
	password: [{ required: true, message: '请输入您的用户密码', trigger: 'blur' }],
});
const router = useRouter();
const routerStore = useRouterStore();
const onLogin = () => {
	// verifyCodeRef.value.openDialog();
	loginChange();
};
const loginChange = async () => {
	await ruleFormRef.value.validate(async (valid) => {
		if (valid) {
			const systemInfo: any = lodash.cloneDeep(commonStore.systemInfo);
			systemInfo.city = systemInfo.province + systemInfo.city;
			systemInfo.operatingSystem = systemInfo.system;
			systemInfo.link = 'LOGIN_SYSTEM_BACKSTAGE';
			const loginResult = await api.adminLogin({ ...systemInfo, ...ruleForm });
			if (loginResult.code === 0) {
				commonStore.setUserInfo(loginResult.result.data);
				// 记录用户信息
				localStorage.setItem('userInfo', JSON.stringify(loginResult.result.data));
				// 记录Token
				window.localStorage.setItem('authorization', loginResult.result.token);
				// 保存菜单
				commonStore.saveMenuInfoList(loginResult.result.menu);
				await router.push('/home');
				ElMessage.success(`欢迎您 ${loginResult.result.data.name}！`);
			}
		} else {
			ElMessage.error(`请输入用户名和密码！`);
		}
	});
};
onMounted(() => {
	keyEnterDown();
});
onBeforeUnmount(() => {
	document.onkeydown = function (event) {
		var e = event || window.event;
		e.returnValue = true;
	};
});
// 监听Enter键盘事件
const keyEnterDown = () => {
	document.onkeydown = function (event) {
		var e = event || window.event;
		var keyCode = e.keyCode || e.which;
		switch (keyCode) {
			case 13: //enter
				loginChange();
				break;
			default:
				break;
		}
	};
};
</script>
<style scoped lang="scss">
.user-login {
	width: 400px;
}
.login-btn {
	margin: 10px 0;
	color: #fff;
	width: 100%;
	height: 45px;
}
.operation {
	width: 100%;
	.forgot {
		cursor: pointer;
		color: #2a42b3;
		float: right;
	}
}
.other-btn-container {
	width: 100%;
	display: flex;
	.other-btn-item {
		width: 50%;
		height: 40px;
		margin-top: 10px;
	}
}
.input-item {
	margin: 20px 0;
	.el-input {
		height: 35px;
	}
}
</style>

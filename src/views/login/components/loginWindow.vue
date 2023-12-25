<template>
	<div class="login-window">
		<user-login v-if="showWindow === 1" @phone-change="updateShowWindow(2)" @code-change="updateShowWindow(3)" />
		<phone-login v-if="showWindow === 2" @cancel-change="updateShowWindow(1)" />
		<code-login v-if="showWindow === 3" @cancel-change="updateShowWindow(1)" />
	</div>
</template>

<script name="loginWindow" setup lang="ts">
import userLogin from './userLogin.vue';
import phoneLogin from './phoneLogin.vue';
import codeLogin from './QRcodeLogin.vue';
import { ref } from 'vue';
const showWindow = ref(1);
const updateShowWindow = (value: number) => {
	showWindow.value = value;
};
</script>

<style scoped lang="scss"></style>

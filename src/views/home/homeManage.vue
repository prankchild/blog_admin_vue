<template>
	<div>
		<h1>homeMessage</h1>
		<el-button @click="getRouter">获取路由信息</el-button>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const getRouter = () => {
	console.log(router, `router`);
};
</script>
<style scoped lang="scss"></style>

<template>
	<div class="app-container animate__animated animate__fadeIn">
		<bl-aside />
		<div class="container">
			<bl-header />
			<bl-main />
		</div>
	</div>
</template>

<script setup lang="ts">
import blHeader from './header/header.vue';
import blAside from './aside/aside.vue';
import blMain from './main.vue';
</script>
<style scoped lang="scss">
.app-container {
	display: flex;
	width: 100vw;
	.container {
		flex: 1;
		overflow: auto;
	}
}
</style>

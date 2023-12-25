<template>
	<router-view />
</template>
<script setup lang="ts">
import { useCommonStore } from './store/modules/common';
import { onMounted } from 'vue';
const common = useCommonStore();
onMounted(() => {
	common.saveSystemInfo();
});
</script>
<style scoped></style>

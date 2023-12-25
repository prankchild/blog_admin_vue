<template>
	<div class="dictionaries_container">
		<mainKey @to-detail="toDetail" />
		<childKey ref="childKeyRef" />
	</div>
</template>

<script setup lang="ts">
import mainKey from './components/MainKey.vue';
import childKey from './components/ChildKey.vue';
import { ref } from 'vue';
const childKeyRef = ref();
const toDetail = (mainKey: any) => {
	childKeyRef.value.parentGetTableData(mainKey.main_key || '');
};
</script>
<style scoped lang="scss">
.dictionaries_container {
	display: flex;
}
</style>

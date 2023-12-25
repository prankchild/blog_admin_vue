<template>
	<el-dialog v-model="dialogVisible" width="380px" title="拖动滑块完成拼图" :append-to-body="true">
		<SliderVerify v-if="dialogVisible" class="slider-verify" text="拖动滑块完成拼图" @on-success="onSuccess" />
	</el-dialog>
</template>

<script setup lang="ts">
import SliderVerify from 'vue-next-slider-vertify';
import { ref, watch } from 'vue';
import 'vue-next-slider-vertify/lib/style.css';
const dialogVisible = ref<boolean>(false);
const visible = ref(false);
const openDialog = () => {
	dialogVisible.value = true;
};
watch(dialogVisible, (newVal) => {
	if (newVal) {
		init();
	}
});
const init = () => {
	visible.value = true;
};
const onSuccess = (e) => {
	console.log(e);

	dialogVisible.value = false;
};
const onFail = () => {
	console.log(123);
};
defineExpose({
	openDialog,
});
watch(
	() => dialogVisible,
	(status) => {
		if (status) {
			init();
		} else {
			visible.value = false;
		}
	}
);
</script>
<style scoped lang="scss">
.s-canvas {
	cursor: pointer;
}
</style>

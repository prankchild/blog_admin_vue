<template>
	<el-dialog v-model="dialogVisible" v-bind="$attrs">
		<slot></slot>
		<template #footer>
			<span class="dialog-footer" v-if="showDefalutFooter">
				<el-button type="primary" @click="submit">{{ submitText }}</el-button>
				<el-button @click="cancel"> {{ cancelText }} </el-button>
				<slot name="fotter"></slot>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps({
	submitText: {
		type: String,
		default: '确定',
	},
	cancelText: {
		type: String,
		default: '取消',
	},
	showDefalutFooter: {
		type: Boolean,
		default: true,
	},
});
const dialogVisible = ref(false);
const emit = defineEmits(['submit', 'cancel']);
const openDialog = () => {
	dialogVisible.value = true;
};
const closeDialog = () => {
	dialogVisible.value = false;
};
const submit = () => {
	emit('submit');
};
const cancel = () => {
	emit('cancel');
};
defineExpose({
	openDialog,
	closeDialog,
});
</script>
<style scoped lang="scss">
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>

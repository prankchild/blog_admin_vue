<template>
	<el-upload
		v-model:file-list="fileList"
		:show-file-list="true"
		list-type="picture-card"
		:before-upload="beforeAvatarUpload"
		:http-request="uploadFile"
	>
		<el-icon><Plus /></el-icon>
	</el-upload>
</template>

<script setup lang="ts" name="uploads">
import api from '@/api';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadUserFile } from 'element-plus';
const emit = defineEmits(['success']);
const fileList = ref<UploadUserFile[]>([]);
const beforeAvatarUpload = (file: any) => {
	const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isJPG) {
		ElMessage.error('仅支持jpg，png格式的图片！');
	}
	if (!isLt2M) {
		ElMessage.error('上传图片大小不能超过 2MB!');
	}
	return isJPG && isLt2M;
};
const uploadFile = (item: any) => {
	api
		.upload({ file: item.file, fileAddress: 'moodImages' })
		.then((result: any) => {
			if (result.code === 0) {
				ElMessage.success('上传成功');
				fileList.value.pop();
				const file: { url: string; name: string } = { url: result.data.imageUrl, name: result.data.imageUrl };
				fileList.value.push(file);
				emit('success', fileList);
			}
		})
		.catch((error: any) => {
			fileList.value.pop();
			ElMessage.error('上传失败', error);
		});
};
const initFileList = (paramsList: any) => {
	fileList.value = paramsList;
};
defineExpose({
	initFileList,
});
</script>
<style scoped lang="scss"></style>

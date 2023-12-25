<template>
	<el-upload style="width: 320px" class="upload-demo" drag :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadFile">
		<div v-if="imageUrl.length <= 0" style="padding: 30px">
			<el-icon class="el-icon--upload">
				<upload-filled />
			</el-icon>
			<div class="el-upload__text">将文件拖拽到此处 <em>或点击进行上传</em></div>
		</div>
		<div v-else class="img_container">
			<img :src="imageUrl" />
		</div>
	</el-upload>
</template>

<script name="upload" setup lang="ts">
import api from '@/api';
import { ElMessage } from 'element-plus';
import { defineEmits, ref } from 'vue';
const emit = defineEmits(['success']);
const imageUrl = ref('');
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
		.upload({ file: item.file })
		.then((result: any) => {
			if (result.code === 0) {
				ElMessage.success('上传成功');
				imageUrl.value = result.data.imageUrl;
				emit('success', result);
			}
		})
		.catch((error: any) => {
			ElMessage.error('上传失败', error);
		});
};
const initImageUrl = (value: string) => {
	console.log(value, `value`);
	imageUrl.value = value;
};
defineExpose({
	initImageUrl,
});
</script>

<style scoped lang="scss">
.img_container {
	width: 100%;
	height: 100%;
	img {
		width: 100%;
		height: 192px;
	}
}
</style>

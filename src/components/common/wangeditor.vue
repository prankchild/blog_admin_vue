<template>
	<div style="border: 1px solid #ccc">
		<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
		<Editor
			v-model="valueHtml"
			style="height: calc(100vh - 320px); overflow-y: hidden"
			:default-config="editorConfig"
			:mode="mode"
			@onCreated="handleCreated"
		/>
	</div>
</template>

<script setup lang="ts" name="wangeditor5">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { IToolbarConfig } from '@wangeditor/editor';
import { onBeforeUnmount, ref, shallowRef, onMounted, nextTick, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IEditorConfig } from '@wangeditor/editor';
import { ElMessage } from 'element-plus';
import api from '@/api';
import { upload } from '../../api/common.api';
const mode = 'default';
const toolbarConfig: Partial<IToolbarConfig> = {
	// TS 语法
	// const toolbarConfig = {                        // JS 语法
	/* 工具栏配置 */
};
// 初始化 MENU_CONF 属性
type InsertFnType = (url: string, alt: string, href: string) => void;
const editorConfig: Partial<IEditorConfig> = {
	// TS 语法
	placeholder: '请输入内容...',
	MENU_CONF: {
		uploadImage: {
			// 自定义上传
			async customUpload(file: File, insertFn: InsertFnType) {
				// TS 语法
				const res = await api.upload({ file });
				let url = '';
				if (res.code === 0) {
					url = res.data.imageUrl;
				}

				/*
				 * file 即选中的文件
				 * 自己实现上传，并得到图片 url alt href
				 * 最后插入图片
				 */
				insertFn(url, '', url);
			},

			/*
			 * 请求路径
			 * server: `${import.meta.env.VITE_APP_BASE_URL_PROXY}/common/upload`,
			 */
		},
	},
};
// 菜单栏去除视频操作
toolbarConfig.excludeKeys = ['uploadVideo', 'insertVideo', 'group-video', 'fullScreen'];
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('');
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	if (editorRef.value === null) return;
	editorRef.value.destroy();
});

const handleCreated = (editor: any) => {
	editorRef.value = editor; // 记录 editor 实例，重要！
};
const emit = defineEmits(['valueHtml']);
const initValue = (value: string) => {
	valueHtml.value = value;
};
watch(valueHtml, (newVal) => {
	// console.log(editorRef.value.getHtml(), `editorRef.value `);

	emit('valueHtml', newVal);
});
defineExpose({
	initValue,
});
</script>

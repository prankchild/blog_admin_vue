<template>
	<Dialog ref="dialogRef" :title="state.options.title" width="50%" @submit="submit" @cancel="cancel">
		<div class="dialog-container">
			<el-form>
				<comment-box :rows="3" @comment-text-change="commentTextChange" @submit="submit" ref="commentRef" />
				<div class="upload-container">
					<uploads @success="uploadChange" ref="uploadRef" />
				</div>
				<div class="upload-container">
					<span class="open"><span class="name">置顶</span><el-switch v-model="state.ruleForm.isTop" :active-value="1" :inactive-value="0" /></span>
					<span class="open"><span class="name">公开</span><el-switch v-model="state.ruleForm.isOpen" :active-value="1" :inactive-value="0" /></span>
				</div>
			</el-form>
		</div>
	</Dialog>
</template>

<script setup lang="ts" name="moodAddEditModel">
import CommentBox from '@/components/common/CommentBox.vue';
import api from '@/api';
import Uploads from '@/components/common/Uploads.vue';
import Dialog from '@/components/common/Dialog.vue';
import { ElMessage, FormRules } from 'element-plus';
import { reactive, ref, Ref, nextTick } from 'vue';
import { moodType } from '@/types/moodType';
const dialogRef = ref();

interface stateType {
	options: optionsType;
	ruleForm: ruleFormType;
}
interface optionsType {
	title: string;
}
interface ruleFormType {
	content: string;
	images: Array<string>;
	isTop: number;
	isOpen: number;
	user_id: number;
	id: number | null;
}
interface Props {
	params?: moodType;
}
const props = withDefaults(defineProps<Props>(), {
	params: {},
});
const state = reactive<stateType>({
	options: {
		title: '新增心情',
	},
	ruleForm: {
		user_id: 1,
		content: '',
		images: [],
		isTop: 0,
		isOpen: 1,
		id: null,
	},
});
// 评论框回调
const commentTextChange = (text: string) => {
	state.ruleForm.content = text;
};
// 上传图片回调
const uploadChange = (fileList: Ref<Array<{ url: string; name: string }>>) => {
	state.ruleForm.images = [];
	fileList.value.forEach((item) => {
		state.ruleForm.images.push(item.url);
	});
};
const openDialog = () => {
	dialogRef.value.openDialog();
	init();
};
const uploadRef = ref();
const commentRef = ref();
const init = () => {
	nextTick(() => {
		// 判断新增还是编辑
		if (Object.values(props.params).length) {
			state.options.title = '编辑';
			for (const key in state.ruleForm) {
				if (props.params[key] || props.params[key] === 0) {
					state.ruleForm[key] = props.params[key];
				}
			}
			const fileList: Array<any> = [];
			state.ruleForm.images.forEach((item: any) => {
				fileList.push({ url: item, name: item });
			});
			uploadRef.value.initFileList(fileList);
			commentRef.value.updateCommentText(state.ruleForm.content);
		} else {
			state.options.title = '新增';
			state.ruleForm = {
				user_id: 1,
				content: '',
				images: [],
				isTop: 0,
				isOpen: 1,
				id: null,
			};
		}
	});
};
const closeDialog = () => {
	dialogRef.value.closeDialog();
	uploadRef.value.initFileList([]);
	commentRef.value.updateCommentText('');
};
const emit = defineEmits(['submit']);
const submit = async () => {
	if (state.ruleForm.content && state.ruleForm.content.length) {
		let opt = 'addMood';
		// 判断编辑还是新增
		if (Object.values(props.params).length) {
			opt = 'updateMood';
		}
		const { code, message } = await api[opt](state.ruleForm);
		if (code === 0) {
			ElMessage.success(message);
			dialogRef.value.closeDialog();
			emit('submit');
		}
	}
};
const cancel = () => {
	closeDialog();
};
defineExpose({
	openDialog,
	closeDialog,
});
</script>
<style scoped lang="scss">
.upload-container {
	margin-top: 20px;
	.open {
		margin-right: 10px;
		.name {
			margin-right: 5px;
			font-weight: 600;
		}
	}
}
</style>

<template>
	<!--  评论框 -->
	<div id="comment-box">
		<div class="textarea">
			<!-- <div class="avatar">
				<div class="avatar-image">
					<img :src="main.userInfo.avatar" alt="" />
				</div>
			</div> -->
			<div class="submit">
				<el-button class="close-button" @click="close" v-if="showClose">取消</el-button>
				<el-button type="primary" class="submit-button" @click="submit" v-if="showSubmit">提交</el-button>
			</div>
			<div class="expression">
				<V3Emoji size="mid" @clickEmoji="clickEmoji" :recent="true" :keep="false" />
			</div>
			<div class="textarea-container">
				<el-input v-model="commentText" type="textarea" :placeholder="placeholder" :rows="rows" class="el-textarea" @blur="handleInputBlur" />
			</div>
		</div>
	</div>
</template>

<script setup name="CommentBox">
import { useCommonStore } from '../../store/modules/common';
import V3Emoji from 'vue3-emoji';
import 'vue3-emoji/dist/style.css';
import { ref, watch, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps({
	rows: {
		type: Number,
		default: 6,
	},
	placeholder: {
		type: String,
		default: '请输入评论内容',
	},
	showClose: {
		type: Boolean,
		default: false,
	},
	showSubmit: {
		type: Boolean,
		default: false,
	},
});
// 评论文本
const commentText = ref('');
const common = useCommonStore();

const clickEmoji = (emoji) => {
	strPartitionList.value[0] += emoji;
	commentText.value = strPartitionList.value[0] + strPartitionList.value[1];
};
// 光标位置数组
const strPartitionList = ref(['', '']);
// 获取光标停止的位置
const handleInputBlur = (e) => {
	const index = e.srcElement.selectionStart;
	const strStart = commentText.value.slice(0, index);
	const strEnd = commentText.value.slice(index);
	strPartitionList.value = [strStart, strEnd];
};
const emit = defineEmits(['commentTextChange', 'submit', 'close']);
watch(commentText, (newVal) => {
	emit('commentTextChange', newVal);
});
const submit = () => {
	if (commentText.value.length === 0) {
		ElMessage.error(`内容不可为空`);
		return;
	}
	emit('submit', commentText.value);
};
const close = () => {
	emit('close');
};
const updateCommentText = (newVal) => {
	commentText.value = newVal;
	strPartitionList.value[0] = commentText.value;
	strPartitionList.value[1] = '';
};
defineExpose({
	updateCommentText,
});
</script>

<style lang="scss" scoped>
.textarea {
	border-radius: 5px;
	border: 1px solid #d9d9d9;
	position: relative;
	&:hover {
		border-color: #40a9ff;
	}
	&:focus {
		border-color: #40a9ff;
		box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
	}
	.textarea-container {
		padding: 20px 10px 45px 15px;
	}
	.avatar {
		position: absolute;
		top: 10px;
		left: 15px;
		.avatar-image {
			img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}
		}
	}
	.submit {
		position: absolute;
		bottom: 10px;
		right: 20px;
		.close-button {
			border-radius: 5px;
			margin-right: 10px;
		}
		.submit-button {
			border-radius: 5px;
		}
	}
	.expression {
		position: absolute;
		bottom: 15px;
		left: 20px;
	}
}
</style>
<style scoped>
/deep/.el-textarea__inner {
	resize: none;
	border: 0 !important;
	/* //padding: 10px 0 0 80px; */
	box-shadow: none !important;
	font-size: 16px !important;
	/* &:focus {
		box-shadow: none;
	} */
}
</style>

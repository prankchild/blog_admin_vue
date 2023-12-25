<template>
	<div>
		<div class="add_article">
			<Card :title-name="tip.titleName">
				<div class="add_article_container">
					<div class="header">
						<el-input v-model="state.title" />
						<el-button style="margin-left: 20px; width: 100px" color="#2a42b3" @click="toSave"> 保存 </el-button>
						<el-button style="width: 100px"> 存为草稿 </el-button>
					</div>
					<wangeditor style="height: calc(100vh - 250px)" @value-html="HtmlChange" ref="wangeditorRef" />
				</div>
			</Card>
		</div>
		<add-article-dialog ref="addArticleDialogRef" :params="state" @submit="submit" />
	</div>
</template>
<script setup lang="ts" name="addArticle">
import wangeditor from '@/components/common/wangeditor.vue';
import Card from '@/components/common/Card.vue';
import { onMounted, reactive, ref } from 'vue';
import AddArticleDialog from './components/add-article-dialog.vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import api from '@/api';
const tip = ref({
	titleName: '发布文章',
});
const state = reactive({ title: '', content: '', textContent: '', params: {} });
const HtmlChange = (e: string) => {
	state.content = e;
	state.textContent = matchReg(e);
};
const addArticleDialogRef = ref();

const toSave = () => {
	if (state.title.length > 0 && state.textContent) {
		addArticleDialogRef.value.openDialog();
	} else {
		ElMessage.error('请填写标题和内容');
	}
};
const matchReg = (str: string) => {
	const reg = /<\/?.+?\/?>/g;
	return str.replace(reg, '');
};
const router = useRouter();
const wangeditorRef = ref();
const init = () => {
	if (router.currentRoute.value.params && router.currentRoute.value.params.id) {
		const id = Number(router.currentRoute.value.params.id);
		tip.value.titleName = '编辑文章';
		getArticle(id);
	} else {
		tip.value.titleName = '发布文章';
	}
};
const getArticle = async (id: number) => {
	const { result, code } = await api.findArticle({ id });
	if (code === 0) {
		state.title = result.data[0].title;
		state.content = result.data[0].content;
		wangeditorRef.value.initValue(result.data[0].content);
		state.textContent = result.data[0].textContent;
		state.params = result.data[0];
	}
};
const submit = () => {
	router.push('/article/articleManage');
};
onMounted(() => {
	init();
});
</script>

<style scoped lang="scss">
.add_article {
	width: 100%;
	height: 100%;
	overflow: hidden;
	.add_article_container {
		.header {
			display: flex;
			margin: 0 0 20px 0;
		}
		width: 98%;
		height: 100%;
	}
}
</style>

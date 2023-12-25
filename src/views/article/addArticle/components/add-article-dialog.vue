<template>
	<el-dialog v-model="dialogVisible" :title="state.title" width="40%">
		<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" status-icon>
			<el-form-item label="文章标签" prop="label">
				<el-select v-model="state.ruleForm.label" placeholder="请选择文章标签" multiple style="width: 320px">
					<el-option v-for="item in state.articleLabel" :key="item.id" :label="item.labelName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="文章类型" prop="type">
				<el-select v-model="state.ruleForm.type" placeholder="请选择文章类型" style="width: 320px">
					<el-option v-for="item in articleStore.articleType" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="是否置顶" prop="isTop">
				<el-radio-group v-model="state.ruleForm.isTop">
					<el-radio :label="0"> 否 </el-radio>
					<el-radio :label="1"> 是 </el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否为最新" prop="isNew">
				<el-radio-group v-model="state.ruleForm.isNew">
					<el-radio :label="0"> 否 </el-radio>
					<el-radio :label="1"> 是 </el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否为HOT" prop="isHot">
				<el-radio-group v-model="state.ruleForm.isHot">
					<el-radio :label="0"> 否 </el-radio>
					<el-radio :label="1"> 是 </el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="文章封面" prop="cover">
				<Upload ref="uploadRef" @success="uploadChange" />
			</el-form-item>
			<el-form-item label="是否公开" prop="cover">
				<el-switch v-model="state.ruleForm.isOpen" :active-value="1" :inactive-value="0" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button color="#2a42b3" @click="publish">{{ state.title }}</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose, watch, defineProps, nextTick } from 'vue';
import api from '@/api';
import Upload from '@/components/common/Upload.vue';
import { useArticleStore } from '@/store/modules/article';
import { ElMessage } from 'element-plus';
import { addArticle } from '@/api/article.api';
const articleStore = useArticleStore();
const props = defineProps({
	params: {
		type: Object,
		default: () => ({}),
	},
});
const dialogVisible = ref(false);
const state = reactive({
	title: '发布文章',
	ruleForm: { user_id: 1, label: '', type: null, isTop: 0, isOpen: 0, cover: '', isHot: 0, isNew: 0, draft: 0, id: null },
	articleLabel: [],
});

const rules = ref({
	label: [{ required: true, message: '请选择文章标签', trigger: 'blur' }],
	type: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
	isTop: [{ required: true, message: '请选择是否置顶', trigger: 'blur' }],
	isHot: [{ required: true, message: '请选择是否为火热', trigger: 'blur' }],
	isNew: [{ required: true, message: '请选择是否最新', trigger: 'blur' }],
	cover: [{ required: true, message: '请选择文章背景图', trigger: 'blur' }],
	isOpen: [{ required: true, message: '请选择是否公开', trigger: 'blur' }],
});
const openDialog = () => {
	dialogVisible.value = true;
};
const getLabelList = async () => {
	const { code, result } = await api.findArticleLabel();
	if (code === 0) {
		state.articleLabel = result.data;
	}
};
const uploadRef = ref();
const init = () => {
	if (props.params.params && props.params.params.id) {
		const params = props.params.params;
		// params.forEach((item: any) => {
		// 	console.log(item, `item`);
		state.title = '编辑文章';
		for (const subKey in state.ruleForm) {
			if (params[subKey] || params[subKey] === 0) {
				state.ruleForm[subKey] = params[subKey];
			}
			if (subKey === 'label') {
				state.ruleForm[subKey] = params[subKey].map((item: any) => {
					return item.article_label_id;
				});
			}
		}
		nextTick(() => {
			uploadRef.value.initImageUrl(state.ruleForm.cover);
		});

		// });
	} else {
		state.title = '发布文章';
	}
	getLabelList();
};
const ruleFormRef = ref();
const emit = defineEmits(['submit']);
const publish = async () => {
	await ruleFormRef.value.validate(async (valid) => {
		if (valid) {
			const parmas = { ...props.params, ...state.ruleForm };
			console.log(parmas, 'parmas');
			interface Result {
				code?: number;
				result?: any;
				message?: string;
			}
			let result: Result = {};
			if (state.ruleForm.id) {
				result = await api.updateArticle(parmas);
			} else {
				result = await api.addArticle(parmas);
			}
			if (result.code === 0) {
				ElMessage.success(result.message);
				emit('submit');
			} else {
				ElMessage.error(result.message);
			}
		} else {
			ElMessage.error('请填写完整数据');
		}
	});
};
const uploadChange = (e) => {
	if (e.code === 0) {
		state.ruleForm.cover = e['data']['imageUrl'];
	}
};
watch(dialogVisible, (newVal) => {
	newVal && init();
});
defineExpose({ openDialog });
</script>
<style scoped lang="scss"></style>

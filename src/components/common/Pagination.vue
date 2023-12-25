<template>
	<el-pagination class="pagination" v-bind="$attrs" layout="->, prev, pager, next, jumper, slot" background>
		<template #default="scope">
			<span class="pagination__total">共{{ totalPage }}页/{{ $attrs.total }}条</span>
		</template>
	</el-pagination>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

const attrs = useAttrs();

const totalPage = computed(() => {
	if (!attrs.total || !attrs['page-size']) {
		return 0;
	}
	return Math.ceil(attrs.total / attrs['page-size']);
});
</script>
<style scoped lang="scss">
.pagination {
	border-radius: var(--el-card-border-radius);
	border: 1px solid var(--el-card-border-color);
	background-color: var(--el-card-bg-color);
	overflow: hidden;
	color: var(--el-text-color-primary);
	transition: var(--el-transition-duration);
	// box-shadow: var(--el-box-shadow-light);
	display: flex;
	// position: absolute;
	// bottom: 0;
	// left: 0;
	z-index: 99;
	width: 100%;
	background: #fff;
	align-items: center;
	height: 64px;
	line-height: 64px;
}
.pagination.is-background {
	--el-text-color-placeholder: '';
	--el-pagination-button-bg-color: '#FFFFFF';

	:deep(.el-pager) {
		li {
			border: 1px solid #e9e9e9;
		}

		.is-active {
			border-color: #3462fd;
			color: #3462fd !important;
			background-color: #fff !important;
		}
	}

	.pagination__total {
		margin-left: 19px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 17px;
		color: #262626;
		padding-right: 43px;
	}
}
</style>

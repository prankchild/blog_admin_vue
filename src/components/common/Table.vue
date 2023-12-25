<template>
	<el-table v-bind="$attrs" style="width: 100%" class="table" empty-text="暂无数据">
		<slot name="default"></slot>
	</el-table>
</template>
<script>
import { defineProps } from 'vue';
// const attrs = useAttrs();
const props = defineProps({
	multipleSelection: {
		type: Array,
		default: () => [],
	},
});
</script>
<style lang="scss">
.table {
	transition: all 1s;
	.table-selected-line {
		background-color: rgba(52, 98, 253, 0.39);
	}
	.table-double-line {
		background-color: rgba(52, 98, 253, 0.04);
	}

	.table-single-line {
		background-color: rgba(226, 226, 226, 0.04);
	}

	.table__header {
		.el-table__cell {
			border: 1px solid #e9e9e9;
			font-size: 14px;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 20px;
			color: #262626;
		}

		.el-table__cell + .el-table__cell {
			border-left: none;
		}
	}
	.table-image {
		margin: 10px;
		width: 128px;
		height: 72px;
	}
}
</style>

<template>
	<div
		:class="[
			'search-container',
			{
				'search-hidden': !state.isExpanded,
			},
		]"
	>
		<el-card shadow="hover">
			<div class="layout-main-search">
				<div class="search-condition">
					<slot name="default"></slot>
				</div>
				<div class="search-button">
					<slot name="button"></slot>
					<span class="ml16 expanded-icon" @click="onPutAway"
						>收起
						<SvgIcon name="screen-stop" style="width: auto; height: auto; vertical-align: middle" />
					</span>
				</div>
			</div>
		</el-card>
		<SvgIcon v-show="!state.isExpanded" name="screen-open" class="search-expanded-icon" @click="onOpen" style="width: 16px; height: 16px" />
	</div>
</template>

<script setup name="Search">
import { reactive } from 'vue';
const emit = defineEmits(['expandedChange']);
const state = reactive({
	isExpanded: true,
});

const onPutAway = () => {
	state.isExpanded = false;
	emit('expandedChange', state.isExpanded);
};

const onOpen = () => {
	state.isExpanded = true;
	emit('expandedChange', state.isExpanded);
};
</script>

<style scoped lang="scss">
.layout-main-search {
	display: flex;
	padding: 5px;
}

.search-condition {
	display: flex;
	flex-wrap: wrap;
	gap: 24px 32px;
	flex: 3;
}

.search-button {
	display: inline-flex;
	justify-content: flex-end;
	float: right;
	text-align: right;
	flex: 1;

	.expanded-icon {
		white-space: nowrap;
		height: 32px;
		line-height: 32px;
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		color: #3462fd;
		cursor: pointer;
		user-select: none;
	}
}

.search-container {
	width: 100%;
	transition: all 1.5s;
	position: relative;
	overflow: visible;
	max-height: 300px;
	margin: 10px 0 20px 0;
	.el-card {
		max-height: 300px;
	}
}

.search-hidden {
	margin-bottom: 32px;
	max-height: 0;

	.el-card {
		max-height: 0;
	}

	.search-expanded-icon {
		width: 16px;
		height: 16px;
		position: absolute;
		left: 50%;
		cursor: pointer;
		bottom: -20px;
	}
}
</style>

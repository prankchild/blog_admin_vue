<template>
	<div class="info-pop" ref="infoContainer">
		<div class="mask" @click="close"></div>
		<!-- <div class="body"> -->
		<h2 class="common-padding shadow">
			<slot name="title"></slot>
			<el-icon @click="close" class="close"><ele-Close /></el-icon>
		</h2>
		<div class="main-container">
			<div class="base-info common-padding">
				<slot name="body"> </slot>
			</div>
			<div class="info-log common-padding">
				<slot name="log"> </slot>
			</div>
			<div class="info-footer">
				<slot name="footer"> </slot>
			</div>
		</div>
		<!-- </div> -->
	</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
const props = defineProps({
	modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'close']);
const close = () => {
	emit('update:modelValue', false);
	emit('close');
};
const infoContainer = ref(null);
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			infoContainer.value.style.display = 'block';
			setTimeout(() => {
				infoContainer.value.style.height = '117%';
				infoContainer.value.style.opacity = '1';
			}, 0);
		} else {
			infoContainer.value.style.height = '0';
			infoContainer.value.style.opacity = '0';
			setTimeout(() => {
				infoContainer.value.style.display = 'none';
			}, 500);
		}
	}
);
onMounted(() => {
	infoContainer.value.style.display = 'none';
});
</script>

<style lang="scss">
.info-pop {
	background-color: transparent;
	position: fixed;
	bottom: 0;
	left: 0px;
	right: 0;
	z-index: 99;
	opacity: 0;
	height: 0;
	transition: all ease 0.3s;
	.mask {
		height: 220px;
	}
	.common-padding {
		padding-left: 24px;
		padding-right: 36px;
	}
	.main-container {
		height: 110%;
		overflow-x: hidden;
		overflow-y: scroll;
		background-color: #fff;
		padding-bottom: 500px;
	}
	.shadow {
		box-shadow: 5px 0px 16px rgba(67, 79, 117, 0.3);
	}
	h2 {
		font-size: 16px;
		color: #262626;
		line-height: 56px;
		background: #fbfbfb;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid #e9e9e9;

		.close {
			margin-right: 24px;
			font-size: 20px;
			color: #ccc;
			cursor: pointer;
		}
	}
	h3,
	.item-title {
		font-size: 16px;
		color: #262626;
		padding: 20px 0;
		font-weight: bold;
		margin-top: 10px;
		&:first-of-type {
			margin-top: 0;
		}
	}
	.base-info {
		.tag {
			position: relative;
			padding-left: 16px;
			margin-top: 26px;
			&:first-of-type {
				margin-top: 0;
			}
		}
		.tag::before {
			content: '';
			position: absolute;
			top: 4px;
			left: 6px;
			width: 3px;
			height: 12px;
			background: #3462fd;
		}
		.el-row {
			position: relative;
			padding-left: 16px;
			margin-top: 26px;
			&:first-of-type {
				margin-top: 0;
			}
		}
		.el-row::before {
			content: '';
			position: absolute;
			top: 4px;
			left: 6px;
			width: 3px;
			height: 12px;
			background: #3462fd;
		}
	}
	.info-log {
		.item-log,
		.el-row {
			margin-top: 12px;
			&:first-of-type {
				margin-top: 0;
			}
			.el-col,
			.item-time {
				&:first-of-type {
					color: #999999;
				}
			}
		}
	}
	.info-footer {
		margin-top: 32px;
		margin-bottom: 32px;
		.action {
			border-top: 1px solid #e2e2e2;
			padding-top: 16px;
			display: flex;
			justify-content: flex-end;
			padding-right: 36px;
		}
		.el-button {
			border-radius: 0;
		}
		.cancel {
			color: #999999;
			border-color: #d9d9d9;
		}
	}
}
</style>

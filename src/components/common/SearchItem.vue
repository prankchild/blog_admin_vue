<template>
	<div class="search-item">
		<span v-if="props.star" class="mr4 red">*</span>
		<span v-if="props.label.length" class="mr4 search-label">{{ props.label }}：</span>
		<slot name="default"></slot>
	</div>
</template>

<script setup name="searchItem" lang="ts">
const props = defineProps({
	label: {
		type: String,
		default: '',
	},
	star: {
		type: Boolean,
		default: false,
	},
});
</script>

<style lang="scss">
.search-item {
	display: inline-block;
	white-space: nowrap;
	display: flex;
}
.red {
	color: red;
}
.search-label {
	line-height: 32px;
}
</style>

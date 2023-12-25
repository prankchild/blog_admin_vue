<template>
	<el-dialog v-model="dialogVisible" title="Tips" width="40%" :before-close="handleClose">
		<div class="map-dialog">
			<div id="map"></div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="userMap">
import { ref, defineExpose, watch, nextTick } from 'vue';
// import AMapLoader from '@amap/amap-jsapi-loader'; // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
import AMapLoader from '@amap/amap-jsapi-loader';
const dialogVisible = ref(false);
const props = defineProps({
	params: {
		type: Object,
		default: () => {},
	},
});
const openDialog = () => {
	dialogVisible.value = true;
};
const closeDialog = () => {
	dialogVisible.value = false;
};
const handleClose = () => {
	closeDialog();
};
const init = () => {
	const position = props.params.rectangle.split(';')[0].split(',');
	console.log(position, `position`);
	// // 创建地图实例
	AMapLoader.load({
		key: 'e4e3d44a98350790a1493450032bbec5', // 申请好的Web端开发者Key，首次调用 load 时必填
		version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then((AMap) => {
			const map = new AMap.Map('map', {
				//设置地图容器id
				viewMode: '3D', //是否为3D地图模式
				zoom: 13, //初始化地图级别
				center: position, //初始化地图中心点位置
			});
		})
		.catch((e) => {
			console.log(e);
		});
};
watch(dialogVisible, (newVal) => {
	if (newVal) {
		nextTick(() => {
			init();
		});
	}
});
defineExpose({
	openDialog,
	closeDialog,
});
</script>
<style scoped lang="scss">
.map-dialog {
	width: 100%;
	height: 500px;
}
#map {
	margin: 50px auto;
	width: 100%;
	height: 100%;
}
::v-deep.el-dialog__body {
	margin: 0 !important;
	padding: 0 !important;
}
</style>

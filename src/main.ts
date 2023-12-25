import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 内部文件
import router from '@/router/index';
import '@/router/permission';
import { createPinia } from 'pinia';
// 样式表
import '@/style/index.scss';
// 动画库
import animate from 'animate.css';
// 查看图片插件
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
// 导入自定义SVG
import SvgIcon from '@/components/common/SvgIcon.vue';
const pinia = createPinia();

const app = createApp(App);
//  全局导入element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
const icons = ElementPlusIconsVue;
for (const i in icons) {
	app.component(`ele-${icons[i].name}`, icons[i]);
}
app.component('SvgIcon', SvgIcon);
app.use(VueViewer);
app.use(animate);
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount('#app');

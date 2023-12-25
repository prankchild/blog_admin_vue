import { nextTick } from 'vue';
import * as svg from '@element-plus/icons-vue';
import { Local } from '@/utils/storage';


/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function elSvg(app) {
	const icons = svg;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
	app.component('SvgIcon', SvgIcon);
}

// 统一批量导出
export default other;

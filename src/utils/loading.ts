import { nextTick } from 'vue';
import '@/style/loading.scss';
/**
 * 页面全局 Loading
 * @method start 创建 loading
 * @method done 移除 loading
 */
export const NextLoading = {
	// 创建 loading
	start: () => {
		const Body: Element = document.body;
		const div = <HTMLElement>document.createElement('div');
		div.setAttribute('class', 'loading');
		const HTML = `
                <div class="sk-cube-grid">
                    <div class="sk-cube sk-cube1"></div>
                    <div class="sk-cube sk-cube2"></div>
                    <div class="sk-cube sk-cube3"></div>
                    <div class="sk-cube sk-cube4"></div>
                    <div class="sk-cube sk-cube5"></div>
                    <div class="sk-cube sk-cube6"></div>
                    <div class="sk-cube sk-cube7"></div>
                    <div class="sk-cube sk-cube8"></div>
                    <div class="sk-cube sk-cube9"></div>
            	</div>
		`;
		div.innerHTML = HTML;
		Body.insertBefore(div, Body.childNodes[0]);
		window.nextLoading = true;
	},
	// 移除 loading
	done: () => {
		nextTick(() => {
			window.nextLoading = false;
			const el = <HTMLElement>document.querySelector('.loading');
			el?.parentNode?.removeChild(el);
		});
	},
};

// <div class="loading-next-box">
// <div class="loading-next-box-warp">
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
//     <div class="loading-next-box-item"></div>
// </div>
// </div>

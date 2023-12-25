import { defineConfig, loadEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
	console.log(mode, `mode`);
	// 获取当前环境的配置
	const config = loadEnv(mode, process.cwd());
	console.log(config, `config`);

	return {
		plugins: [vue(), vueSetupExtend()],
		resolve: {
			alias: { '@': path.resolve(__dirname, './src') },
			extensions: ['.js', '.ts', '.json', '.jsx', '.tsx'],
		},
		server: {
			proxy: {
				'/koa': {
					// target: config.VITE_APP_BASE_URL_PROXY,
					target: config.VITE_APP_BASE_URL_PROXY,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/koa/, ''),
				},
				'/ip': {
					target: 'https://restapi.amap.com/ip', // localhost=>target
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/ip/, ''),
				},
			},
		},
		//配置sass
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/style/app.scss";`,
				},
			},
		},
	};
});

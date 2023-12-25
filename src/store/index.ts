
/*
 * export const useStore = defineStore('main', {
 *   // 推荐使用 完整类型推断的箭头函数
 *   state: () => ({ isOpenAside: true }),
 *   actions: {
 *     changeOpenAside(bol:boolean) {
 *       this.isOpenAside = bol
 *     }
 *   },
 * })
 */


import { createPinia } from 'pinia'

const store = createPinia()

export { store }

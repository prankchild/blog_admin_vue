import { defineStore } from 'pinia'

export const useArticleStore = defineStore({
  id: 'articleStore',
  state: () => ({
    articleType: [
      { id: 1, name: '原创' },
      { id: 2, name: '转载' },
      { id: 3, name: '翻译' },
    ]
  }),
  getters: {},
  actions: {},
})

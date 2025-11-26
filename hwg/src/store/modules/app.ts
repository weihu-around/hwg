import { defineStore } from 'pinia'


// 第一个参数是应用程序中 store 的唯一 id
export const useAppStore = defineStore('app', {
  // 配置项
  state: () => {
    return {
      pageLoading: false // 路由跳转Loading
    }
  },
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading
    },
  },
  actions: {
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    },
  }
})

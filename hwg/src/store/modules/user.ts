import { defineStore } from 'pinia'
import { routes, router } from '@/router'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { RouteRecordRaw } from "vue-router";
import { loginOut } from '@/api/login'

const { wsCache } = useCache()

// 第一个参数是应用程序中 store 的唯一 id
export const useUserStore = defineStore('users', {
  // 配置项
  state: () => {
    return {
      uid: 1,
      exp: 100,
      menuRoutes: [] as RouteRecordRaw[], //仓库存储生成菜单需要数组(路由)
      user: {
        username: ''
      }
    }
  },
  getters: {
    // 无参
    addExp: (state) => {
      return state.exp + 150
    },
    // 带参
    addExpCustom: (state) => {
      return (num: number) => state.exp + num
    }
  },
  actions: {
    showParam(param: string) {
      console.log('传入的参数为：' + param)
    },
    //  设置菜单路由
    async setMenuRoutes(){
      const resetWhiteNameList = [ 'Login', 'NoFound', 'PersonalCenter']
      const menuRoutes: Array<RouteRecordRaw> = []
      // router.getRoutes().forEach((route) => {
      //   const { name } = route
      //   if (name && !resetWhiteNameList.includes(name as string)) {
      //     menuRoutes.push(route)
      //   }
      // })
      routes.forEach((route) => {
        const { name } = route
        if (name && !resetWhiteNameList.includes(name as string)) {
          menuRoutes.push(route)
        }
      })
      this.menuRoutes = menuRoutes
    },
    // 缓存用户信息
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = wsCache.get(CACHE_KEY.USER)
      if (!userInfo) {
        // userInfo = await getInfo() // UNDO 等待接口
        userInfo = {
          username: 'admin',
        }
      }
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    // 登出
    async loginOut() {
      // await loginOut()  UNDO 等待接口
      removeToken()
      deleteUserCache() // 删除用户缓存
      this.resetState()
      // 干掉token后再走一次路由让它过router.beforeEach的校验
      window.location.reload(); // 重新加载当前页，需认证页面会去登录页 
    },
    resetState() {
      this.user = {
        username: '',
      }
    }
  }
})

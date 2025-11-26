import { router } from './router'
import { getAccessToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'

// const parseURL = (
//   url: string | null | undefined
// ): { basePath: string; paramsObject: { [key: string]: string } } => {
//   // 如果输入为 null 或 undefined，返回空字符串和空对象
//   if (url == null) {
//     return { basePath: '', paramsObject: {} }
//   }

//   // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数
//   const questionMarkIndex = url.indexOf('?')
//   let basePath = url
//   const paramsObject: { [key: string]: string } = {}

//   // 如果找到了问号，说明有查询参数
//   if (questionMarkIndex !== -1) {
//     // 获取 basePath
//     basePath = url.substring(0, questionMarkIndex)

//     // 从 URL 中获取查询字符串部分
//     const queryString = url.substring(questionMarkIndex + 1)

//     // 使用 URLSearchParams 遍历参数
//     const searchParams = new URLSearchParams(queryString)
//     searchParams.forEach((value, key) => {
//       // 封装进 paramsObject 对象
//       paramsObject[key] = value
//     })
//   }

//   // 返回 basePath 和 paramsObject
//   return { basePath, paramsObject }
// }

// 路由不重定向白名单
const whiteList = [
  '/login',
  // '/register',
]

// 路由加载前
router.beforeEach(async (to, from, next) => {
  useAppStore().setPageLoading(true)
  const userStore = useUserStore()
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      await userStore.setUserInfoAction() // 缓存用户信息
      await userStore.setMenuRoutes() // 过滤菜单路由
      // const redirectPath = from.query.redirect || to.path
      // // // 修复跳转时不带参数的问题
      // const redirect = decodeURIComponent(redirectPath as string)
      // const { paramsObject: query } = parseURL(redirect)
      // const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query }
      // next(nextData)
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  document.title = to?.meta?.title as string
  setTimeout(()=>{
    useAppStore().setPageLoading(false)
  }, 800)
})

import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { getAccessToken } from '@/utils/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from "@/store/modules/user"
import qs from 'qs'


// 请求白名单，无须token的接口
const whiteList: string[] = ['/login']
// 是否显示重新登录
export const isRelogin = { show: false }

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let isToken = (config!.headers || {}).isToken === false
    whiteList.some((v) => {
      if (config.url && config.url.indexOf(v) > -1) {
        return (isToken = false)
      }
    })
    if (getAccessToken() && !isToken) {
      config.headers.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token
    }
    // const token = window.sessionStorage.getItem('token')
    // const token = getAccessToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    const method = config.method?.toUpperCase()
     // 防止 GET 请求缓存
     if (method === 'GET') {
      config.headers['Cache-Control'] = 'no-cache'
      config.headers['Pragma'] = 'no-cache'
    }
    // 自定义参数序列化函数
    else if (method === 'POST') {
      const contentType = config.headers['Content-Type'] || config.headers['content-type']
      if (contentType === 'application/x-www-form-urlencoded') {
        if (config.data && typeof config.data !== 'string') {
          config.data = qs.stringify(config.data)
        }
      }
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;
    if (data.code === 200) {
      return response.data;
    } 
    // 登录超时 UNDO 待后台确认状态码或msg信息
    else if (data.msg === '登录超时') {
      return handleAuthorized()
    }
    ElMessage.error(data.msg || "系统出错");
    return Promise.reject(new Error(data.msg || "Error"));
  },
  (error: any) => {
    if (error.response.data) {
      ElMessage.error(error.response.data.msg || "系统出错");
    }
    return Promise.reject(error.message);
  }
);

// 登录超时 
const handleAuthorized = () => {
  if (!isRelogin.show) {
    isRelogin.show = true
    ElMessageBox.confirm('登录超时，请重新登录', '系统提示', {
      type: 'warning'
    }).then(() => {
      useUserStore().loginOut()
    })
  }
  return Promise.reject('登录超时,请重新登录!')
}

// 导出 axios 实例
export default request;


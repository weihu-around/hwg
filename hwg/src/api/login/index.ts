import request from "@/utils/request"
// import { AxiosPromise } from "axios";
// import { HotArticleQuery, HotArticleVo } from './types'
// import { Page } from "../page";

// 入参是HotArticleQuery，返回体是Page<HotArticleVo>
//  登出
export function loginOut() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

//  登录
export function login(data: any) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: data
  })
}

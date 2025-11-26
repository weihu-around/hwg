import request from "@/utils/request"
import { AxiosPromise } from "axios";
import { HotArticleQuery, HotArticleVo } from './types'
import { Page } from "../page";

// 入参是HotArticleQuery，返回体是Page<HotArticleVo>
export function getArticleApi(queryParams?: HotArticleQuery) : AxiosPromise<Page<HotArticleVo>> {
  return request({
    url: '/article/list',
    method: 'post',
    data: queryParams
  })
}

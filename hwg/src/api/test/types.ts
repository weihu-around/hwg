// 请求参数
export interface HotArticleQuery {
  pageSize: number;
  pageIndex: number;
  searchKey: string;
}
// 返回分页数据的具体参数
export interface HotArticleVo {
  id: number;
  title: string;
}

import request from "@/utils/request"

export const UserApi = {
  // 获取用户列表
  users: async (data:any)=> {
    return await request({
      url: '/admin/logout',
      method: 'post',
      data: data
    })
  }
}
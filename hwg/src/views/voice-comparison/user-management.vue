<template>
  <el-card style="margin-bottom: 30px;">
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="queryParams.account"
          placeholder="请输入账号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
 
  <el-card>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="账号" align="center" prop="areaName"/>
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" width="140px" show-overflow-tooltip/>
      <el-table-column label="昵称" align="center" prop="nickname" width="120px" show-overflow-tooltip/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="年龄" align="center" prop="age"/>
      <el-table-column label="性别" align="center" prop="sex">
        <template #default="scope">
          <span v-if="scope.row.sex == 0">女</span>
          <span v-else>男</span>
        </template>
      </el-table-column>
      <el-table-column label="地区（国籍）" align="center" prop="area" width="120px"/>
      <el-table-column label="职业" align="center" prop="job"/>
      <el-table-column label="受教育程度" align="center" prop="education" width="120px"/>
      <el-table-column label="订阅状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="info" v-if="scope.row.status == 0">未订阅</el-tag>
          <el-tag type="primary" v-else-if="scope.row.status==1">已订阅</el-tag>
          <el-tag type="danger" v-else>已过期</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="110" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openInfo(scope.row.id)"> 查看订单信息 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-card>
 
  <!-- 详情弹窗 -->
  <Details ref="detailsRef" />
</template>

<script setup lang="ts">
import Details from './details.vue'
defineOptions({ name: 'VoiceUserManagement' })
// const message = useMessage() // 消息弹窗
const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any>([]) // 列表数据
const initFields = () => {
  return {	
    pageNo: 1,
    pageSize: 10,
    account: '',
    phone: '', 
    name: '',
    email: '',
  }
}

const queryParams = ref(initFields())
const queryFormRef = ref() // 搜索的表单
const detailsRef = ref() // 详情弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await ServiceProviderApi.queryPage(queryParams.value)
    // list.value = data.list
    // total.value = data.total
    list.value = [
      {id: 1, sex: 0, nickname: '徐徐徐徐uuuuuuuuuuuu', email: '6666666@qq.com', status: 0},
      {id: 2, sex: 1, status: 1},
      {id: 3, sex: 1, status: 2},
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
}

/** 查看详情 **/ 
const openInfo = (id: number)=>{
  detailsRef.value.open(id)
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = initFields()
  handleQuery()
}
/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
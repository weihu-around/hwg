<template>
  <div class="padding-20px">
    <el-card style="margin-bottom: 15px;">
      <el-form class="mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="170px">
        <el-form-item label="《小学识字板》订阅状态" prop="szbSubscriptionStatus">
          <el-select v-model="queryParams.szbSubscriptionStatus" placeholder="请选择订阅状态" clearable class="!w-240px" >
              <el-option v-for="dict in DICT_SUBSCRIPTION" :key="dict.code" :label="dict.value" :value="dict.code" />
            </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="queryParams.account" placeholder="请输入账号" clearable @keyup.enter="handleQuery" class="!w-240px" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable class="!w-240px" >
            <el-option v-for="dict in DICT_SEX" :key="dict.code" :label="dict.value" :value="dict.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="《普粤通》订阅状态" prop="pytSubscriptionStatus">
          <el-select v-model="queryParams.pytSubscriptionStatus" placeholder="请选择订阅状态" clearable class="!w-240px" >
              <el-option v-for="dict in DICT_SUBSCRIPTION" :key="dict.code" :label="dict.value" :value="dict.code" />
            </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="queryParams.email" placeholder="请输入邮箱" clearable @keyup.enter="handleQuery" class="!w-240px" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter="handleQuery" class="!w-240px" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary" :icon="Search"> 搜索 </el-button>
          <el-button @click="resetQuery" :icon="Refresh"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  
    <el-card>
      <el-table v-loading="loading" :data="list" max-height="530px">
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="账号" align="center" prop="areaName" width="140px" show-overflow-tooltip/>
        <el-table-column label="密码" align="center" prop="phone" width="140px" show-overflow-tooltip />
        <el-table-column label="性别" align="center" prop="sex">
          <template #default="scope">
            <span v-if="scope.row.sex == 0">女</span>
            <span v-else>男</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" prop="email" width="140px" show-overflow-tooltip/>
        <el-table-column label="用户名" align="center" prop="username" width="120px" show-overflow-tooltip/>
        <el-table-column label="注册日期" align="center" prop="createTime" width="180px" show-overflow-tooltip/>
        <el-table-column label="《小学识字板》订阅状态" align="center" width="180px" prop="szbSubscriptionStatus">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.szbSubscriptionStatus == 0">未订阅</el-tag>
            <el-tag type="primary" v-else-if="scope.row.szbSubscriptionStatus==1">订阅中</el-tag>
            <el-tag type="danger" v-else>已过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="《普粤通》订阅状态" align="center"  width="160px" prop="pytSubscriptionStatus">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.pytSubscriptionStatus == 0">未订阅</el-tag>
            <el-tag type="primary" v-else-if="scope.row.pytSubscriptionStatus==1">订阅中</el-tag>
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
  </div>
 
 
  <!-- 详情弹窗 -->
  <Details ref="detailsRef" />
</template>

<script setup lang="ts">
import Details from './components/details.vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { UserApi } from '@/api/system/user'


defineOptions({ name: 'UserManagement' })

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any>([]) // 列表数据
const DICT_SEX = ref([
  {value: '女', code: 0},
  {value: '男', code: 1}
])
const DICT_SUBSCRIPTION = ref([
  {value: '无订阅', code: 0},
  {value: '订阅中', code: 1},
  {value: '已过期', code: 2},
])
const initFields = () => {
  return {	
    pageNo: 1,
    pageSize: 10,
    account: '',
    sex: '',
    username: '',
    email: '',
    szbSubscriptionStatus: '',
    pytSubscriptionStatus: ''
  }
}

const queryParams = ref(initFields())
const queryFormRef = ref() // 搜索的表单
const detailsRef = ref() // 详情弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const result = await UserApi.users(queryParams.value) UNDO 等待接口
    // list.value = result.list
    // total.value = result.total
    list.value = [
      {id: 1, sex: 0, username: '徐徐徐徐uuuuuuuuuuuu', email: '6666666@qq.com', pytSubscriptionStatus: 0, szbSubscriptionStatus: 1},
      {id: 2, sex: 1, pytSubscriptionStatus: 1, szbSubscriptionStatus: 2},
      {id: 3, sex: 1, pytSubscriptionStatus: 2, szbSubscriptionStatus: 0},
    ]
    total.value = 3
  } finally {
    setTimeout(()=>{
      loading.value = false
    }, 1000)
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
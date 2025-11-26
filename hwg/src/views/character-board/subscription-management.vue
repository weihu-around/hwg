<template>
  <el-card style="margin-bottom: 30px;">
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
      <el-form-item label="状态" prop="account">
        <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in DICTLIST" 
              :key="dict.code"
              :label="dict.value"
              :value="dict.code"
            />
          </el-select>
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
      <el-table-column label="订阅时长（天）" align="center" prop="period"/>
      <el-table-column label="订阅价格（元）" align="center" prop="price" />
      <el-table-column label="展示次序" align="center" prop="order" width="140px"/>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="info" v-if="scope.row.status == 0">发布中</el-tag>
          <el-tag type="primary" v-else-if="scope.row.status==1">未发布</el-tag>
          <el-tag type="danger" v-else>已废弃</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="110" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleEdit(scope.row.id)"> 修改 </el-button>
          <el-button link type="primary" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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
 
</template>

<script setup lang="ts">

defineOptions({ name: 'CharacterUserManagement' })
// const message = useMessage() // 消息弹窗
const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any>([]) // 列表数据
const DICTLIST = ref([
  {value: '发布中', code: 0},
  {value: '未发布', code: 1},
  {value: '已过期', code: 2}
])
const initFields = () => {
  return {	
    pageNo: 1,
    pageSize: 10,
    status: ''
  }
}

const queryParams = ref(initFields())
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await ServiceProviderApi.queryPage(queryParams.value)
    // list.value = data.list
    // total.value = data.total
    list.value = [
      {id: 1, period: 30, price: 180, order: '1', status: 0},
      {id: 2, period: 60, price: 360,  order: '2', status: 1},
      {id: 3, period: 70, price: 400,  order: '3'},
    ]
    total.value = 3
  } finally {
    loading.value = false
  }
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
<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="50%">
    <el-form ref="queryFormRef" :model="queryParams" label-width="120px" :inline="true">
      <el-form-item label="订阅产品名称" prop="production">
        <el-select v-model="queryParams.production" placeholder="请选择订阅产品" clearable class="!w-240px" >
          <el-option v-for="dict in DICT_PRODUCTIONS" :key="dict.code" :label="dict.value" :value="dict.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable class="!w-240px" >
          <el-option v-for="dict in DICT_ORDER_STATUS" :key="dict.code" :label="dict.value" :value="dict.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="订阅开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          value-format="x"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订阅结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          value-format="x"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="x"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary" :icon="Search"> 搜索 </el-button>
        <el-button @click="resetQuery" :icon="Refresh"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <div style="border: solid 1px #dcdfe6;border-radius: 4px;">
      <el-table v-loading="tableLoading" :data="list" max-height="230px" stripe :header-cell-style="{background:'#f2f2f2'}">
        <el-table-column label="ID" align="center" width="70" prop="id"/>
        <el-table-column label="订单号" align="center" prop="orderNo" width="140"/>
        <el-table-column label="订单产品名称" align="center" prop="production" width="120"/>
        <el-table-column label="订单状态" align="center"  width="160px" prop="orderStatus">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.orderStatus == 1">已支付</el-tag>
            <el-tag type="danger" v-else>未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" />
        <el-table-column label="订阅开始时间" align="center" prop="startTime" width="180" :formatter="dateFormatter" />
        <el-table-column label="订阅结束时间" align="center" prop="endTime" width="180" :formatter="dateFormatter" />
      </el-table>
    </div>
      <!-- 分页 -->
      <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/formatTime'
defineOptions({ name: 'Details' })

// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const initFields = () => {
  return {	
    userId: undefined,
    pageNo: 1,
    pageSize: 10,
    production: '',
    orderStatus: '',
    createTime: [],
    startTime: [],
    endTime: []
  }
}
const queryParams = ref(initFields())
const queryFormRef = ref()
const DICT_PRODUCTIONS = ref([
  {value: '小学识字板', code: 0},
  {value: '普粤通', code: 1},
])
const DICT_ORDER_STATUS = ref([
  {value: '未支付', code: 0},
  {value: '已完成', code: 1},
])
const list = ref<any>([])
const total = ref(0)
const tableLoading = ref(false)

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  dialogTitle.value = "订单详情"
  queryParams.value = {...queryParams.value, userId: id as any} 
  await getList()
}

/** 获取订单详情列表 **/ 
const getList = async() => {
  tableLoading.value = true
  try {
    // await getList() // UNDO
    list.value = [
      { id: 1, orderNo: 'A1231', production: '小学识字板', orderStatus: 1},
      { id: 2, orderNo: 'B1232', production: '普粤通', orderStatus: 0},
      { id: 3, orderNo: 'A1233', production: '小学识字板', orderStatus: 1},
      { id: 4, orderNo: 'B1234', production: '普粤通', orderStatus: 0},
      { id: 5, orderNo: 'A1235', production: '小学识字板', orderStatus: 1},
      { id: 6, orderNo: 'B1236', production: '普粤通', orderStatus: 0},
      { id: 7, orderNo: 'A1237', production: '小学识字板', orderStatus: 1},
      { id: 8, orderNo: 'B1238', production: '普粤通', orderStatus: 0},
      { id: 9, orderNo: 'A1239', production: '小学识字板', orderStatus: 1},
      { id: 10, orderNo: 'B123-', production: '普粤通', orderStatus: 0},
    ]
    total.value = 10
  } finally {
    tableLoading.value = false
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
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>

<style lang="scss" scoped>
  :deep(.el-form-item--default) {
    margin-bottom: 10px;
  }
  :deep(.el-table__inner-wrapper:before) {
    background-color: transparent !important;
  }
  :deep(.el-form-item__label) {
    color: #909399;
    justify-content: flex-end;
  }
  .content {
    color: #606266;
  }
</style>
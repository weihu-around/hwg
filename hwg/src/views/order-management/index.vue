<template>
  <div class="padding-20px">
    <el-card style="margin-bottom: 15px;">
      <el-form ref="queryFormRef" :model="queryParams" label-width="120px" :inline="true">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" class="!w-240px" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="queryParams.account" placeholder="请输入账号" clearable @keyup.enter="handleQuery" class="!w-240px" />
        </el-form-item>
        <el-form-item label="订阅产品名称" prop="production">
          <el-select v-model="queryParams.production" placeholder="请选择订阅产品" clearable class="!w-240px" >
            <el-option v-for="dict in DICT_PRODUCTIONS" :key="dict.code" :label="dict.value" :value="dict.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="订阅类型" prop="productionType">
          <el-select v-model="queryParams.productionType" placeholder="请选择订阅类型" clearable class="!w-240px" >
            <el-option v-for="dict in DICT_PRODUCTION_TYPES" :key="dict.code" :label="dict.value" :value="dict.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="queryParams.productionType" placeholder="请选择支付类型" clearable class="!w-240px" >
            <el-option v-for="dict in DICT_PAY_TYPES" :key="dict.code" :label="dict.value" :value="dict.code" />
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
    </el-card>
    <el-card>
      <el-table v-loading="loading" :data="list" max-height="470px">
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="订单号" align="center" prop="orderNo"/>
        <el-table-column label="账号" align="center" prop="account" width="120px" show-overflow-tooltip/>
        <el-table-column label="订阅产品名称" align="center" prop="production" width="140px"/>
        <el-table-column label="订单支付金额" align="center" prop="amount"  width="120px" />
        <el-table-column label="货币单位" align="center" prop="unit" width="100"/>
        <el-table-column label="订阅类型" align="center" prop="productionType">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.productionType == 0">未订阅</el-tag>
            <el-tag type="primary" v-else-if="scope.row.productionType==1">订阅中</el-tag>
            <el-tag type="danger" v-else-if="scope.row.productionType==2">已过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" />
        <el-table-column label="订阅开始时间" align="center" prop="startTime" width="180" :formatter="dateFormatter" />
        <el-table-column label="订阅结束时间" align="center" prop="endTime" width="180" :formatter="dateFormatter" />
        <el-table-column label="支付类型" align="center" prop="payType" width="140" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.payType == 0">appstore</span>
            <span v-else>Googleplay</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="orderStatus">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.orderStatus==1">已完成</el-tag>
            <el-tag type="danger" v-else-if="scope.row.orderStatus==0">未支付</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" min-width="110" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row.id)"> 修改 </el-button>
            <el-button link type="primary" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column> -->
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
 
 
</template>

<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/formatTime'

defineOptions({ name: 'OrderManagement' })

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any>([]) // 列表数据

const DICT_PRODUCTIONS = ref([
  {value: '小学识字板', code: 0},
  {value: '普粤通', code: 1},
])
const DICT_PRODUCTION_TYPES = ref([
  {value: '未订阅', code: 0},
  {value: '订阅中', code: 1},
  {value: '已过期', code: 2}
])
const DICT_PAY_TYPES = ref([
  {value: 'appstore', code: 0},
  {value: 'Googleplay', code: 1}
])
const DICT_ORDER_STATUS = ref([
  {value: '未支付', code: 0},
  {value: '已完成', code: 1},
])
const initFields = () => {
  return {	
    pageNo: 1,
    pageSize: 10,
    orderNo: '',
    account: '',
    production: '',
    productionType: '',
    payType: '',
    orderStatus: '',
    startTime: '',
    endTime: '',
    createTime: ''
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
      {id: 1, orderNo: 'A123', production: '普粤通', unit: '￥', productionType: 0, orderStatus: 0},
      {id: 2, orderNo: 'B123', production: '普粤通', unit: '$',  productionType: 1, orderStatus: 1},
      {id: 3, orderNo: 'C123', production: '小学识字板', unit: '$', productionType: 2, orderStatus: 1},
    ]
    total.value = 3
  } finally {
    setTimeout(()=>{
      loading.value = false
    }, 1000)
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
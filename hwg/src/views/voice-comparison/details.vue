<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="78px"
    >
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="姓名 :" prop="">
            <div class="content line-clamp-1" :title="formData?.name">{{ formData?.name }}</div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="联系方式 :" prop="">
            <div class="content">{{formData?.mobile}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="姓名 :" prop="">
            <div class="content line-clamp-2" :title="formData?.name">{{ formData?.name }}</div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="联系方式 :" prop="">
            <div class="content">{{formData?.mobile}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="姓名 :" prop="">
            <div class="content line-clamp-2" :title="formData?.name">{{ formData?.name }}</div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="联系方式 :" prop="">
            <div class="content">{{formData?.mobile}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="姓名 :" prop="">
            <div class="content line-clamp-2" :title="formData?.name">{{ formData?.name }}</div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="联系方式 :" prop="">
            <div class="content">{{formData?.mobile}}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
// import { dateFormatter, formatDate } from '@/utils/formatTime'
// import { DistributorApi } from '@/api/home/distributor'
// import { yuanToWYUnit } from '@/utils/unitSwitch'

defineOptions({ name: 'Details' })

// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

// const { t } = useI18n() // 国际化
// const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formData = ref()
const initFields = () => {
  return {	
    // pageNo: 1,
    // pageSize: 10,
    // agentId: undefined,
    // payDate: undefined
  }
}
// const promotionParams = ref(initFields())

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  dialogTitle.value = "详情"
  formData.value = {
    name: 'sdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdfsdfasdf',
    mobile: '13022220000'
  }
  try {
    // await getPromotionList()
  } finally {

  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>

<style lang="scss" scoped>
  // .form-item-wrapper {
  //   border: dotted 1px #DCDFD6; 
  //   margin-bottom: 16px;
  //   border-radius: 10px;
  // }
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
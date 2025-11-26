<template>
  <div class="padding-20px">
    <el-card class="probationary-days-block">
      <h3 class="title">配置可试用天数</h3>
      <el-form ref="formRef" :model="formData" :rules="formType == 'edit' ? formRules : {}" label-width="200px" v-loading="formLoading" >
        <el-form-item label="《普粤通》可试用天数 :" prop="pytDays">
          <div class="flex items-center"  v-if="formType == 'edit'">
            <el-input v-model="formData.pytDays" placeholder="请输入可试用天数" type="number" class="!w-240px"/>
            <span class="ml-10px">天</span>
          </div>
          <span v-else>{{ formData.pytDays }} 天 </span>
        </el-form-item>
        <el-form-item label="《小学识字板》可试用天数 :" prop="szbDays">
          <div class="flex items-center"  v-if="formType == 'edit'">
            <el-input v-model="formData.szbDays" placeholder="请输入可试用天数" type="number" class="!w-240px"/>
            <span class="ml-10px">天</span>
          </div>
          <span v-else>{{ formData.szbDays }} 天 </span>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <template v-if="formType == 'view'">
          <el-button @click="formType = 'edit'" type="primary" >修 改</el-button>
        </template>
        <template v-else>
          <el-button @click="formType = 'view'" :disabled="formLoading">取 消</el-button>
          <el-button @click="saveForm" type="primary" :disabled="formLoading">保 存</el-button>
        </template>
      </div>
    </el-card> 
  </div>
  
</template>

<script setup lang="ts">
import { FormRules } from 'element-plus'

const formRules = reactive<FormRules>({
  pytDays: [{ required: true, message: '请填写天数', trigger: 'blur' }],
  szbDays: [{ required: true, message: '请填写天数', trigger: 'blur' }],
})
const initFields = ()=>{
  return {
    pytDays: '',
    szbDays: ''
  }
}
const formData = ref(initFields())
const formType = ref('view')
const formLoading = ref(false)
/** 保存 **/  
const saveForm = async ()=>{
  formLoading.value = true
  try {
    // await 保存接口 UNDO
    console.log('保存更改')
  } finally {
    formLoading.value = false
    formType.value = 'view'
  }
}

/** 获取试用天数信息 **/
const getInfo = async()=>{
  formLoading.value = true
  // await getInfo接口 UNDO
  let res = {pytDays: '7',  szbDays: '20'}
  formData.value = res
  setTimeout(()=>{
    formLoading.value = false
  }, 1200)
} 

/** 初始化 **/
onMounted(async () => {
  await getInfo()
})
</script>

<style lang="scss" scoped>
.probationary-days-block {
  width: 650px;
  padding-bottom: 20px;
  .title {
    margin-bottom: 37px;
  }
  
  .footer-btn {
    margin-top: 20px;
    float: right;
  }
}

</style>
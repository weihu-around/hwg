<template>
  <el-form ref="formRef" :model="pswForm" :rules="rules" :label-width="120">
    <el-form-item label="旧密码" prop="oldPassword">
      <InputPassword v-model="pswForm.oldPassword" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <InputPassword v-model="pswForm.newPassword" strength />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <InputPassword v-model="pswForm.confirmPassword" strength />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit(formRef)">保存</el-button>
      <el-button @click="reset(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { InputPassword } from '@/components/InputPassword'
// import { updateUserPassword } from '@/api/system/user/profile'

defineOptions({ name: 'ResetPwd' })

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const formRef = ref<FormInstance>()
const pswForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单校验
const equalToPassword = (_rule, value, callback) => {
  if (pswForm.confirmPassword && pswForm.confirmPassword !== value) {
    callback(new Error('两次输入密码不一致'))
  } else if (pswForm.newPassword && pswForm.newPassword !== value) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
    { required: true, message: '密码格式8-16位，包含字母、数字或符号中任意两种',pattern: /^(?![A-Za-z]+$)(?!\d+$)(?![^\da-zA-Z]+$)[A-Za-z\d\W]{8,16}$/, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
    { required: true, message: '密码格式8-16位，包含字母、数字或符号中任意两种',pattern: /^(?![A-Za-z]+$)(?!\d+$)(?![^\da-zA-Z]+$)[A-Za-z\d\W]{8,16}$/, trigger: 'blur' }
  ]
})

const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      // await updateUserPassword(pswForm.oldPassword, pswForm.newPassword) UNDO 等待接口
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
      emit('success')
    }
  })
}

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

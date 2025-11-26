<template>
  <div class="page-login">
    <div class="page-left flex-1 flex items-center justify-center">
      <div style="margin-top: -60px;">
        <img key="1" alt="" class="w-350px" src="@/assets/login-box-bg.svg" />
        <div key="2" class="text-3xl text-white">欢迎使用弘文馆后台管理系统</div>
      </div>
    </div>
    <div class="page-right flex-1 flex items-center justify-center">
      <el-form
          ref="loginFormRef"
          :model="loginData.loginForm"
          :rules="LoginRules"
          class="login-form"
          label-position="top"
          label-width="120px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="title">登录</div>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="padding-right: 30px; padding-left: 30px">
              <el-form-item prop="username">
                <el-input
                  v-model="loginData.loginForm.username"
                  placeholder="请输入账号"
                  autocomplete="new-password"
                  :prefix-icon="UserFilled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" style="padding-right: 30px; padding-left: 30px">
              <el-form-item prop="password">
                <el-input
                  v-model="loginData.loginForm.password"
                  placeholder="请输入密码"
                  show-password
                  type="password"
                  :prefix-icon="Lock"
                  @keyup.enter="handleLogin()"
                  autocomplete="new-password"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24" style="padding-right: 10px; padding-left: 10px; margin-bottom: -20px">
              <el-form-item>
                <el-row justify="space-between" style="width: 100%">
                  <el-col :span="6">
                    <el-checkbox v-model="loginData.loginForm.rememberMe">
                      {{ t('login.remember') }}
                    </el-checkbox>
                  </el-col>
                  <el-col :offset="6" :span="12">
                    <el-link
                      style="float: right"
                      type="primary"
                      @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
                    >
                      {{ t('login.forgetPassword') }}
                    </el-link>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col> -->
            <el-col :span="24" style="padding-right: 30px; padding-left: 30px">
              <el-button type="primary" :loading="loginLoading" @click="handleLogin" class="login-btn">登录</el-button>
            </el-col>
          </el-row>
        </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UserFilled, Lock } from '@element-plus/icons-vue'
  import * as authUtil from '@/utils/auth'
  import { ElLoading, ElMessage } from 'element-plus'
  import { login } from '@/api/login/index'


  const { push } = useRouter()
  const loginFormRef = ref()
  const loginLoading = ref(false) // 登录按钮loading
  const loading = ref() // 登录页面loading
  const loginData = reactive({
    // token: '',
    loginForm: {
      username: "",
      password:""
    }
  })
  const LoginRules = reactive({
    username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  })

  // 登录之前做设备限制，不让手机设备 & 微信浏览器登录
  const deviceAllow = async()=>{
    const isWeixinBrowser = /micromessenger/i.test(navigator.userAgent) // 当前浏览器是微信浏览器
    const isAndroid = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); //判断是否为安卓手机
    if (isWeixinBrowser || isAndroid) {
      ElMessage.warning('请在电脑使用浏览器访问!')
      return false
    } 
    return true
  }
  /** 登录 **/ 
  const handleLogin = async()=>{
    await loginFormRef.value.validate()

    const isAllow:boolean = await deviceAllow()
    if(!isAllow) return // 非web浏览器设备不让登录

    loginLoading.value = true
    try {
      // UNDO 等待接口
      // await login(loginData.loginForm).then(res => {
      //   authUtil.setToken(res.data.token)
      // })
      authUtil.setToken('IamAccessToken')
      loading.value = ElLoading.service({
        lock: true,
        text: '正在加载系统中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await push({ path: '/'})
    } finally {
      loginLoading.value = false
      loading.value.close()
    }
  }
</script>

<style lang="scss" scoped>
  .page-login {
    width: 100%;
    height: 100%;
    display: flex;
    .page-left {
      background-color: #283149;
      color: rgb(255,255,255);
    }
    .page-right {
      padding: 30px;
      .login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: solid 1px #EAEAEA;
        box-shadow: 0 0 6px #EAEAEA;
        max-width: 500px;
        padding: 30px 20px 45px;
        border-radius: 8px;
        :deep(.el-form-item) {
          margin-bottom: 30px;
        }
        :deep(.el-input__inner) {
          height: 38px;
        }
        .title {
          font-size: 30px;
          font-weight: bold;
          line-height: 45px;
          text-align: center;
          width: 100%;
          letter-spacing: .5rem;
        }
        .login-btn {
          width:100%;
          height: 45px;
          font-size: 20px;
          letter-spacing: .8rem;
        }
      }
    }
  }

  @media (max-width: 1000px) {
    .page-left {
      display: none;
    }
  }
</style>
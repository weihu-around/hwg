<template>
  <div class="page-personal">
    <div class="account-block block">
      <img src="@/assets/imgs/ProfileUser/avatar.png" alt=""/>
      <div>
        <div class="name">{{ userInfo?.username }}</div>
        <div class="time">创建时间：{{ formatDate(userInfo.createTime) }}</div>
      </div>
    </div>
    <div class="info-block block">
      <div class="head">
        <img src="@/assets/imgs/ProfileUser/account.png" alt=""/>
        <span>账号基本信息</span>
      </div>
      <div class="info-details">
        <div class="info-item line">
          <div class="flex-x-center">
            <img src="@/assets/imgs/ProfileUser/phone.png" alt=""/>
            <span>绑定手机</span>
          </div>
          <div class="flex-x-center">
            <span>{{ userInfo?.mobile }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="flex-x-center">
            <img src="@/assets/imgs/ProfileUser/email.png" alt=""/>
            <span>绑定邮箱</span>
          </div>
          <div class="flex-x-center">
            <span>{{ userInfo?.email }}</span>
          </div>
        </div>
        <div class="info-item">
          <div class="flex-x-center">
            <img src="@/assets/imgs/ProfileUser/psd.png" alt=""/>
            <span>登录密码</span>
          </div>
          <div class="flex-x-center">
            <el-button class="btn" @click="openUpdatePsdForm">修改</el-button>
          </div>
        </div>
      </div>
    </div>
    <Dialog title="修改密码" v-model="dialogVisible" :showClose="true">
      <ResetPwd @success="saveUpdate"/>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'


// import { getUserProfile, ProfileVO } from '@/api/system/user/profile'
import ResetPwd from './ResetPwd.vue'

defineOptions({ name: 'ProfileUser' })

const userStore = useUserStore()
const { replace } = useRouter()

const userInfo = ref({} as any)
const dialogVisible = ref(false) // 弹窗的是否展示
const getUserInfo = async () => {
  // const users = await getUserProfile() UNDO 等待接口
  const users = { username: 'admin'}
  userInfo.value = users
}

// 打开修改密码弹窗
const openUpdatePsdForm = ()=>{
  dialogVisible.value = true
}

// 修改密码成功,提示重登
const saveUpdate = async() => {
  dialogVisible.value = false
  try {
    await ElMessageBox.confirm('密码已修改，请重新登录', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showCancelButton:false
    })
    await userStore.loginOut()
    replace('/login?redirect=/index')
  } catch {}
}

onMounted(async () => {
  await getUserInfo()
})
</script>

<style lang="scss" scoped>
.page-personal {
  padding: 122px 30px 0 30px;
  height: 200px;
  width: 100%;
  background-image: url('@/assets/imgs/ProfileUser/banner.png');
  background-size: 100% 200px;
  .block {
    min-width: 650px;
    // width: 100%;
    background-color: #FFFFFF;
    border-radius: 10px;
    &.account-block {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding: 48px 32px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 16px;
      }
      .name {
        font-size: 16px;
        color: #333333;
        line-height: 24px;
        margin-bottom: 8px;
        font-weight: bold;
      }
      .time {
        font-size: 14px;
        color: #999999;
        line-height: 20px;
      }
    }
    &.info-block {
      color: #333333;
      font-size: 14px;
      .head {
        display: flex;
        margin: 0 16px;
        align-items: center;
        height: 54px;
        font-size: 16px;
        border-bottom: solid 1px #DBDBDB;
        img {
          width: 24px;
          height: 24px;
          margin-right: 16px;
        }
      }
      .info-details {
        display: flex;
        flex-wrap: wrap;
        padding: 20px 0;
        .info-item {
          width: calc(50% - 1px);
          padding: 5px 30px;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &.line {
            border-right: solid 1px #DBDBDB;
          }
          .flex-x-center {
            display: flex;
            align-items: center;
          }
          img {
            width: 48px;
            height: 48px;
            margin-right: 20px;
          }
          .btn {
            background-color: #FF5710;
            color: #FFFFFF;
            padding: 4px 30px;
            margin-left: 16px;
            border: none;
          }
        }
      }
    }
  }
  
}
</style>

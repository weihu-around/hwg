<template>
  <div class="common-layout" >
      <!-- 页面头部 -->
      <el-header height="80px">
        <div class="head-left">
          <span class="sys-title">弘文馆APP后台管理系统</span>
          <div class="menu-collapse-icon" @click="isMenuCollapse = !isMenuCollapse">
            <el-icon v-if="isMenuCollapse"><Expand /></el-icon>
            <el-icon v-else><Fold /></el-icon>
          </div>
          <el-breadcrumb separator="/" class="head-tool">
            <el-breadcrumb-item :to="{ path: '/' }">
              <div class="flex items-center">
                <el-icon><component is="house"></component></el-icon>
                <span class="ml-5px">首页</span>
              </div>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <div class="flex items-center">
                <el-icon><component :is="breadCrumbObj.meta?.icon"></component></el-icon>
                <span class="ml-5px">{{ breadCrumbObj.meta?.title }}</span>
              </div>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="user-box">
          <span>你好，{{ userInfo.username }}</span>
          <el-dropdown trigger="click">
            <div class="el-dropdown-link flex items-center">
              <div class="avatar">
                <img src="@/assets/imgs/myavatar.jpg" alt="" />
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="User" @click="toUserCenter" >个人中心</el-dropdown-item>
                <el-dropdown-item :icon="SwitchButton" @click="loginOut" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <!-- 左边菜单 -->
        <el-aside> <Sidebar :isMenuCollapse="isMenuCollapse" class="sidebar-container"/> </el-aside>
        <el-container >
          <!-- 主内容 -->
           <!-- tags 菜单 -->
          <TagView :height="35"/>
           <!-- el-main内容超出显示滚动条 -->
          <el-main style="height:0;flex-grow:1;padding: 0;" v-loading="pageLoading"> <RouterView/> </el-main> 
          <!-- 底部 -->
          <el-footer> <span>Copyright ©2025 弘文馆</span> </el-footer>
        </el-container>
      </el-container>
  </div>
</template>

<script lang="ts" setup>
  import Sidebar from "@/views/Layout/components/sidebar/index.vue";
  import { RouterView, useRoute } from 'vue-router'
  import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
  import { SwitchButton, User } from '@element-plus/icons-vue'
  import { useAppStore } from "@/store/modules/app";
  import { useUserStore } from "@/store/modules/user";
  import { ElMessageBox } from 'element-plus'
  import { router } from '@/router';  

  const { wsCache } = useCache()
  const userInfo = wsCache.get(CACHE_KEY.USER)
  const pageLoading = computed(() => useAppStore().getPageLoading) // 路由跳转时的页面loading
  const isMenuCollapse = ref(false)
  const $route = useRoute()
  const breadCrumbObj = ref()

  watch(
    $route,
    (newValue) => {
      getBreadcrumb(newValue)
    },
    { immediate: true }
  )

  // 登出
  const loginOut = async()=>{
    ElMessageBox.confirm('是否确认退出登录？', '提示', {
      type: 'warning'
    }).then(async () => {
      await useUserStore().loginOut()
    }).catch(() => {
      
    })
  }

  // 前往个人中心页
  const toUserCenter = async()=> {
    router.push('/personal-center/index')
  }
  
  // 面包屑
  function getBreadcrumb(val) {
    breadCrumbObj.value = val
  }

  onMounted(()=>{
    window.addEventListener('resize', ()=>isMenuCollapse.value = window.innerWidth < 1000)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', ()=>isMenuCollapse.value = window.innerWidth < 1000)
  })
</script>

<style lang="scss" scoped>
  .common-layout {
    width: 100%;
    height: 100%;
    :deep(.el-header) {
      padding: 0;
      min-width: 650px;
      border-bottom: solid 1px #EAEAEA;
      text-align: center;
      line-height: 85px;
      font-size: 30px;
    }
    :deep(.el-aside) {
      background-color: var(--left-menu-bg-color);
      height: calc(100vh - 85px);
      overflow: hidden;
      width: auto !important;
    }
    :deep(.el-container) {
      background-color: var(--app-content-bg-color);
    }
    :deep(.el-header) {
      background-color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      .head-left {
        display: flex;
        align-items: center;
        .sys-title {
          padding: 0 10px;
          font-size: 26px;
          font-family: FangZhengXinZongYiJianTi-1;
        }
        .menu-collapse-icon {
          cursor: pointer;
          margin-left: 10px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
        }
      }
      .user-box {
        margin: 0 10px;
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #C0C4CC;
          margin-left: 10px;
          overflow: hidden;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        span {
          color: #606266;
          font-size: 16px;
          font-weight: 400;
        }
        span:focus-visible {
          outline: none !important;
        }
      }
    }
    :deep(.el-footer) {
      height: var(--app-footer-height);
      span {
        line-height: var(--app-footer-height);
        color: #a8abb2;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        width: 100%;
      }
    }
    .sidebar-container {
      height: 100%;
      transition: width 0.28s;
    }
  }

  @media (max-width: 850px) {
    .head-tool {
      display: none;
    }
  }
</style>
<template>
  <el-scrollbar>
    <el-menu
      backgroundColor="var(--left-menu-bg-color)"
      textColor="var(--left-menu-text-color)"
      activeTextColor="var(--left-menu-text-active-color)"
      :router="true"
      :collapse="isMenuCollapse"
      :default-active="activeMenu">
      <template v-for="item in menuRoutes" >

        <template v-if="item.children && !item.meta?.hidden">
          <el-sub-menu :index="item.path" :key="item.path"  >
            <template #title>
              <el-icon><component :is="item.meta?.icon"></component></el-icon>
              <span>{{ item.meta?.title }}</span>
            </template>
            <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.path" class="sub-menu-deep" >
              <el-icon><component :is="subItem.meta?.icon"></component></el-icon>
              <router-link style="width: 100%;" :to="subItem.path">{{ subItem.meta?.title }}</router-link>
            </el-menu-item>
          </el-sub-menu>
        </template>

        <template v-else-if="item.children && item.meta?.hidden">
          <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.path" class="sub-menu-deep">
            <el-icon><component :is="subItem.meta?.icon"></component></el-icon>
            <router-link style="width: 100%;" :to="subItem.path"> {{ subItem.meta?.title }}</router-link>
          </el-menu-item>
        </template>

        <template v-else-if="!item.children">
          <el-menu-item :index="item.path" :key="item.path">
            <el-icon><component :is="item.meta?.icon"></component></el-icon>
            <router-link style="width: 100%;" :to="item.path">{{ item.meta?.title }}</router-link>
          </el-menu-item>
        </template>

      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { useRoute, RouteRecordRaw } from 'vue-router';

defineComponent({
  name: 'Sidebar',
});
defineProps({
  // 是否折叠菜单
  isMenuCollapse: {
    type: Boolean
  },
})
const menuRoutes = computed<Array<RouteRecordRaw>>(()=> useUserStore().menuRoutes) 
const route = useRoute()
const activeMenu = computed(() => route.path)

onMounted(()=> {});


</script>

<style lang="scss" scoped>
:deep(.el-menu) {
  border-right: none;
  // 菜单折叠时，隐藏菜单文本，只展示图标
  &.el-menu--collapse {
    a {
      opacity: 0 !important;
    }
  }
  .el-menu-item {
    width: 220px;
    &.is-active {
      background-color: var(--left-menu-bg-active-color) !important;
    }
    > a {
      text-decoration: none;
      color: #FFFFFF !important;
    }
  }
}
</style>
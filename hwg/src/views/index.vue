<template>
  <div>
    <h1>这是主页！</h1>
    <el-button @click="to">前往</el-button>
    <el-button @click="getArticleList">获取</el-button>
  </div>
  <el-button @click="get">测试pinia</el-button>
</template>


<script setup lang="ts">
import { getArticleApi } from '@/api/test/test'
import { HotArticleQuery, HotArticleVo } from '@/api/test/types'
import { Page } from '@/api/page'
import { router } from '@/router';
import { reactive, ref } from 'vue';

import { useUserStore } from '@/store/modules/user'

const query = reactive<HotArticleQuery>({
  pageIndex: 1,
  pageSize: 10,
  searchKey: ''
})

const articleData = ref<Page<HotArticleVo>>();

function getArticleList() {
  getArticleApi(query).then(res => {
    articleData.value = res.data
    console.log(articleData.value.records)
    console.log(articleData.value.total)
  })
}

function to() {
  router.push('/about')
}

function get() {
  const store = useUserStore()
  console.log(store)
  // 或者
  const { uid, exp} = useUserStore()
  console.log(uid)
  console.log(exp)
  // 修改
  store.exp = 200
  // 重置
  store.$reset()
  console.log(store)

 // 测试调用getters
  console.log(store.addExp)
  console.log(store.addExpCustom(180))

  // 测试调用actions
  store.showParam('test')
}

</script>

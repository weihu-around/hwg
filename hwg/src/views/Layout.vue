<template>
  <div class="common-layout" >
    <el-container>
      <el-header height="200px">Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>
            main
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
  .common-layout {
    width: 100%;
    height: 100%;

  }
</style>
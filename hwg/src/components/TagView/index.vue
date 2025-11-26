<template>
  <div :style=boxStyle class="component-wrapper">
    <div class="tags-tool left" @click="moveTo(-200)"> <el-icon><DArrowLeft /></el-icon> </div>
    <ElScrollbar  class="scrollbar-wrapper" ref="scrollbarRef" @scroll="scroll">
      <div class="tags-box">
        <el-tag v-for="tag in tags" :key="tag.name" :class="['tag-item', {'active': tag.name === activeName}]" closable @close="closeTag(tag)" @click="clickTag(tag)">
          <div class="flex items-center">
            <el-icon><component :is="tag.icon"></component></el-icon>
            <span class="ml-5px">{{ tag.name }}</span>
          </div>
        </el-tag>
      </div>
    </ElScrollbar>
    <div class="tags-tool right" @click="moveTo(200)"> <el-icon><DArrowRight /></el-icon> </div>
  </div>
</template>

<script lang="ts" setup>
import { isNumber } from '@/utils/is'
import { useRoute, useRouter, RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { ElScrollbar as ElScrollbarType } from 'element-plus/es/components/scrollbar/index'

defineOptions({ name: 'TagView' })

const props = defineProps({
  height: {
    type: Number || String,
    default: 45
  }
})

interface Tag {
  name: string
  path: string
  icon: string
}
interface ScrollToParams {
  el: HTMLElement
  to: number
  position: string
  duration?: number
  callback?: () => void
}

const boxHeight = ref(isNumber(props.height) ? `${props.height}px` : props.height)
const boxStyle = computed(()=>{
  return {
    height: unref(boxHeight)
  }
})
const scrollbarRef = ref<InstanceType<typeof ElScrollbarType> | null>(null)
const tags = ref<Tag[]>([]) // tag菜单集合
const activeName = ref('') // 当前点击菜单tag的路由名
const $route = useRoute()
const $router = useRouter()

// 保存滚动位置
const scrollLeftNumber = ref(0)

interface ScrollBarParamsVO {
   scrollLeft: number, 
   scrollTop: number 
}
const scroll = ({ scrollLeft }:ScrollBarParamsVO) => {
  scrollLeftNumber.value = scrollLeft as number
}

onBeforeMount(() => {
  addTag($route)
})

watch(
  $route,
  (newValue) => {
    addTag(newValue)
    moveToCurrentTag(newValue)
  },
  // { immediate: true }
)

// 动画: 每次的移动值
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

/** 解决 el[position]会报'类型为 "string" 的表达式不能用于索引类型 "HTMLElement"'的问题**/ 
interface HTMLElement {
    [key: string]: any; // 或者更具体的类型，如 HTMLElement | null
}
// 动画：执行移动
const move = (el: HTMLElement, position: string, amount: number) => {
  el[position] = amount
}

// 缓慢动画滚动事件
const useScrollTo = ({
  el,
  position = 'scrollLeft',
  to,
  duration = 500,
  callback
}: ScrollToParams) => {
  const isActiveRef = ref(false)
  const start = el[position]
  const change = to - start
  const increment = 20 // 动画间隔 20 毫秒
  let currentTime = 0

  function animateScroll() {
    if (!unref(isActiveRef)) {
      return
    }
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    move(el, position, val)
    if (currentTime < duration && unref(isActiveRef)) {
      requestAnimationFrame(animateScroll)
    } else {
      if (callback) {
        callback()
      }
    }
  }

  function run() {
    isActiveRef.value = true
    animateScroll()
  }

  function stop() {
    isActiveRef.value = false
  }

  return { start: run, stop }
}

//  移动tag位置 到最左边/最右边
const moveTo = (to:number) => {
  const wrap$ = scrollbarRef.value?.wrapRef // 定位元素
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}
// 监听路由变化，移动到当前选中的tag
const moveToCurrentTag = async(v: RouteLocationNormalizedLoaded) => {
  await nextTick()
  moveToTarget(v)
}

// 移动到当前选中的tag
function moveToTarget (currentTag: RouteLocationNormalizedLoaded){
  const wrap$ = unref(scrollbarRef)?.wrapRef
  // let firstTag: Nullable<RouterLinkProps> = null
  // let lastTag: Nullable<RouterLinkProps> = null
  let firstTag = null
  let lastTag = null

  const tagList = unref(tags)

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if (firstTag?.path === currentTag.fullPath) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if (lastTag?.path === currentTag.fullPath) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      // to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      to: wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      // (item) => (item?.to as RouteLocationNormalizedLoaded)?.path === currentTag.fullPath
      (item) => item.path === currentTag.fullPath
    )
    // const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)
    const tgsRefs = document.getElementsByClassName('tag-item')

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag ? (nextTag.offsetLeft + nextTag.offsetWidth + 4) : 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag ? (prevTag.offsetLeft - 4) : -4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 路由变化，则添加tag
function addTag(data: any) {
  const findData = tags.value.find((item) => item.name === data.meta.title)
  if (!findData) {
    tags.value.push({ name: data.meta.title, path: data.path, icon: data.meta.icon })
  }
  activeName.value = data.meta.title
}
//  关闭tag菜单
const closeTag = (tag: Tag) => {
  if (tags.value.length === 1) return
 
  const index = tags.value.findIndex((item) => item.name === tag.name)
  tags.value.splice(index, 1)
 
  const lastTag = tags.value[tags.value.length - 1]
  activeName.value = lastTag.name
  $router.push(lastTag.path)
}
//  点集tag菜单，跳转对应路由
const clickTag = (tag: Tag) => {
  $router.push(tag.path)
}
</script>

<style lang="scss" scoped>

.component-wrapper {
  // width: 300px;
  background-color: #FFFFFF;
  box-shadow: 0 5px 10px #EAEAEA;
  display: flex;
  .tags-tool {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a8abb2;
    &.left {
      border-right: solid 1px #dcdfe6;
    }
    &.right {
      border-left: solid 1px #dcdfe6;
    }
  } 
  .scrollbar-wrapper {
    flex: 1;
    overflow: hidden;
    height: 100%;
    :deep(.el-scrollbar__view) {
      height: 100%;
    }
    .tags-box {
      // flex: 1;
      // overflow: hidden;
      display: flex;
      flex-wrap: nowrap;
      position: relative;
      cursor: pointer;
      height: inherit;
      .tag-item {
        color: #606266;
        position: relative;
        top: 4px;
        cursor: pointer;
        height: calc(100% - 8px);
        background-color: #FFFFFF;
        margin-left: 4px;
        font-size: 12px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        box-sizing: border-box;
        .el-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
        }
        &.active {
          background-color: #409EFF;
          color: #fff;
          border: none;
        }
      }
    }
  }
  
}
</style>
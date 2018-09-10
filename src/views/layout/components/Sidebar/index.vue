<template>
  <scroll-bar>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { constantRouterMap } from '@/router'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  props: {
    sidebar: {
      type: Object,
      required: true
    }
  },
  components: { SidebarItem, ScrollBar },
  data () {
    return {
      routes: constantRouterMap
    }
  },
  computed: {
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>

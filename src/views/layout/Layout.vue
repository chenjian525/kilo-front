<template>
<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
<sidebar class="sidebar-container" :sidebar="sidebar"></sidebar>
  <div class="main-container">
    <navbar :sidebar="sidebar"></navbar>
    <!-- <tags-view></tags-view> -->
    <app-main></app-main>
  </div>
</div>
</template>

<script>
import {bus} from '@/bus.js'
import { Navbar, Sidebar, AppMain } from './components'

export default {
  name: 'layout',
  created () {
    bus.$on('toggleSidebar', () => {
      this.sidebar.opened = !this.sidebar.opened
    })

    bus.$on('goto', (url) => {
      if (url === '/login') {
        localStorage.removeItem('jwt')
      }
      this.$router.push(url)
    })
  },
  data () {
    return {
      sidebar: {
        opened: true
      }
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>

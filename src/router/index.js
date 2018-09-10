import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)

const _import = (file) => require('@/views/' + file + '.vue').default

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '',
    component: Layout,
    redirect: 'source',
    alwaysShow: true,
    meta: { title: '配置管理', icon: 'settings' },
    children: [
      { path: 'source', component: _import('db/index'), name: 'source', meta: { title: '数据库' } },
      { path: 'schedule', component: _import('db/schedule/index'), name: 'schedule', hidden: true },
      { path: 'table', component: _import('db/table/index'), name: 'table', hidden: true }
    ]
  },
  {
    path: '/schedule-log',
    component: Layout,
    redirect: '/schedule-log/index',
    alaysShow: true,
    name: 'schedule_log',
    children: [
      { path: 'index', component: _import('schedule/index'), name: 'scheduleIndex', meta: { title: '任务日志', 'icon': 'documentation' } }
    ]
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

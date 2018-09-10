<template>
<div class="app-container">
  <el-row>
    <el-col><h3>任务日志: </h3></el-col>
  </el-row>
<el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="库编号" >
        <template slot-scope="scope">
          <span class="link-type" @click="goToSchedules(scope.row.resource_id)">{{scope.row.resource_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划编号">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据">
        <template slot-scope="scope">
          <span>{{scope.row.data}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="查询时间">
        <template slot-scope="scope">
          <span>{{scope.row.date_joined}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
</div>
</template>

<script>
// import { getScheduleLogData } from '@/api/db'

const scheduleLogData = {
  items: [
    {resource_id: 1, schedule_id: 5, data: { 'a': 1, 'b': 2, 'c': 3 }, date_joined: '2018-04-05 14:25:36'},
    {resource_id: 2, schedule_id: 2, data: { 'a': 1, 'b': 2, 'c': 3 }, date_joined: '2018-04-05 14:25:36'},
    {resource_id: 3, schedule_id: 6, data: { 'a': 1, 'b': 2, 'c': 3 }, date_joined: '2018-04-05 14:25:36'},
    {resource_id: 4, schedule_id: 7, data: { 'a': 1, 'b': 2, 'c': 3 }, date_joined: '2018-04-05 14:25:36'},
    {resource_id: 5, schedule_id: 8, data: { 'a': 1, 'b': 2, 'c': 3 }, date_joined: '2018-04-05 14:25:36'}
  ],
  total: 5
}

const getScheduleLogData = (query) => {
  return new Promise((resolve, reject) => {
    resolve({data: scheduleLogData})
  })
}

export default {
  data () {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      total: null,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.listLoading = true
      const params = Object.assign({}, this.$route.query, this.listQuery)
      getScheduleLogData(params).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    goToSchedules (resourceId) {
      this.$router.push({
        path: '/schedule', query: { resource_id: resourceId }
      })
    }
  }
}
</script>

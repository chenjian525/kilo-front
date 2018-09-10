<template>
<div class="app-container">
  <el-row>
    <el-col><h3>数据库: <el-tooltip class="item" effect="dark" content="添加新任务" placement="top-start"><span class="link-type" @click="goTotables(resource_id)">{{ database }}</span></el-tooltip></h3></el-col>
  </el-row>
<el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="表" >
        <template slot-scope="scope">
          <span class="link-type" @click="goToScheduleLog(scope.row.id)">{{scope.row.table}}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段">
        <template slot-scope="scope">
          <span>{{ scope.row.fields }}</span>
        </template>
      </el-table-column>
      <el-table-column label="间隔" width="60px">
        <template slot-scope="scope">
          <span>{{scope.row.periodic}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已执行" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.times}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下次执行">
        <template slot-scope="scope">
          <span>{{scope.row.next}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="true">修改</el-button>
          <el-button size="mini" type="danger" @click="true">删除
          </el-button>
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
import { getScheduleData } from '@/api/db'

// const scheduleData = JSON.parse('{"total": 5, "data": null, "items": [{"fields": ["database", "source", "port"], "times": 0, "date_joined": "2018-04-05 16:29:25", "desc": "wer", "table": "resource", "resource_name": "\\u6d4b\\u8bd5", "periodic": 3, "resource_id": 1, "next": "2018-04-05 16:32:25", "id": 1}, {"fields": ["database", "source", "port"], "times": 0, "date_joined": "2018-04-05 16:32:03", "desc": "wesd", "table": "", "resource_name": "\\u6d4b\\u8bd5", "periodic": 5, "resource_id": 1, "next": "2018-04-05 16:37:03", "id": 2}, {"fields": ["desc", "periodic", "next"], "times": 0, "date_joined": "2018-04-05 16:40:26", "desc": "asd", "table": "schedule", "resource_name": "\\u6d4b\\u8bd5", "periodic": 3, "resource_id": 1, "next": "2018-04-05 16:43:26", "id": 3}, {"fields": ["source", "username", "database"], "times": 0, "date_joined": "2018-04-05 16:43:03", "desc": "asd", "table": "resource", "resource_name": "\\u6d4b\\u8bd5", "periodic": 4, "resource_id": 1, "next": "2018-04-05 16:47:03", "id": 4}, {"fields": ["source", "host", "database"], "times": 0, "date_joined": "2018-04-05 16:44:58", "desc": "asd", "table": "resource", "resource_name": "\\u6d4b\\u8bd5", "periodic": 7, "resource_id": 1, "next": "2018-04-05 16:51:58", "id": 5}], "status": 200}')

// const getScheduleData = (query) => {
//   return new Promise((resolve, reject) => {
//     resolve({data: scheduleData})
//   })
// }

export default {
  data () {
    return {
      tableKey: 0,
      resource_id: this.$route.query.resource_id,
      listLoading: true,
      database: '',
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
      getScheduleData(params).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.list.length > 0) {
          this.database = this.list[0].resource_name
        }
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
    goTotables (resourceId) {
      this.$router.push({
        path: 'table', query: { resource_id: resourceId }
      })
    },
    goToScheduleLog (scheduleId) {
      this.$router.push({
        path: 'schedule-log', query: { resource_id: scheduleId }
      })
    }
  }
}
</script>

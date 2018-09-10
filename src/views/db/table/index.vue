<template>
  <div class="tables-container">
  <el-container>
    <el-header style="background: #909399;">
      <p style="margin-top: 20px;">数据库: {{ database }}</p>
    </el-header>
    <el-container>
    <el-aside>
      <el-menu>
        <el-menu-item v-for="(table, index) in tables" :index="''+index" :key="index" @click="pickTable(table)">
          <span slot="title">{{ table }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <h5 v-if="tableColumns" style="margin-bottom: 20px;">请选择字段: </h5>
      <el-button :type="isColumnPicked(column) ? 'success' : 'info'" v-for="column in tableColumns" :key="column" style="margin: 3px;" @click="clickField(column)">{{ column }}</el-button>
      <h5 v-if="tableColumns">条件: </h5>
      <el-input placeholder="请输入内容" v-if="tableColumns" v-model="scheduleForm.periodic">
        <template slot="prepend">分钟间隔</template>
      </el-input>
      <el-input placeholder="请输入内容" v-if="tableColumns" v-model="scheduleForm.desc" style="margin-top: 10px;">
        <template slot="prepend">任务说明</template>
      </el-input>
      <el-button type="primary" style="margin-top: 30px;" v-if="tableColumns" @click="addSchedule" :disabled="buttonStatus">创建任务</el-button>
    </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import { metaData, addSchedule } from '@/api/db'

// const metaData = url => new Promise((resolve, reject) => {
//   const data = {
//     tables: ['resource', 'schedule', 'schedule_log'],
//     database: 'kilometers',
//     schedule: ['id', 'resource_id', 'name', 'table', 'fields', 'periodic', 'next', 'times', 'date_joined'],
//     resource: ['id', 'name', 'source', 'host', 'port', 'database', 'username', 'password', 'date_joined'],
//     schedule_log: ['id', 'resource_id', 'schedule_id', 'data', 'date_joined']
//   }
//   resolve({data: data})
// })

export default {
  data () {
    return {
      buttonStatus: false,
      initialForm: {
        resource_id: this.$route.query.resource_id,
        table: '',
        desc: '',
        fields: [],
        periodic: ''
      },
      fieldType: 'info',
      database: '',
      pickedTable: '',
      tables: [],
      mapColumns: {},
      tableColumns: '',
      scheduleForm: Object.assign({}, this.initialForm)
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      metaData(this.$route.query).then(response => {
        if (response.data && response.data.errcode) {
          this.$message({
            type: 'error',
            message: response.data.message,
            duration: 2000
          })
        } else {
          this.database = response.data.database
          this.tables = response.data.tables
          this.mapColumns = response.data
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '网络错误，请刷新重试',
          duration: 2000
        })
      })
    },
    resetScheduleForm () {
      this.scheduleForm = Object.assign({}, this.initialForm)
      this.scheduleForm.fields = []
    },
    pickTable (table) {
      this.pickedTable = table
      this.resetScheduleForm()
      this.scheduleForm.table = table
    },
    isColumnPicked (column) {
      return this.scheduleForm.fields.indexOf(column) > -1
    },
    clickField (column) {
      const i = this.scheduleForm.fields.indexOf(column)
      if (i > -1) {
        this.scheduleForm.fields.splice(i, 1)
      } else {
        this.scheduleForm.fields.push(column)
      }
    },
    toggleButtonStatus () {
      this.buttonStatus = !this.buttonStatus
    },
    addSchedule () {
      if (this.scheduleForm.fields.length === 0) {
        this.$message({
          type: 'error',
          message: '请选定任务要查询的字段',
          duration: 2000
        })
        return false
      }
      if (!this.scheduleForm.desc) {
        this.$message({
          type: 'error',
          message: '请输入任务说明',
          duration: 2000
        })
        return false
      }
      if (!/^[1-9][0-9]*\.?[0-9]*$/.test(this.scheduleForm.periodic)) {
        this.$message({
          type: 'error',
          message: '请输入正确的任务执行周期',
          duration: 2000
        })
        return false
      }
      let params = Object.assign({}, this.scheduleForm)
      params.fields = params.fields.join()
      this.toggleButtonStatus()
      addSchedule(params).then(response => {
        if (response.data && response.data.errcode) {
          this.$message({
            type: 'error',
            message: response.data.message,
            duration: 2000
          })
        } else {
          this.$message({
            type: 'success',
            message: response.data.message,
            duration: 2000
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '网络错误，请刷新重试',
          duration: 2000
        })
      }).then(() => {
        this.resetScheduleForm()
        this.toggleButtonStatus()
      })
    }
  },
  watch: {
    pickedTable: function (val, oldVal) {
      this.tableColumns = this.mapColumns[val]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tables-container {
  margin: 10px 20px 0;
  overflow: hidden;
}
</style>

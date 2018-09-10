<template>
  <div class="app-container">
    <div>
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加数据库</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="库名" >
        <template slot-scope="scope">
          <span class="link-type" @click="goToSchedules(scope.row.id)">{{scope.row.database}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <span>{{scope.row.host}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="端口">
        <template slot-scope="scope">
          <span>{{scope.row.port}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.date_joined}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px" style='width: 400px; margin-left:150px;'>
        <el-form-item label="名字" prop="name">
          <el-input v-model="temp.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="source">
          <el-select v-model="temp.source" clearable>
            <el-option v-for="item in  databaseTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机" prop="host">
          <el-input v-model="temp.host" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据库" prop="database">
          <el-input v-model="temp.database" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="temp.password" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :type="testButtonType" @click="testData" :disabled="testButtonStatus">测试</el-button>
          <el-button type="primary" @click="submitData" :disabled="submitButtonStatus">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, testDb, addDb, updateDb, deleteDb } from '@/api/db'

// const list = [
//   { name: '测试', source: 'mysql', host: 'localhost', database: 'kilometers', username: 'agent', date_joined: '2018-04-03 14:25:53', port: 3306 }
// ]

// const fetchList = () => {
//   return new Promise((resolve, reject) => {
//     const res = { total: 1, items: list }
//     resolve({data: res})
//   })
// }

const databaseTypeOptions = [
  { key: 'mysql', display_name: 'mysql' },
  { key: 'sqlite3', display_name: 'sqlite3' },
  { key: 'postgresql', display_name: 'postgresql' },
  { key: 'mongodb', display_name: 'mongodb' }
]

const tipsMap = {
  name: '数据库别称',
  database: '数据库名称',
  username: '用户名',
  password: '密码',
  host: '数据库地址'
}

export default {
  name: 'sourceData',
  data () {
    const validateRequired = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入' + tipsMap[rule.field]))
      } else {
        callback()
      }
    }

    return {
      submitButtonStatus: false,
      testButtonStatus: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      testButtonType: 'info',
      canCommit: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      databaseTypeOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        name: '',
        source: '',
        host: '',
        database: '',
        username: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改数据库',
        create: '添加数据库'
      },
      rules: {
        name: [{ validator: validateRequired, trigger: 'blur' }],
        source: [{ required: true, message: '请选择数据库类型', trigger: 'blur' }],
        host: [{ validator: validateRequired, trigger: 'blur' }],
        database: [{ validator: validateRequired, trigger: 'blur' }],
        username: [{ validator: validateRequired, trigger: 'blur' }],
        password: [{ validator: validateRequired, trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    toggleSubmitButton () {
      this.submitButtonStatus = !this.submitButtonStatus
    },
    toggleTestButton () {
      this.testButtonStatus = !this.testButtonStatus
    },
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    goToSchedules (sourceId) {
      this.$router.push({ path: 'schedule', query: { resource_id: sourceId } })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp () {
      this.temp = {
        id: undefined,
        name: '',
        source: '',
        host: '',
        database: '',
        username: '',
        password: ''
      }
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    testData () {
      this.toggleTestButton()
      let params = {test_resource: true}
      params = Object.assign(this.temp, params)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          testDb(params).then(response => {
            if (response.data && response.data.errcode) {
              this.$message({
                type: 'error',
                message: response.data.message,
                duration: 2000
              })
            } else {
              this.testButtonType = 'success'
              this.canCommit = true
              this.$message({
                type: 'success',
                message: response.data.message,
                duration: 2000
              })
            }
          }).catch(() => {
            this.message({
              type: 'error',
              message: '网络错误，请刷新重试',
              duration: 2000
            })
          }).then(() => {
            this.toggleTestButton()
          })
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row) // copy obj
      if (row.port) {
        const postFix = ':' + row.port
        this.temp.host += postFix
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    submitData () {
      if (!this.canCommit) {
        this.$message({
          type: 'warning',
          message: '请先测试连接',
          duration: 2000
        })
      } else {
        console.log(this.temp)
        let params = Object.assign(this.temp, {})
        delete params.test_resource
        this.toggleSubmitButton()
        if (this.dialogStatus === 'create') {
          addDb(params).then(response => {
            if (response.data && response.data.errcode) {
              this.$message({
                type: 'error',
                message: response.data.message,
                duration: 2000
              })
            } else {
              this.resetTemp()
              this.$message({
                type: 'success',
                message: response.data.message,
                duration: 2000
              })
              this.dialogFormVisible = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '网络错误，请刷新重试',
              duration: 2000
            })
          }).then(() => {
            this.toggleSubmitButton()
            this.getList()
          })
        } else if (this.dialogStatus === 'update') {
          updateDb(params).then(response => {
            if (response.data && response.data.errcode) {
              this.$message({
                type: 'error',
                message: response.data.message,
                duration: 2000
              })
            } else {
              this.resetTemp()
              this.$message({
                type: 'success',
                message: response.data.message,
                duration: 2000
              })
              this.dialogFormVisible = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '网络错误，请刷新重试',
              duration: 2000
            })
          }).then(() => {
            this.toggleSubmitButton()
            this.getList()
          })
        }
      }
    },
    handleDelete (row) {
      this.$confirm('确认删除该数据库吗？', '提示', {type: 'warning'}).then(() => {
        deleteDb({id: row.id}).then(response => {
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
          this.getList()
        })
      })
    }
  },
  watch: {
    temp: {
      handler: function (val, oldVal) {
        this.canCommit = false
        this.testButtonType = 'info'
      },
      deep: true
    }
  }
}
</script>

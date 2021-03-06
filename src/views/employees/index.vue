<template>
  <div class="dashboard-container">
    <div class="app-container">

      <!-- 上方内容 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push({ path: '/import', query: { redirect: '/employees' }})"
          >导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button :disabled="!checkPermission('POINT-USER-ADD')" size="small" type="primary" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 中部 tab 表格 -->
      <el-card>
        <el-table border :data="tableList">
          <el-table-column type="index" label="序号" sortable width="80" />
          <el-table-column label="姓名" prop="username" sortable />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto "
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" sortable />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" sortable />
          <el-table-column label="部门" prop="departmentName" sortable />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable>
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable>
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template v-slot="{ row }">
              <el-button :disabled="!checkPermission('POINT-USER-UPDATE')" type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 下方分页组件 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            layout="total, prev, pager, next"
            :page-size="queryInfo.size"
            :current-page="queryInfo.page"
            :total="total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>

      <!-- 新增员工弹层 -->
      <add-employee :show-dialog.sync="showDialog" />
      <!-- 图片 二维码弹层 -->
      <el-dialog title="二维码" :visible.sync="showCodeDialog">
        <el-row type="flex" justify="center">
          <!-- //!<canvas> 标签定义图形，比如图表和其他图像。<canvas> 标签只是图形容器，您必须使用脚本来绘制图形。  -->
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>

      <!-- 分配角色弹层 -->
      <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'
import QrCode from 'qrcode'

export default {
  name: 'Employess',
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      queryInfo: {
        page: 1,
        size: 10
      },
      total: 0,
      tableList: [],
      showDialog: false, // 控制新增员工弹层的显示与隐藏
      showCodeDialog: false, // 二维码弹层
      showRoleDialog: false, // 分配角色弹层
      userId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工综合列表
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.queryInfo)
      this.total = total
      this.tableList = rows
    },
    changePage(newPage) {
      this.queryInfo.page = newPage
      this.getEmployeeList()
    },
    // 格式化数据
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj && obj.value || '未知'
    },
    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除此员工吗', { title: '提示', type: 'warning' })
        await delEmployee(id)
        if (document.querySelectorAll('.el-card tbody tr').length / 2 === 1) {
          this.queryInfo.page = this.queryInfo.page > 1 && this.queryInfo.page - 1 || 1
        }
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 导出 excel 表格
    exportData() {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        const data = this.formatJson(headers, rows)

        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: '员工资料表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 该方法负责将数组转化成二维数组
    // 表头和数据一一对应
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [['张三'],[],[]]
      return rows.map(item => {
        // item : { username:'张三', mobile:1319999999 }
        // Object.keys(headers) : ['姓名','手机号',...]
        return Object.keys(headers).map(key => {
          // 判断字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            const en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知' // 返回对应的汉字
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
    },
    // 展示二维码弹层
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url && url.trim()) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 展示分配角色弹层
    async editRole(id) {
      this.userId = id
      //! props 传参是异步的
      // 调用子组件方法获取用户的角色信息
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>

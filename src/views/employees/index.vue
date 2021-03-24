<template>
  <div class="dashboard-container">
    <div class="app-container">

      <!-- 上方内容 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 中部 tab 表格 -->
      <el-card>
        <el-table border :data="tableList">
          <el-table-column type="index" label="序号" sortable width="80" />
          <el-table-column label="姓名" prop="username" sortable />
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
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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

    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import Employees from '@/api/constant/employees'

export default {
  data() {
    return {
      queryInfo: {
        page: 1,
        size: 10
      },
      total: 0,
      tableList: []
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
      const obj = Employees.hireType.find(item => item.id === cellValue)
      return obj && obj.value || '未知'
    }
  }
}
</script>

<style>

</style>

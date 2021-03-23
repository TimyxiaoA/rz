<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 头部 公司名称 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 树形控件 -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <tree-tools slot-scope="{ data }" :tree-node="data" @addDepts="addDepts" @editDepts="editDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
      <!-- 添加部门弹出层 -->
      <add-dept ref="addDeptsRef" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      node: null // 当前点击的节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取所有部门结构
    async getDepartments() {
      const res = await getDepartments()
      // id: '' 处理效验规则问题 (undefined 与 '' 并不相等)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      // list 数组转成 树状结构
      // ! 推荐使用 array-to-tree 包
      this.departs = tranListToTreeData(res.depts, '')
    },
    // 添加子部门
    addDepts(node) {
      this.showDialog = true
      this.node = node
      // 调用子组件的方法
      this.$refs.addDeptsRef.getEmployeeSimple()
    },
    // 编辑部门
    editDepts(node) {
      this.showDialog = true
      this.node = node
      //! 调用子组件的方法  props传参是异步的
      // 第一种方法
      this.$nextTick(() => {
        this.$refs.addDeptsRef.getDepartDetail()
      })
      // 第二种方法 this.$refs.addDeptsRef.getDepartDetail(node.id) 传递参数 子组件中方法形参接收
    }
  }
}
</script>

<style spoced>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>

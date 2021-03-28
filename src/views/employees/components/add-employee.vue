<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">

    <el-form ref="fromDataRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请输入入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in Employees.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          default-expand-all
          :props="{ label: 'name' }"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>

    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/department'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import Employees from '@/api/constant/employees'

export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      Employees: Employees,
      formData: {
        username: '', // 姓名
        mobile: '', // 手机号
        timeOfEntry: '',	// 入职时间
        formOfEmployment: '',	// 聘用形式
        workNumber: '',	// 工号
        departmentName: '',	// 组织名称
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        //! 注意: 这里用 change 事件 校验 (失去焦点且内容改变)
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }]
      },
      treeData: [], // 树形控件数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false// 控制树的显示或者隐藏进度条
    }
  },

  methods: {
    // 获取部门列表
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 确定新增员工
    async btnOk() {
      try {
        await this.$refs.fromDataRef.validate()
        // 添加
        await addEmployee(this.formData)
        this.$message.success('添加员工成功')
        // 刷新
        this.$parent.getEmployeeList()
        // 关闭弹层
        this.$parent.showDialog = false
        //! 注意 $parent的使用  子组件在父组件使用的独特位置
      } catch (error) {
        console.log(error)
      }
    },
    // 取消
    btnCancel() {
      console.log('触发了关闭事件')
      this.formData = {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      }
      // 清除效验
      this.$refs.fromDataRef.resetFields()
      // 关闭弹层
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>

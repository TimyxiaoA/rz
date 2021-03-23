<template>
  <el-dialog v-loading="loading" :title="showTitle" :visible="showDialog" @close="btnCancel">

    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" placeholder="1-50个字符" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" placeholder="1-50个字符" style="width: 80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" placeholder="请选择" style="width: 80%">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" :row="3" placeholder="1-300个字符" style="width: 80%" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="btnCancel">取 消</el-button>
      <el-button type="primary" size="small" @click="btnOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, editDepartments } from '@/api/department'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.form.id) {
        // 编辑 部门名称不能与同级部门名称相同 不包括自己
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 添加的子部门不能与同级子部门名称相同
        // 获取当前部门所有子部门 再判断是否有相同的名称
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`当前部门下已存在${value}这个子部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.form.id) {
        // 编辑 部门编码 code 不能与其他相同 不包括自己
        isRepeat = depts.filter(item => item.code !== this.treeNode.code).some(item => item.code === value && value)
      } else {
        // 不能添加相同 code 的部门编码
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`当前组织架构下已存在${value}这个部门编码了`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为 1~50 个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' } // 不能添加相同 name 的子部门名称
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为 1~50 个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' } // 不能添加相同 code 的部门编码
        ],
        nanager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍长度为 1~300 个字符', trigger: 'blur' }
        ]
      },
      peoples: [], // 员工简单列表数据
      loading: false
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 根据 ID 获取部门详情
    async getDepartDetail() {
      this.form = await getDepartDetail(this.treeNode.id)
    },
    // 点击确定
    btnOk() {
      // 表单效验
      this.$refs.deptForm.validate(async valid => {
        if (valid) {
          this.loading = true
          if (this.form.id) {
            // 编辑部门
            await editDepartments(this.form)
            this.$message.success('修改部门成功')
          } else {
            // 添加子部门
            await addDepartments({ ...this.form, pid: this.treeNode.id })
            this.$message.success('添加子部门成功')
          }
          // 关闭弹层
          this.$emit('update:showDialog', false)
          //! 关闭弹层时会触发 dialog的 @close="btnCancel" 事件
          // 停止loading
          this.loading = false
          // 刷新页面
          this.$emit('addDepts')
        }
      })
    },
    // 点击取消
    btnCancel() {
      // 重置表单 关闭弹层
      this.$refs.deptForm.resetFields() // 只会重置绑定的数据和效验规则 其他的数据还是存在
      this.form = { name: '', code: '', manager: '', introduce: '' }
      this.$emit('update:showDialog', false)
    }
  }
}

</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>

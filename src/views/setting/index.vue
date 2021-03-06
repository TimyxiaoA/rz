<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="loading">
        <el-tabs>
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 中部表格 -->
            <el-table :data="tableList" border style="width: 100%">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button type="success" size="small" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row.id)">修改</el-button>
                  <el-button type="danger" size="small" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 下方分页 -->
            <el-row type="flex" justify="end" align="middle" style="height: 60px">
              <el-pagination layout="total,prev, pager, next" :total="total" :current-page="queryInfo.page" :page-size="queryInfo.pagesize" @current-change="handleCurrentChange" />
            </el-row>
          </el-tab-pane>

          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px;user-select:none;">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 新增或编辑的弹层 -->
      <el-dialog :title="roleTitle" :visible.sync="showDialog" @close="btnCancel">
        <el-form ref="roleFormRef" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <el-row type="flex" justify="end">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取 消</el-button>
            <el-button size="small" type="primary" @click="btnOk">确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <!--分配权限弹层  -->
      <el-dialog title="分配权限" :visible.sync="showPermDialog" @close="btnPremCancel">
        <el-tree
          ref="premTree"
          :data="premData"
          :props="defaultProps"
          default-expand-all
          show-checkbox
          check-strictly
          :default-checked-keys="selectCheck"
          node-key="id"
        />
        <el-row slot="footer" type="flex" justify="end">
          <el-col :span="6">
            <el-button size="small" @click="btnPremCancel">取消</el-button>
            <el-button type="primary" size="small" @click="btnPremOk">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetails, editRole, addRole, assignPrem } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Setting',
  data() {
    return {
      queryInfo: {
        page: 1,
        pagesize: 2
      },
      total: 0, // 数据总条数
      tableList: [], // 列表数据
      formData: {}, // 表单数据
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog: false,
      premData: [], // 所有权限列表
      defaultProps: {
        label: 'name'
      },
      selectCheck: [], // 被选中的多选框 id 数组
      roleId: null // 当前点击的角色id
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    roleTitle() {
      return this.roleForm.id ? '编辑角色' : '添加角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      this.loading = true
      const { total, rows } = await getRoleList(this.queryInfo)
      this.total = total
      this.tableList = rows
      this.loading = false
    },
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getRoleList()
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除此角色吗', { title: '提示', type: 'warning' })
        await deleteRole(id)
        if (document.querySelectorAll('.el-card tbody tr').length === 1) {
          this.queryInfo.page = this.queryInfo.page > 1 && this.queryInfo.page - 1 || 1
        }
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        // console.log(error)
      }
    },
    // 修改角色
    async editRole(id) {
      this.roleForm = await getRoleDetails(id) // 数据回写
      this.showDialog = true // 展示弹层
    },
    // 修改或添加角色按钮
    async btnOk() {
      const formdata = this.roleForm
      if (formdata.id) {
        // 编辑
        await editRole(formdata)
      } else {
        // 添加
        await addRole(formdata)
      }
      this.$message.success('设置成功')
      this.showDialog = false
      this.getRoleList()
    },
    // 取消按钮
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleFormRef.resetFields()
      this.showDialog = false
    },
    // 展示分配权限弹层
    async assignPerm(id) {
      this.premData = tranListToTreeData(await getPermissionList(), '0') // 获取所有权限并转换为 树形
      this.roleId = id
      const { permIds } = await getRoleDetails(id) // 获取当前角色的权限点
      this.selectCheck = permIds
      this.showPermDialog = true
      // this.$nextTick(() => {
      //   this.$refs.premTree.setCheckedKeys(permIds, true)
      // })
    },
    // 确定按钮
    async btnPremOk() {
      const keysCheck = this.$refs.premTree.getCheckedKeys()
      await assignPrem({ id: this.roleId, permIds: keysCheck })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPremCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style scoped>
</style>

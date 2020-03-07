<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" :closable="false" type="warning" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKey"
            :options="cateList"
            :props="casProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs -->
      <el-tabs v-model="activeTable" @tab-click="handleTabsChange">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable" size="mini" @click="showAddDialog">添加参数</el-button>

          <el-table :data="manyAttrList" border stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleTagClose(scope.row,index)"
                >{{item}}</el-tag>
                <!-- 添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisable" size="mini" @click="showAddDialog">添加属性</el-button>
          <el-table :data="onlyAttrList" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleTagClose(scope.row,index)"
                >{{item}}</el-tag>
                <!-- 添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteAttr(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleAddDialogClose"
    >
      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handleEditDialogClose"
    >
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      // 被级联选择中的
      selectedKey: [],
      // 级联选择器的数据源
      cateList: [],
      // 级联选择器的具体参数
      casProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 哪个table
      activeTable: 'many',
      // 动态列表
      manyAttrList: [],
      // 静态列表
      onlyAttrList: [],
      // 当前被选中的分类的Id
      currentCateId: null,
      // 是否显示添加对话框
      addDialogVisible: false,
      // 添加参数对话框表单
      addForm: {
        attr_name: ''
      },
      // 添加参数表单验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 修改参数对话框表单
      editForm: {
        attr_name: '',
        attr_id: null
      },
      // 修改参数表单验证规则
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 是否显示修改对话框
      editDialogVisible: false
    }
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cateList = res.data
      console.log(res)
    },
    // 获取参数列表(封装过了)
    async getAttrList() {
      if (this.selectedKey.length !== 3) {
        // 选中的不是三级分类
        // 清空所有
        this.selectedKey = []
        this.manyAttrList = []
        this.onlyAttrList = []
        return
      }
      // 选中的是三级分类
      this.currentCateId = this.selectedKey[this.selectedKey.length - 1]
      console.log(this.currentCateId)
      const { data: res } = await this.$http.get(
        `categories/${this.currentCateId}/attributes`,
        {
          // 动态决定获取哪个
          params: { sel: this.activeTable }
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // 把attr_vals用逗号分隔变为数组形式
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 并添加控制单独的inputvalue和visible
        item.inputValue = ''
        item.inputVisible = false
      })

      if (this.activeTable === 'many') {
        this.manyAttrList = res.data
      } else {
        this.onlyAttrList = res.data
      }
    },
    // 处理级联被选中
    handleChange() {
      this.getAttrList()
    },
    // 处理表格切换更改
    handleTabsChange() {
      this.getAttrList()
    },
    // 打开添加对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 处理添加对话框关闭
    handleAddDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交 添加参数 表单
    addAttr() {
      // 先校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入名称!')
        }
        const { data: res } = await this.$http.post(
          `categories/${this.currentCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTable,
            attr_vals: ''
          }
        )
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加' + this.dialogTitle + '数据失败')
        }
        this.$message.success('添加' + this.dialogTitle + '数据成功')
        this.getAttrList()
        this.addDialogVisible = false
      })
    },
    // 打开编辑对话框
    showEditDialog(row) {
      this.editForm.attr_name = row.attr_name
      this.editForm.attr_id = row.attr_id
      this.editDialogVisible = true
    },
    // 处理编辑对话框关闭
    handleEditDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交 编辑参数 表单
    editAttr() {
      // 先校验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入正确名称!')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.currentCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeTable,
            attr_vals: ''
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('编辑' + this.dialogTitle + '数据失败')
        }
        this.$message.success('编辑' + this.dialogTitle + '数据成功')
        this.getAttrList()
        this.editDialogVisible = false
      })
    },
    // 删除属性
    async deleteAttr(row) {
      const confirmResult = await this.$confirm(
        `确定要删除该${this.dialogTitle}吗？`,
        '删除提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'danger'
        }
      ).catch(err => err)
      // 若点击取消
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.currentCateId}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数数据失败')
      }
      this.$message.success('删除' + this.dialogTitle + '数据成功')
      this.getAttrList()
    },
    // 删除tag处理函数
    async handleTagClose(row, index) {
      // 传过来索引 故把索引值所对的项删除即可
      row.attr_vals.splice(index, 1)
      // 上传到后台服务器
      const { data: res } = await this.$http.put(
        `categories/${this.currentCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数项失败')
      }
      console.log(res)
      this.$message.success('删除参数项成功')
    },
    // 当添加tag时 keyup了或者blur了
    async handleInputConfirm(row) {
      // 如果输入的内容不合法
      // trim 方法可以去除字符串两端的空格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果合法 则先push到数组里
      row.attr_vals.push(row.inputValue.trim())
      // 上传到后台服务器
      const { data: res } = await this.$http.put(
        `categories/${this.currentCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      console.log(res)
      this.$message.success('修改参数项成功')
      row.inputVisible = false
      row.inputValue = ''
    },
    // 点击按钮 显示添加tag
    showInput(row) {
      row.inputVisible = true
      // $nextTick 当页面被重新渲染时会调用
      this.$nextTick(_ => {
        // 获取原生的input调用input
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  computed: {
    // 如果按钮需要被禁用则返回true
    isBtnDisable() {
      if (this.selectedKey.length !== 3) {
        return true
      } else return false
    },
    // 动态决定对话框标题
    dialogTitle() {
      if (this.activeTable === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  .el-row {
    margin-top: 15px;
  }
  .el-tabs {
    margin-top: 15px;
  }
  .el-table {
    margin-top: 15px;
  }
  .el-tag {
    margin-left: 15px;
  }
  .input-new-tag {
    width: 200px;
    margin-left: 15px;
  }
  .button-new-tag {
    margin-left: 15px;
  }
}
</style>

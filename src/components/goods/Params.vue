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
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisable" size="mini">添加属性</el-button>
          <el-table :data="onlyAttrList" border stripe style="width: 100%">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="'添加' + dialogTitle" :visible.sync="addDialogVisible" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
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
      addDialogVisible: false
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
    // 获取动态参数列表(封装过了)
    async getManyAttrList() {
      if (this.selectedKey.length !== 3) {
        // 选中的不是三级分类
        return (this.selectedKey = [])
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
      if (this.activeTable === 'many') {
        this.manyAttrList = res.data
      } else {
        this.onlyAttrList = res.data
      }
    },
    // 处理级联被选中
    handleChange() {
      this.getManyAttrList()
    },
    // 处理标签更改
    handleTabsChange() {
      this.getManyAttrList()
    },
    // 打开添加对话框
    showAddDialog() {
      this.addDialogVisible = true
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
}
</style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" id="addBtn" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格  -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 模板区域_是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 模板区域_排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 模板区域_操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="addCateDialogVisible" width="30%" @close="handleClose">
      <!-- 对话框主体表单 -->
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCate"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            expandTrigger="hover"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
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
      // 商品分类列表
      cateList: [],
      // 查询分类数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数
      total: 0,
      // 配置行信息
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt' }
      ],
      // 添加分类对话框是否显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        // 添加分类的父级ID 添加1级分类则pid为0
        cat_pid: 0,
        // 分类层级,0为一级分类
        cat_level: 0
      },
      // 级联选择器中的前两级的父分类
      parentCate: [],
      // 被选中的父分类
      selectedKeys: [],
      // 设置级联选择器的参数
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      // 将数据列表赋值给cateList
      this.cateList = res.data.result
      // 保存总数据条数
      this.total = res.data.total
      console.log(res.data)
    },
    // 更改页面大小变化
    handleSizeChange(newsize) {
      console.log(newsize)
      // 当pagesize发生改变时触发
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 更改页数
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getCateList()
    },
    // 打开添加分类对话框
    showAddCateDialog() {
      // 先获取父级分类
      this.getParentCate()
      this.addCateDialogVisible = true
    },
    // 获取父两级分类
    async getParentCate() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.parentCate = res.data
      console.log(this.parentCate)
    },
    // 级联菜单中发生变化
    handleChange() {
      console.log(this.selectedKeys)
      // 如果选中了某个分类
      if (this.selectedKeys.length > 0) {
        // 三级分类只需要选中两级分类
        this.addCateForm.cat_level = this.selectedKeys.length
        // 分类父Id为数组的最后一个元素
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
      } else {
        // 如果没有选中
        // 添加的就是一级分类
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
      console.log(this.addCateForm)
    },
    // 关闭表单
    handleClose() {
      // 当关闭添加分类对话框时，重置表单
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.addCateDialogVisible = false
    },
    // 提交添加分类表单
    async addCate() {
      console.log(this.addCateForm)
      const { data: res } = await this.$http.post(
        'categories',
        this.addCateForm
      )
      if (res.meta.status !== 200) {
        this.$message.error('添加分类失败')
      }
      this.$message.success('添加分类成功')
      console.log(res)
      this.getCateList()
      this.handleClose()
      this.addCateDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
#addBtn {
  margin-bottom: 15px;
}
</style>

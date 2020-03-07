<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 步骤条 -->
      <el-steps :active="activeStep-0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs tab-position="left" :value="activeStep">
        <!-- 超大表单：label-position="top"(设置label在文本框上方) -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          label-position="top"
        >
          <el-tabs v-model="activeStep" :tab-position="'left'" :before-leave="beforeTabLeave">
            <!-- 标签页1 -->
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <!-- 选择商品分类的级联选择框 -->
                <el-cascader
                  expandTrigger="hover"
                  v-model="addForm.goods_cat"
                  :options="cateList"
                  :props="cateProps"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1"></el-tab-pane>
            <el-tab-pane label="商品属性" name="2"></el-tab-pane>
            <el-tab-pane label="商品图片" name="3"></el-tab-pane>
            <el-tab-pane label="商品内容" name="4"></el-tab-pane>
          </el-tabs>
        </el-form>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      // 当前激活的步骤
      activeStep: '0',
      // 表单数据
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: []
      },
      // 验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 级联选择器的数据源
      cateList: [],
      // 级联选择器的配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 左侧Tabs 与步骤同步
    // asyncWithStep(tab) {
    //   this.activeStep = parseInt(tab.name)
    // },
    // 获得分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },
    // 级联选择器选中了
    handleChange() {
      // 强制选择三级标签
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = ''
      } else {
        console.log(this.addForm.goods_cat)
      }
    },
    // 检验是否可以切到下一个tab了
    beforeTabLeave() {
      if (this.addForm.goods_cat.length === 3) {
        return true
      } else return false
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 15px;

  .el-tabs {
    margin-top: 30px;
  }
  .el-form {
    width: 75%;
  }
}
</style>

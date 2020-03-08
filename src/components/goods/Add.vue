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

      <!-- 超大表单：label-position="top"(设置label在文本框上方) -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeStep"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
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
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
              <!-- 使用数组渲染复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 循环生成静态属性 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 因为upload组件进行图片上传的时候并不是使用axios发送请求
            所以，我们需要手动为上传图片的请求添加token，即为upload组件添加headers属性-->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
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
        goods_cat: [],
        // 上传的图片数组
        pics: [],
        // 商品详情介绍
        goods_introduce: '',
        attrs: []
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
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 图片上传的url 完整名称！
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象 加一个token
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      // 保存预览图片的URL地址
      previewPath: '',
      // 控制预览图片对话框的显示和隐藏
      previewVisible: false
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
    beforeTabLeave(activeName, oldActiveName) {
      // 在tab栏切换之前触发，两个形参为切换前，后的tab栏name
      if (oldActiveName === '0') {
        // 在第一个标签页的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        } else if (this.addForm.goods_name.trim() === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.addForm.goods_price.trim() === '') {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.addForm.goods_weight.trim() === '') {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.addForm.goods_number.trim() === '') {
          this.$message.error('请输入商品数量')
          return false
        }
      }
    },
    // 切换Tabs的时候
    async tabClicked() {
      // 如果切换到商品参数了 则
      if (this.activeStep === '1') {
        // 发送请求获取动态参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        // 将attr_vals字符串转换为数组
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeStep === '2') {
        // 发送请求获取静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败')
        }

        this.onlyTableData = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      // 当用户点击图片进行预览时执行，处理图片预览
      // 形参file就是用户预览的那个文件
      this.previewPath = file.response.data.url
      // 显示预览图片对话框
      this.previewVisible = true
    },
    // 删除图片时
    handleRemove(file) {
      // 当用户点击X号删除时执行
      // 形参file就是用户点击删除的文件
      // 获取用户点击删除的那个图片的临时路径
      const filePath = file.response.data.tmp_path
      // 使用findIndex来查找符合条件的索引
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      // 移除索引对应的图片
      this.addForm.pics.splice(index, 1)
    },
    // 上传成功
    handleSuccess(response) {
      // 当上传成功时触发执行
      // 形参response就是上传成功之后服务器返回的结果
      // 将服务器返回的临时路径保存到addForm表单的pics数组中
      this.addForm.pics.push({ pic: response.data.tmp_path })
      console.log(this.addForm.pics)
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请正确填写每一个表单项')
        }
        // 深拷贝
        const form = _.cloneDeep(this.addForm)
        // 将cat变为字符串
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyTableData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          form.attrs.push(obj)
        })
        this.onlyTableData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          form.attrs.push(obj)
        })
        console.log(form)
        // 发送请求完成商品的添加,商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        // 编程式导航跳转到商品列表
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 当前三级分类的Id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
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

  //给添加商品按钮添加间距
  .btnAdd {
    margin-top: 15px;
  }
}
</style>

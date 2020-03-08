<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="10">
          <!-- 搜索栏 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
          <template>
            <!-- 修改地址 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditAddress"></el-button>
            <!-- 查看物流信息 -->
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10 , 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改收货地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线组件  -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from '../assets/js/citydata.js'
export default {
  created() {
    this.getOrderList()
  },
  data() {
    return {
      // 查询信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表数据
      orderList: [],
      // 数据总条数
      total: 0,
      // 控制修改地址对话框
      addressVisible: false,
      // 地址表单
      addressForm: {
        address1: [],
        address2: ''
      },
      // 地址表单校验规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 将导入的cityData数据保存起来
      cityData: cityData,
      // 物流信息对话框
      progressVisible: false,
      // 保存物流信息
      progressInfo: []
    }
  },
  methods: {
    // 获得订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败!')
      }

      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(res)
    },
    // 页大小
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址
    showEditAddress() {
      this.addressVisible = true
    },
    // 对话框关闭
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgress() {
      // 发送请求获取物流数据
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败!')
      }
      this.progressInfo = res.data
      // 显示对话框
      this.progressVisible = true
    },
    // 搜索
    search() {
      console.log('111')
      this.getOrderList()
    }
  }
}
</script>

<style lang="less" scoped>
// 导入时间线的样式
@import '../plugins/timeline/timeline.css';
@import '../plugins/timeline-item/timeline-item.css';
.el-card {
  margin-top: 15px;
  .el-table {
    margin-top: 15px;
  }
}
</style>

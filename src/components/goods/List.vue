<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            class="input-with-select"
            @clear="handleClear"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" id="addBtn" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表单 -->
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="85px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="85px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <!-- 使用了过滤器 -->
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      // 查询的对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总共
      total: 0
    }
  },
  methods: {
    async getGoodsList() {
      //   根据分页获取对应的商品列表
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res.data)
      // this.$message.success('获取商品列表成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 页面大小改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 页数改变
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this.getGoodsList()
    },
    // 删除商品
    async deleteGoods(row) {
      // 根据id删除对应的参数或属性
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        '请问是否要删除该商品',
        '删除提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      // 没有取消就是要删除，发送请求完成删除
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }

      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 添加商品 跳到新的组件
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 搜索商品
    searchGoods() {
      this.getGoodsList()
    },
    // 清空搜索
    handleClear() {
      this.queryInfo.query = ''
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  #addBtn {
    margin-left: 15px;
  }
}
</style>

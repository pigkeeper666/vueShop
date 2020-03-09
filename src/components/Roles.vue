<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="roleList" stripe border style="width: 100%" row-key="id">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="border-bottom" v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 二级 -->
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="warning"
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                      type="success"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetDialogVisible(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetDialogVisible"
      width="50%"
      @close="closeSetRightsDialog"
    >
      <!-- 树形控件 -->
      <el-tree
        show-checkbox
        :default-checked-keys="defaultChecked"
        :default-expanded-keys="defaultChecked"
        ref="treeRef"
        node-key="id"
        :data="treeRights"
        :props="treeProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRoleList()
  },
  data() {
    return {
      // 角色列表
      roleList: [],
      //   分配角色的对话框是否显示
      SetDialogVisible: false,
      // 树形权限列表
      treeRights: [],
      //   树的props
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 树默认check的值
      defaultChecked: [],
      // 保存正在操作的roleid
      currentRoleId: 0
    }
  },
  methods: {
    // 获得角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      console.log(res.data)
      this.roleList = res.data
    },
    // 按ID删除权限
    async removeRightById(row, rightId) {
      const confirmResult = await this.$confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const roleId = row.id
      const { data: res } = await this.$http.delete(
        `roles/${roleId}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      // 无需再重新加载所有权限
      // 只需要对现有的角色权限进行更新即可
      row.children = res.data
      // this.getRoleList();
      console.log(res)
    },
    // 显示分配权限对话框
    async showSetDialogVisible(role) {
      // 提交的时候用
      this.currentRoleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.treeRights = res.data
      // 将role的权限放入该数组
      this.getLeafKey(role, this.defaultChecked)
      console.log(this.treeRights)
      this.SetDialogVisible = true
    },
    // 将指定role的子权限放入数组
    getLeafKey(node, array) {
      // 如果没有了 就说明到底层了，将key加入数组
      if (!node.children) {
        return array.push(node.id)
      }
      // 如果还有子节点 就继续挖下去
      node.children.forEach(item => {
        this.getLeafKey(item, array)
      })
    },
    // 得到树形组件中被选择的 权限的id
    getRightsId() {
      // 获得所有全选节点
      const leaf = this.$refs.treeRef.getCheckedKeys()
      // 获得半选节点
      const half = this.$refs.treeRef.getHalfCheckedKeys()
      // 展开表达式
      const whole = [...leaf, ...half]
      return whole
    },
    // 提交分配的权限
    async setRights() {
      // 接口要求转化成字符串
      const whole = this.getRightsId().join(',')
      //   注意传参方式
      const { data: res } = await this.$http.post(
        `roles/${this.currentRoleId}/rights`,
        {
          rids: whole
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.SetDialogVisible = false
    },
    closeSetRightsDialog() {
      // 清空默认
      this.defaultChecked = []
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
  .el-table {
    margin-top: 15px;
  }
  .el-row {
    display: flex;
    align-items: center;
    .el-col {
      margin: 5px 0;
    }
    .el-tag {
      margin-left: 4px;
    }
  }
  .border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>

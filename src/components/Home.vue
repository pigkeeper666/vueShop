<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header height="60px;">
      <!-- logo和标题 -->
      <div class="logoAndtext">
        <img src="../assets/logo.png" alt />
        <div class="text">电商后台管理系统</div>
      </div>
      <!-- 退出按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="this.isCollapse? '64px':'200px'">
        <div class="toggle_btn" @click="menuCollapse">|||</div>
        <el-menu
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="this.isCollapse"
          :collapse-transition="false"
          router
          :default-active="nav_active"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item1.path" v-for="item1 in menu_list" :key="item1.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item1.id]"></i>
              <!-- 文本 -->
              <span>{{item1.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item
              :index="'/'+item2.path"
              v-for="item2 in item1.children"
              :key="item2.id"
              @click="saveNavState(item2.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主页 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单列表
      menu_list: null,
      // 菜单是否折叠
      isCollapse: false,
      // 字体图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 高亮nav 这样子就算刷新也可以保持高亮
      nav_active: window.sessionStorage.getItem('navPath')
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获得menuList
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.menu_list = res.data
      console.log(this.menu_list)
    },
    // 控制菜单折叠
    menuCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保持子菜单高亮
    saveNavState(path) {
      path = '/' + path
      // 存到sessionStorage里
      window.sessionStorage.setItem('navPath', path)
      this.nav_active = path
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logoAndtext {
    height: 60px;
    width: 270px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 15%;
    }
    .text {
      color: white;
      font-size: 25px;
    }
    .el-button {
      padding: 0 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .iconfont {
    margin-right: 10px;
  }
  .el-menu {
    border: 0;
  }
  .toggle_btn {
    text-align: center;
    color: #eee;
    padding: 5px 0;
    letter-spacing: 0.2em;
  }
  .toggle_btn:hover {
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>

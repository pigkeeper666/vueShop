<template>
  <div class="login_container">
    <!-- 登陆盒子 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单 -->
      <el-form ref="login_form_ref" :rules="login_rule" :model="login_form" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="login_form.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="login_form.password"
            show-password
            prefix-icon="el-icon-setting"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 按钮 -->
          <div class="btns">
            <el-button type="info" @click="reset">重置</el-button>
            <el-button type="success" @click="login">登陆</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储用户输入的用户名和密码
      login_form: {
        username: '',
        password: ''
      },
      //   校验规则
      login_rule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 16,
            message: '长度在 4 到 16 个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 4,
            max: 16,
            message: '长度在 4 到 16 个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.login_form_ref.validate(async valid => {
        // 如果输入不规范就返回
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.login_form)
        // console.log(res)
        // 用户名或密码错误
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 登陆成功
        this.$message.success(res.meta.msg)
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        // 导航至/home
        this.$router.push('/home')
      })
    },
    reset() {
      this.$refs.login_form_ref.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
.login_box {
  width: 500px;
  height: 300px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar {
    width: 150px;
    height: 150px;
    padding: 10px;
    border: 1px solid #eee;
    background-color: #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: white;
    }
  }
  .login_form {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 10px 20px;
    // 这样加了padding就不会超出
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .el-input {
      margin: 5px 0px;
    }
  }
}
</style>

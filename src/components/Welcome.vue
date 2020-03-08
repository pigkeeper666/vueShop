<template>
  <div class="center">
    <div id="main"></div>
    <div class="welcome">
      <h2>Welcome</h2>
      <h2 style="color: rgba(0, 0, 0, 0.5)">For your coming</h2>
      <h2>——电商后台管理系统</h2>
    </div>
  </div>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
export default {
  async mounted() {
    // 在页面dom元素加载完毕之后执行的钩子函数mounted
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 使用获取的数据展示图表
    myChart.setOption(this.option)
  },
  data() {
    return {
      option: {
        series: {
          type: 'sunburst',
          data: [
            {
              name: '用户管理',
              value: 2,
              children: [
                {
                  value: 2,
                  name: '用户列表'
                }
              ]
            },
            {
              name: '权限管理',
              value: 2,
              children: [
                {
                  name: '角色列表',
                  value: 1
                },
                {
                  name: '权限列表',
                  value: 1
                }
              ]
            },
            {
              name: '商品管理',
              value: 3,
              children: [
                {
                  name: '商品列表',
                  value: 1
                },
                {
                  name: '分类参数',
                  value: 1
                },
                {
                  name: '商品分类',
                  value: 1
                }
              ]
            },
            {
              name: '订单',
              value: 2,
              children: [{ name: '订单列表', value: 2 }]
            },
            {
              name: '数据',
              value: 2,
              children: [{ name: '数据报表', value: 2 }]
            }
          ]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#main {
  width: 500px;
  height: 500px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.welcome {
  padding-left: 25px;
  border-left: 5px solid rgba(173, 171, 171, 0.1);
}
</style>

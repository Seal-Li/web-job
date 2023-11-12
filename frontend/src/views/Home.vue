<template>
    <div class="home-container">
      <!-- 上导航栏 -->
      <el-row class="nav-bar">
        <el-col :span="18">
          <el-menu mode="horizontal" @select="handleNavMenuSelect" background-color="#67C23A" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1">推荐</el-menu-item>
            <el-menu-item index="2">热门</el-menu-item>
            <el-menu-item index="3">啤酒品类</el-menu-item>
            <el-menu-item index="4">啤酒课堂</el-menu-item>
            <el-menu-item index="5">我要哈啤酒</el-menu-item>
            <el-menu-item index="6">论坛</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6">
          <!-- 左侧导航栏的宽度减小一半 -->
          <div class="welcome">欢迎{{ username }}！</div>
          <!-- 右上方退出登录按钮 -->
          <el-button @click="logout" type="text" class="logout-button">退出登录</el-button>
        </el-col>
      </el-row>
  
      <!-- 左侧导航栏 -->
      <el-row class="side-bar">
        <el-col :span="3">
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleSideMenuSelect" background-color="#f5f5f5" text-color="#333" active-text-color="#67C23A">
            <el-submenu index="personal">
              <template slot="title">个人中心</template>
              <el-menu-item index="personal-info">基础信息</el-menu-item>
              <!-- 在这里添加其他个人中心的子菜单项 -->
            </el-submenu>
            <el-menu-item index="wallet">我的钱包</el-menu-item>
            <el-menu-item index="creations">我的创作</el-menu-item>
            <el-menu-item index="orders">我的订单</el-menu-item>
            <el-menu-item index="statistics">收支统计</el-menu-item>
            <el-menu-item index="feedback">我要反馈</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="15">
          <!-- 右侧内容区域，根据左侧导航栏选项展示不同内容 -->
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '用户1', // 替换为实际的用户名
        activeMenu: 'personal-info', // 默认选中的左侧导航栏项
      };
    },
    methods: {
      handleNavMenuSelect(index) {
        // 处理上导航栏菜单点击事件
        console.log('点击上导航栏菜单:', index);
      },
      handleSideMenuSelect(index) {
        // 处理左侧导航栏菜单点击事件
        console.log('点击左侧导航栏菜单:', index);
        this.activeMenu = index; // 更新当前选中项
      },
      logout() {
        // 处理退出登录逻辑
        console.log('执行退出登录操作');
      },
    },
  };
  </script>
  
  <style scoped>
  .home-container {
    padding: 0px;
  }
  
  .nav-bar {
    background-color: #fff; /* 上导航栏背景色 */
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1); /* 上导航栏阴影效果 */
  }
  
  .logout-button {
    color: #67C23A; /* 退出登录按钮文字颜色 */
  }
  
  .side-bar {
    height: calc(100vh - 40px); /* 左侧导航栏高度 */
    overflow-y: auto; /* 左侧导航栏超出高度时出现滚动条 */
  }
  
  .welcome {
    padding: 0px;
    font-size: 16px;
    font-weight: bold;
  }
  </style>
  
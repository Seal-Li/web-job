<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎用户{{ username }}！</div>
      <!-- 使用 router-link 实现导航 -->
      <router-link v-for="item in navItems" :key="item.id" :to="{ name: item.routeName }" class="nav-item" :data-route-name="item.routeName">
        {{ item.label }}
      </router-link>
      <div class="logout" @click="logout">退出登录</div>
    </div>

    <!-- 下方区域 -->
    <div class="main-container">
      <!-- 左侧导航栏 -->
      <div class="side-bar" :class="{ 'hide': isSideBarHidden }">
        <div class="side-row" v-for="(row, index) in sideItemsInRows" :key="index">
          <router-link v-for="item in row" :key="item.id" :to="{ name: item.routeName }" class="side-item">
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content">
        <!-- 你想展示的独立于其他页面的信息 -->
        <div>
          <h2>欢迎来到推荐页面</h2>
        </div>
        <!-- 其他内容 ... -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemsPerRow: 1,
      username: '用户1', // 替换为实际的用户名
      isSideBarHidden: false,
      navItems: [
        { id: 1, label: '推荐', routeName: 'recommend' },
        { id: 2, label: '热销', routeName: 'hot' },
        { id: 3, label: '啤酒品类', routeName: 'beerCategory' },
        { id: 4, label: '啤酒知识', routeName: 'beerKnowledge' },
        { id: 5, label: '论坛', routeName: 'forum' },
      ],
      sideItems: [
        { id: 1, label: '用户中心', routeName: 'userCenter' },
        { id: 2, label: '我的订单', routeName: 'myOrders' },
        { id: 3, label: '我的收藏', routeName: 'myFavorites' },
        { id: 4, label: '我的地址', routeName: 'myAddresses' },
      ],
    };
  },
  methods: {
    logout() {
      // 处理退出登录逻辑
      console.log('执行退出登录操作');
    },
    updateNavStyles() {
      // 获取当前路由的名称
      const currentRoute = this.$route.name;

      // 遍历导航项，根据当前路由更新导航栏样式
      this.navItems.forEach((item) => {
        // 判断当前导航项是否是激活状态
        const isActive = item.routeName === currentRoute;

        // 更新导航项的样式
        const navItem = document.querySelector(`.nav-item[data-route-name="${item.routeName}"]`);
        if (navItem) {
          navItem.classList.toggle('active', isActive);
        }
      });

      // 清除其他导航项的激活状态
      const inactiveNavItems = document.querySelectorAll('.nav-item:not(.active)');
      inactiveNavItems.forEach((item) => {
        item.classList.remove('active');
      });
    },
  },
  computed: {
    sideItemsInRows() {
      return Array.from({ length: Math.ceil(this.sideItems.length / this.itemsPerRow) }, (v, i) =>
        this.sideItems.slice(i * this.itemsPerRow, i * this.itemsPerRow + this.itemsPerRow)
      );
    },
  },
};
</script>

<style scoped>
@import "../css/Home.css";
</style>

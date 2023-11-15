<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎！</div>
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
          <h2>欢迎来到我的地址页面</h2>
        </div>
        <!-- 其他内容 ... -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // 将 body 的 margin 设置为 0
    document.body.style.margin = '0';
  },
  data() {
    return {
      itemsPerRow: 1,
      username: '用户1', // 替换为实际的用户名
      isSideBarHidden: false,
      navItems: [
        { id: 0, label: '首页', routeName: 'Home' },
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
      this.$router.push('/');
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

<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎用户{{ username }}！</div>
      <!-- 使用 router-link 实现导航 -->
      <router-link v-for="item in navItems" :key="item.id" :to="{ name: item.routeName }" class="nav-item">
        {{ item.label }}
      </router-link>
      <div class="logout" @click="logout">退出登录</div>
    </div>

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
      <router-view></router-view>
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
  },
  computed: {
    sideItemsInRows() {
      // 使用slice方法将sideItems切分成每行itemsPerRow个元素的二维数组
      return Array.from({ length: Math.ceil(this.sideItems.length / this.itemsPerRow) }, (v, i) =>
        this.sideItems.slice(i * this.itemsPerRow, i * this.itemsPerRow + this.itemsPerRow)
      );
    },
  },
};
</script>

<style scoped>
.home-container {
  padding: 0px;
  display: flex;
  flex-direction: column;
  background: url('../assets/bgpic.jpg') center/cover no-repeat; /* 替换为你的背景图片 URL */
}

.bg-transparent {
  background: rgba(255, 255, 255, 0.8); /* 设置背景图片透明度，可以根据需要调整值 */
  padding: 20px; /* 为了演示，你可能需要调整其他容器样式 */
}

.nav-bar {
  background-color: #784d42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: #fff;
}

/* .nav-item, */
.welcome {
  /* width: 150px; */
  margin-right: 10px;
  color:blue;
}
.logout {
  cursor: pointer;
  color:blue;
}

.side-bar {
  width: 150px; /* 左侧导航栏的宽度 */
  height: calc(100vh + 44px); /* 高度为视口高度减去导航栏的高度 */
  overflow-y: auto;
  background-color: #784d42; /* 左侧导航栏的背景颜色 */
  padding: 10px;
  transition: width 0.3s;
}

.hide {
  width: 0;
}

.side-item {
  padding: 8px;
  margin-bottom: 5px;
  cursor: pointer;
}

.content {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
}
</style>

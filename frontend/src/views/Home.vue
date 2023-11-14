<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎用户<br>{{ username }}！</div>
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
        <div class="product-group">
          <div v-for="(product, index) in latestProducts" :key="product.id" class="product-box">
            <img :src="product.image" alt="Product Image">
            <h3>{{ product.name }}</h3>
            <p>介绍： {{ product.description }}</p>
            <p>酒精度： {{ product.alcoholContent }}</p>
            <p>原麦汁浓度： {{ product.originalGravity }}</p>
            <p>价格: ￥{{ product.price.toFixed(2) }}</p>
            <!-- 添加下面的判断，如果是每行的最后一个商品，则添加一个占位元素 -->
            <div v-if="(index + 1) % productsPerRow === 0" class="filler"></div>
          </div>
        </div>
        <!-- 其他内容 ... -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/auth';
import { computed, watchEffect } from 'vue';

export default {
  setup() {
    const userStore = useUserStore();

    // 获取用户名
    const username = computed(() => userStore.username);

    // 在用户信息更新时自动更新用户名
    watchEffect(() => {
      console.log('User info updated:', userStore.$state);
      // 这里可以执行一些其他的逻辑
    });

    return {
      username,
      // 其他返回的数据
    };
  },
  data() {
    return {
      itemsPerRow: 1,
      productsPerRow: 3,
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
      latestProducts: [
        {
          id: 1,
          name: '一世传奇',
          image: new URL('@/static/legend.png', import.meta.url).href,
          description: `
            百位酿酒大师，传承百年工艺;
            融汇百种酿法，经过千锤百炼;
            酿于百年酒厂，藏于百年橡桶;
            集合百味芳香，酿就百年传奇;
            百酿成传奇……`,
          alcoholContent: '>10.5% vol',
          originalGravity: '23.9 P',
          price: 1399.00,
        },
        {
          id: 2,
          name: '百年之旅',
          image: new URL('@/static/bainian.png', import.meta.url).href,
          description: `
            有着微微焦糖、烤面包香气，有一定苦度。相当高的发酵程度。
            麦芽香气较为明显，酒花味道较淡，花香柔和。
            琥珀色，酒液清亮通明，白色泡沫，持续时间较短。`,
          alcoholContent: '6% vol',
          originalGravity: '15 P',
          price: 369,
        },
        {
          id: 3,
          name: '百年鸿运',
          image: new URL('@/static/hongyunhead.jpg', import.meta.url).href,
          description: `
            青岛啤酒推出的一款限定款虎年生肖酒，选用优质大麦和上等啤酒花为原料酿制而成，
            酒精度达到.5%vol，原麦汁浓度19.8°P，泡沫丰富，口感香醇；
            该限定款啤酒采用喜庆吉祥的外观设计，包装使用红色礼盒，瓶身附带金虎图案，卡扣瓶盖更易开启。`,
          alcoholContent: '5%',
          originalGravity: '19.8 P',
          price: 729,
        },
        // 添加更多新品...
      ],
    };
  },
  methods: {
    logout() {
      // 处理退出登录逻辑
      console.log('执行退出登录操作');
      // 导航到登录页面并替换当前路由历史
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

.product-group {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; /* 允许商品换行 */
}

.product-box {
  display: flex;
  flex-direction: column;
  align-items: center; /* 让图片在水平方向上居中显示 */
  border: 1px solid #ccc;
  padding: 10px;
  width: 29%; /* 每个商品框占据 30% 的宽度，以适应三列布局 */
  margin: 10px;
  text-align: left; /* 居左显示 */
}

.product-box img {
  max-width: 100%;
  height: auto;
  align-self: center; /* 使图片在垂直方向上居中显示 */
  margin-bottom: 10px; /* 添加一些底部间距 */
}

.filler {
  flex: 1; /* 占满剩余空间 */
}

</style>

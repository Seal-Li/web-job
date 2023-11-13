<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎！</div>
      <!-- 使用 router-link 实现导航 -->
      <router-link
        v-for="item in navItems"
        :key="item.id"
        :to="{ name: item.routeName }"
        class="nav-item"
        :data-route-name="item.routeName"
      >
        {{ item.label }}
      </router-link>
      <div class="logout" @click="logout">退出登录</div>
    </div>

    <!-- 下方区域 -->
    <div class="main-container">
      <!-- 左侧导航栏 -->
      <div class="side-bar" :class="{ 'hide': isSideBarHidden }">
        <div class="side-row" v-for="(row, index) in sideItemsInRows" :key="index">
          <router-link
            v-for="item in row"
            :key="item.id"
            :to="{ name: item.routeName }"
            class="side-item"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content">
        <table>
          <thead>
            <tr>
              <th>产品ID</th>
              <th>产品名称</th>
              <th>价格</th>
              <th>制造商</th>
              <th>生产原料</th>
              <th>产品描述</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.product_id">
              <td>{{ product.product_id }}</td>
              <td>{{ product.product_name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.manufacturer }}</td>
              <td>{{ product.raw_material }}</td>
              <td>{{ product.product_desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axio from 'axios';
export default {
  data() {
    return {
      itemsPerRow: 1,
      isSideBarHidden: false,
      products: [],
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
  created() {
    this.fetchAllProducts(); // 调用新的方法
  },
  methods: {
    // 处理退出登录逻辑
    logout() {
      console.log('执行退出登录操作');
    },
    // 新增方法，用于获取所有产品数据
    async fetchAllProducts() {
      try {
        const response = await this.$axios.get('http://localhost:3000/all-products');
        console.log("response:", response);
        this.products = response.data.products;
      } catch (error) {
        console.error('获取产品信息失败', error);
      }
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
.home-container {
    padding: 0px;
    display: flex;
    flex-direction: column;
    background: none !important;
    height: 100%; /* 高度为视口高度 */
}

.nav-bar {
    background-color: #784d42;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    color: #fff;
}

.nav-item, .side-item {
    padding: 8px;
    margin-bottom: 5px;
    cursor: pointer;
    font-weight: bold; /* 加粗字体 */
    text-decoration: none; /* 取消下划线 */
    color: #fff; /* 字体颜色 */
}

.welcome {
    /* width: 150px; */
    margin-left: 20px;
    color: blue;
}

.logout {
    cursor: pointer;
    color: blue;
    margin-right: 20px;
}

.main-container {
    display: flex;
    height: 100%; /* 高度为父容器高度 */
}

.side-bar {
    width: 150px; /* 左侧导航栏的宽度 */
    height: 100vh; /* 高度为父容器高度 */
    overflow-y: auto;
    background-color: #784d42; /* 左侧导航栏的背景颜色 */
    padding-top: 30px;  
    padding-left: 30px;
    transition: width 0.3s;
}

.hide {
    width: 0;
}

.side-row {
    margin-bottom: 30px;
}

.content {
    flex: 1; /* 填充剩余空间 */
    padding: 20px; /* 设置内容区域的内边距 */
    overflow: auto; /* 允许内容溢出时显示滚动条 */
}

table {
    width: 100%; /* 表格充满整个容器宽度 */
    border-collapse: collapse; /* 合并边框，使其更紧凑 */
}

th, td {
    border: 1px solid #ddd; /* 添加边框 */
    padding: 8px; /* 单元格内边距 */
    text-align: left; /* 文字左对齐 */
}

th {
    font-weight: bold; /* 表头文字加粗显示 */
    background-color: #f2f2f2; /* 表头背景颜色 */
}

</style>

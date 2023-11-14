<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎!</div>
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
        <!-- 在搜索框旁边添加价格范围搜索框 -->
        <div class="search-bar">
          <input v-model="searchKeyword" type="text" placeholder="输入关键字搜索">
          <input v-model.number="minPrice" type="number" placeholder="最低价格">
          <input v-model.number="maxPrice" type="number" placeholder="最高价格">
          <button @click="searchProducts">搜索</button>
        </div>
        <br>
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

        <!-- 分页控制按钮 -->
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="prevPage" class="pagination-button">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button :disabled="currentPage === totalPages || totalPages === 0" @click="nextPage" class="pagination-button">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, ref, reactive, computed, onMounted, toRefs } from 'vue';
import { useAuthStore } from '@/store/auth';

export default defineComponent({
  setup() {
    const userStore = useAuthStore();
    const { username, email, telphone, usertype, money } = toRefs(userStore.$state);

    const state = reactive({
      itemsPerRow: 1,
      isSideBarHidden: false,
      initialLoad: true,
      isSearching: false,
      products: [],
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
      currentPage: 1,
      perPage: 5,
      totalProducts: 0,
      searchKeyword: '',
      totalPages: 0,
      minPrice: null,
      maxPrice: null,
    });

    const fetchProducts = async () => {
      try {
        let apiUrl = 'http://localhost:3000/all-products';
        let params = {
          page: state.currentPage,
          limit: state.perPage,
        };

        if (state.isSearching) {
          apiUrl = 'http://localhost:3000/search-products';
          params = {
            keyword: state.searchKeyword,
            minPrice: state.minPrice || undefined,
            maxPrice: state.maxPrice || undefined,
            page: state.currentPage,
            limit: state.perPage,
          };
        }

        const response = await axios.get(apiUrl, { params });
        state.products = response.data.products;
        state.totalProducts = response.data.totalProducts;

        // 计算总页数
        state.totalPages = Math.ceil(state.totalProducts / state.perPage);
        // console.log('当前总页数:', state.totalPages);
      } catch (error) {
        console.error('未能获取到数据', error);
      }
    };

    const nextPage = () => {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        // console.log('下一页：', state.currentPage);
        fetchProducts();
      }
    };

    const prevPage = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        // console.log('上一页：', state.currentPage);
        fetchProducts();
      }
    };

    const searchProducts = async () => {
      state.isSearching = true;
      state.currentPage = 1;
      await fetchProducts();
    };

    onMounted(() => {
      fetchProducts();
    });

    const sideItemsInRows = computed(() => {
      return Array.from({ length: Math.ceil(state.sideItems.length / state.itemsPerRow) }, (v, i) =>
        state.sideItems.slice(i * state.itemsPerRow, i * state.itemsPerRow + state.itemsPerRow)
      );
    });

    return {
      ...toRefs(state),
      username,
      email,
      telphone,
      usertype,
      money,
      fetchProducts,
      nextPage,
      prevPage,
      searchProducts,
      sideItemsInRows,
    };
  },
});
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
    width: 100px;
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
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd; /* 添加边框 */
}

th {
    font-weight: bold; /* 表头文字加粗显示 */
    background-color: #f2f2f2; /* 表头背景颜色 */
}

/* 设置每列的固定宽度 */
th:nth-child(1), td:nth-child(1) { width: 40px; } /* 产品ID列宽度 */
th:nth-child(2), td:nth-child(2) { width: 150px; } /* 产品名称列宽度 */
th:nth-child(3), td:nth-child(3) { width: 80px; } /* 价格列宽度 */
th:nth-child(4), td:nth-child(4) { width: 120px; } /* 制造商列宽度 */
th:nth-child(5), td:nth-child(5) { width: 120px; } /* 生产原料列宽度 */
th:nth-child(6), td:nth-child(6) { width: 240px; } /* 产品描述列宽度 */

/* 分页控件样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px; /* 调整上下间距 */
}

.pagination-button {
  margin: 0 10px; /* 调整按钮间距 */
}

</style>

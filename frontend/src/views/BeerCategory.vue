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
          <div class="search-inputs">
            <el-input v-model="searchKeyword" type="text" placeholder="输入关键字搜索"></el-input>
            <el-input v-model.number="minPrice" type="number" placeholder="最低价格"></el-input>
            <el-input v-model.number="maxPrice" type="number" placeholder="最高价格"></el-input>
          </div>
          <div class="search-buttons">
            <el-button @click="searchProducts" type="primary">搜索</el-button>
            <el-button v-if="usertype === 'Admin'" type="primary" @click="addNewData">添加新数据</el-button>
          </div>
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
              <th v-if="usertype === 'Admin'">操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 在表格中添加编辑状态的标志 -->
            <tr v-for="product in products" :key="product.product_id">
              <td>{{ product.product_id }}</td>
              <td>
                <span v-if="!product.editing">{{ product.product_name }}</span>
                <el-input v-model="product.editingName" v-if="product.editing"></el-input>
              </td>
              <td>
                <span v-if="!product.editing">{{ product.price }}</span>
                <el-input v-model.number="product.editingPrice" v-if="product.editing"></el-input>
              </td>
              <td>
                <span v-if="!product.editing">{{ product.manufacturer }}</span>
                <el-input v-model="product.editingManufacturer" v-if="product.editing"></el-input>
              </td>
              <td>
                <span v-if="!product.editing">{{ product.raw_material }}</span>
                <el-input v-model="product.editingRawMaterial" v-if="product.editing"></el-input>
              </td>
              <td>
                <span v-if="!product.editing">{{ product.product_desc }}</span>
                <el-input v-model="product.editingDesc" v-if="product.editing"></el-input>
              </td>
              <td v-if="usertype === 'Admin'">
                <el-button v-if="!product.editing" @click="editProduct(product)">编辑</el-button>
                <el-button v-else @click="saveProduct(product)">保存</el-button>
                <el-button type="danger" @click="deleteProduct(product)">删除</el-button>
              </td>
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
import { ElMessageBox } from 'element-plus';

export default defineComponent({
  components: {
    ElMessageBox
  },
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
      } catch (error) {
        console.error('未能获取到数据', error);
      }
    };

    const nextPage = () => {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        fetchProducts();
      }
    };

    const prevPage = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
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

    const addNewData = () => {
      // 清空表单数据
      clearForm();
      // 将dialogVisible设置为true，显示弹窗
      dialogVisible.value = true;
    };

    const editProduct = (product) => {
      // 设置编辑状态
      product.editing = true;
      // 缓存原始数据
      product.editingName = product.product_name;
      product.editingPrice = product.price;
      product.editingManufacturer = product.manufacturer;
      product.editingRawMaterial = product.raw_material;
      product.editingDesc = product.product_desc;
    };

    const saveProduct = async (product) => {
      // 发送请求保存数据的逻辑
      try {
        const response = await axios.post('http://localhost:3000/update-product', {
          product_id: product.product_id,
          product_name: product.editingName,
          price: product.editingPrice,
          manufacturer: product.editingManufacturer,
          raw_material: product.editingRawMaterial,
          product_desc: product.editingDesc,
        });
        if (response.data.success) {
          // 保存成功后，退出编辑状态
          product.editing = false;
          // 重新加载数据
          fetchProducts();
        } else {
          console.error('保存失败');
        }
      } catch (error) {
        console.error('保存失败', error);
      }
    };

    const deleteProduct = async (product) => {
      try {
        const confirmed = await ElMessageBox.confirm('确定删除该产品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(() => {});
        if (confirmed) {
          // 发送请求将产品从后端删除
          await axios.post('http://localhost:3000/delete-product', { product_id: product.product_id });
          // 刷新产品列表
          fetchProducts();
        }
      } catch (error) {
        console.error('删除产品时出错', error);
      }
    };

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
      addNewData,
      editProduct,
      saveProduct,
      deleteProduct,
      ElMessageBox
    };
  },
});
</script>

<style scoped>
@import "../css/BeerCategory.css";
</style>

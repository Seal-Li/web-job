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
        <!-- 展示用户信息的容器 -->
        <div class="user-info-container">
          <div>
            <span class="info-label">用户名：</span>
            <span v-if="!isEditing" class="info-text">{{ username }}</span>
            <input v-if="isEditing" v-model="editedUsername" />
            <span class="edit-button" @click="toggleEditing">{{ isEditing ? '保存' : '编辑' }}</span>
          </div>
          <div>
            <span class="info-label">绑定手机号：</span>
            <span v-if="!isEditing" class="info-text">{{ telphone }}</span>
            <input v-if="isEditing" v-model="editedTelphone" />
          </div>
          <div>
            <span class="info-label">绑定邮箱：</span>
            <span v-if="!isEditing" class="info-text">{{ email }}</span>
            <input v-if="isEditing" v-model="editedEmail" />
          </div>
          <div>
            <span class="info-label">用户类型：</span>
            <span v-if="!isEditing" class="info-text">{{ usertype }}</span>
            <input v-if="isEditing" v-model="editedUsertype" />
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
import { computed, watchEffect, ref } from 'vue';

export default {
  setup() {
    const userStore = useUserStore();

    // 获取用户名
    const username = computed(() => userStore.username);
    const email = computed(() => userStore.email);
    const telphone = computed(() => userStore.telphone);
    const usertype = computed(() => userStore.usertype);
    const money = computed(() => userStore.money);

    // 编辑状态
    const isEditing = ref(false);

    // 编辑时的临时变量
    const editedUsername = ref('');
    const editedTelphone = ref('');
    const editedEmail = ref('');
    const editedUsertype = ref('');

    // 在用户信息更新时自动更新用户名
    watchEffect(() => {
      console.log('User info updated:', userStore.$state);
      // 这里可以执行一些其他的逻辑
    });

    // 切换编辑状态
    const toggleEditing = () => {
      if (isEditing.value) {
        // 保存编辑后的信息
        userStore.setUsername(editedUsername.value);
        userStore.setTelphone(editedTelphone.value);
        userStore.setEmail(editedEmail.value);
        userStore.setUsertype(editedUsertype.value);
      } else {
        // 进入编辑状态时，将编辑前的信息保存到临时变量中
        editedUsername.value = username.value;
        editedTelphone.value = telphone.value;
        editedEmail.value = email.value;
        editedUsertype.value = usertype.value;
      }

      // 切换编辑状态
      isEditing.value = !isEditing.value;
    };

    return {
      username,
      email,
      telphone,
      usertype,
      isEditing,
      editedUsername,
      editedTelphone,
      editedEmail,
      editedUsertype,
      toggleEditing,
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

.user-info-container {
  margin: 20px auto;
  padding: 15px;
  border: 2px solid #ddd;
  width: 60%;
  text-align: left;
  font-size: 18px;
  line-height: 4; /* 行高 */
}

.info-label {
  font-weight: bold;
  margin-bottom: 8px; /* 文本和标签之间的距离 */
}

.info-text {
  margin-bottom: 15px; /* 文本与编辑按钮之间的距离 */
}

.edit-button {
  cursor: pointer;
  color: blue;
  float: right;
}
</style>
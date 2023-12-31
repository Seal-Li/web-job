<template>
  <div class="home-container">
    <!-- 上方导航栏 -->
    <div class="nav-bar">
      <div class="welcome">欢迎{{ username }}！</div>
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
      <div class="side-bar" :class="{ hide: isSideBarHidden }">
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
            <el-button class="edit-button" @click="saveInfo">
              {{ isEditing ? '保存信息' : '编辑信息' }}
            </el-button>
          </div>
          <div>
            <span class="info-label">用户名：</span>
            <span v-if="!isEditing" class="info-text">{{ username }}</span>
            <el-input v-if="isEditing" v-model="editedUsername" :readonly="!isEditing"> </el-input>
          </div>
          <div>
            <span class="info-label">绑定手机号：</span>
            <span v-if="!isEditing" class="info-text">{{ telphone }}</span>
            <el-input v-if="isEditing" v-model="editedTelphone" :readonly="!isEditing"> </el-input>
          </div>
          <div>
            <span class="info-label">绑定邮箱：</span>
            <span v-if="!isEditing" class="info-text">{{ email }}</span>
            <el-input v-if="isEditing" v-model="editedEmail" :readonly="!isEditing"> </el-input>
          </div>
          <div>
            <span class="info-label">用户类型：</span>
            <span v-if="!isEditing" class="info-text">{{ usertype }}</span>
            <el-select v-if="isEditing" v-model="editedUsertype" :readonly="!isEditing" placeholder="请选择用户类型">
              <el-option
                v-for="type in userTypes"
                :key="type.value"
                :label="type.label"
                :value="type.value"
                :disabled="isUserTypeDisabled(type.value)"></el-option>
            </el-select>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { computed, watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const userStore = useAuthStore();

    const userTypes = [
      { value: 'Customer', label: '消费者' },
      { value: 'Dealer', label: '经销商' },
    ];

    const isUserTypeDisabled = (type) => {
      // 用户类型为管理员时不可编辑
      return isEditing.value && userStore.usertype === 'Admin';
    };

    // 获取用户名
    const username = computed(() => userStore.username);
    const email = computed(() => userStore.email);
    const telphone = computed(() => userStore.telphone);
    const usertype = computed(() => userStore.usertype);

    // 编辑状态
    const isEditing = ref(false);

    // 编辑时的临时变量
    const editedUsername = ref(username.value);
    const editedTelphone = ref(telphone.value);
    const editedEmail = ref(email.value);
    const editedUsertype = ref(usertype.value);

    // 在用户信息更新时自动更新用户名
    watchEffect(() => {
      console.log('用户信息已更新:', userStore.$state);
    });

    // 保存信息到后端数据库
    const saveInfo = async () => {
      if (isEditing.value) {
        // 处于编辑模式，保存信息到后端数据库
        try {
          let response = await axios.post('/update-user-info', {
            userid: userStore.userid,
            username: editedUsername.value,
            telphone: editedTelphone.value,
            email: editedEmail.value,
            usertype: editedUsertype.value,
          });
          if (response.data.success) {
            // 保存成功，更新本地存储
            userStore.setUsername(editedUsername.value);
            userStore.setTelphone(editedTelphone.value);
            userStore.setEmail(editedEmail.value);
            userStore.setUsertype(editedUsertype.value);
          } else {
            console.error('保存信息失败');
          }
        } catch (error) {
          console.error('保存信息失败', error);
        }

        // 退出编辑模式
        isEditing.value = false;
      } else {
        // 不处于编辑模式，切换到编辑模式
        // 将编辑前的信息保存到临时变量中
        editedUsername.value = username.value;
        editedTelphone.value = telphone.value;
        editedEmail.value = email.value;
        editedUsertype.value = usertype.value;

        // 切换编辑状态
        isEditing.value = true;
      }
    };

    // 切换编辑状态的方法
    const toggleEditing = () => {
      isEditing.value = !isEditing.value;
    };

    // 退出登录
    const logout = () => {
      // 处理退出登录逻辑
      console.log('执行退出登录操作');
      // 更新登录状态
      console.log("开始执行退出")
      userStore.logout();
      console.log("执行退出")

      // 导航到登录页面并替换当前路由历史
      router.push('/');
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
      saveInfo,
      toggleEditing,
      logout,
      userTypes,
      isUserTypeDisabled,
      userStore
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
  computed: {
    sideItemsInRows() {
      return Array.from({ length: Math.ceil(this.sideItems.length / this.itemsPerRow) }, (v, i) =>
        this.sideItems.slice(i * this.itemsPerRow, i * this.itemsPerRow + this.itemsPerRow)
      );
    },
  },
  mounted() {
    // 将 body 的 margin 设置为 0
    document.body.style.margin = '0';
  },
};
</script>

<style scoped>
@import "../css/Home.css";

.user-info-container {
  margin: 20px auto;
  padding: 25px;
  border: 1px solid #ddd;
  width: 60%;
  text-align: left;
  font-size: 18px;
  line-height: 4; /* 调整行高 */
  border-radius: 5px;
}

.info-label {
  font-weight: bold;
  margin-bottom: 8px;
}

.info-text {
  margin-bottom: 15px;
}

.edit-button {
  cursor: pointer;
  color: blue;
  float: right;
}

/* 调整输入框的长度 */
.el-input {
  width: 200px; /* 根据需要调整宽度 */
}
</style>

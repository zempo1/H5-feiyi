<template>
  <div class="container">
    <div class="login" @click="login">
      <div class="avatar">
        <img :src="userStore.avatarUrl ? userStore.avatarUrl : '../../assets/icon/User-Circle.png'">
      </div>
      <span class="name">{{userStore.refreshToken ? userStore.nickName : '请点击登录'}}</span>
    </div>
    <div class="group">
      <div class="list">
        <img src="../../assets/icon/message.svg"  >
        <span class="text">我的互动</span>
      </div>
      <div class="list">
        <img src="../../assets/icon/badge.svg"> 
        <span class="text">我的徽章</span>
      </div>
      <div class="list" @click="router.push('/myInfo')">
        <img src="../../assets/icon/Settings.svg"> 
        <span class="text">账户设置</span>             
      </div>
       <div class="list" @click="logout">
        <span class="text">退出登录</span>             
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useuserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useuserStore()
import { apiLogout } from '@/api';

const login = () => {
    if(userStore.refreshToken) {
        router.push('/myInfo')
    }else {
        router.push('/login')
    }
}

const logout = async () => {
    await apiLogout()
    userStore.removeAll()
    router.push('/login')
}

</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.login {
    display: flex;
    align-items: center;
    font-size: 20px;
    .name {
        color: #333;
        font-weight: 600;
        padding-right: 20px;
    }
}
.avatar {
    width: 80px;
    height: 80px;
    border-radius: 30%;
    margin: 40px 20px;
    padding-left: 20px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        border-radius: 30%;
        object-fit: cover;
    }
}
.group {
  display: flex;
  flex-direction: column;
  padding: 20px;
    .list {
      position: relative;
      display: flex;
      align-items: center;
      padding: 10px 0;
      img {
        width: 30px;
        height: 30px;
      }
      span {
        font-size: 18px;
        color: #333;
        margin-left: 10px;
      }
    }
    .list::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px; /* 渐变线高度 */
      background: linear-gradient(to right, transparent, #666 30%, #666 70%, transparent);
    }
}


// PC端适配
@media (min-width: 768px) {
    .container {
        padding: 0 10px;
        max-width: 600px;
        margin: 0 auto;
    }
    

}

</style>
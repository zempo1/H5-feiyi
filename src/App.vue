<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useuserStore } from './stores/user';
  const userStore = useuserStore();
  const route = useRoute();
  
  // 判断是否显示 tabbar
  const showTabbar = computed(() => {
    const loginRoutes = ['/', '/login', '/register', '/loginIndex'];
    return !loginRoutes.includes(route.path);
  });
</script>

<template>
  <router-view></router-view>
  <van-tabbar route v-if="showTabbar">
    <van-tabbar-item replace to="/index" icon="wap-home-o">首页</van-tabbar-item>
    <van-tabbar-item replace to="/resources" icon="tv-o">非遗资源</van-tabbar-item>
    <van-tabbar-item replace to="/study" icon="records-o">学习打卡</van-tabbar-item>
    <van-tabbar-item replace to="/postBar" icon="apps-o">社区</van-tabbar-item>
    <van-tabbar-item replace to="/my" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss">

@media (min-width: 768px) {
   :root:root {
    --van-tabbar-height: 32px;
    --van-tabbar-item-font-size: 8px;
    --van-tabbar-item-icon-size: 12px;
    --van-tabbar-item-line-height: 4px;
    --van-tabbar-item-icon-margin-bottom: 4px;
  }

}
@media (min-width: 1200px) {
   :root:root {
    --van-tabbar-height: 20px;
    --van-tabbar-item-font-size: 4px;
    --van-tabbar-item-icon-size: 8px;
    --van-tabbar-item-line-height: 2px;
    --van-tabbar-item-icon-margin-bottom: 2px;
  }
}
@media (orientation: landscape) and (max-height: 600px) {
  :root:root {
    --van-tabbar-height: 20px;
    --van-tabbar-item-font-size: 4px;
    --van-tabbar-item-icon-size: 8px;
    --van-tabbar-item-line-height: 2px;
    --van-tabbar-item-icon-margin-bottom: 2px;
  }
}
</style>

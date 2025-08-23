<!-- <script setup>
import Tabbar from './components/Tabbar.vue';

</script>
 
 <template>
   <router-view></router-view>
   
   <Tabbar />
  
 </template>
 
 <style lang="scss">
 

 </style> -->
<script setup>
 import { ref, computed,onMounted,nextTick} from 'vue'
  import { useRoute } from 'vue-router'
  import { useuserStore } from '@/stores/user';
  import studyActive from '@/assets/tabbar/study-h.svg'
  import studyInactive from '@/assets/tabbar/study.svg'
  import indexActive from '@/assets/tabbar/index-h.svg'
  import indexInactive from '@/assets/tabbar/index.svg'
  import resourceActice from '@/assets/tabbar/resource-h.svg'
  import resourceInactive from '@/assets/tabbar/resource.svg'
  import postBarActive from '@/assets/tabbar/postBar-h.svg'
  import postBarInactive from '@/assets/tabbar/postBar.svg'
  import myActive from '@/assets/tabbar/user-h.svg'
  import myInactive from '@/assets/tabbar/user.svg'

  const userStore = useuserStore();
  const route = useRoute();
 const tabbarRef = ref();
 onMounted( async () => {
   await nextTick();
   console.log(tabbarRef.value);
   if(tabbarRef.value && tabbarRef.value.$el.offsetHeight){
     const tabbarHeight = tabbarRef.value.$el.offsetHeight;
     console.log(tabbarHeight);
     const root = document.documentElement;
     root.style.setProperty('--tabbar-height', `${tabbarHeight}px`);
   }
 
 })
  
   // 判断是否显示 tabbar
   const showTabbar = computed(() => {
     const loginRoutes = ['/index', '/resources', '/study', '/postBar','/my'];
     return loginRoutes.includes(route.path);
   });
   
   const active = ref(0)
  const icons = {
    home: { active: indexActive, inactive: indexInactive },
    study: { active: studyActive, inactive: studyInactive },
    resource: { active: resourceActice, inactive: resourceInactive },
    postBar: { active: postBarActive, inactive: postBarInactive },
    my: { active: myActive, inactive: myInactive }
  }
 
</script>

<template>
   <router-view></router-view>
    <van-tabbar route v-if="showTabbar" ref="tabbarRef" safe-area-inset-bottom  >
    <van-tabbar-item replace to="/index" >
      <span>首页</span>
      <template #icon="props">
        <img :src="props.active ? icons.home.active : icons.home.inactive" class="van-icon-img"  />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/resources" icon="tv-o">
      <span>非遗资源</span>
      <template #icon="props">
        <img :src="props.active ? icons.resource.active : icons.resource.inactive"  class="van-icon-img" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/study">
      <span>学习打卡</span>
      <template #icon="props">
        <img :src="props.active ? icons.study.active : icons.study.inactive" class="van-icon-img" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/postBar" icon="apps-o">
      <span>社区</span>
      <template #icon="props">
        <img :src="props.active ? icons.postBar.active : icons.postBar.inactive" class="van-icon-img" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/my" icon="user-o" class="van-icon-img">
      <span>我的</span>
      <template #icon="props">
        <img :src="props.active ? icons.my.active : icons.my.inactive" class="van-icon-img" />
      </template>
    </van-tabbar-item>
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
   .van-icon-img {
      width: 12px;
   }
 }
 @media (min-width: 1200px) {
    :root:root {
     --van-tabbar-height: 26px;
     --van-tabbar-item-font-size: 4px;
     --van-tabbar-item-icon-size: 8px;
     --van-tabbar-item-line-height: 2px;
     --van-tabbar-item-icon-margin-bottom: 2px;
   }
 }
 @media (orientation: landscape) and (max-height: 600px) {
   :root:root {
     --van-tabbar-height: 26px;
     --van-tabbar-item-font-size: 4px;
     --van-tabbar-item-icon-size: 8px;
     --van-tabbar-item-line-height: 2px;
     --van-tabbar-item-icon-margin-bottom: 2px;
   }
 }
</style>
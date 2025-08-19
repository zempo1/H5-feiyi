<script setup>
 import Tabbar from './components/Tabbar.vue';
</script>
 
 <template>
   <router-view></router-view>
   <!-- 底部导航栏 -->
   <Tabbar />
  
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

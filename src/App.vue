<script setup>
import Tabbar from './components/Tabbar.vue';


</script>
 
 <template>
   <router-view></router-view>
   
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

     --van-nav-bar-height: 32px;
     --van-nav-bar-title-font-size: 12px;
     --van-nav-bar-arrow-size: 12px;
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

     --van-nav-bar-height: 20px;
     --van-nav-bar-title-font-size: 6px;
     --van-nav-bar-arrow-size: 6px;
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
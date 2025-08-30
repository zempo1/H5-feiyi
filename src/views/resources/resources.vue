<template>
    <div class="container">
      <div class="top">
        <van-nav-bar title="非遗文化库" @click-left="sift" safe-area-inset-top >
          <template #left>
            <van-icon name="wap-nav" size="22"/>
          </template>
        </van-nav-bar>
        <van-search
          placeholder="搜索非遗文化"
          shape="round"
          background="#f4f1ea"
          disabled
        >
        </van-search> 
      </div>
      <div class="banner">
        <div class="my-swipe">
        <van-swipe  :autoplay="3000" indicator-color="white">
          <van-swipe-item>1</van-swipe-item>
          <van-swipe-item>2</van-swipe-item>
          <van-swipe-item>3</van-swipe-item>
          <van-swipe-item>4</van-swipe-item>
        </van-swipe>
        </div>
        <div class="text">
          文字
        </div>
      </div>
      <div class="list" v-for="item in 50">2</div>
    </div>  
</template>

<script setup>
import { ref,onMounted,watch } from 'vue';


const sift = (e) => {
  console.log(e);
}
</script>

<style lang="scss" scoped>

    
.container {
  min-height: 100vh;
}
.top {
  position: sticky;
  top: 0;
  z-index: 999;
  width: 100%;
}

.banner {
  // height: 200px;
  padding: 10px 15px;
  font-size: 20px;
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 130px;
    text-align: center;
    background-color: #39a9ed;
    border-radius: 15px;
  }
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}


</style>
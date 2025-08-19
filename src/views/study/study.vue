<template>
    <div class="container">
       <div class="search-header">
      <van-search
        placeholder="搜索帖子、用户、话题"
        shape="round"
      >
      </van-search>
    </div>
    
    <!-- 分类标签 -->
    <div class="category-tabs">
      <van-tabs v-model:active="activeTab" sticky :offset-top ="searchHeaderHeight">
        <van-tab title="精华" name="essence">
          <div ref="contentContainerRef" @scroll="onScroll" :style="contentStyle">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :disabled="isRefreshDisable">
                  <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                  >
                    <van-cell v-for="item in list" :key="item" :title="item" />
                  </van-list>
            </van-pull-refresh>
          </div>

        </van-tab>
        <van-tab title="热门" name="hot">

        </van-tab>
        <van-tab title="最新" name="latest">

        </van-tab>
        <van-tab title="视频" name="video">

        </van-tab>
      </van-tabs>
    </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRect } from '@vant/use';

 const isRefreshDisable = ref(true)
 const contentContainerRef = ref()
 // 监听滚动
 const onScroll = () => {
  // 获取到滚动的元素的滚动距离
  const scrollTop = contentContainerRef.value.scrollTop
  // 距离大于0时，下拉刷新不生效
  if (scrollTop > 0) {
    isRefreshDisable.value = true
  } else {
    isRefreshDisable.value = false
  }
}

const searchHeaderHeight = ref(0);

const contentStyle = computed(() => {
  const tabHeaderHeight = 44; // van-tabs an-tabs__wrap height is 44px
  return {
    height: `calc(100vh - ${searchHeaderHeight.value}px - ${tabHeaderHeight}px)`,
    overflowY: 'auto',
  };
});

onMounted( () => {
  const searchHeader = document.querySelector('.search-header');
  searchHeaderHeight.value = searchHeader.offsetHeight;
});




const activeTab = ref('essence');
 const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);

    const onLoad = () => {
      console.log('加载更多');
      setTimeout(() => {
        if (refreshing.value) {
          list.value = [];
          refreshing.value = false;
        }

        for (let i = 0; i < 35; i++) {
          list.value.push(list.value.length + 1);
        }
        loading.value = false;

        if (list.value.length >= 40) {
          finished.value = true;
        }
      }, 200);
    };

    const onRefresh = () => {
      // 清空列表数据
      finished.value = false;
      console.log('刷新');
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loading.value = true;
      onLoad();
    };


</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
  
  .search-header {
       position: sticky;
    top: 0;
    z-index: 100;
  }
}

</style>
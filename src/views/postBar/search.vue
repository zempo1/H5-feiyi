<template>
    <div class="container">
      <van-nav-bar
        v-model="searchValue"
        title="搜索"
        left-arrow
        @click-left="goBack"
        safe-area-inset-top
        fixed
        placeholder
      />
      <div class="search">
        <van-search
          v-model="searchValue"
          @search="onSearch"
          placeholder="搜索帖子、用户、话题"
          shape="round"
          background="#f3efe8"
          ref="search"
        >
        </van-search>
        <div class="history-panel" v-if="historyList.length > 0">
          <div class="history-header">
            <span class="title">搜索历史</span>
            <van-icon name="delete-o" size="20" color="gray" @click="deleteHistory" />
          </div>
     
          <div class="history-tags" >
            <div class="item" v-for="item in historyList" :key="item" @click="gotoSearch(item)">
                {{ item }}
            </div>
          </div>
        </div>
         <!-- 无记录提示 -->
        <van-empty v-else description="暂无搜索历史" />
      </div>
    </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
const router = useRouter()

const searchValue = ref('')
const historyList = ref([])

const saveHistory = () => {
    localStorage.setItem('searchHistory', JSON.stringify(historyList.value))
}
const loadHistory = () => {
    historyList.value = JSON.parse(localStorage.getItem('searchHistory') || '[]')
}
loadHistory()

const search = ref(null)
onMounted(() => {
  search.value.focus()
})

const onSearch = () => {
    if(searchValue.value) {
        historyList.value = [
            ...historyList.value.filter(item => item !== searchValue.value),
            searchValue.value
        ].slice(-10)
        saveHistory()
        router.push({
          name: 'searchList',
          query: {
            q: searchValue.value
          }
        })
        searchValue.value = ''
    }
}

const deleteHistory = () => {
    showConfirmDialog({
        message: '确认删除搜索历史吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonColor: '#ee0a24',
        onConfirm: () => {
            historyList.value = []
            saveHistory()
        }
    })
}

const gotoSearch = (item) => {
  router.push({
    name: 'searchList',
    query: {
      q: item
    }
  })
}

const goBack = () => {
    router.push({
      name: 'postBar'
    })
}

</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background-color: #f3efe8;
}
.search {
    margin-top: 10px;
}
.history-panel {
  margin-top: 20px;
  padding: 0 20px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  .title {
    font-size: 18px;
    font-weight: 600;
  }
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .item {
    font-size: 16px;
    height: 32px;
    line-height: 32px;
    padding: 2px 16px;
    border-radius: 8px;
    background-color: #ddd;

  }
}
</style>
 <template>
  <div class="community-page">
    <div>
      <!-- 顶部搜索栏 -->
      <div class="search-header" @click="gotoSearch">
        <van-search
          placeholder="搜索帖子、用户、话题"
          shape="round"
          background="#f3efe8"
          
        >
        </van-search>
      </div>
      
      <!-- 分类标签 -->
      <div class="category-tabs">
        <van-tabs
          v-model:active="activeTab" 
          type="card" 
          color="#997a41"
          sticky 
          :offset-top ="searchHeaderHeight" 
          @click-tab="onClickTab"
        >
          <van-tab ref="tabs" title="精华" name="essence">
            <div class="tab-content">
              <post-list
                @load="onLoad" 
                @onRefresh="onRefresh" 
                :finished="uiPost.essenceEmpty" 
                v-model:loading="uiPost.loading" 
                :posts="essencePosts" 
                :searchHeaderHeight="searchHeaderHeight" 
                :tabsHeight="tabsHeight" 
              />
            </div>
          </van-tab>
          <van-tab title="热门" name="hot">
            <div class="tab-content">
              <post-list :posts="hotPosts"  :searchHeaderHeight="searchHeaderHeight" :tabsHeight="tabsHeight" />
            </div>
          </van-tab>
          <van-tab title="最新" name="latest">
            <div class="tab-content">
              <post-list :posts="latestPosts" :searchHeaderHeight="searchHeaderHeight" :tabsHeight="tabsHeight" />
            </div>
          </van-tab>
          <van-tab title="视频" name="video">
            <div class="tab-content">
              <post-list :posts="videoPosts" :searchHeaderHeight="searchHeaderHeight" :tabsHeight="tabsHeight"/>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>


    <!-- 发帖按钮 -->
    <van-floating-bubble
      axis="xy"
      magnetic="x"
      @click="gotoPublish"
      gap="28"
    >
      <van-icon name="plus" size="20" />
    </van-floating-bubble>

    <!-- 发帖对话框 -->
    <van-dialog
      v-model:show="showPostDialog"
      title="发布帖子"
      :show-confirm-button="false"
      class="post-dialog"
    >
      <div class="post-form">
        <van-field
          v-model="newPost.title"
          placeholder="请输入标题"
          maxlength="50"
          show-word-limit
        />
        <van-field
          v-model="newPost.content"
          type="textarea"
          placeholder="分享你的想法..."
          rows="4"
          maxlength="500"
          show-word-limit
        />
        <van-uploader
          v-model="newPost.images"
          multiple
          :max-count="9"
          :after-read="afterRead"
        />
        <div class="post-actions">
          <van-button type="primary" @click="submitPost">发布</van-button>
          <van-button @click="showPostDialog = false">取消</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted ,nextTick } from 'vue';
import { showToast, showSuccessToast } from 'vant';
import {apiGetPostList} from '@/api'
import PostList from './components/PostList.vue';
import router from '@/router';

class UIPost {
  constructor() {
    this.essencePage = 0;
    this.essenceSize = 5
    this.essenceTotalPages = 1
    this.essenceEmpty = false
    this.loading = false //组件的
    this.isLoading = false //用于防抖
  }

  async getPostList(params) {
    if(this.essenceEmpty || this.isLoading) {
      return;
    }
    try {
      uiPost.loading = true
      this.isLoading = true
      const res = await apiGetPostList(params);
      console.log(res);
      essencePosts.value = [...essencePosts.value,...res.data.content]
      this.essencePage ++;
      this.essenceTotalPages = res.data.totalPages
      if(this.essencePage > this.essenceTotalPages) this.essenceEmpty = true
      console.log(essencePosts.value);
    } catch (error) {
      console.log(error);
    }finally {
      uiPost.loading = false
      this.isLoading = false
    }

  }

}
const uiPost = new UIPost();

const onRefresh = () => {
  console.log('子调用父方法');
  if(activeTab.value === 'essence') {
    uiPost.essencePage = 0;
    uiPost.essenceEmpty = false
    essencePosts.value = []
    uiPost.getPostList({
      page: 0,
      size: uiPost.essenceSize
    })
    // uiPost.getPostList({
    //   page: 0,
    //   size: 5
    // })
  }
}

const onLoad = () => {
  uiPost.getPostList({
    page: uiPost.essencePage,
    size: uiPost.essenceSize
  })
}

//计算ref为searchHeader的盒子的高度
const searchHeaderHeight = ref(0);
const tabsHeight = ref(0);
const tabs = ref()
onMounted( async() => {
  await nextTick();
  const searchHeader = document.querySelector('.search-header');
  searchHeaderHeight.value = searchHeader.offsetHeight;
  tabsHeight.value = tabs.value.$el.offsetTop;
   uiPost.getPostList({
    page: 0,
    size: uiPost.essenceSize
  })
});

//切换类型
const onClickTab = (e) => {
  console.log(e);
}
// 响应式数据
const activeTab = ref('essence');
const showPostDialog = ref(false);


//四种类型的帖子
const essencePosts = ref([]);

const hotPosts = ref([
  {
     "id": 1943635217659072512,
        "title": "看看潮汕英歌舞",
        "content": "老铁们，今天和王力宏来到了潮汕潮安区，来看看这英歌舞这么个事",
        "type": "IMAGE",
        "status": "PUBLISHED",
        "images": [
            "https://loremflickr.com/400/400?lock=7326805739230008"
        ],
        "tags": [
            "英歌舞",
            "潮汕",
            "甜妹"
        ],
        "viewCount": 0,
        "likeCount": 0,
        "commentCount": 0,
        "shareCount": 0,
        "isTop": false,
        "isHot": false,
        "createdAt": [
            2025,
            7,
            11,
            19,
            35,
            21,
            543812000
        ],
        "updatedAt": [
            2025,
            7,
            11,
            19,
            35,
            21,
            543812000
        ],
        "author": {
            "id": 1939884796922695680,
            "username": "mobile_13709670518",
            "nickname": "Aseubel",
            "avatar": null,
            "level": 1,
            "isActive": true
        },
        "interestTags": [],
        "isLiked": false,
        "isFollowingAuthor": false
  }
]);

const latestPosts = ref([
  {
     "id": 1943635217659072512,
        "title": "看看潮汕英歌舞",
        "content": "老铁们，今天和王力宏来到了潮汕潮安区，来看看这英歌舞这么个事",
        "type": "IMAGE",
        "status": "PUBLISHED",
        "images": [
            "https://loremflickr.com/400/400?lock=7326805739230008"
        ],
        "tags": [
            "英歌舞",
            "潮汕",
            "甜妹"
        ],
        "viewCount": 0,
        "likeCount": 0,
        "commentCount": 0,
        "shareCount": 0,
        "isTop": false,
        "isHot": false,
        "createdAt": [
            2025,
            7,
            11,
            19,
            35,
            21,
            543812000
        ],
        "updatedAt": [
            2025,
            7,
            11,
            19,
            35,
            21,
            543812000
        ],
        "author": {
            "id": 1939884796922695680,
            "username": "mobile_13709670518",
            "nickname": "Aseubel",
            "avatar": null,
            "level": 1,
            "isActive": true
        },
        "interestTags": [],
        "isLiked": false,
        "isFollowingAuthor": false
  }
]);

const videoPosts = ref([
 {
     "id": 1943635217659072512,
        "title": "看看潮汕英歌舞",
        "content": "老铁们，今天和王力宏来到了潮汕潮安区，来看看这英歌舞这么个事",
        "type": "IMAGE",
        "status": "PUBLISHED",
        "images": [
            "https://loremflickr.com/400/400?lock=7326805739230008"
        ],
        "tags": [
            "英歌舞",
            "潮汕",
            "甜妹"
        ],
        "viewCount": 0,
        "likeCount": 0,
        "commentCount": 0,
        "shareCount": 0,
        "isTop": false,
        "isHot": false,
        "createdAt": [
            2025,
            7,
            11,
            19,
            35,
            21,
            543812000
        ],
        "updatedAt": [
            2025,
            7,
            11,
            19,
            35,
            21,
            543812000
        ],
        "author": {
            "id": 1939884796922695680,
            "username": "mobile_13709670518",
            "nickname": "Aseubel",
            "avatar": null,
            "level": 1,
            "isActive": true
        },
        "interestTags": [],
        "isLiked": false,
        "isFollowingAuthor": false
  }
]);

const gotoPublish = () => {
  router.push('/publish');
}

const afterRead = (file) => {
  // 处理图片上传
  console.log('上传图片:', file);
};

const submitPost = () => {
  if (!newPost.title.trim() || !newPost.content.trim()) {
    showToast('请填写标题和内容');
    return;
  }
};

const gotoSearch = () => {
  console.log(1);
  router.push('/search');
}

</script>

<style lang="scss" scoped>
.community-page {
  min-height: 100vh;

  .search-header {
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .category-tabs {
    background-color: #f3efe8;
    margin-top: 10px;
  }
  
  .tab-content {
    padding: 12px;
  }
  
  
}
</style>
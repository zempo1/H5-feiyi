 <template>
  <div class="community-page">
    <div>
      <!-- 顶部搜索栏 -->
      <div class="search-header">
        <van-search
          placeholder="搜索帖子、用户、话题"
          shape="round"
        >
        </van-search>
      </div>
      
      <!-- 分类标签 -->
      <div class="category-tabs">
        <van-tabs v-model:active="activeTab" sticky :offset-top ="searchHeaderHeight" @click-tab="onClickTab">
          <van-tab ref="tabs" title="精华" name="essence">
            <div class="tab-content">
              <post-list @load="onLoad" :posts="essencePosts" :searchHeaderHeight="searchHeaderHeight" :tabsHeight="tabsHeight" />
            </div>
          </van-tab>
          <van-tab title="热门" name="hot">
            <div class="tab-content">
              <post-list :posts="hotPosts" :searchHeaderHeight="searchHeaderHeight" :tabsHeight="tabsHeight" />
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
  }

  async getPostList(params) {
    const res = await apiGetPostList(params);
    console.log(res);
    essencePosts.value = [...essencePosts.value,...res.data.content]
    console.log(essencePosts.value);
  }
}
const uiPost = new UIPost();

const onLoad = () => {
  console.log('onLoad');
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
    size: 10
  })
});

const onClickTab = (e) => {
  console.log(e);
}
// 响应式数据
const activeTab = ref('essence');
const showPostDialog = ref(false);

// 新帖子数据
const newPost = reactive({
  title: '',
  content: '',
  images: []
});

// 模拟帖子数据
const essencePosts = ref([
  // {
  //   id: 1,
  //   avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  //   nickname: '非遗传承人',
  //   time: '2小时前',
  //   title: '传统手工艺的魅力',
  //   content: '今天想和大家分享一些传统手工艺的制作过程，这些技艺承载着深厚的文化内涵...',
  //   images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
  //   likes: 128,
  //   comments: 32,
  //   collections: 15,
  //   isLiked: false,
  //   isCollected: false
  // },
  // {
  //   id: 2,
  //   avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  //   nickname: '文化爱好者',
  //   time: '4小时前',
  //   title: '校园非遗文化节精彩回顾',
  //   content: '刚刚结束的校园非遗文化节真是太精彩了！各种传统技艺展示让人大开眼界...',
  //   images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
  //   likes: 89,
  //   comments: 18,
  //   collections: 8,
  //   isLiked: true,
  //   isCollected: false
  // },
  // {
  //   id: 3,
  //   avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  //   nickname: '文化爱好者',
  //   time: '4小时前',
  //   title: '校园非遗文化节精彩回顾',
  //   content: '刚刚结束的校园非遗文化节真是太精彩了！各种传统技艺展示让人大开眼界...',
  //   images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
  //   likes: 89,
  //   comments: 18,
  //   collections: 8,
  //   isLiked: true,
  //   isCollected: false
  // },
  //  {
  //   id: 4,
  //   avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  //   nickname: '文化爱好者',
  //   time: '4小时前',
  //   title: '校园非遗文化节精彩回顾',
  //   content: '刚刚结束的校园非遗文化节真是太精彩了！各种传统技艺展示让人大开眼界...',
  //   images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
  //   likes: 89,
  //   comments: 18,
  //   collections: 8,
  //   isLiked: true,
  //   isCollected: false
  // }
]);

const hotPosts = ref([
  {
    id: 3,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    nickname: '校园达人',
    time: '1小时前',
    title: '如何制作传统剪纸艺术',
    content: '剪纸艺术是中国传统文化的重要组成部分，今天教大家制作简单的窗花...',
    images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
    likes: 256,
    comments: 45,
    collections: 23,
    isLiked: false,
    isCollected: true
  }
]);

const latestPosts = ref([
  {
    id: 4,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    nickname: '新用户',
    time: '30分钟前',
    title: '第一次体验传统陶艺',
    content: '今天第一次尝试制作陶艺，虽然手法还很生疏，但感受到了传统工艺的魅力...',
    images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
    likes: 12,
    comments: 3,
    collections: 2,
    isLiked: false,
    isCollected: false
  }
]);

const videoPosts = ref([
  {
    id: 5,
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    nickname: '视频创作者',
    time: '2小时前',
    title: '传统木雕技艺展示',
    content: '通过视频展示传统木雕的制作过程，让大家更直观地了解这项技艺...',
    images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
    likes: 156,
    comments: 28,
    collections: 12,
    isLiked: false,
    isCollected: false,
    isVideo: true
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
  
  // 模拟发布帖子
  const post = {
    id: Date.now(),
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    nickname: '我',
    time: '刚刚',
    title: newPost.title,
    content: newPost.content,
    images: newPost.images.map(img => img.url || img.content),
    likes: 0,
    comments: 0,
    collections: 0,
    isLiked: false,
    isCollected: false
  };
  
  latestPosts.value.unshift(post);
  showSuccessToast('发布成功');
  showPostDialog.value = false;
  
  // 重置表单
  newPost.title = '';
  newPost.content = '';
  newPost.images = [];
};

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

  }
  
  .tab-content {
    padding: 12px;
  }
  
  
}
</style>
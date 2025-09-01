<template>
  <div class="post-list"  :style="contentStyle">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" >
        <van-list
        v-model:loading="loading"
        :finished="props.finished"
        finished-text="没有更多了"
        @load="onLoad"
        :loading = "loading"
        >
          <div v-for="post in posts" :key="post.id" class="post-card"  @click="gotoDetail(post)">
            <!-- 用户信息 -->
            <div class="post-header">
              <div class="user-info">
                <van-image
                  :src="post.author.avatar"
                  width="40"
                  height="40"
                  round
                  fit="cover"
                />
                <div class="user-details">
                  <div class="nickname">{{ post.author.nickname }}</div>
                  <div class="time">{{ post.time }}</div>
                </div>
              </div>
              <van-icon name="ellipsis" class="more-icon" @click.stop="showPostActions(post)" />
            </div>
  
            <!-- 帖子内容 -->
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-text">{{ post.content }}</p>
              
              <!-- 图片展示 -->
              <div v-if="post.images && post.images.length > 0" class="post-images">
                <van-image
                  v-for="(image, index) in post.images.slice(0, 3)"
                  :key="index"
                  :src="image"
                  width="100"
                  height="100"
                  fit="cover"
                  @click.stop="previewImage(post.images, index)"
                />
                <div v-if="post.images.length > 3" class="more-images">
                  +{{ post.images.length - 3 }}
                </div>
              </div>
  
              <!-- 视频标识 -->
              <div v-if="post.type==='VIDEO'" class="video-badge">
                <van-icon name="play-circle-o" />
                <span>视频</span>
              </div>
            </div>
  
            <!-- 互动按钮 -->
            <div class="post-actions">
              <div class="action-item" @click.stop="toggleLike(post)">
                <van-icon 
                  :name="post.isLiked ? 'like' : 'like-o'" 
                  :class="{ 'liked': post.isLiked }"
                />
                <span>{{ post.likeCount }}</span>

              </div>
              
              <div class="action-item">
                <van-icon name="chat-o" />
                <span>{{ post.commentCount }}</span>
              </div>

              <div class="action-item" @click.stop="sharePost(post)">
                <van-icon name="share-o" />
                <span>分享</span>
              </div>
            </div>
          </div>
        </van-list>
    </van-pull-refresh>

    <!-- 帖子操作菜单 -->
    <van-action-sheet
      v-model:show="showActions"
      :actions="postActions"
      cancel-text="取消"
      @select="onActionSelect"
    />

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast, showImagePreview } from 'vant';
import {apiPostLike} from '@/api'
import {debouncePromise} from '@/utils/tool'

// Props
const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  searchHeaderHeight: {
    type: Number,
    default: 0
  },
  tabsHeight: {
    type: Number,
    default: 0
  },
  // 是否已加载完成
  finished: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['load','onRefresh'])

const loading = defineModel('loading',{type:Boolean,default:false}) // 加载状态

onMounted(() => {
  console.log('props', props);
})
const contentStyle = computed(() => {
  return {
    height: `calc(100vh - ${props.searchHeaderHeight}px - ${props.tabsHeight}px - var(--tabbar-height) - 20px)`,
    overflowY: 'auto',
  };
});

const router = useRouter();

const gotoDetail = (post) => {
  router.push({
    name: 'postDetail',
    params: { id: post.id }
  });
}
// 响应式数据
const refreshing = ref(false);
const showActions = ref(false);
const currentPost = ref(null);

// 帖子操作菜单
const postActions = [
  { name: '举报', color: '#ee0a24' },
  { name: '不感兴趣' },
  { name: '复制链接' }
];

// 方法
const onRefresh = () => {
  // 模拟刷新
  console.log('刷新');
  emit('onRefresh')
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};

const onLoad = () => {
  // 模拟加载更多
  emit('load');
};

const showPostActions = (post) => {
  currentPost.value = post;
  showActions.value = true;
};

const onActionSelect = (action) => {
  showToast(`选择了: ${action.name}`);
  showActions.value = false;
};

//切换点赞
const toggleLike = debouncePromise(async (post) => {
  const {success} = await apiPostLike(post.id)
  if(success) {
    post.isLiked = !post.isLiked;
    post.likeCount += post.isLiked ? 1 : -1;
  }
})




const sharePost = (post) => {
  showToast('分享功能开发中...');
};

const previewImage = (images, startPosition) => {
  showImagePreview({
    images,
    startPosition,
    closeable: true
  });
};
</script>

<style lang="scss" scoped>
.post-list {
  .post-card {
    // background: linear-gradient(to top, #fff, #e3e3e0);
    background: linear-gradient(to bottom,#d9b98c,15%,#f7f3e8);
    border-radius: 12px;
    margin-bottom: 12px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .user-details {
          .nickname {
            font-size: 14px;
            font-weight: 500;
            color: #323233;
            margin-bottom: 2px;
          }
          
          .time {
            font-size: 12px;
            color: #969799;
          }
        }
      }
      
      .more-icon {
        color: #969799;
        font-size: 16px;
        padding: 4px;
      }
    }
    
    .post-content {
      .post-title {
        font-size: 16px;
        font-weight: 600;
        color: #323233;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }
      
      .post-text {
        font-size: 14px;
        color: #646566;
        line-height: 1.5;
        margin: 0 0 12px 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      
      .post-images {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        flex-wrap: wrap;
        
        .van-image {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .more-images {
          width: 100px;
          height: 100px;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
        }
      }
      
      .video-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        
        .van-icon {
          font-size: 14px;
        }
      }
    }
    
    .post-actions {
      display: flex;
      justify-content: space-around;
      padding-top: 12px;
      
      .action-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        transition: all 0.2s ease;
        
        &:active {
          background: #f2f3f5;
        }
        
        .van-icon {
          font-size: 16px;
          color: #969799;
          
          &.liked {
            color: #ee0a24;
          }
          
          &.collected {
            color: #ff9500;
          }
        }
        
        span {
          font-size: 14px;
          color: #646566;
        }
      }
    }
  }
}

</style>
<template>
    <div class="post-detail">
        <!-- 顶部导航栏 -->
        <van-nav-bar
            title="帖子详情"
            left-arrow
            @click-left="onClickLeft"
            fixed
            placeholder
        />
        
        <!-- 帖子内容卡片 -->
        <div class="post-card">
            <!-- 用户信息区域 -->
            <div class="user-info">
                <van-image
                    class="avatar"
                    round
                    :src="post.author?.avatar || '/src/assets/icon/User-Circle.png'"
                />
                <div class="info">
                    <div class="nickname">{{ post.author?.nickname || '用户昵称' }}</div>
                    <div class="time">{{ formatTime(post.createdAt) }}</div>
                </div>
                <van-icon name="ellipsis" size="20px" @click="showPostActions" />
            </div>
            
            <!-- 帖子内容区域 -->
            <div class="post-content">
                <h3 class="title">{{ post.title || '帖子标题' }}</h3>
                <p class="text">{{ post.content || '帖子内容' }}</p>
                
                <!-- 图片区域 -->
                <div class="images" v-if="post.images && post.images.length">
                    <van-image-preview
                        v-model:show="showImagePreview"
                        :images="post.images"
                        :start-position="imageIndex"
                        :show-index="true"
                    />
                    <div class="image-grid" :class="imageGridClass">
                        <div 
                            v-for="(image, index) in post.images" 
                            :key="index" 
                            class="image-item"
                            @click="previewImage(post.images, index)"
                        >
                            <van-image 
                                :src="image" 
                                fit="cover"
                            />
                        </div>
                    </div>
                </div>
                
                <!-- 标签区域 -->
                <div class="tags" v-if="post.tags && post.tags.length">
                    <van-tag 
                        v-for="(tag, index) in post.tags" 
                        :key="index"
                        plain
                        type="primary"
                        class="tag"
                    >
                        {{ tag }}
                    </van-tag>
                </div>
            </div>
            
            <!-- 互动区域 -->
            <div class="interaction">
                <div class="action-item" @click="toggleLike">
                    <van-icon :name="post.isLiked ? 'like' : 'like-o'" :class="{ 'liked': post.isLiked }" />
                    <span>{{ post.likeCount || 0 }}</span>
                </div>
                <div class="action-item" @click="sharePost">
                    <van-icon name="share-o" />
                    <span>分享</span>
                </div>
            </div>
        </div>
        
        <!-- 分割线 -->
        <div class="divider">
            <span>评论 {{ post.commentCount || 0 }}</span>
        </div>
        
        <!-- 评论排序 -->
        <div class="comment-sort">
            <div 
                class="sort-item" 
                :class="{ active: sortType === 'default' }" 
                @click="changeCommentSort('default')"
            >
                默认
            </div>
            <div 
                class="sort-item" 
                :class="{ active: sortType === 'hot' }" 
                @click="changeCommentSort('hot')"
            >
                热门
            </div>
            <div 
                class="sort-item" 
                :class="{ active: sortType === 'latest' }" 
                @click="changeCommentSort('latest')"
            >
                最新
            </div>
        </div>
        
        <!-- 评论列表 -->
        <div class="comment-list-container">
            <van-list
                v-model:loading="isLoadingComments"
                :finished="!hasMoreComments"
                finished-text="没有更多评论了"
                @load="onLoadMoreComments"
                :immediate-check="false"
            >
                <template v-if="comments.length">
                    <div 
                        v-for="(comment, index) in comments" 
                        :key="index" 
                        class="comment-item"
                        @click="showCommentReplies(comment)"
                    >
                        <van-image
                            class="avatar"
                            round
                            :src="comment.user.avatar.imageUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                        />
                        <div class="comment-content">
                            <div class="comment-user">
                                <span class="nickname">{{ comment.user.nickname || '用户昵称' }}</span>
                                <van-icon name="ellipsis" size="18px"  />     
                            </div>
                            <div class="comment-text">{{ comment.content }}</div>
                            <div class="time-actions">
                                <span class="time">{{ formatTime(comment.createdAt) }}</span>
                                <div class="comment-actions">
                                    <div class="action-item" @click.stop="likeComment(comment)">
                                        <van-icon :name="comment.isLiked ? 'like' : 'like-o'" :class="{ 'liked': comment.isLiked }" />
                                        <span>{{ comment.likeCount || 0 }}</span>
                                    </div>
                                    <div class="action-item">
                                        <van-icon name="comment-o" />
                                        <span>回复</span>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <!-- 回复列表预览 (只显示部分) -->
                            <div class="reply-list" v-if="comment.replies && comment.replies.length">
                            <div 
                                v-for="(reply, replyIndex) in comment.replies.slice(0, 2)" 
                                :key="replyIndex" 
                                class="reply-item"
                            >
                                <div class="reply-user">
                                    <span class="nickname">{{ reply.user.nickname || '用户昵称' }}：{{ reply.content }}</span>
                                </div>
                            </div>
                                <div class="view-more" v-if="comment.replies.length > 2">
                                查看全部 {{ comment.replies.length }} 条回复
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <van-empty v-else description="暂无评论" />
            </van-list>
        </div>
        
        <!-- 评论输入框 -->
        <div class="comment-input">
            <van-field
                v-model="commentText"
                placeholder="写下你的评论..."
                :border="false"
                :autofocus="false"
                class="input"
            >
                <template #button>
                    <van-button 
                        size="small" 
                        type="primary" 
                        class="send-btn"
                        :disabled="!commentText.trim()"
                        @click="submitComment"
                    >
                        发送
                    </van-button>
                </template>
            </van-field>
        </div>
        
        <!-- 分享弹出层 -->
        <van-share-sheet
            v-model:show="showShare"
            title="分享给好友"
            :options="shareOptions"
            @select="onShareSelect"
        />
        
        <!-- 评论回复弹出层 -->
        <van-popup
            v-model:show="showRepliesPopup"
            position="bottom"
            round
            closeable
            :style="{ height: '75%' }"
        >
            <div class="replies-popup-content">
                <div class="popup-title">评论详情</div>
                
                <!-- 原评论 -->
                <div class="original-comment" v-if="currentComment">
                    <div class="user-info">
                        <van-image
                            class="avatar"
                            round
                            :src="currentComment.user.avatar.imageUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                        />
                        <div class="info">
                            <div class="nickname">{{ currentComment.user.nickname || '用户昵称' }}</div>
                            <div class="time">{{ formatTime(currentComment.createdAt) }}</div>
                        </div>
                    </div>
                    <div class="comment-text">{{ currentComment.content }}</div>
                    <div class="comment-actions">
                        <div class="action-item" @click="likeComment(currentComment)">
                            <van-icon :name="currentComment.isLiked ? 'like' : 'like-o'" :class="{ 'liked': currentComment.isLiked }" />
                            <span>{{ currentComment.likeCount || 0 }}</span>
                        </div>
                        <div class="action-item" @click="replyComment(currentComment)">
                            <van-icon name="comment-o" />
                            <span>回复</span>
                        </div>
                    </div>
                </div>
                
                <!-- 分割线 -->
                <div class="divider">
                    <span>全部回复 {{ currentReplies.length }}</span>
                </div>
                
                <!-- 回复列表 -->
                <div class="replies-list">
                    <van-list
                        v-model:loading="isLoadingReplies"
                        :finished="!hasMoreReplies"
                        finished-text="没有更多回复了"
                        @load="onLoadMoreReplies"
                        :immediate-check="false"
                    >
                        <template v-if="allRepliesSorted.length">
                            <!-- 合并后的回复列表（包含主回复和子回复） -->
                            <div 
                                v-for="(reply, index) in allRepliesSorted" 
                                :key="reply.id || (reply.isSubReply ? 'subReply-'+index : 'reply-'+index)" 
                                :class="['reply-item', reply.isSubReply ? 'sub-reply' : '']"
                            >
                                <!-- 头像和用户信息区域 -->
                                <div class="reply-header">
                                    <van-image
                                        class="avatar"
                                        round
                                        :src="reply.user.avatar?.imageUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
                                    />
                                    <div class="user-info">
                                        <div class="nickname">{{ reply.user.nickname || '用户昵称' }}</div>
                                        <div class="time">{{ formatTime(reply.createdAt) }}</div>
                                    </div>
                                </div>
                                
                                <!-- 回复内容 -->
                                <div class="reply-text">
                                    <span v-if="reply.isSubReply" class="reply-to">回复@{{ reply.parentReply.user.nickname || '用户昵称' }}：</span>
                                    {{ reply.content }}
                                </div>
                                
                                <!-- 操作按钮 -->
                                <div class="reply-actions">
                                    <div class="action-item" @click="likeReply(reply)">
                                        <van-icon :name="reply.isLiked ? 'like' : 'like-o'" :class="{ 'liked': reply.isLiked }" />
                                        <span>{{ reply.likeCount || 0 }}</span>
                                    </div>
                                    <div class="action-item" @click=" replyToReply(reply)">
                                        <van-icon name="comment-o" />
                                        <span>回复</span>
                                    </div>
                                </div>
                            
                            </div>
                        </template>
                        <van-empty v-else description="暂无回复" />
                    </van-list>
                </div>
                
                <!-- 回复输入框 -->
                <div class="reply-input">
                    <van-field
                        v-model="replyText"
                        :placeholder="replyPlaceholder"
                        :border="false"
                        :autofocus="false"
                        class="input"
                    >
                        <template #button>
                            <van-button 
                                size="small" 
                                type="primary" 
                                class="send-btn"
                                :disabled="!replyText.trim()"
                                @click="submitReply"
                            >
                                发送
                            </van-button>
                        </template>
                    </van-field>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';
import {formatTime,debouncePromise,formatCreatedAt} from '@/utils/tool'
import { apiPostLike, apiGetPostDetail, apiGetPostComments, apiAddComment, apiCommentLike, apiGetCommentReplies,apiGetHotComments,apiGetLatestComments } from '@/api/post';

const router = useRouter();
const route = useRoute();

// 获取帖子ID
const postId = route.params.id;

// 帖子数据
const post = ref({});

// 评论数据
const comments = ref([]);

// 获取帖子详情
const fetchPostDetail = async () => {
    try {
        // 实际项目中应该调用API
        const res = await apiGetPostDetail(postId);
        console.log(res);
        if (res && res.data) {
            post.value = res.data;
        }
        
    } catch (error) {
        showToast('获取帖子详情失败');
        console.error('获取帖子详情失败:', error);
    }
};

// 评论分页参数
const commentPage = ref(0);
const commentSize = ref(5);
const hasMoreComments = ref(true);
const loading = ref(false);
const isLoadingComments = ref (false)

// 获取评论列表
const fetchComments = async (loadMore = false) => {
    if (loading.value) return;
    
    try {
        loading.value = true;
        isLoadingComments.value = true;
        // 实际项目中应该调用API
        const params = {
            page: commentPage.value,
            size: commentSize.value
        }
        let res = null;
        if (sortType.value === 'default') {
            res = await apiGetPostComments(postId, params);
        }else if(sortType.value === 'hot') {
            res = await apiGetHotComments({...params,postId});
        }else if(sortType.value === 'latest') {
            res = await apiGetLatestComments({postId,...params});
        }
        console.log('获取评论结果:', res);
        if (loadMore) {
            comments.value = [...comments.value, ...res.data.content];
        } else {
            comments.value = res.data.content;
            commentPage.value = 0; // 重置页码
        }
        
        // 判断是否还有更多评论
        hasMoreComments.value = res.data.hasNext;
    } catch (error) {
        showToast('获取评论失败');
        console.error('获取评论失败:', error);
    } finally {
        loading.value = false;
        isLoadingComments.value = false;
    }
};

// 页面加载时获取数据
onMounted(async () => {
    try {
        await fetchPostDetail();
        await fetchComments();
        
    } catch (error) {
        console.error('加载失败:', error);
    }
});




// 显示评论回复弹出层
const showCommentReplies = async (comment) => {
    currentComment.value = comment;
    showRepliesPopup.value = true;
    replyPage.value = 0;
    hasMoreReplies.value = true;
    currentReplies.value = [];
    replyText.value = '';
    replyToUser.value = null;
    
    await fetchCommentReplies();
};

// 获取评论回复列表
const fetchCommentReplies = async (isLoadMore = false) => {

    if(loadingReplies.value) return
    
    try {
        isLoadingReplies.value = true;
        loadingReplies.value = true;
        // 实际项目中应该调用API
        const params = {
            page: replyPage.value,
            size: replySize.value
        }
        
        let res;
        try {
            res = await apiGetCommentReplies(currentComment.value.id, params);
            console.log('回复列表',res);
        } catch (apiError) {
            console.log(apiError);
        }
        
        if (res && res.data) {
            let newReplies = res.data.content;

            
            // 对新获取的回复按时间排序（升序，最新的在后面）
            newReplies = newReplies.sort((a, b) => {
                
                const dateA = a.createdAt ? formatCreatedAt(a.createdAt): 0;
                const dateB = b.createdAt ? formatCreatedAt(b.createdAt) : 0;
                return dateA - dateB;
            });
            
            if (isLoadMore) {
                // 合并并重新排序所有回复
                currentReplies.value = [...currentReplies.value, ...newReplies];
                // 对整个列表重新排序
                currentReplies.value = currentReplies.value.sort((a, b) => {
                    const dateA = a.createdAt ? formatCreatedAt(a.createdAt) : 0;
                    const dateB = b.createdAt ? formatCreatedAt(b.createdAt) : 0;
                    return dateA - dateB;
                });
            } else {
                currentReplies.value = newReplies;
            }
                console.log('当前回复列表:', currentReplies.value);
            
            // 判断是否还有更多回复
            hasMoreReplies.value = res.data.page <= res.data.totalPages;
            replyPage.value = res.data.page
        }
    } catch (error) {
        showToast('获取回复列表失败');
        console.error('获取回复列表失败:', error);
    } finally {
        loadingReplies.value = false;
        isLoadingReplies.value = false;
    }
};

// 点赞回复
const likeReply = debouncePromise(async (reply) => {
    try {
        const {success} = await apiCommentLike(reply.id);
        if(success) {
            // 找到对应的回复并更新
            const targetReply = findReplyById(reply.id);
            if (targetReply) {
                targetReply.isLiked = !targetReply.isLiked;
                targetReply.likeCount = targetReply.isLiked ? 
                    (targetReply.likeCount || 0) + 1 : 
                    Math.max(0, (targetReply.likeCount || 0) - 1);
            }
        }
    } catch (error) {
        showToast('点赞失败');
        console.error('点赞回复失败:', error);
    }
});

// 辅助函数：根据ID查找回复
const findReplyById = (replyId) => {
    // 在主回复中查找
    for (let i = 0; i < currentReplies.value.length; i++) {
        const reply = currentReplies.value[i];
        if (reply.id === replyId) {
            return reply;
        }
        // 在子回复中查找
        if (reply.replies && reply.replies.length > 0) {
            for (let j = 0; j < reply.replies.length; j++) {
                if (reply.replies[j].id === replyId) {
                    return reply.replies[j];
                }
            }
        }
    }
    return null;
};

const replyPlaceholder = ref('写下你的评论')
// 回复其他回复
const replyToReply = (reply) => {
    replyToUser.value = reply;
    console.log(reply);
    // 如果提供了原始回复者的昵称，则使用它，否则使用回复者的昵称
    const replyToName =  reply.user.nickname;
    replyPlaceholder.value = `回复 @${replyToName}: `;
    // 聚焦到回复输入框
    document.querySelector('.reply-input .van-field__control')?.focus();
};

// 提交回复
const submitReply = async () => {
    if (!replyText.value.trim() || !currentComment.value) return;
    
    try {
        // 确定是回复主评论还是回复其他回复
        const isReplyToSubReply = replyToUser.value && replyToUser.value.isSubReply;
        const isReplyToMainReply = replyToUser.value && !replyToUser.value.isSubReply;
        
        // 确定parentId
        let parentId;
        if (isReplyToSubReply) {
            // 如果是回复子回复，parentId应该是子回复的parentReply的id
            parentId = replyToUser.value.parentReply.id;
        } else if (isReplyToMainReply) {
            // 如果是回复主回复，parentId是主回复的id
            parentId = replyToUser.value.id;
        } else {
            // 如果是回复主评论，parentId是主评论的id
            parentId = currentComment.value.id;
        }
        
        const params = {
            parentId: parentId,
            content: replyText.value,
        };
        console.log(params);
        
        const res = await apiAddComment(params);
        
        if (res && res.data) {
            const newReply = res.data;
            // 确保回复有正确的时间戳
            if (!newReply.createdAt) {
                newReply.createdAt = new Date().toISOString();
            }
            
            // 如果是回复其他回复，需要找到对应的主回复并添加到它的子回复中
            if (isReplyToMainReply) {
                // 找到对应的主回复
                const mainReply = currentReplies.value.find(r => r.id === replyToUser.value.id);
                if (mainReply) {
                    // 确保replies数组存在
                    if (!mainReply.replies) {
                        mainReply.replies = [];
                    }
                    // 添加到子回复列表
                    mainReply.replies.push(newReply);
                }
            } else {
                // 添加到主回复列表
                currentReplies.value.push(newReply);
            }
            
            // 清空输入框和重置回复对象
            replyText.value = '';
            replyToUser.value = null;
            replyPlaceholder.value = '写下你的评论';
            
            showSuccessToast('回复成功');
        }
    } catch (error) {
        showToast('回复失败');
        console.error('提交回复失败:', error);
    }
};

// 处理van-list的加载更多事件
const onLoadMoreComments = async () => {
    console.log('触发加载更多评论', { hasMoreComments: hasMoreComments.value, loading: loading.value });
    if (hasMoreComments.value && !loading.value) {
        commentPage.value++;
        console.log('加载更多评论，页码:', commentPage.value);
        await fetchComments(true);
        console.log('加载完成，页码:', commentPage.value);
    } else {
        console.log('无法加载更多评论');
    }
};

// 处理回复列表van-list的加载更多事件
const onLoadMoreReplies = async () => {
    console.log('触发加载更多回复');
    console.log(hasMoreReplies.value, loadingReplies.value);
    if (hasMoreReplies.value && !loadingReplies.value) {
        // console.log('加载更多回复，页码:', replyPage.value);
        await fetchCommentReplies(true);
        console.log('回复加载完成，页码:', replyPage.value);
    } else {
        console.log('无法加载更多回复');
    }
};

// 评论排序类型
const sortType = ref('default'); // 'hot'或'latest'

// 切换评论排序方式
const changeCommentSort = async (type) => {
    sortType.value = type;
    console.log(sortType.value);
    comments.value = [];
    commentPage.value = 0;
    hasMoreComments.value = true;
    await fetchComments();
};

// 评论输入
const commentText = ref('');

// 评论回复弹出层相关
const showRepliesPopup = ref(false);
const currentComment = ref(null);
const currentReplies = ref([]);
const replyPage = ref(0);
const replySize = ref(5);
const hasMoreReplies = ref(true);
const loadingReplies = ref(false);
const isLoadingReplies = ref(false);
const replyText = ref('');
const replyToUser = ref(null); // 当前回复的用户，如果是回复评论则为null

// 计算属性：合并主回复和子回复并按时间排序
const allRepliesSorted = computed(() => {
    // 创建一个新数组来存储所有回复
    let allReplies = [];
    
    // 遍历主回复
    currentReplies.value.forEach((reply, index) => {

        // 添加主回复到数组
        allReplies.push({
            ...reply,
            isSubReply: false,
            parentReply: null
        });
        
        // 如果有子回复，添加子回复到数组
        if (reply.replies && reply.replies.length > 0) {
            reply.replies.forEach((subReply, subIndex) => {
                allReplies.push({
                    ...subReply,
                    isSubReply: true,
                    parentReply: reply
                });
            });
        }
    });
    
    // 按时间排序（降序，最新的在前面）
    const sorted = allReplies.sort((a, b) => {
        try {
            // 确保两个日期都是有效的，使用getTime()获取时间戳数值
            const dateA = a.createdAt ? formatCreatedAt(a.createdAt) : 0;
            const dateB = b.createdAt ? formatCreatedAt(b.createdAt) : 0;
            
            // 如果时间戳无效，记录错误但继续排序
            if (isNaN(dateA) || isNaN(dateB)) {
                console.warn('无效的时间戳:', { a: a.createdAt, b: b.createdAt });
                return 0;
            }
            
            // 如果日期相同，主回复优先于子回复
            if (dateA === dateB) {
                // 如果a是子回复而b不是，b应该排在前面
                if (a.isSubReply && !b.isSubReply) return 1;
                // 如果b是子回复而a不是，a应该排在前面
                if (!a.isSubReply && b.isSubReply) return -1;
                // 如果都是子回复或都是主回复，保持原有顺序
                return 0;
            }
            
            return dateA - dateB;
        } catch (error) {
            console.error('排序出错:', error, a.createdAt, b.createdAt);
            return 0; // 发生错误时保持原有顺序
        }
    });
    
    return sorted;
});



// 图片预览相关
const showImagePreview = ref(false);
const imageIndex = ref(0);

// 分享相关
const showShare = ref(false);
const shareOptions = [
    { name: '微信', icon: 'wechat' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' },
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
];

// 图片网格样式
const imageGridClass = computed(() => {
    const count = post.value.images?.length || 0;
    if (count === 1) return 'grid-1';
    if (count === 2) return 'grid-2';
    if (count === 3) return 'grid-3';
    if (count === 4) return 'grid-4';
    if (count >= 5) return 'grid-multi';
    return '';
});

// 返回上一页
const onClickLeft = () => {
    router.back();
};


// 预览图片
const previewImage = (images, index) => {
    imageIndex.value = index;
    showImagePreview.value = true;
};

// 点赞帖子
const toggleLike = debouncePromise(async () => {
    const {success} = await apiPostLike(postId)
    if(success) {
        post.value.isLiked = !post.value.isLiked;
        post.value.likeCount += post.value.isLiked ? 1 : -1;
    }

});


// 分享帖子
const sharePost = () => {
    showShare.value = true;
};

// 分享选择回调
const onShareSelect = (option) => {
    showToast(`分享到: ${option.name}`);
    showShare.value = false;
};

// 点赞评论
const likeComment = debouncePromise (async (comment) => {
    console.log(comment);
    const {success} = await apiCommentLike(comment.id);
    if(success){
        comment.isLiked = !comment.isLiked;
        comment.likeCount += comment.isLiked ? 1 : -1;
    }
});

// 回复评论
const replyComment = (comment) => {
    console.log(comment);
    if (showRepliesPopup.value && currentComment.value) {
        // 在弹出层内回复主评论
        replyText.value = '';
        replyToUser.value = null;
        replyPlaceholder.value = '写下你的评论';
        document.querySelector('.reply-input .van-field__control')?.focus();
    } else {
        // 在主页面回复评论
        commentText.value = `回复 @${comment.nickname}: `;
    }
};

// 评论帖子
const submitComment = async () => {
    if (!commentText.value.trim()) return;
    
    try {
        // 实际项目中应该调用API
        const res = await apiAddComment({
            postId: postId,
            content: commentText.value
        });
        console.log(res);
        const newComment = res.data;
        
        // 添加到评论列表
        comments.value.unshift(newComment);
        post.value.commentCount++;
        
        // 清空输入框
        commentText.value = '';
        showSuccessToast('评论成功');
    } catch (error) {
        showToast('评论失败:',error);
        console.error('评论失败:', error);
    }
};

const showPostActions = () => {
    console.log('显示帖子操作');
}


</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.post-detail {
    min-height: 100vh;
    background-color: #f7f3e8;
    padding-bottom: 60px; // 为底部评论输入框留出空间
    padding-top: 10px;

    
    .post-card {
        margin: 12px;
        padding: 16px;
        background-color: #f5f5f5;
        border-radius: $border-radius;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        
        .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            
            .avatar {
                width: 40px;
                height: 40px;
                margin-right: 12px;
            }
            
            .info {
                flex: 1;
                
                .nickname {
                    font-size: 16px;
                    font-weight: 500;
                    color: $text-color;
                    margin-bottom: 2px;
                }
                
                .time {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
        
        .post-content {
            .title {
                font-size: 18px;
                font-weight: bold;
                color: $text-color;
                margin: 0 0 12px;
            }
            
            .text {
                font-size: 15px;
                line-height: 1.6;
                color: $text-color;
                margin-bottom: 16px;
                white-space: pre-wrap;
            }
            
            .images {
                margin-bottom: 16px;
                
                .image-grid {
                    display: grid;
                    gap: 4px;
                    
                    &.grid-1 {
                        grid-template-columns: 1fr;
                        
                        .image-item {
                            max-height: 250px;
                            
                            .van-image {
                                height: 100%;
                                width: 100%;
                                max-height: 250px;
                            }
                        }
                    }
                    
                    &.grid-2 {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    &.grid-3 {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    
                    &.grid-4 {
                        grid-template-columns: repeat(2, 1fr);
                        grid-template-rows: repeat(2, 1fr);
                    }
                    
                    &.grid-multi {
                        grid-template-columns: repeat(3, 1fr);
                        grid-auto-rows: 1fr;
                    }
                    
                    .image-item {
                        aspect-ratio: 1;
                        overflow: hidden;
                        border-radius: 4px;
                        
                        .van-image {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            
            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 16px;
                
                .tag {
                    color: $primary-color;
                    border-color: $primary-color;
                }
            }
        }
        
        .interaction {
            display: flex;
            justify-content: space-around;
            padding-top: 12px;
            border-top: 1px solid #eee;
            
         
        }
    }
    .action-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        color: #666;
        font-size: 14px;
        
        .van-icon {
            font-size: 18px;
            
            &.liked {
                color: #ee0a24;
            }
            
        }
    }
    .divider {
        display: flex;
        align-items: center;
        margin: 16px 12px;
        color: #999;
        font-size: 14px;
        
        &::before,
        &::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: #eee;
        }
        
        span {
            padding: 0 12px;
        }
    }
    
    .comment-sort {
        display: flex;
        margin: 0 12px 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;


        .sort-item {
            padding: 6px 12px;
            font-size: 14px;
            color: #666;
            position: relative;
            margin-right: 16px;
            
            
            &.active {
                color: $primary-color;
                font-weight: 500;
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 16px;
                    height: 2px;
                    background-color: $primary-color;
                    border-radius: 1px;
                }
            }
        }
    }
    
    .comment-list-container {
        margin: 0 12px;
        margin-bottom: 70px; /* 为底部输入框留出空间 */
    }
    
    .comment-item {
            display: flex;
            padding: 16px 0;
            border-bottom: 1px solid #ddd;
            
            .avatar {
                width: 36px;
                height: 36px;
                margin-right: 12px;
                flex-shrink: 0;
            }
            
            .comment-content {
                flex: 1;
                
                .comment-user {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    
                    .nickname {
                        font-size: 14px;
                        font-weight: 500;
                        color: $text-color;
                    }
                    
                }
                
                .comment-text {
                    font-size: 14px;
                    line-height: 1.5;
                    color: $text-color;
                    margin-bottom: 8px;
                }
                .time-actions {
                    display: flex;
                    justify-content: space-between;
                     .time {
                        font-size: 12px;
                        color: #999;
                    }
                }
                .comment-actions {
                    display: flex;
                    gap: 16px;
                    
                }
                
                .reply-list {
                    margin-top: 5px;
                    padding: 8px 12px;
                    background-color: #f7e3e8;
                    border-radius: 6px;

                    
                    .reply-item {
                        padding: 8px 0;
                        
                        &:not(:last-child) {
                            border-bottom: 1px solid #ddd;
                        }
                        
                        // 子回复样式
                    .sub-reply {
                        margin-left: 20px; // 添加左侧缩进，视觉上表示这是一个子回复
                        position: relative;
                        padding-left: 10px;
                        border-left: 2px solid #f7e3e8;
                        margin-top: 8px;
                        margin-bottom: 8px;

                        &:before {
                            content: '';
                            position: absolute;
                            left: -10px;
                            top: 20px;
                            width: 10px;
                            height: 1px;
                            background-color: #eee;
                        }
                    }
                        
                        .reply-user {
                            margin-bottom: 4px;
                            
                            .nickname {
                                font-size: 13px;
                                font-weight: 500;
                                color: $text-color;
                            }
                            
                            .reply-to {
                                font-size: 13px;
                                color: #999;
                                margin: 0 4px;
                            }
                        }
                        
                        .reply-text {
                            font-size: 13px;
                            line-height: 1.5;
                            color: $text-color;
                            margin-bottom: 4px;
                        }
                        
                    }
                    
                    .view-more {
                        font-size: 12px;
                        color: $primary-color;
                        text-align: center;
                        padding: 8px 0 4px;
                        font-weight: 500;
                    }
                }
            }
        }
    }
    
    .comment-input {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        padding: 8px 10px;
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
        z-index: 10;
        
        .input {
            background-color: #f5f5f5;
            border-radius: 20px;
        }
  
        
        .send-btn {
            border-radius: 14px;
            background-color: $accent-color;
            border-color: $accent-color;
            color: #fff;
            font-size: 14px;
            height: 30px;
            padding: 0 14px;
        }
    }
    
    // 评论回复弹出层样式
    .replies-popup-content {
        display: flex;
        flex-direction: column;
        // height: 100%;
        padding: 16px;
        
        .popup-title {
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            margin-bottom: 16px;
        }
        
        .original-comment {
            padding: 16px;
            background-color: #f9f9f9;
            border-radius: 8px;
            margin-bottom: 16px;
            
            .user-info {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                
                .avatar {
                    width: 36px;
                    height: 36px;
                    margin-right: 12px;
                }
                
                .info {
                    flex: 1;
                     .nickname {
                        font-size: 14px;
                        font-weight: 500;
                        color: $text-color;
                    }
                     .time {
                        font-size: 12px;
                        color: #999;
                     }
                }
            }
            
            .comment-text {
                font-size: 14px;
                line-height: 1.5;
                color: $text-color;
                margin-bottom: 12px;
                margin-left: 44px;
            }
            
            .comment-actions {
                display: flex;
                justify-content: flex-end;
                gap: 16px;
            }
        }
        
        .replies-list {
            flex: 1;
            margin: 0 -8px;
            padding: 0 8px;
            
            .reply-item {
                padding: 12px 0;
                border-bottom: 1px solid #eee;
                
                .reply-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    
                    .avatar {
                        width: 32px;
                        height: 32px;
                        margin-right: 12px;
                        flex-shrink: 0;
                    }
                    
                    .user-info {
                        flex: 1;
                        
                        .nickname {
                            font-size: 13px;
                            font-weight: 500;
                            color: $text-color;
                            margin-bottom: 2px;
                        }
                        
                        .time {
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
                
                .reply-text {
                    font-size: 13px;
                    line-height: 1.5;
                    color: $text-color;
                    margin-bottom: 8px;
                    margin-left: 44px;
                    
                    .reply-to {
                        color: $primary-color;
                        font-weight: 500;
                    }
                }
                
                .reply-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                    
                    .action-item {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        font-size: 12px;
                        color: #999;
                        cursor: pointer;
                        
                        &:hover {
                            color: $primary-color;
                        }
                        
                        .van-icon {
                            font-size: 18px;
                            
                            &.liked {
                                color: $primary-color;
                            }
                        }
                    }
                }
            }
        }
        
      
        
        .reply-input {
            // padding: 12px 0 0;
            border-top: 1px solid #eee;
            margin-top: 8px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 5px;
            background-color: #fff;
               
            .input {
                background-color: #f5f5f5;
                border-radius: 20px;
            }
            
            .send-btn {
                border-radius: 14px;
                background-color: $accent-color;
                border-color: $accent-color;
                color: #fff;
                font-size: 14px;
                height: 30px;
                padding: 0 14px;
            }
        }
    }


</style>
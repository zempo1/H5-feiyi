<template>
  <div class="publish-container">
    <van-nav-bar title="发布帖子" @click-left="goBack" left-arrow safe-area-inset-top/>
    <div class="form-section">
      <van-field
        v-model="formData.title"
        label="标题"
        placeholder="请输入帖子标题"
        maxlength="30"
        show-word-limit
        label-width="4em"
      />
      <van-field
        v-model="formData.content"
        label="内容"
        type="textarea"
        rows="5"
        autosize
        placeholder="请输入帖子内容"
        maxlength="500"
        show-word-limit
        label-width="4em"
      />
      <div class="uploader-label">上传图片/视频</div>
      <van-uploader
        v-model="formData.fileList"
        :max-count="6"
        :after-read="afterRead"
        :accept="'image/*,video/*'"
        multiple
      />
      <div class="category-section">
        <div class="category-label">选择分类</div>
        <van-dropdown-menu>
          <van-dropdown-item v-model="formData.category" :options="categoryOptions" />
        </van-dropdown-menu>
      </div>
      <van-button
        type="primary"
        
        block
        class="publish-btn"
        @click="onPublish"
      >发布</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router'
import {apiCreatePost,uploadImage} from '@/api'

const router = useRouter()

const formData = ref({
    title: '',
    content: '',
    category: 'food',
    fileList: [],
    images: []
})

const categoryOptions = [
  { text: '非遗美食', value: 'food' },
  { text: '传统手工艺', value: 'craft' },
  { text: '民俗活动', value: 'folk' },
  { text: '非遗故事', value: 'story' },
  { text: '其他', value: 'other' },
];

const afterRead = async (file) => {
    console.log(file);
    const fd = new FormData();
    fd.append('file', file.file);
    const res = await uploadImage(fd);
    console.log(res);
    formData.value.images.push(res.data.imageUrl)
    console.log(formData.value.images);
  // 这里可以上传到服务器，示例直接添加到 fileList
  // showToast('文件已添加');
};

const onPublish = async () => {
  if (!formData.value.title.trim()) {
    showToast('请输入标题');
    return;
  }
  if (!formData.value.content.trim()) {
    showToast('请输入内容');
    return;
  }
  if (!formData.value.category) {
    showToast('请选择分类');
    return;
  }
  const res = await apiCreatePost({
    title: formData.value.title,
    content: formData.value.content,
    type: 'TEXT',
    images:formData.value.images
  })
  console.log(res);
  // 这里可以提交到后端
  showToast('发布成功！');
  // 清空表单
  formData.value.title = '';
  formData.value.content = '';
  formData.value.fileList = [];
  formData.value.category = '';
  router.push('/postBar')
};
const goBack = () => {
    router.back()
}
</script>

<style lang="scss" scoped>
.publish-container {
  min-height: 100vh;
  .form-section {
    padding: 16px;
    background: #fff;
    border-radius: 12px;
    margin: 16px;
    margin-bottom: calc(16px + var(--tabbar-height));
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    .uploader-label {
      margin: 16px 0 8px 0;
      font-size: 15px;
      color: #333;
    }
    .category-section {
      margin: 15px 0 16px 0;
      .category-label {
        margin-bottom: 10px;
        font-size: 15px;
        color: #333;
      }
      
    }
    .publish-btn {
      margin-top: 20px;
      border-radius: 24px;
      font-size: 16px;
      height: 40px;

    }
  }
}
</style>
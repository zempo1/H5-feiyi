<template>
  <div class="user-profile-container">
    <van-nav-bar
      title="账户信息"
      left-arrow
      @click-left="goBack"
      safe-area-inset-top
      fixed
      placeholder
    />
    <div class="avatar-container">
      <van-uploader :after-read="afterRead" :max-count="1">
        <div class="avatar-wrapper">
          <van-image
            class="avatar-image"
            round
            fit="cover"
            :src="avatar || defaultAvatar"
          />
          <div class="change-overlay">
            <span>更换头像</span>
          </div>
        </div>
      </van-uploader>
    </div>
    <div class="profile-card">

      <div class="info-form-section">
        <van-cell-group inset class="info-cell-group">
          <van-field
            v-model="formData.nickname"
            label="昵称"
            placeholder="请输入昵称"
            input-align="right"
          />
          <van-field
            v-model="formData.bio"
            label="个人简介"
            placeholder="请输入个人简介"
            type="textarea"
            rows="1"
            autosize
            input-align="right"
          />
          <van-field
            v-model="formData.gender"
            label="性别"
            is-link
            readonly
            placeholder="请选择性别"
            @click="showGenderPicker = true"
            input-align="right"
          />
          <van-field
            v-model="formData.birthday"
            label="生日"
            is-link
            readonly
            placeholder="请选择生日"
            @click="showBirthdayPicker = true"
            input-align="right"
          />
          <van-field
            v-model="formData.city"
            label="城市"
            placeholder="请输入城市"
            input-align="right"
          />
          <van-field
            v-model="formData.profession"
            label="职业"
            placeholder="请输入职业"
            input-align="right"
          />
          <van-field
            v-model="formData.email"
            label="邮箱"
            placeholder="请输入邮箱"
            input-align="right"
          />
          <!-- <van-field
            v-model="formData.mobile"
            label="手机号"
            placeholder="请输入手机号"
            input-align="right"
            readonly
          /> -->
        </van-cell-group>
      </div>
      
      <van-button
        type="primary"
        block
        class="save-btn"
        @click="onSave"
        :loading="loading"
      >保存</van-button>
    </div>

    <van-popup v-model:show="showGenderPicker" round position="bottom">
      <van-picker
        :columns="genderColumns"
        @confirm="onConfirmGender"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showBirthdayPicker" round position="bottom">
      <van-date-picker
        title="选择生日"
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmBirthday"
        @cancel="showBirthdayPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref,reactive,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import defaultAvatar from '@/assets/icon/User-Circle.png';
import { apiGetMyInfo,apiUpdateMyInfo,uploadImage } from '@/api';
import { useuserStore } from '@/stores/user';

const userStore = useuserStore();
const router = useRouter();
const loading = ref(false);

const showGenderPicker = ref(false);
const showBirthdayPicker = ref(false);

const currentDate = ref(['2000','01', '01']);
const minDate = new Date(1950, 0, 1);
const maxDate = new Date();

//个人数据
const avatar = ref('')
const formData = reactive({
  nickname: '',
  bio: '',
  gender: '',
  birthday: '',
  city: '',
  profession: '',
  email: '',
  avatarId: ''
});
const isHaveEmail = ref(false)
const getMyInfo = async () => {
  try {
    const res = await apiGetMyInfo();
    console.log(res);
    if(res.data.email !== null) isHaveEmail.value = true;
    formData.nickname = res.data.nickname;
    formData.bio = res.data.bio;
    formData.gender = res.data.gender;
    formData.birthday = res.data.birthday.join('-')
    formData.city = res.data.city;
    formData.profession = res.data.profession;
    formData.email = res.data.email;
    avatar.value = res.data.avatar.imageUrl

  } catch (error) {
    showToast('获取个人信息失败');
  }
}
onMounted(async () =>{
  getMyInfo()
})

const genderColumns = [
  {text: '男',value:'男'},
  {text: '女',value:'女'},
  {text: '未知',value:'未知'},
];

const afterRead = async (file) => {
  // 模拟图片上传
  file.status = 'uploading';
  file.message = '上传中...';
  try {
    const fd = new FormData();
    fd.append('file', file.file);
    const res = await uploadImage(fd)
    console.log(res);
    avatar.value = res.data.imageUrl
    formData.avatarId = res.data.imageId
    console.log(formData);
  } catch (error) {
    file.status = 'failed';
    file.message = '上传失败';
  }
  
};

const onConfirmGender = ({ selectedValues }) => {
  formData.gender = selectedValues[0];
  showGenderPicker.value = false;
};

const onConfirmBirthday = ({ selectedValues  }) => {
  formData.birthday = selectedValues.join('-');
  showBirthdayPicker.value = false;
};

const onSave = async () => {
  loading.value = true;
  console.log(formData);
  try {
    if(isHaveEmail.value && formData.email.includes('*')) {
      //不传email
      formData.email = ''
    }else if(isHaveEmail.value){
      //对邮箱进行校验
      const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if(!emailReg.test(formData.email)){
        showToast('邮箱格式不正确');
        return;
      }
    }
    const res = await apiUpdateMyInfo(formData);
    console.log(res);
    userStore.setUserInfo({avatarUrl:avatar.value,
      ...formData
    })
    showToast(res.data)
    getMyInfo()
  } catch (error) {
    showToast('保存失败');
    console.log(error);
  }finally {
    loading.value = false;
  }
 
};

const goBack = () => {
  router.back();
};

</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
.user-profile-container {
  min-height: 100vh;
  background-color: #f3efe8;
  display: flex;
  flex-direction: column;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 20px;
  margin: 0px 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}

.avatar-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  background-color: #e9d9b3;
}

.avatar-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #fff; /* 可选：添加白色边框 */
}

.avatar-image {
  width: 100%;
  height: 100%;
  transition: filter 0.3s;
}

.avatar-wrapper:hover .avatar-image {
  filter: brightness(80%);
}

.change-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @include flex-center;
  color: #fff;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.avatar-wrapper:hover .change-overlay {
  opacity: 1;
}

.info-form-section {
  width: 100%;
  .info-cell-group {
    border-radius: 10px;
    overflow: hidden;
  }
}

.save-btn {
  margin-top: 30px;
  border-radius: 24px;
  font-size: 16px;
  height: 44px;
  background-color:#4e3b23;
  border: none;
  width: 90%;
}
</style>
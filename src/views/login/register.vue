
<template>
  <div class="register-bg">
    <van-nav-bar
      title="用户注册"
      left-arrow
      safe-area-inset-top
      @click-left="goBack"
    />
    <div class="register-container">
      <van-form @submit="onSubmit" class="register-form">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            label="用户名"
            label-width="4em"
            placeholder="请输入用户名"
            required
            :rules="[
              { required: true, message: '请输入用户名' },
              { pattern: /^[a-zA-Z0-9_-]{4,20}$/, message: '用户名只能包含字母、数字、下划线、减号' }
            ]"
          />
          <van-field
            v-model="formData.password"
            type="password"
            name="password"
            label="密码"
            label-width="4em"
            placeholder="请输入密码"
            required
            :rules="[
              { required: true, message: '请输入密码' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/,message: '密码至少包含8-20位，至少包含一个大写字母，一个小写字母，一个数字' }
            ]"
          />
          <van-field
            v-model="formData.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            label-width="5em"
            placeholder="请再次输入密码"
            required
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validatePassword, message: '两次密码不一致' }
            ]"
          />
          <van-field
            v-model="formData.nickname"
            name="nickname"
            label="昵称"
            label-width="4em"
            placeholder="请输入昵称"
            required
            :rules="[{ required: true, message: '请输入昵称' }]"
          />
          <van-field
            v-model="formData.mobile"
            name="mobile"
            label="手机号"
            label-width="4em"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
          />
          <van-field
            v-model="formData.smsCode"
            name="smsCode"
            label="验证码"
            placeholder="请输入验证码"
            label-width="4em"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="countdown > 0"
                @click="sendSmsCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
        
        <div class="register-btn-wrapper">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            class="register-btn"
            :loading="loading"
          >
            立即注册
          </van-button>
        </div>
        
        <div class="login-link">
          已有账号？<span @click="goLogin">立即登录</span>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast,showSuccessToast } from 'vant'
import 'vant/es/toast/style';
import {apiSendCode,apiRegister} from '@/api'
import {saveData} from '@/utils/saveData'

const router = useRouter()
const loading = ref(false)
const countdown = ref(0)

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  mobile: '',
  smsCode: ''
})

// 验证密码一致性
const validatePassword = (value) => {
  return value === formData.password
}

// 发送验证码
const sendSmsCode = async () => {
  if (!formData.mobile) {
    showToast('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(formData.mobile)) {
    showToast('请输入正确的手机号')
    return
  }
  const res = await apiSendCode({
    mobile: formData.mobile
  })
  console.log(res);
  // 开始倒计时
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  showToast('验证码发送成功')
}

// 提交注册
const onSubmit = async (data) => {
  if(loading.value) return
  loading.value = true
  try {
    // 过滤掉 password 属性
    console.log('注册信息:', data)
    const res = await apiRegister(data)
    console.log(res);
    saveData(res.data)
    
    showSuccessToast('注册成功')
    setTimeout(() => {
      router.push('/index')
    }, 1500)
  } catch (error) {
    showToast('注册失败，请重试')
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到登录页
const goLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.register-bg {
  min-height: 100vh;
  height: 100vh;
}

.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.van-cell {
  margin-bottom: 6px;
}

.register-form {
  background: #fff;
  border-radius: 16px;
  padding: 24px 16px 16px 16px;
  box-shadow: 0 4px 20px rgba(78, 59, 35, 0.08);
}

.register-btn-wrapper {
  margin: 30px 0 20px 0;
}

.register-btn {
  height: 44px;
  font-size: 16px;
  background: #4e3b23;
  border: none;
  
  &:active {
    background: darken(#4e3b23, 8%);
  }
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #888;
  
  span {
    color: #e6b877;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: #b89b6a;
    }
  }
}

// PC端适配
@media (min-width: 768px) {
  .register-container {
    max-width: 500px;
  }
  
  .register-form {
    padding: 30px;
  }
  
  .register-title {
    font-size: 24px;
  }
  
  .register-btn {
    height: 50px;
    font-size: 18px;
  }
}
</style>
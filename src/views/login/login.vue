
<template>
  <div class="login-bg">
    <van-nav-bar
      title="用户登录"
      left-arrow
      safe-area-inset-top
      @click-left="goBack"
    />
    <div class="login-container">
      <div class="login-header">
        <div class="login-title">欢迎回来</div>
        <div class="login-subtitle">登录校园非遗传承平台</div>
      </div>
      
      <van-form @submit="onSubmit" class="login-form">
        <!-- 登录方式切换 -->
        <div class="login-tabs">
          <div 
            class="tab-item" 
            :class="{ active: loginType === 'password' }"
            @click="loginType = 'password'"
          >
            账号登录
          </div>
          <div 
            class="tab-item" 
            :class="{ active: loginType === 'sms' }"
            @click="loginType = 'sms'"
          >
            验证码登录
          </div>
        </div>
        
        <!-- 密码登录 -->
        <van-cell-group inset v-if="loginType === 'password'">
          <van-field
            v-model="passwordForm.username"
            name="username"
            label="账号"
            label-width="4em"
            placeholder="用户名/手机号"
            required
            :rules="[{ required: true, message: '请输入用户名或手机号' }]"
          />
          <van-field
            v-model="passwordForm.password"
            type="password"
            name="password"
            label="密码"
            label-width="4em"
            placeholder="请输入密码"
            required
            :rules="[{ required: true, message: '请输入密码' }]"
          />
          <!-- 记住密码选项 -->
          <van-cell>
            <template #title>
              <van-checkbox v-model="rememberPassword" shape="square">
                记住密码
              </van-checkbox>
            </template>
          </van-cell>
        </van-cell-group>
        
        <!-- 验证码登录 -->
        <van-cell-group inset v-if="loginType === 'sms'">
          <van-field
            v-model="smsForm.mobile"
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
            v-model="smsForm.smsCode"
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
        
        <!-- 登录按钮 -->
        <div class="login-btn-wrapper">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            class="login-btn"
            :loading="loading"
          >
            立即登录
          </van-button>
        </div>
        
        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="third-party-btns">
            <div class="third-party-btn wechat" @click="wechatLogin">
              <van-icon name="wechat" />
              <span>微信登录</span>
            </div>
            <div class="third-party-btn qq" @click="qqLogin">
              <van-icon name="qq" />
              <span>QQ登录</span>
            </div>
          </div>
        </div>
        
        <!-- 注册链接 -->
        <div class="register-link">
          还没有账号？<span @click="goRegister">立即注册</span>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import 'vant/es/toast/style'
import {apiLogin,apiLoginByCode,apiSendCode} from '@/api'
import {saveData} from '@/utils/saveData'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const router = useRouter()
const loading = ref(false)
const countdown = ref(0)
const loginType = ref('password') // 'password' 或 'sms'

// 加密密钥（建议放在环境变量中）
const ENCRYPT_KEY = import.meta.env.VITE_ENCRYPT_KEY

// 密码登录表单
const passwordForm = reactive({
  username: '',
  password: ''
})

// 验证码登录表单
const smsForm = reactive({
  mobile: '',
  smsCode: ''
})

// 记住密码
const rememberPassword = ref(false)

// 加密数据
const encryptData = (data) => {
  if (!ENCRYPT_KEY) {
    return null
  }
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPT_KEY).toString()
}

// 解密数据
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPT_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    console.error('解密失败:', error)
    return null
  }
}

// 页面加载时读取保存的登录信息
const loadSavedLoginInfo = () => {
  const encryptedData = Cookies.get('savedLoginInfo')
  if (encryptedData) {
    const decryptedData = decryptData(encryptedData)
    if (decryptedData) {
      const { username, password, remember } = decryptedData
      passwordForm.username = username || ''
      passwordForm.password = password || ''
      rememberPassword.value = remember || false
    }
  }
}

// 保存登录信息到 cookie
const saveLoginInfo = () => {
  if (rememberPassword.value) {
    const loginInfo = {
      username: passwordForm.username,
      password: passwordForm.password,
      remember: true
    }
    const encryptedData = encryptData(loginInfo)
    if (encryptedData) {
      // 设置 cookie，7天过期
      Cookies.set('savedLoginInfo', encryptedData, { expires: 7 })
    } else {
      console.error('加密失败，无法保存登录信息')
    }
  } else {
    Cookies.remove('savedLoginInfo')
  }
}



// 发送验证码
const sendSmsCode = async () => {
  if (!smsForm.mobile) {
    showToast('请输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(smsForm.mobile)) {
    showToast('请输入正确的手机号')
    return
  }
   const res = await apiSendCode({
    mobile: smsForm.mobile
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

//账号登录
const loginByPassword = async (data) => {
    const { username, password } = data
    const phoneReg = /^1[3-9]\d{9}$/
    let loginType = 'username'
    if(phoneReg.test(username)) {
        loginType = 'mobile'
    }
    const res = await apiLogin({
        loginId: username,
        password: password,
        loginType: loginType
    })
    return res;
}
//验证码登录
const loginBySms = async (data) => {
    console.log(data);
    const { mobile, smsCode } = data
    const res = await apiLoginByCode({
        mobile: mobile,
        smsCode: smsCode
    })
    return res;
}
// 提交登录
const onSubmit = async (data) => {
  if(loading.value) return;
  loading.value = true
  try {
    const res = loginType.value === 'password' ? await loginByPassword(data) : await loginBySms(data)
    console.log(res);
    saveData(res.data)
    
    // 如果是密码登录且勾选了记住密码，保存登录信息
    if (loginType.value === 'password') {
      saveLoginInfo()
    }
    
    setTimeout(() => {
      showSuccessToast('登录成功')
      router.push('/index')
    }, 1000)
  } catch (error) {
    console.log(error)
    showToast(error.message)
  } finally {
    loading.value = false
  }
}

// 微信登录
const wechatLogin = () => {
  showToast('微信登录功能开发中')
}

// QQ登录
const qqLogin = () => {
  showToast('QQ登录功能开发中')
}

// 页面加载时执行
onMounted(() => {
  loadSavedLoginInfo()
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到注册页
const goRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.van-cell {
  margin-bottom: 6px;
}

.login-bg {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  
  .login-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .login-subtitle {
    font-size: 16px;
    color: #b89b6a;
  }
}

.login-tabs {
  display: flex;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(78, 59, 35, 0.08);
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    
    &.active {
      background: #4e3b23;
      color: #fff;
    }
  }
}

.login-form {
  background: #fff;
  border-radius: 16px;
  padding: 24px 16px 16px 16px;
  box-shadow: 0 4px 20px rgba(78, 59, 35, 0.08);
}

.login-btn-wrapper {
  margin-top: 10px;
}

.login-btn {
  height: 44px;
  font-size: 16px;
  background: #4e3b23;
  border: none;
  
  &:active {
    background: darken(#4e3b23, 8%);
  }
}

.third-party-login {
  margin: 25px 0;
  
  .divider {
    text-align: center;
    position: relative;
    margin: 20px 0;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e0e0e0;
    }
    
    span {
      background: #fff;
      padding: 0 16px;
      color: #999;
      font-size: 14px;
    }
  }
  
  .third-party-btns {
    display: flex;
    justify-content: center;
    gap: 40px;
  }
  
  .third-party-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.05);
    }
    
    .van-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    span {
      font-size: 12px;
      color: #666;
    }
    
    &.wechat .van-icon {
      color: #07c160;
    }
    
    &.qq .van-icon {
      color: #12b7f5;
    }
  }
}

.register-link {
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
   
  .login-container {
    max-width: 500px;
  }
  
  .login-form {
    padding: 30px;
  }
  
  .login-title {
    font-size: 24px ;
  }
  .login-btn {
    height: 50px;
    font-size: 18px;
  }
}
</style>
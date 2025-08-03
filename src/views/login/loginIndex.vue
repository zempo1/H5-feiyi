
<template>
  <div class="login-index-bg">
    <div class="login-index-container">
      <div class="login-title">校园非遗传承平台</div>
      <div class="login-desc">传承文化 · 共享非遗</div>
      <div class="login-btn-group">
        <van-button
          type="primary"
          block
          round
          class="login-btn"
          @click="toLogin"
        >普通用户登录</van-button>
        <van-button
          type="default"
          block
          round
          class="login-btn outline"
          @click="toGuest"
        >游客模式</van-button>
      </div>
      <div class="register-link">
        还没有账号？<span @click="toRegister">立即注册</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function toLogin() {
  router.push('/login')
}
function toGuest() {
  router.push('/index')
}
function toRegister() {
  router.push('/register')
}
</script>

<style lang="scss">
.login-index-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-index-container {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 3px 18px rgba(78,59,35,0.08);
  padding: 24px 12px 20px 12px;
  width: 85vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-title {
  font-size: 26px;
  font-weight: bold;
  color: #4e3b23;
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-align: center;
}
.login-desc {
  font-size: 16px;
  color: #b89b6a;
  margin-bottom: 24px;
  text-align: center;
}
.login-btn-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 12px;
}
.login-btn {
  font-size: 16px;
  height: 40px;
  border-radius: 12px !important;
  font-weight: 500;
  letter-spacing: 1px;
}
.login-btn.outline {
  color: #4e3b23 !important;
  border: 1.5px solid #4e3b23 !important;
  background: #fff !important;
}
.register-link {
  margin-top: 12px;
  font-size: 14px;
  color: #888;
  text-align: center;
  span {
    color: #e6b877;
    cursor: pointer;
    margin-left: 4px;
    font-weight: 500;
    transition: color 0.2s;
    &:hover {
      color: #b89b6a;
    }
  }
}

</style>
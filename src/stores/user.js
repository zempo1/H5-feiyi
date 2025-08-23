import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useuserStore = defineStore('user',()=>{
    const accessToken = ref('')
    const refreshToken = ref('')
    const userName = ref('')
    const nickName = ref('')
    const avatarUrl = ref('')

    const setAccessToken = (token) => {
      accessToken.value = token
    }
    const setRefreshToken = (token) => {
      refreshToken.value = token
    }
    const setUserInfo = (user) => {
      if(user.username) userName.value = user.username
      if(user.nickname) nickName.value = user.nickname
      if(user.avatarUrl) avatarUrl.value = user.avatarUrl
    }
    
    const removeToken = () => {
      accessToken.value = ''
      refreshToken.value = ''
    }
    const removeUserInfo = () => {
      userName.value = ''
      nickName.value = ''
      avatarUrl.value = ''
    }
    const removeAll = () => {
      removeToken()
      removeUserInfo()
    }
    return {
      accessToken,
      refreshToken,
      userName,
      nickName,
      avatarUrl,
      setAccessToken,
      setRefreshToken,
      setUserInfo,
      removeToken,
      removeUserInfo,
      removeAll
    }
  },
  {
  persist: true,
  }
)
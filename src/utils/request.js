import axios from 'axios'
import { useuserStore } from '@/stores/user'
import {apiRefreshToken} from '@/api/login'
import { showToast } from 'vant'
import router from '@/router'
import 'vant/es/toast/style';

const baseUrl = 'http://8.134.200.160:20611'
const userStore = useuserStore()

const instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000
})

instance.interceptors.request.use(
    (config) => {
        const accessToken = userStore.accessToken
        const url = config.url
        if(url.includes('login') || url.includes('register')){
            return config
        }
        if(accessToken) {
            if(url.includes('refresh-token')) {
                const refreshToken = userStore.refreshToken
                console.log('请求头中添加refreshToken');
                config.headers['Authorization'] = `Bearer ${refreshToken}`
            }
            else {
                console.log('请求头中添加token');
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

let isRefreshing = false
let requests = []

instance.interceptors.response.use(
    (response) => {
        if(response.data.code === 200){
            return response.data
        }
        return Promise.reject(response.data)
    },
    async (error) => {
        console.log('request的error',error);
        const { config, response: {status}} = error
        if(status !== 401) {
            return Promise.reject(error)
        }
        
        if(isRefreshing) {
            return new Promise((resolve) => {
                requests.push(() => {
                    resolve(instance(config))
                })
            })
        }
        
        isRefreshing = true
        
        try {
            const res = await apiRefreshToken({
                refreshToken: userStore.refreshToken
            })
            console.log('刷新toekn返回数据',res);
            userStore.setAccessToken(res.data.accessToken)
            //重试之前挂起的请求
            requests.forEach((cb) => cb())
            requests = []
            
            // 重试当前失败的请求
            return instance(config)
        } catch (e) {
            console.log('刷新token失败',e);
            showToast('登录信息已过期，请重新登录')
            userStore.removeAll()
            router.push('/')
            return Promise.reject(error)
        } finally {
            isRefreshing = false
        }
    }
)

export default instance
export { baseUrl }
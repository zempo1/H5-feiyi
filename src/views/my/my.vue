<template>
    <div class="container">
        <div class="box">
            <van-cell-group inset>
                <van-cell title="单元格" is-link />
                <van-cell title="单元格" is-link />
                <van-cell title="单元格" is-link />
                <van-cell title="单元格" is-link @click="get" />
                <!-- 退出登录 -->
                 <van-cell title="退出登录" is-link @click="handleLogout" />
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import {apiLogout,getMyInfo} from "@/api";
import { useuserStore } from "@/stores/user";
import router from "@/router";
const userStore = useuserStore();

const get = async () => {
    const res = await getMyInfo();
    console.log(res);
}
const handleLogout = async () => {
    
    const res = await apiLogout();
    console.log(res);
    // 处理退出登录逻辑
    userStore.removeToken();
    userStore.removeUserInfo();
    setTimeout(() =>{
        router.push('/');
    },1000)

}
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

// PC端适配
@media (min-width: 768px) {
    .container {
        padding: 0 10px;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .box {
        
        .van-cell {
            font-size: 6px;
            padding: 0px 10px;
            margin-bottom: 0;
            
        }
        
    }
}

</style>
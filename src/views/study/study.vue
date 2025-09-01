<template>
  <div class="container">
    <!-- 背景层 -->
    <div class="bgc"></div>
    <!-- 内容层 -->
    <div class="card">
        <van-image
          class="avatar"
            round
            :src="userStore.avatarUrl || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
        />
        <div class="content">
          <h3>加油！你已成功打卡</h3>
          <div class="day">
            <h1>{{ clockInCount }}</h1><span>天</span>
          </div>
          <div class="gameBox">
            <div class="game">1</div>
            <div class="game">2</div>
            <div class="clock" @click="clockIn">
              立即打卡
          </div>
          </div>
          
        </div>
    </div>
  </div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import { useuserStore } from '@/stores/user';
import { apiClockIn,apiGetClockInCount } from '@/api';
import {debouncePromise} from '@/utils/tool'
import { showToast } from 'vant';
const userStore = useuserStore()

const clockInCount = ref()

onMounted(() => {
  getClockIn()
})
const getClockIn = async () => {
  const res = await apiGetClockInCount()
  console.log(res);
  clockInCount.value = res.data.currentConsecutiveDays
}

const clockIn = debouncePromise(async () => {
  try {
    const res = await apiClockIn()
    console.log(res);
    clockInCount.value = res.data.consecutiveDays
    showToast(res.data.message)
  } catch (error) {
    showToast(error.response.data.message)
  }

},300)

</script>

<style lang="scss" scoped>
.container {
  position: relative;   /* 让子元素可绝对定位 */
  min-height: 100vh;
  overflow: hidden;
}

.bgc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vh;

  background-image: url('../../assets/bgc/daka.png');
  background-size: cover;
  background-position: center;

  /* 从上到下渐变透明：黑→透明 */
  mask: linear-gradient(to bottom, #000 0%, transparent 100%);
  -webkit-mask: linear-gradient(to bottom, #000 0%, transparent 100%);
  z-index: 0;           /* 确保在内容下方 */
}

.card {
  position: relative;
  z-index: 1;  
  margin: 0 20px;
  padding: 10px;
  margin-top: 22vh;
  height: 100%;
  background-color: #f3e3ca;
  min-height: 60vh;
}
.avatar {
    width: 80px;
    height: 80px;
    padding-left: 20px;
    overflow: hidden;
    margin-top: -46px;
    display: block;
}
.content {
  margin-top: 30px;
  padding: 0 10px;
  h3 {
    color: #000;
    font-size: 30px;
  }
  .day {
    margin-top: 20px;
    font-weight: 700;
    font-size: 30px;
    display: flex;
    justify-content: space-between;
    align-items:baseline;
    h1 {
      color: #000;
      font-size: 80px;
      margin-left: 20px;
    }
  }
  .gameBox {
    margin-top: 35px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
    position: relative;
    .game {
      width: 140px;
      height: 130px;
      
      background-color: #fff;
      border-radius: 30%;
      text-align: center;
      box-shadow: 0 0 5px #000;
    }
  }
  .clock {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background-color: #997a41;
    color: #fff;
    padding: 5px;
    font-size: 24px;
    display: flex;               
    flex-direction: column;        
    justify-content: center;     
    align-items: center;   
    text-align: center;
    text-orientation: upright;   
    letter-spacing: 4px;           
    line-height: 1.1;
  }
}
</style>
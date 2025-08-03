<template>
    <div>
       
        <van-cell-group>
        <!-- 循环展示内容 -->
            <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
        </van-cell-group>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// import { debounce } from 'throttle-debounce';
import { showToast } from 'vant';
const list = ref([]);
const value = ref('');
for(let i=0;i<20;i++) {
    list.value.push({
        title: `标题${i+1}`
    });
}

// const onSearch = () => showToast(`搜索：${val || '无'}`);
</script>

<style lang="scss" scoped>

</style>
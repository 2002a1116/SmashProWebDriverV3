<template>
<n-flex justify="center">
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Home Page</h1>
        </n-flex>
        <n-card style="max-width: 800px;">
            <n-flex vertical>
                <n-flex justify="center">
                    <n-carousel autoplay show-arrow>
                        <img
                        class="carousel-img"
                        src="../../assets/image_front.jpg"
                        >
                        <img
                        class="carousel-img"
                        src="../../assets/image_back.jpg"
                        >
                        <img
                        class="carousel-img"
                        src="../../assets/image_parts.jpg"
                        >
                        <img
                        class="carousel-img"
                        src="../../assets/image_exp1.jpg"
                        >
                        <img
                        class="carousel-img"
                        src="../../assets/image_exp2.jpg"
                        >
                    </n-carousel>
                </n-flex>
                <n-flex justify="center">
                    <n-button type="primary" @click="open_device">
                        {{ $t('label.open') }}
                    </n-button>
                </n-flex>
                <n-flex justify="center">
                    <span>839973286,Controller group,手柄交流群</span>
                </n-flex>
                <n-flex justify="center">
                    <span>我知道图不好看,欢迎大家返图，设备打开功能迁移至左侧侧边栏</span>
                </n-flex>
            </n-flex>
        </n-card>
    </n-flex>
</n-flex>
</template>
<style scoped>
.carousel-img {
    width: 100%;
    height: 400px;
    object-fit: cover;
}
</style>
<script lang="ts">
import {open_device,device} from '../webusb'
export default{
    setup() {
        return{
        open_device,
        device,
        };
    },
    methods:{
        handleClick(){
            window.open('https://m.tb.cn/h.h7CWRGT?tk=XDOR4Y788NM');
        }
    }
}
</script>
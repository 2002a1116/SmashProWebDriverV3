<template>
<n-flex justify="center">
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Home Page</h1>
        </n-flex>
        <n-card style="width: 800px;">
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
                    <n-card title="旧版驱动：">
                        <n-flex justify="center">
                            <n-flex vertical>
                                <a href="https://2002a1116.github.io/SmashProWebDriverV2/">固件V1.2.x驱动，已弃用</a>
                                <a href="legacy.smashpro.icu">固件V1.4.x驱动，已弃用，预计2026-7-1关闭</a>
                            </n-flex>
                        </n-flex>
                    </n-card>
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
import {open_device,device} from '../Api/webusb'
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
<template>
    <n-flex vertical>
        <n-flex justify="center">
            <n-pagination v-model:page="cur" :page-count="tol" show-quick-jumper></n-pagination>
        </n-flex>
        <slot/>
        <n-flex justify="center">
            <n-pagination v-model:page="cur" :page-count="tol" show-quick-jumper></n-pagination>
        </n-flex>
    </n-flex>
</template>
<script setup lang="js">
import { ref } from 'vue';
const cur = defineModel("cur", { type: Number, default: 0 })
const tol = defineModel("tol", { type: Number, default: 0 })

</script>
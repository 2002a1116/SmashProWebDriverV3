<template>
    <n-button circle size="tiny"
        :color="props.bg_color" :text-color="props.text_color" :style="style">{{ props.text }}</n-button>
</template>
<script lang="ts">
import { defineComponent, h, reactive, ref } from 'vue';
export default defineComponent({
    name:'RgbButton',
    props: {
        text: String,
        text_color: String,
        bg_color: String,
        style: Object,
    },
    setup(props, ctx){
        return{
            props,
        };
    }
})
</script>
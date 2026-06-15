<template>
    <n-select v-model:value="value" :options="options" 
        :render-option="renderOption" />
</template>
<script setup lang="ts">
import { NIcon, NTooltip, type SelectOption } from 'naive-ui';
import { h, type VNode, type VNodeChild } from 'vue';
import type { HintSelectOption } from '../Api/struct';
import { isEmpty } from 'lodash';
import { useI18n } from 'vue-i18n';

const value = defineModel("value", { type: Number });
const options = defineModel("options",{type:Array});
/*const style = defineProps({
    style:{
        type:String,
        default:null
    },
})*/
const {t} = useI18n();
function renderOption({ node, option }: { node: VNode, option: HintSelectOption }) {
    if(isEmpty(option.hint)){
        return node;
    }
    return h(NTooltip, {style:"width:max-content"}, {
        trigger: () => node,
        default: () => t(option.hint)
    })
}
</script>
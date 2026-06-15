<template>
    <n-collapse-item :disabled="!FormatIsEnumable(item)">
        <template #arrow v-if="!FormatIsEnumable(item)">
            <n-icon>
                <PricetagOutline></PricetagOutline>
            </n-icon>
        </template>
        <template #header>
            <n-space>
                {{ isNil(item.name)?"":item.name }}
                <n-tag> {{ get_text(item.type) }} </n-tag>
                <n-tag> {{ isNil(FormatGetLength(item))?"undefined":FormatGetLength(item) }} </n-tag>
            </n-space>
        </template>
        <template #header-extra>
            <n-button @click="new_item=_.cloneDeep(item);show_modal=true;">mod</n-button>
            <n-button @click="onclick">{{ btn_text }}</n-button>
        </template>
        <template v-if="FormatIsEnumable(item)">
            <FormatCard v-model:value="item.formats" :loading="false" :length="item.length" :is_array="item.type == 'a'"></FormatCard>
        </template>
    </n-collapse-item>
    <n-modal v-model:show="show_modal">
            <n-card
            style="width: 600px"
            title="New"
            size="huge"
            :bordered="false"
            >
            name:
            <n-input v-model:value="new_item.name"></n-input>
            type:
            <n-select v-model:value="new_item.type" :options="type_list" style="width: 150px" />
            length:
            <n-input-number v-model:value="new_item.length"></n-input-number>
            <n-button @click="show_modal=false">cancel</n-button>
            <n-button @click="set();show_modal=false;">confirm</n-button>
            </n-card>
        </n-modal>
</template>
<script setup lang="ts">
import { Format, FormatGetLength, FormatIsEnumable } from 'bitmapper';
import { isNil, isNull, isUndefined } from 'lodash';
import { ref } from 'vue';
import FormatCard from './FormatCard.vue';
import { get_text, type_list } from '../Api/wrapper.ts';
import _ from 'lodash';
import { PricetagOutline } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';

const show_modal=ref(false);
const new_item = ref();
const item = defineModel("item", { type: Format, default: new Format() })
const props = defineProps({
    btn_click:{
        type:Function,
        default:undefined
    },
    btn_text:{
        type:String,
        default:"OPS"
    },
})
function onclick(){
    if(props.btn_click != undefined){
        props.btn_click();
    }
}
function set(){
    if(new_item.value.type != 'o' && new_item.value.type != 'a')
        new_item.value.formats=undefined;
    else if(isUndefined(new_item.value.formats)){
        new_item.value.formats=new Array<Format>;
    }
    item.value=_.cloneDeep(new_item.value);
    new_item.value=new Format();
}
</script>
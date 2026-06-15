<template>
    <template v-if="loading">
        loading
    </template>
    <template v-else>
        <n-collapse>
            <template v-if="formats.length">
                <template v-for="(item,index) in formats">
                <Transition name="fade">
                    <FormatItem v-model:item="formats[index]" :btn_click="()=>remove(index)" btn_text="-"></FormatItem>
                </Transition>
                </template>
            </template>
            <template v-if="!(is_array&&formats.length)">
                <n-collapse-item :disabled="true">
                    <template #arrow>
                        <span></span>
                    </template>
                    <template #header>  
                        <n-button @click="show_modal=true;">+</n-button>
                    </template>
                </n-collapse-item>
            </template>
        </n-collapse>
    </template>
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
        <n-button @click="add();show_modal=false;">confirm</n-button>
        </n-card>
    </n-modal>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { Format } from 'bitmapper';
import FormatItem from './FormatItem.vue';
import { type_list } from '../Api/wrapper.ts';
import _ from 'lodash';
let show_modal = ref(false);
let new_item:Ref<Format> = ref(new Format());
const props = defineProps({
    loading:{
        type:Boolean,
        default:false
    },
    is_array:{
        type:Boolean,
        default:false
    }
});
const formats = defineModel("value", { type: Array<Format> });
const length = defineModel("length",{type: Number});
function add(){
    if(new_item.value.type=='o' || new_item.value.type=='a'){
        new_item.value.formats=new Array<Format>();
    }else
        new_item.value.formats=undefined;
    formats.value.push(_.cloneDeep(new_item.value));
    length.value=formats.value.length;
    new_item.value = new Format();
}
function remove(indx:number){
    formats.value.splice(indx,1);
}

</script>
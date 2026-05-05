<template>
    <n-grid :x-gap="props.x_gap" :y-gap="props.y_gap" 
        :cols="props.cols" :collapsed-rows="Number(props.c_rows)" 
        :item-responsive="props.item_responsive"
    >
        <template v-for="(item,index) in options">
            <n-gi :span="props.span" :offset="props.offset">
                <n-button text block style="font-size: 15px" @click="update(index)">  
                    <n-image v-if="item.uri !== null" 
                        width="100%"
                        object-fit="fill" 
                        :src="item.uri"
                        preview-disabled
                        :style = "'border: '+(value[index]?props.border:'0px solid #000')"
                        :img-props = "{alt:item.text}"
                    />
                    <template v-else>{{ item.text }}</template>
                </n-button>
            </n-gi>
        </template>
    </n-grid>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref, type ModelRef } from 'vue';
//https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg
interface option{
    text:{
        type:String,
        default:"Error"
    },
    uri:{
        type:String,
        default:"https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    },
    disabled:{
        type:Boolean,
        default:false
    }
};
const options:ModelRef<option[]> = defineModel("options", { type: Array })
const value = defineModel("value", { type: Array })
const props = defineProps({
    type:{
        type:Number,
        default:0
    },
    x_gap:{
        type:Number,
        default:0
    },
    y_gap:{
        type:Number,
        default:0
    },
    prefix:{
        type:Number,
        default:0
    },
    offset:{
        type:Number,
        default:0
    },
    cols:{
        type:Number,
        default:24
    },
    c_rows:{
        type:Number,
        default:1
    },
    span:{
        type:Number,
        default:1
    },
    item_responsive:{
        type:Boolean,
        default:false
    },
    border:{
        type:String,
        default:"3px solid #000"
    }
})
const sts=ref(Array());
function update(index){
    console.log(index);
    console.log(props.type);
    value.value[index]=!value.value[index];
    switch(props.type){
        case 0:
            //value.value[index]=!value.value[index];
            break;
        case 1: 
        /*fall through*/
        case 2:
            value.value.forEach((element,i) => {
                if(element==true&&index!=i)
                    value.value[i]=false;
            });
            if(props.type==1)
                break;
            if(value.value[index]==false)
                value.value[index]=true;
            break;
        default:
            break;
    }
}
</script>
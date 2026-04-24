<template>
    <!--<n-scrollbar x-scrollable>-->
    <!--this shit doesnt work,why-->
        <n-flex justify="start" :style="'column-gap: '+props.gap">
            <template v-for="(item,index) in options">
                <n-tooltip trigger="hover">
                    <template #trigger>
                    <n-button text block :style="'font-size: 15px;width:'+props.item_width+';height: '+props.item_height" 
                    @click="update(index)">  
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
                    </template>
                    {{ item.desc }}
                </n-tooltip>
            </template>
        </n-flex>
    <!--</n-scrollbar>-->
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
    },
    desc:{
        type:String,
        default:""
    }
};
const options:ModelRef<option[]> = defineModel("options", { type: Array })
const value = defineModel("value", { type: Array })
const props = defineProps({
    type:{
        type:Number,
        default:0
    },
    item_width:{
        type:String,
        default:"50px"
    },
    item_height:{
        type:String,
        default:"60px"
    },
    gap:{
        type:String,
        default:"20px"
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
<template>
        <n-flex vertical>
            <JoystickGraphic id="AffineItemCanvas" :cursor="cursor"
                :dot="n" :showOcto="props.showOcto"></JoystickGraphic>
            <n-flex :inline="true" :wrap="false" align="center">
                <n-flex-item style="min-width: 0; white-space: nowrap; flex: 0 0 auto;">
                    <span>notch:</span>
                </n-flex-item>
                <n-flex-item :flex="1" style="min-width: 0">
                    <n-flex align="center" :wrap="false">
                    <span>X:</span>
                    <n-input-number
                        v-model:value="n.x"
                        style="flex: 1; min-width: 0" 
                        :min="-2047"
                        :max="2047"
                    />
                    </n-flex>
                </n-flex-item>

                <!-- 右侧 Y 组 -->
                <n-flex-item :flex="1" style="min-width: 0">
                    <n-flex align="center" :wrap="false">
                    <span>Y:</span>
                    <n-input-number
                        v-model:value="n.y"
                        style="flex: 1; min-width: 0"
                        :min="-2047"
                        :max="2047"
                    />
                    </n-flex>
                </n-flex-item>
            </n-flex>
            <n-flex :inline="true" :wrap="false" align="center">
                <n-flex-item style="min-width: 0; white-space: nowrap; flex: 0 0 auto;">
                    <span>angle:</span>
                </n-flex-item>
                <n-flex-item :flex="1" style="min-width: 0">
                    <n-flex align="center" :wrap="false">
                    <span>X:</span>
                    <n-input-number
                        v-model:value="a.x"
                        style="flex: 1; min-width: 0"
                        :min="-2047"
                        :max="2047"
                    />
                    </n-flex>
                </n-flex-item>

                <!-- 右侧 Y 组 -->
                <n-flex-item :flex="1" style="min-width: 0">
                    <n-flex align="center" :wrap="false">
                    <span>Y:</span>
                    <n-input-number
                        v-model:value="a.y"
                        style="flex: 1; min-width: 0"
                        :min="-2047"
                        :max="2047"
                    />
                    </n-flex>
                </n-flex-item>
            </n-flex>
            <n-flex justify="space-around">
                <n-button @click="show=false;">quit</n-button>
                <n-button @click="cali()" :loading="calibrating">cali</n-button>
            </n-flex>
        </n-flex>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRef, watch, type Ref } from 'vue';
import { ReorderFourOutline } from '@vicons/ionicons5'
import { Coord } from '../../../../Api/struct.ts';
import JoystickGraphic from '../JoystickGraphic.vue';
import { isNil } from 'lodash';
import { adc_data, js_data, raw_js_data } from '../../../../Api/webusb.ts';
const props = defineProps({
    chnl:{
        type:Number,
        default:0
    },showOcto:{
        type:Boolean,
        default:false
    }
});// Coord 是类型或接口
//const value = defineModel<{ notch: Coord; angle: Coord }>("value");
const notch = defineModel<Coord>("notch");
const angle = defineModel<Coord>("angle");
const show = defineModel<Boolean>("showModal");
const n = reactive(notch);
const a = reactive(angle);
watch(n,(new_val)=>{notch.value = new_val;})
watch(a,(new_val)=>{angle.value = new_val;})

let calibrating = ref(false);
const cursor = computed(()=>{
    return {x:raw_js_data.value[props.chnl].x+2048,y:raw_js_data.value[props.chnl].y+2048};
    //return {x:adc_data.value[props.chnl*2],y:adc_data.value[props.chnl+1]};
})
function cali(){
    calibrating.value=true;
    new Promise((resolve,reject)=>{
        setTimeout(() => {
            if(isNil(raw_js_data.value))
                reject("error no raw data for mapping");
            else
                resolve("");
        }, 750);
    }).then(()=>{
        let tmp = raw_js_data.value[props.chnl];
        console.log(raw_js_data);
        a.value = tmp;
        calibrating.value=false;
    }).catch(error=>{
        alert(error);
        calibrating.value=false;
    });
}
</script>
<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>RGB</h1>
        </n-flex>
        <n-flex vertical>
            <n-flex justify="center">
                <n-select v-model:value="rgb_layout" :options="rgb_layout_list" style="width: 150px" />
            </n-flex>
            <n-flex justify="center">
                <n-card style="height: 400px; max-width: 800px; width:100%;">
                    <div class="rgb_background">
                        <n-color-picker v-for="(item,index) in rgb_pos_cal" 
                        :show-preview="true" :show-alpha="false" size="small"
                        v-model:value="rgb_value[index]" 
                        :on-complete="(value:string)=>{conf.rgb.data[index]=hex_to_rgb(value);}" 
                        >
                            <template #trigger="{ value, onClick, ref: triggerRef }">
                                <rgb-button :ref="triggerRef" @click="onClick" text="Set" :bg_color="value" :text_color="rgb_button_color_cal_rev(value)" 
                                :style="{left:rgb_pos_cal[index].left+'px', top: rgb_pos_cal[index].top +'px', position: 'absolute', height:'20px', width:'20px'}"></rgb-button>
                            </template>
                        </n-color-picker>
                    </div>
                </n-card>
            </n-flex>
            <n-flex justify="center">
                <n-card>
                    <n-flex vertical>
                        <func-switch v-model:value="conf.rgb.enable" :text="$t('text.rgb_setting')"/>
                        <func-switch v-model:value="conf.rgb.allow_rgb_on_bat" :text="$t('text.allow_rgb_on_bat')"/>
                        <n-card>
                            <n-flex justify="space-between">
                                <span>{{ $t('text.rgb_slow_start') }}:</span>
                                <n-input-number v-model:value="rgb_slow_start_period" size="small" :step="0.05" :min="0" :max="10" style="width: 100px;"/>
                            </n-flex>
                            <n-slider v-model:value="rgb_slow_start_period" :step="0.05" :min="0" :max="10"/>
                        </n-card>
                    </n-flex>
                </n-card>
            </n-flex>
        </n-flex>
    </n-flex>
</template>
<style>
.rgb_background{
    position: absolute;
    background-image: url('../../desc.png');
    background-size:contain;
    background-position: center;
    height:400px;
    width:800px;
}
</style>
<script lang="ts">
import { computed, h, reactive, ref, watch } from 'vue';
import { hex_to_rgb, rgb_to_hex } from '../Api/webusb';
import RgbButton from '../UI/RgbButton.vue'
import { useI18n } from 'vue-i18n';
import FuncSwitch from '../UI/FuncSwitch.vue';
import { conf } from '../Api/config.ts';
let rgb_layout = ref(1);
let rgb_pos=[[{left:280,top:100},
        {left:200,top:100},
        {left:200,top:150},
        {left:280,top:150},
        {left:400,top:220},
        {left:480,top:220},
        //{left:400,top:170},
        {left:480,top:170},
        //{left:480,top:220},
        {left:400,top:170},
        {left:370,top:240},
        {left:370,top:160},
        {left:370,top:125},
        {left:410,top:145},
        {left:550,top:170},
        {left:505,top:125},
        {left:465,top:90},
        {left:437,top:100},
        {left:410,top:110},
        {left:370,top:90},
        {left:315,top:100},
        {left:340,top:140},
        {left:300,top:130},
        {left:240,top:185},
        {left:240,top:235},
        {left:300,top:215},
        {left:320,top:195},
        {left:300,top:175},
        {left:280,top:195}
    ],[ {left:280,top:100},
        {left:200,top:100},
        {left:200,top:150},
        {left:280,top:150},
        {left:400,top:220},
        {left:480,top:220},
        //{left:400,top:170},
        {left:480,top:170},
        //{left:480,top:220},
        {left:400,top:170},
        {left:410,top:145},
        {left:410,top:110},
        {left:467,top:145},
        {left:510,top:180},
        {left:547,top:145},
        {left:507,top:110},
        {left:437,top:100},
        {left:315,top:100},
        {left:342,top:145},
        {left:270,top:196},
        {left:300,top:215},
        {left:330,top:196},
        {left:300,top:175}]]
export default {
    setup() {
        const { t } = useI18n();
        let rgb_value = reactive([]);
        conf.rgb.data.forEach((item,index) => {
            rgb_value.push(rgb_to_hex(item));
        });
        watch(conf.rgb.data,()=>{
            conf.rgb.data.forEach((item,index) => {
            rgb_value[index]=(rgb_to_hex(item));
        });
        })
        return {
            h,
            rgb_button_color:reactive([]),
            rgb_to_hex,
            hex_to_rgb,
            conf,
            rgb_value,
            rgb_pos,
            rgb_layout,
            rgb_layout_list:computed(()=>[
            {
                label: t('text.top_rgb'),
                value: 0,
                disabled: false
            },{
                label: t('text.button_rgb'),
                value: 1,
                disabled: false
            }])
        };
    },
    components:{
        RgbButton,
        FuncSwitch
    },
    methods: {
        rgb_button_color_cal_rev(color:string):string{
            let c=hex_to_rgb(color);
            c.r=0xff-c.r;
            c.g=0xff-c.g;
            c.b=0xff-c.b;
            return rgb_to_hex(c);
        },
    },
    computed:{
        rgb_pos_cal:{
            get(){
                let arr:any[] = [];
                for(var p of rgb_pos[rgb_layout.value]){
                    if(p.left<0)break;
                    arr.push(p);
                }
                return arr;
            }
        },
        rgb_slow_start_period:{
            get():number{
                return conf.rgb.slow_start_period/20;
            },
            set(v:number){
                let r=v*10;
                if(r>200)r=200;
                else if(r<0)r=0;
                conf.rgb.slow_start_period=v*20;
            }
        },
    }
}
</script>
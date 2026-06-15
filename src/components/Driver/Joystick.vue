<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Joystick</h1>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.left')+$t('word_sep')+$t('text.js')+':'" style="width: 450px;">
                <JoystickPanel v-model:mode="conf.js.l_mode" :modeList="mode_list" :chnl="0" canvasID="js_canvas_l"></JoystickPanel>
            </n-card>
            <n-card :title="$t('text.right')+$t('word_sep')+$t('text.js')+':'" style="width: 450px;">
                <JoystickPanel v-model:mode="conf.js.r_mode" :modeList="mode_list" :chnl="1" canvasID="js_canvas_r"></JoystickPanel>
            </n-card>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.anti_snap')+':'">
                <n-flex>
                    <span>{{ $t('text.left')+$t('word_sep')+$t('text.dz')}}:</span>
                    <n-input-number v-model:value="conf.snpbk.dz[0]" size="tiny" />
                    <n-slider v-model:value="conf.snpbk.dz[0]" :step="1" :min="0" :max="2047" />
                    <span>{{ $t('text.right')+$t('word_sep')+$t('text.dz')}}:</span>
                    <n-input-number v-model:value="conf.snpbk.dz[1]" size="tiny" />
                    <n-slider v-model:value="conf.snpbk.dz[1]" :step="1" :min="0" :max="2047" />
                    <span>{{ $t('text.filter')+$t('word_sep')+$t('text.window')}}({{ $t('text.ms') }}):</span>
                    <n-input-number v-model:value="js_snbk_delay" size="tiny" />
                    <n-slider v-model:value="js_snbk_delay" :step="0.001" :min="0" :max="64" />
                </n-flex>
            </n-card>
            <n-card :title="$t('text.st_and_cali')+':'">
                <n-flex vertical>
                    <div>
                        <n-flex justify="space-around">
                            <n-button @click="calibrate_js_center">
                                {{ $t('text.cali') }}{{ $t('word_sep') }}{{ $t('text.js') }}{{ $t('word_sep') }}{{ $t('text.center_point') }}
                            </n-button>
                        </n-flex>
                    </div>
                    <span>{{ $t('hint.js_center_cali') }}:</span>
                    <n-divider/>
                    <div>
                        <n-flex justify="space-between">
                            <span>{{ $t('text.dz') }}{{ $t('word_sep') }}{{ $t('text.mode') }}:</span>
                            <n-select v-model:value="conf.js.dz_mode" :options="dz_mode_list" style="width: 200px" />
                        </n-flex>
                        <func-switch :text="$t('text.js')+$t('word_sep')+
                            $t('text.range')+$t('word_sep')+$t('text.normalization')" 
                            v-model:value="conf.js.normalization"/>
                    </div>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { conf } from '../Api/config';
import { adc_data, fw_snd, js_data, raw_js_data, send_conf } from '../Api/webusb';
import type { Coord } from '../Api/struct';
import { useI18n } from 'vue-i18n';
import JoystickPanel from './components/js/JoystickPanel.vue'
import { isNil } from 'lodash';
import _ from 'lodash';
const { t } = useI18n();
const mode_list=[{
    label:'Ratio',
    value:0
},{
    label:'Affine',
    value:1
}]
const js_snbk_delay = computed({
    get: ():number=>{
        return conf.snpbk.filter_window/1000;
    },
    set: (v:number)=>{
        conf.snpbk.filter_window=v*1000;
    }
})
const dz_mode_list = computed(() => [
    {
        label: 'off',
        value: 0,
        disabled: false
    },
    {
        label: 'center',
        value: 1,
        disabled: false
    },
    {
        label: t('text.axis'),
        value: 2,
        disabled: false
    },
    {
        label: t('text.axis')+'('+t('text.smoothed')+')',
        value: 3,
        disabled: false
    }
])
function calibrate_js_center(){
    //fw_snd(0x07,null);
    if(isNil(raw_js_data.value))
        fw_snd(0x07,null);
    else{
        let tmp = _.cloneDeep(adc_data.value);
        console.log(tmp);
        for(let i=0;i<4;++i)
            conf.js.center[i] = tmp[i];
        send_conf(0);
    }
}
let raw_input_interval;
onMounted(()=>{
    raw_input_interval = setInterval(()=>fw_snd(0x06,null), 50); // 每1ms轮询一次
})
onUnmounted(()=>{
    if(!isNil(raw_input_interval))
        clearInterval(raw_input_interval); // 清除定时器，防止内存泄漏
})
</script>
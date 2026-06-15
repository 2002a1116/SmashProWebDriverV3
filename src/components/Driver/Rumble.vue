<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Rumble</h1>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.left')+$t('word_sep')+$t('text.rumble')+$t('word_sep')+$t('text.scale')">
                <n-flex vertical>
                    <n-flex>
                        <span>{{ $t('text.high') }}{{ $t('word_sep') }}{{ $t('text.band') }}:</span>
                        <n-input-number v-model:value="rumble_ratio_0" :step="1" :min="0" :max="200" size="small" style="width:150px"/>%
                        <n-slider v-model:value="rumble_ratio_0" :step="1" :min="0" :max="200" />
                    </n-flex>
                    <n-flex>
                        <span>{{ $t('text.low') }}{{ $t('word_sep') }}{{ $t('text.band') }}:</span>
                        <n-input-number v-model:value="rumble_ratio_2" :step="1" :min="0" :max="200" size="small" style="width:150px"/>%
                        <n-slider v-model:value="rumble_ratio_2" :step="1" :min="0" :max="200" />
                    </n-flex>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.right')+$t('word_sep')+$t('text.rumble')+$t('word_sep')+$t('text.scale')">
                <n-flex vertical>
                    <n-flex>
                        <span>{{ $t('text.high') }}{{ $t('word_sep') }}{{ $t('text.band') }}:</span>
                        <n-input-number v-model:value="rumble_ratio_1" :step="1" :min="0" :max="200" size="small" style="width:150px"/>%
                        <n-slider v-model:value="rumble_ratio_1" :step="1" :min="0" :max="200" />
                    </n-flex>
                    <n-flex>
                        <span>{{ $t('text.low') }}{{ $t('word_sep') }}{{ $t('text.band') }}:</span>
                        <n-input-number v-model:value="rumble_ratio_3" :step="1" :min="0" :max="200" size="small"  style="width:150px"/>%
                        <n-slider v-model:value="rumble_ratio_3" :step="1" :min="0" :max="200" />
                    </n-flex>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.rumble')+$t('word_sep')+$t('text.settings')">
                <n-flex vertical>
                <!--
                    <n-flex>
                        <span>rumble switch:</span>
                        <n-switch v-model:value="rumble_enabled" />
                    </n-flex>
                -->
                    <func-switch v-model:value="conf.rumble.enable" :text="$t('text.rumble')"/>
                    <span>{{ $t('hint.rise_low') }}</span>
                    <func-switch v-model:value="conf.rumble.hd.low_amp_rise" :text="$t('text.rise_low')"/>
                    <span>{{ $t('hint.drop_high') }}</span>
                    <func-switch v-model:value="conf.rumble.hd.high_amp_drop" :text="$t('text.drop_high')"/>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.rumble')+$t('word_sep')+$t('text.strategy')">
                <n-flex vertical>
                    <n-flex>
                        <span>{{ $t('text.rumble') }}{{ $t('word_sep') }}{{ $t('text.mode') }}:</span>
                        <n-select v-model:value="conf.rumble.hd.legacy" :options="rumble_mode_list" style="width: 150px" />
                    </n-flex>
                    <n-flex>
                        <span>{{ $t('hint.rumble_strategy') }}</span>
                        <n-select v-model:value="conf.rumble.hd.pattern" :options="rumble_pattern_list" style="width: 300px" />
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { AMP_FACTOR } from '../Api/webusb'
import { configProviderProps } from 'naive-ui';
import { factory } from 'typescript';
import FuncSwitch from '../UI/FuncSwitch.vue';
import { useI18n } from 'vue-i18n';
import { conf } from '../Api/config.ts';
export default {
    setup() {
        const { t } = useI18n();
        return {
            conf,
            rumble_pattern_list:computed(()=>[
                {
                    label: 'play wave with 0 amplitude',
                    value: 0,
                    disabled: false
                },
                {
                    label: 'skip wave with 0 amplitude',
                    value: 1,
                    disabled: false
                }
            ]),
            rumble_mode_list:computed(()=>[
                {
                    label: t('text.new'),
                    value: 0,
                    disabled: false
                },
                {
                    label: t('text.legacy'),
                    value: 1,
                    disabled: false
                }
            ])
        }
    },
    components:{
        FuncSwitch,
    },
    computed:{
        rumble_ratio_0:{
            get(){
                return conf.rumble.hd.amp_ratio[0]/AMP_FACTOR*100;
            },
            set(v:any){
                v/=100;
                if(v>=2)v=1.99;
                else if(v<0)v=0
                conf.rumble.hd.amp_ratio[0]=v*AMP_FACTOR;
            }
        },
        rumble_ratio_1:{
            get(){
                return conf.rumble.hd.amp_ratio[1]/AMP_FACTOR*100;
            },
            set(v:any){
                v/=100;
                if(v>=2)v=1.99;
                else if(v<0)v=0
                conf.rumble.hd.amp_ratio[1]=v*AMP_FACTOR;
            }
        },
        rumble_ratio_2:{
            get(){
                return conf.rumble.hd.amp_ratio[2]/AMP_FACTOR*100;
            },
            set(v:any){
                v/=100;
                if(v>=2)v=1.99;
                else if(v<0)v=0
                conf.rumble.hd.amp_ratio[2]=v*AMP_FACTOR;
            }
        },
        rumble_ratio_3:{
            get(){
                return conf.rumble.hd.amp_ratio[3]/AMP_FACTOR*100;
            },
            set(v:any){
                v/=100;
                if(v>=2)v=1.99;
                else if(v<0)v=0
                conf.rumble.hd.amp_ratio[3]=v*AMP_FACTOR;
            }
        },
    },
    methods: {
    },
    mounted() {
    },
    beforeDestroy() {
    }
}
</script>
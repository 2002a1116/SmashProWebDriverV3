<template>
    <n-flex vertical>
        <n-flex>
            <n-flex>
                <span>X{{ $t('word_sep') }}{{ $t('text.axis') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('text.scale') }}:</span>
                <n-input-number v-model:value="js_ratio_0" :min="0" :max="4"
                :step="0.03125" size="small" style="width: 110px;"/>
            </n-flex>
            <n-flex>
                <span>{{ $t('text.reverse') }}:</span>
                <n-switch v-model:value="jss_0"/>
                <!-- <n-switch v-model:value="js_reversed[0]"
                    @update:value="(v: boolean): boolean => { js_reversed[0] = (v); js_ratio_0=-js_ratio_0; return v; }" /> -->
            </n-flex>
            <n-slider v-model:value="js_ratio_0" :step="0.03125" :min="0" :max="4"
                @update:value="(value: number) => js_associate(0, value)" />
        </n-flex>
        <n-flex>
            <n-flex>
                <span>Y{{ $t('word_sep') }}{{ $t('text.axis') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('text.scale') }}:</span>
                <n-input-number v-model:value="js_ratio_1" :min="0" :max="4"
                :step="0.03125" size="small" style="width: 110px;"/>
            </n-flex>
            <n-flex>
                <span>{{ $t('text.reverse') }}:</span>
                <n-switch v-model:value="jss_1"/>
                <!--
                <n-switch v-model:value="js_reversed[1]"
                    @update:value="(v: boolean): boolean => { js_reversed[1] = (v); js_ratio_1=-js_ratio_1; return v; }" />
                -->
            </n-flex>
            <n-slider v-model:value="js_ratio_1" :step="0.03125" :min="0" :max="4"
                @update:value="(value: number) => js_associate(1, value)" />
        </n-flex>
        <span>{{ $t('text.dz') }}({{ $t('text.raw')}}):</span>
        <n-flex>
            <span>X{{ $t('word_sep') }}{{ $t('text.axis') }}:</span>
            <n-input-number v-model:value="conf.js.dz[chnl*2+0]" size="small" />
            <n-slider v-model:value="conf.js.dz[chnl*2+0]" :step="1" :min="0" :max="256" />
            <span>Y{{ $t('word_sep') }}{{ $t('text.axis') }}:</span>
            <n-input-number v-model:value="conf.js.dz[chnl*2+1]" size="small" />
            <n-slider v-model:value="conf.js.dz[chnl*2+1]" :step="1" :min="0" :max="256" />
        </n-flex>
        <span>{{ $t('text.fac_cali') }}:</span>
        <n-flex>
        </n-flex>
    </n-flex>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { JS_FACTOR, device, fw_snd } from '../../../../Api/webusb.ts'
import FuncSwitch from '../../../../UI/FuncSwitch.vue';
import { useI18n } from 'vue-i18n';
import { conf } from '../../../../Api/config.ts';
export default {
    props:{
        chnl:Number,
    },
    setup() {
        const { t } = useI18n();
        return {
            //js_ratio: ref([1.25, 1.25, 1.25, 1.25]),
            js_reversed: ref([false, false, false, false]),
            conf,
            t,
        }
    },
    components:{
        FuncSwitch,
    },
    methods: {
        get_js_ratio(id: number): number{
            return (conf.js.ratio[id]<0?-conf.js.ratio[id]:conf.js.ratio[id])/JS_FACTOR;
        },
        set_js_ratio(id: number, v: any){
            conf.js.ratio[id] = v * JS_FACTOR * (conf.js.ratio[id]<0?-1:1);
        },
        get_jss(id:number):boolean {
            return conf.js.ratio[id]<0;
        },
        js_associate(id: number, value: number): number {
            //console.log(value);
            //conf.joystick_ratio[id] = Math.floor(value * JS_FACTOR * (this.js_reversed[id] ? -1 : 1));
            return value;
        }
    },
    computed: {
        js_ratio_0:{
            get():number{
                return this.get_js_ratio(this.chnl*2+0);
                //return conf.joystick_ratio[0] / JS_FACTOR * (this.js_reversed[0] ? -1 : 1);
            },
            set(v:number){
                this.set_js_ratio(this.chnl*2+0,v);
                //conf.joystick_ratio[0] = v * JS_FACTOR*(this.js_reversed[0] ? -1 : 1);
            }
        },
        js_ratio_1:{
            get():number{
                return this.get_js_ratio(this.chnl*2+1);
                //return conf.joystick_ratio[1] / JS_FACTOR * (this.js_reversed[1] ? -1 : 1);
            },
            set(v:number){
                this.set_js_ratio(this.chnl*2+1,v);
                //conf.joystick_ratio[1]=v*JS_FACTOR*(this.js_reversed[1] ? -1 : 1);
            }
        },
        jss_0:{
            get():boolean{
                return this.get_jss(this.chnl*2+0);
            },
            set(v:boolean){
                if(v != this.get_jss(this.chnl*2+0))
                    conf.js.ratio[this.chnl*2+0]*=-1;
            }
        },
        jss_1:{
            get():boolean{
                return this.get_jss(this.chnl*2+1);
            },
            set(v:boolean){
                if(v != this.get_jss(this.chnl*2+1))
                    conf.js.ratio[this.chnl*2+1]*=-1;
            }
        }
    },
}

</script>

<style scoped></style>
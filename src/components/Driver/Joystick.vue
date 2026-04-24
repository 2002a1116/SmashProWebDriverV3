<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Joystick</h1>
        </n-flex>
        <n-flex justify="center">
            <n-card class="n-card-large">
                <n-flex justify="space-evenly">
                    <canvas id="ljoy_canvas" width="300" height="350"></canvas>
                    <canvas id="rjoy_canvas" width="300" height="350"></canvas>
                </n-flex>
            </n-card>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.left')+$t('word_sep')+$t('text.js')+':'">
                <n-flex vertical>
                    <n-flex>
                        <n-flex>
                            <span>X{{ $t('word_sep') }}{{ $t('text.axis') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('text.scale') }}:</span>
                            <n-input-number v-model:value="js_ratio_0" :min="0" :max="4"
                            :step="0.03125" size="small" style="width: 120px;"/>
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
                            :step="0.03125" size="small" style="width: 120px;"/>
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
                        <n-input-number v-model:value="conf.dead_zone[0]" size="small" />
                        <n-slider v-model:value="conf.dead_zone[0]" :step="1" :min="0" :max="256" />
                        <span>Y{{ $t('word_sep') }}{{ $t('text.axis') }}:</span>
                        <n-input-number v-model:value="conf.dead_zone[1]" size="small" />
                        <n-slider v-model:value="conf.dead_zone[1]" :step="1" :min="0" :max="256" />
                    </n-flex>
                    <span>{{ $t('text.fac_cali') }}:</span>
                    <n-flex>
                        <n-button @click="js_start_calibrate(0)">{{ $t('text.start') }}</n-button>
                        <n-button @click="js_save_calibration(0)">{{ $t('text.end') }}</n-button>
                    </n-flex>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.right')+$t('word_sep')+$t('text.js')+':'">
                <n-flex vertical>
                    <n-flex>
                        <n-flex>
                            <span>X{{ $t('word_sep') }}{{ $t('text.axis') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('text.scale') }}:</span>
                            <n-input-number v-model:value="js_ratio_2" :min="0" :max="4"
                            :step="0.03125" size="small" style="width: 120px;" />
                        </n-flex>
                        <n-flex>
                            <span>{{ $t('text.reverse') }}:</span>
                            <n-switch v-model:value="jss_2"/>
                            <!--
                            <n-switch v-model:value="js_reversed[2]"
                                @update:value="(v: boolean): boolean => { js_reversed[2] = (v); js_ratio_2=-js_ratio_2; return v; }" />
                            -->
                        </n-flex>
                        <n-slider v-model:value="js_ratio_2" :step="0.03125" :min="0" :max="4"
                            @update:value="(value: number) => js_associate(2, value)" />
                    </n-flex>
                    <n-flex>
                        <n-flex>
                            <span>Y{{ $t('word_sep') }}{{ $t('text.axis') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('word_sep') }}{{ $t('text.scale') }}:</span>
                            <n-input-number v-model:value="js_ratio_3" :min="0" :max="4"
                            :step="0.03125" size="small" style="width: 120px;"/>
                        </n-flex>
                        <n-flex>
                            <span>{{ $t('text.reverse' )}}:</span>
                            <n-switch v-model:value="jss_3"/>
                            <!--
                            <n-switch v-model:value="js_reversed[3]"
                                @update:value="(v: boolean): boolean => { js_reversed[3] = (v); js_ratio_3=-js_ratio_3; return v; }" />
                            -->
                        </n-flex>
                        <n-slider v-model:value="js_ratio_3" :step="0.03125" :min="0" :max="4"
                            @update:value="(value: number) => js_associate(3, value)" />
                    </n-flex>
                    <span>{{ $t('text.dz') }}({{ $t('text.raw')}}):</span>
                    <n-flex>
                        <span>X{{ $t('word_sep') }}{{ $t('text.axis') }}:</span>
                        <n-input-number v-model:value="conf.dead_zone[2]" size="small" />
                        <n-slider v-model:value="conf.dead_zone[2]" :step="1" :min="0" :max="256" />
                        <span>Y{{ $t('word_sep') }}{{ $t('text.axis') }} Y:</span>
                        <n-input-number v-model:value="conf.dead_zone[3]" size="small" />
                        <n-slider v-model:value="conf.dead_zone[3]" :step="1" :min="0" :max="256" />
                    </n-flex>
                    <span>{{ $t('text.fac_cali') }}:</span>
                    <n-flex>
                        <n-button @click="js_start_calibrate(1)">{{ $t('text.start') }}</n-button>
                        <n-button @click="js_save_calibration(1)">{{ $t('text.end') }}</n-button>
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.anti_snap')+':'">
                <n-flex>
                    <span>{{ $t('text.left')+$t('word_sep')+$t('text.dz')}}:</span>
                    <n-input-number v-model:value="conf.joystick_snapback_deadzone[0]" size="tiny" />
                    <n-slider v-model:value="conf.joystick_snapback_deadzone[0]" :step="1" :min="0" :max="2048" />
                    <span>{{ $t('text.right')+$t('word_sep')+$t('text.dz')}}:</span>
                    <n-input-number v-model:value="conf.joystick_snapback_deadzone[1]" size="tiny" />
                    <n-slider v-model:value="conf.joystick_snapback_deadzone[1]" :step="1" :min="0" :max="2048" />
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
                            <n-select v-model:value="dead_zone_mode" :options="dz_mode_list" style="width: 200px" />
                        </n-flex>
                        <!--
                            <n-flex justify="space-between">
                            <span>joystick range normalization:</span>
                            <n-switch v-model:value="js_normalization"/>
                            </n-flex>
                        -->
                            <func-switch :text="$t('text.js')+$t('word_sep')+$t('text.range')+$t('word_sep')+$t('text.normalization')" v-model:value="js_normalization"/>
                    </div>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { conf, JS_FACTOR, device, js, fw_snd, js_start_calibrate, js_save_calibration } from '../webusb'
import FuncSwitch from './FuncSwitch.vue';
import { useI18n } from 'vue-i18n';
let interval:any;
export default {
    setup() {
        const { t } = useI18n();
        return {
            //js_ratio: ref([1.25, 1.25, 1.25, 1.25]),
            js_reversed: ref([false, false, false, false]),
            dz_mode_list: computed(() => [
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
            ]),
            interval,
            js_start_calibrate,
            js_save_calibration,
            conf,
        }
    },
    components:{
        FuncSwitch,
    },
    methods: {
        get_js_ratio(id: number): number{
            return (conf.joystick_ratio[id]<0?-conf.joystick_ratio[id]:conf.joystick_ratio[id])/JS_FACTOR;
        },
        set_js_ratio(id: number, v: any){
            conf.joystick_ratio[id] = v * JS_FACTOR * (conf.joystick_ratio[id]<0?-1:1);
        },
        get_jss(id:number):boolean {
            return conf.joystick_ratio[id]<0;
        },
        js_associate(id: number, value: number): number {
            //console.log(value);
            //conf.joystick_ratio[id] = Math.floor(value * JS_FACTOR * (this.js_reversed[id] ? -1 : 1));
            return value;
        },
        calibrate_js_center(){
            fw_snd(0x07,null);
        },
        draw() {
            let ljco:any = document.getElementById('ljoy_canvas');
            let rjco:any = document.getElementById('rjoy_canvas');
            //console.log(conf.joystick_snapback_deadzone);
            //console.log(conf.dead_zone);
            try {
                let ljc = ljco.getContext('2d');
                let rjc = rjco.getContext('2d');
                ljc.clearRect(0, 0, 300, 350);
                rjc.clearRect(0, 0, 300, 350);
                ljc.beginPath();
                ljc.arc(100, 100, 80, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                ljc.closePath();//关闭当前路径
                rjc.beginPath();
                rjc.arc(100, 100, 80, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                rjc.closePath();//关闭当前路径
                ljc.moveTo(0, 100);//起点坐标
                ljc.lineTo(200, 100);//终点坐标
                ljc.moveTo(100, 0);//起点坐标
                ljc.lineTo(100, 200);//终点坐标
                rjc.moveTo(0, 100);//起点坐标
                rjc.lineTo(200, 100);//终点坐标
                rjc.moveTo(100, 0);//起点坐标
                rjc.lineTo(100, 200);//终点坐标
                ljc.stroke();
                rjc.stroke();
                ljc.beginPath();
                //ljc.arc(100, 100, 5, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                //console.log(js[0].pos);
                ljc.arc(js[0].pos.x * 100 / 2048, (4096 - js[0].pos.y) * 100 / 2048, 5, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                ljc.closePath();
                ljc.fillStyle = 'ffffff';
                ljc.fill();
                ljc.stroke();
                rjc.beginPath();
                //ljc.arc(100, 100, 5, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                rjc.arc(js[1].pos.x * 100 / 2048, (4096 - js[1].pos.y) * 100 / 2048, 5, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
                rjc.closePath();
                rjc.fillStyle = 'ffffff';
                rjc.fill();
                rjc.stroke();
                ljc.font        = "normal 20px Arial";
                ljc.strokeStyle = "#000000";
                rjc.font        = "normal 20px Arial";
                rjc.strokeStyle = "#000000";
                ljc.strokeText('X'+this.$t('word_sep')+this.$t('text.pos')+":"+(js[0].pos.x-2048).toString(), 0, 310);
                ljc.strokeText(this.$t('text.raw')+this.$t('word_sep')+this.$t('text.pos')+':'+
                    Math.round(((js[0].pos.x-2048)/this.js_ratio_0)).toString(), 130, 310);

                ljc.strokeText('Y'+this.$t('word_sep')+this.$t('text.pos')+":"+(js[0].pos.y-2048).toString(), 0, 330);
                ljc.strokeText(this.$t('text.raw')+this.$t('word_sep')+this.$t('text.pos')+':'+
                    Math.round(((js[0].pos.y-2048)/this.js_ratio_1)).toString(), 130, 330);
                
                rjc.strokeText('X'+this.$t('word_sep')+this.$t('text.pos')+":"+(js[1].pos.x-2048).toString(), 0, 310);
                rjc.strokeText(this.$t('text.raw')+this.$t('word_sep')+this.$t('text.pos')+':'+
                    Math.round(((js[1].pos.x-2048)/this.js_ratio_2)).toString(), 130, 310);

                rjc.strokeText('Y'+this.$t('word_sep')+this.$t('text.pos')+":"+(js[1].pos.y-2048).toString(), 0, 330);
                rjc.strokeText(this.$t('text.raw')+this.$t('word_sep')+this.$t('text.pos')+':'+
                    Math.round(((js[1].pos.y-2048)/this.js_ratio_3)).toString(), 130, 330);
            } catch (e: any) {
                console.log("draw error");
                console.log(e.message);
            }
        }
    },
    computed: {
        js_normalization:{
            get():boolean{
                return ((conf.config_bitmap1>>2)&0x1)>0;
            },
            set(v:boolean){
                if(v)
                    conf.config_bitmap1|=0x4;
                else
                    conf.config_bitmap1&=(~0x4);
            }
        },
        js_snbk_delay:{
            get(){
                return conf.joystick_snapback_filter_max_delay/1000;
            },
            set(v:any){
                conf.joystick_snapback_filter_max_delay=v*1000;
            }
        },
        dead_zone_mode:{
            get():number{
                //return (conf.config_bitmap1>>6)&0x3;
                return conf.dead_zone_mode;
            },
            set(v:number){
                conf.dead_zone_mode=v;
                //conf.config_bitmap1=(conf.config_bitmap1&0x3f)|((v<<6)&0xc0)
            }
        },
        js_ratio_0:{
            get():number{
                return this.get_js_ratio(0);
                //return conf.joystick_ratio[0] / JS_FACTOR * (this.js_reversed[0] ? -1 : 1);
            },
            set(v:number){
                this.set_js_ratio(0,v);
                //conf.joystick_ratio[0] = v * JS_FACTOR*(this.js_reversed[0] ? -1 : 1);
            }
        },
        js_ratio_1:{
            get():number{
                return this.get_js_ratio(1);
                //return conf.joystick_ratio[1] / JS_FACTOR * (this.js_reversed[1] ? -1 : 1);
            },
            set(v:number){
                this.set_js_ratio(1,v);
                //conf.joystick_ratio[1]=v*JS_FACTOR*(this.js_reversed[1] ? -1 : 1);
            }
        },
        js_ratio_2:{
            get():number{
                return this.get_js_ratio(2);
                //return conf.joystick_ratio[2] / JS_FACTOR * (this.js_reversed[2] ? -1 : 1);
            },
            set(v:number){
                this.set_js_ratio(2,v);
                //conf.joystick_ratio[2]=v*JS_FACTOR*(this.js_reversed[2] ? -1 : 1);
            }
        },
        js_ratio_3:{
            get():number{
                return this.get_js_ratio(3);
                //return conf.joystick_ratio[3] / JS_FACTOR * (this.js_reversed[3] ? -1 : 1);
            },
            set(v:number){
                this.set_js_ratio(3,v);
                //conf.joystick_ratio[3]=v*JS_FACTOR*(this.js_reversed[3] ? -1 : 1);
            }
        },
        jss_0:{
            get():boolean{
                return this.get_jss(0);
            },
            set(v:boolean){
                if(v != this.get_jss(0))
                    conf.joystick_ratio[0]*=-1;
            }
        },
        jss_1:{
            get():boolean{
                return this.get_jss(1);
            },
            set(v:boolean){
                if(v != this.get_jss(1))
                    conf.joystick_ratio[1]*=-1;
            }
        },
        jss_2:{
            get():boolean{
                return this.get_jss(2);
            },
            set(v:boolean){
                if(v != this.get_jss(2))
                    conf.joystick_ratio[2]*=-1;
            }
        },
        jss_3:{
            get():boolean{
                return this.get_jss(3);
            },
            set(v:boolean){
                if(v != this.get_jss(3))
                    conf.joystick_ratio[3]*=-1;
            }
        }
    },
    watch:{
        /*watch_js_ratio:{
            handler(v,oldv){
                for(let i=0;i<4;++i){
                    //console.log(conf.joystick_ratio[i]);
                    this.js_reversed[i]=(conf.joystick_ratio[i]<0);
                    //conf.joystick_ratio[i]=conf.joystick_ratio[i] * (this.js_reversed[i] ? -1 : 1);
                    //console.log(conf.joystick_ratio[i]);
                }
            }
        }*/
    },
    mounted() {
        /*for(let i=0;i<4;++i){
            //console.log(conf.joystick_ratio[i]);
            this.js_reversed[i]=(conf.joystick_ratio[i]<0);
            //conf.joystick_ratio[i]=conf.joystick_ratio[i] * (this.js_reversed[i] ? -1 : 1);
            console.log(conf.joystick_ratio[i]);
        }*/
        this.draw(); // 初始调用
        this.interval = setInterval(this.draw, 1); // 每1ms轮询一次
    },
    unmounted() {
        clearInterval(this.interval); // 清除定时器，防止内存泄漏
    },
    beforeDestroy() {
        clearInterval(this.interval); // 清除定时器，防止内存泄漏
    }
}
</script>

<style scoped></style>
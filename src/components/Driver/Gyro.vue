<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Gyroscope</h1>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.imu')+$t('word_sep')+$t('text.settings')">
                <n-flex vertical>
                    <n-flex justify="space-evenly">
                        <n-flex>
                            <func-switch v-model:value="conf.imu.enable" :text="$t('text.gyro')"/>
                        </n-flex>
                        <n-flex>
                            <n-button @click="calibrate_sensor">
                                {{ $t('text.cali') }}
                            </n-button>
                        </n-flex>
                    </n-flex>
                    <span>{{ $t('text.sample_gap') }}({{ $t('text.ms') }}):</span>
                    <n-input-number v-model:value="imu_sample_gap" size="small" />
                    <n-slider v-model:value="imu_sample_gap" :step="0.001" :min="1" :max="5" />
                </n-flex>
            </n-card>
            <n-card :title="$t('text.gyro')+' '+$t('text.scale')">
                <n-flex vertical>
                    <n-flex>
                        <span>X{{$t('word_sep')}}{{ $t('text.axis') }}:</span>
                        <n-input-number v-model:value="gyro_ratio_x" size="small" />%
                        <n-slider v-model:value="gyro_ratio_x" :step="1" :min="0" :max="200" />
                    </n-flex>
                    <n-flex>
                        <span>Y{{$t('word_sep')}}{{ $t('text.axis') }}:</span>
                        <n-input-number v-model:value="gyro_ratio_y" size="small" />%
                        <n-slider v-model:value="gyro_ratio_y" :step="1" :min="0" :max="200" />
                    </n-flex>
                    <n-flex>
                        <span>Z{{$t('word_sep')}}{{ $t('text.axis') }}:</span>
                        <n-input-number v-model:value="gyro_ratio_z" size="small" />%
                        <n-slider v-model:value="gyro_ratio_z" :step="1" :min="0" :max="200" />
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { GYRO_FACTOR,calibrate_sensor } from '../Api/webusb'
import { conf } from '../Api/config';
import FuncSwitch from '../UI/FuncSwitch.vue';
export default {
    setup() {
        return {
            calibrate_sensor,
            conf,
            //imu_sample_gap: ref(1.75),
            //imu_enabled: ref(1),
            //gyro_ratio_x: ref(1),
            //gyro_ratio_y: ref(1),
            //gyro_ratio_z: ref(1)
        }
    },
    components:{
        FuncSwitch
    },
    computed:{
        imu_sample_gap:{
            get():number{
                return conf.imu.sample_gap/1000;
            },
            set(v:number){
                conf.imu.sample_gap=v*1000;
            }
        },
        gyro_ratio_x:{
            get():number{
                return conf.imu.ratio_x/GYRO_FACTOR*100;
            },
            set(v:number){
                conf.imu.ratio_x=v*GYRO_FACTOR/100;
            }
        },
        gyro_ratio_y:{
            get():number{
                return conf.imu.ratio_y/GYRO_FACTOR*100;
            },
            set(v:number){
                conf.imu.ratio_y=v*GYRO_FACTOR/100;
            }
        },
        gyro_ratio_z:{
            get():number{
                return conf.imu.ratio_z/GYRO_FACTOR*100;
            },
            set(v:number){
                conf.imu.ratio_z=v*GYRO_FACTOR/100;
            }
        }
    },
    methods: {
    }
}
</script>
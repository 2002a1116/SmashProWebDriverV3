<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Others</h1>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.settings')" style="max-width: 500px">
                <n-flex vertical>
                    <n-flex justify="start">
                        <n-grid x-gap="0" :cols="30" collapsed-rows=1 item-responsive>
                            <n-gi span="6">
                                    <span>{{ $t('text.bt_addr') }}:</span>
                            </n-gi>
                            <n-gi span="3" style="display: flex; align-items: center; gap: 2px;">
                                <n-input v-model:value="bd_addr_0" :show-button=false style="width: 40px" min="0"
                                    max="255" size="tiny"/>
                                <span style="margin: 0 2px;">:</span>
                            </n-gi>       
                            <n-gi span="3" style="display: flex; align-items: center; gap: 2px;">       
                                <n-input v-model:value="bd_addr_1" :show-button=false style="width: 40px" min="0"
                                    max="255" size="tiny"/>
                                <span style="margin: 0 2px;">:</span>
                            </n-gi>       
                            <n-gi span="3" style="display: flex; align-items: center; gap: 2px;">
                                <n-input v-model:value="bd_addr_2" :show-button=false style="width: 40px" min="0"
                                    max="255" size="tiny"/>
                                <span style="margin: 0 2px;">:</span>
                            </n-gi>       
                            <n-gi span="3" style="display: flex; align-items: center; gap: 2px;">
                                <n-input v-model:value="bd_addr_3" :show-button=false style="width: 40px" min="0"
                                    max="255" size="tiny"/>
                                <span style="margin: 0 2px;">:</span>
                            </n-gi>       
                            <n-gi span="3" style="display: flex; align-items: center; gap: 2px;">
                                <n-input v-model:value="bd_addr_4" :show-button=false style="width: 40px" min="0"
                                    max="255" size="tiny"/>
                                <span style="margin: 0 2px;">:</span>
                            </n-gi>       
                            <n-gi span="3" style="display: flex; align-items: center; gap: 2px;">     
                                <n-input v-model:value="bd_addr_5" :show-button=false style="width: 40px" min="0"
                                    max="255" size="tiny"/>
                            </n-gi>
                            <n-gi span="6">
                                <n-flex justify="end">
                                    <n-button @click="generate_bd_addr">{{ $t('text.gen') }}</n-button>
                                </n-flex>
                            </n-gi>
                        </n-grid>
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.pfw') }}:</span>
                        <n-select v-model:value="conf.basic.pro_fw_version" :options="pro_fw_ver_list" style="width: 150px" />
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.rpt_rate') }}:</span>
                        <!--<n-select v-model:value="conf.usb.in_interval" :options="report_rate_list" style="width: 150px" />-->
                        <hint-select v-model:value="conf.usb.in_interval" :options="report_rate_list" style="width: 150px"/>
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.pkt_timer') }}:</span>
                        <n-select v-model:value="conf.basic.ns_pkt_timer_mode" :options="pkt_timer_mode_list"
                            style="width: 150px" />
                    </n-flex>
                    <func-switch v-model:value="conf.usb.auto_recovery" :text="$t('text.usb_recovery')"/>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.hw_settings')">
                <n-flex vertical>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.cfw') }}:</span>
                        {{ fw_version_text }}
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.lfw') }}:</span>
                        {{ latest_fw_version_text }}
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{$t('text.chip_id')}}:</span>
                        {{ chip_id }}
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.scanrate') }}:</span>
                        {{ scan_rate }}HZ
                    </n-flex>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.shell_color')">
                <n-flex vertical>
                    {{ $t('text.shell') }}:<n-color-picker :show-preview="true" v-model:value="color_shell" />
                    {{ $t('text.button') }}:<n-color-picker :show-preview="true" v-model:value="color_button" />
                    {{ $t('text.left_grip') }}:<n-color-picker :show-preview="true" v-model:value="color_grip_left" />
                    {{ $t('text.right_grip') }}:<n-color-picker :show-preview="true" v-model:value="color_grip_right" />
                    <n-flex justify="space around">
                        <n-button @click="read_erom_sync(0x6050, 0x0C)">{{ $t('text.read') }}</n-button>
                        <n-button @click="controller_color_save(0x1)">{{ $t('text.save') }}</n-button>
                    </n-flex>
                </n-flex>
            </n-card>
            <n-card :title="$t('text.imp_exp')">
                <n-flex vertical>
                    <n-input v-model:value="conf_seri" type="textarea" :autosize="{
                        minRows: 1,
                        maxRows: 100,
                    }"></n-input>
                    <n-flex justify="space-around">
                        <n-button @click="import_json_config">{{ $t('text.imp') }}</n-button>
                        <n-button @click="export_json_config">{{ $t('text.exp') }}</n-button>
                    </n-flex>
                    <n-divider>{{ $t('text.cloud_service') }}</n-divider>
                    <n-flex justify="space-around">
                        <n-button :loading="loading" @click="read_conf_cloud()"> {{ $t('text.read')+$t('word_sep')+$t('text.cloud') }}</n-button>
                        <n-button :loading="loading" @click="save_conf_cloud()"> {{ $t('text.save')+$t('word_sep')+$t('text.cloud') }}</n-button>
                        <n-button :loading="loading" @click="read_stock_conf()">
                            {{ $t('text.read')+$t('word_sep')+$t('text.stock')+$t('word_sep')+$t('text.config') }}
                        </n-button>
                        <template v-if="is_admin">
                            <n-button :loading="loading" @click="save_stock_conf()">
                                {{ $t('text.save')+$t('word_sep')+$t('text.stock')+$t('word_sep')+$t('text.config') }}
                            </n-button>
                        </template>
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, ref } from 'vue'
import { controller_color, gen_bt_addr, 
    fw_version_text, hex_to_rgb, read_erom_sync, rgb_to_hex, send_conf, chip_id, 
    fw_version,
    controller_color_save,
    device_status, 
    fw_snd} from '../Api/webusb'
import FuncSwitch from '../UI/FuncSwitch.vue';
import axios from 'axios';
import HintSelect from '../UI/HintSelect.vue';
import { conf, conf_download_all, conf_upload_all, GetConfigDTO, ImplementConfigDTO, ReadStockConfig, SaveStockConfig } from '../Api/config';
import _ from 'lodash';
export default {
    setup() {
        const is_admin=inject("$IS_ADMIN");
        return {
            controller_color_save,
            is_admin,
            loading:ref(false),
            fw_version_text,
            latest_fw_version_text: "V1.4.0.3",
            reactive,
            conf_seri: ref(""),
            conf,
            chip_id,
            read_erom_sync,
            device_status,
            status_interval:null,
            pro_fw_ver_list: [
                {
                    label: '3.48',
                    value: 0,
                    disabled: false
                },
                {
                    label: '3.49',
                    value: 2,
                    disabled: false
                },
                {
                    label: '4.33',
                    value: 1,
                    disabled: true
                }
            ],
            report_rate_list: [
                {
                    label: '60',
                    value: 16,
                    disabled: false,
                    hint: 'hint.not_for_ns'
                },
                {
                    label: '125',
                    value: 8,
                    disabled: false,
                    hint: 'hint.for_ns'
                },
                {
                    label: '200',
                    value: 5,
                    disabled: false,
                    hint: 'hint.for_ns'
                },
                {
                    label: '250',
                    value: 4,
                    disabled: false,
                    hint: 'hint.best_for_ns'
                },
                {
                    label: '500',
                    value: 2,
                    disabled: false,
                    hint: 'hint.not_for_ns'
                },
                {
                    label: '1000',
                    value: 1,
                    disabled: false,
                    hint: 'hint.not_for_ns'
                },
            ],
            pkt_timer_mode_list: [
                {
                    label: 'stock',
                    value: 0,
                    disabled: false
                },
                {
                    label: 'timestamp',
                    value: 1,
                    disabled: false
                },
                {
                    label: 'packet counter',
                    value: 2,
                    disabled: false
                },
            ]
        }
    },
    computed: {
        color_shell: {
            get(): string {
                return rgb_to_hex(controller_color[0]);
            },
            set(v: string) {
                controller_color[0] = hex_to_rgb(v);
            }
        },
        color_button: {
            get(): string {
                return rgb_to_hex(controller_color[1]);
            },
            set(v: string) {
                controller_color[1] = hex_to_rgb(v);
            }
        },
        color_grip_left: {
            get(): string {
                return rgb_to_hex(controller_color[2]);
            },
            set(v: string) {
                controller_color[2] = hex_to_rgb(v);
            }
        },
        color_grip_right: {
            get(): string {
                return rgb_to_hex(controller_color[3]);
            },
            set(v: string) {
                controller_color[3] = hex_to_rgb(v);
            }
        },
        bd_addr_0:{
            get(){
                return conf.basic.bd_addr[0].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.basic.bd_addr[0]=parseInt(str,16);
            }
        },
        bd_addr_1:{
            get(){
                return conf.basic.bd_addr[1].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.basic.bd_addr[1]=parseInt(str,16);
            }
        },
        bd_addr_2:{
            get(){
                return conf.basic.bd_addr[2].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.basic.bd_addr[2]=parseInt(str,16);
            }
        },
        bd_addr_3:{
            get(){
                return conf.basic.bd_addr[3].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.basic.bd_addr[3]=parseInt(str,16);
            }
        },
        bd_addr_4:{
            get(){
                return conf.basic.bd_addr[4].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.basic.bd_addr[4]=parseInt(str,16);
            }
        },
        bd_addr_5:{
            get(){
                return conf.basic.bd_addr[5].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.basic.bd_addr[5]=parseInt(str,16);
            }
        },
        scan_rate:{
            get(){
                return (device_status.loopcnt/device_status.looptick*1000).toFixed(0);
            },set(str:string){}
        }
    },
    methods: {
        read_conf_cloud(){
            conf_download_all();
            /*this.color_shell = controller_color[0].hex();
            this.color_button = controller_color[1].hex();
            this.color_grip_left = controller_color[2].hex();
            this.color_grip_right = controller_color[3].hex();*/
        },
        save_conf_cloud(){
            conf_upload_all();
        },
        read_stock_conf(){
            ReadStockConfig();
        },
        save_stock_conf(){
            SaveStockConfig();
        },
        generate_bd_addr() {
            gen_bt_addr();
        },
        export_json_config(){
            let p = GetConfigDTO();
            this.conf_seri=JSON.stringify(p);
        },
        import_json_config(){
            let p = JSON.parse(this.conf_seri);
            ImplementConfigDTO(p);
        }
    },
    components:{
        FuncSwitch,
        HintSelect,
    },
    mounted(){
        this.status_interval = setInterval(()=>{fw_snd(0xFD,null);},1000);
    },
    unmounted() {
        if(!_.isNil(this.status_interval)){
            clearInterval(this.status_interval);
            this.status_interval=null;
        }
    },
    beforeDestroy() {
        if(!_.isNil(this.status_interval)){
            clearInterval(this.status_interval);
            this.status_interval=null;
        }
    }
}
</script>
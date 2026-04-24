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
                            <n-gi span="3">
                                <n-input v-model:value="bd_addr_0" :show-button=false style="width: 40px" min="0"
                                    max="255" />:
                            </n-gi>       
                            <n-gi span="3">                 
                                <n-input v-model:value="bd_addr_1" :show-button=false style="width: 40px" min="0"
                                    max="255" />:
                            </n-gi>       
                            <n-gi span="3">      
                                <n-input v-model:value="bd_addr_2" :show-button=false style="width: 40px" min="0"
                                    max="255" />:
                            </n-gi>       
                            <n-gi span="3">      
                                <n-input v-model:value="bd_addr_3" :show-button=false style="width: 40px" min="0"
                                    max="255" />:
                            </n-gi>       
                            <n-gi span="3">      
                                <n-input v-model:value="bd_addr_4" :show-button=false style="width: 40px" min="0"
                                    max="255" />:
                            </n-gi>       
                            <n-gi span="3">      
                                <n-input v-model:value="bd_addr_5" :show-button=false style="width: 40px" min="0"
                                    max="255" />
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
                        <n-select v-model:value="conf.pro_fw_version" :options="pro_fw_ver_list" style="width: 150px" />
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.rpt_rate') }}:</span>
                        <n-select v-model:value="conf.in_interval" :options="report_rate_list" style="width: 150px" />
                    </n-flex>
                    <n-flex justify="space-between">
                        <span>{{ $t('text.pkt_timer') }}:</span>
                        <n-select v-model:value="conf.ns_pkt_timer_mode" :options="pkt_timer_mode_list"
                            style="width: 150px" />
                    </n-flex>
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
                        <span> chip_id:</span>
                        {{ chip_id }}
                    </n-flex>
                    <func-switch v-model:value="usb_auto_recovery" :text="$t('text.usb_recovery')"/>
                    <n-flex vertical>
                        <n-card>
                            <n-flex justify="space-between">
                                <span>{{ $t('text.rgb_slow_start') }}:</span>
                                <n-input-number v-model:value="rgb_slow_start_period" size="small" :step="0.05" :min="0" :max="10" style="width: 100px;"/>
                            </n-flex>
                            <n-slider v-model:value="rgb_slow_start_period" :step="0.05" :min="0" :max="10"/>
                        </n-card>
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
                        <n-button @click="read_erom(0x6050, 0x0C)">{{ $t('text.read') }}</n-button>
                        <n-button @click="controller_color_save(0xf)">{{ $t('text.save') }}</n-button>
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
                    <n-divider/>
                    <n-flex justify="space-around">
                        <n-button :loading="loading" @click="read_conf_cloud()"> {{ $t('text.read') }} {{ $t('text.cloud') }}</n-button>
                        <n-button :loading="loading" @click="save_conf_cloud()"> {{ $t('text.save') }} {{ $t('text.cloud') }}</n-button>
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script lang="ts">
import { defineComponent, inject, reactive, ref } from 'vue'
import { conf, conf_unserilize, controller_color, controller_color_save, gen_bt_addr, 
    fw_version_text, hex_to_rgb, read_erom, rgb_to_hex, factory_config, fac_conf_unserilize, 
    factory_config_save, send_conf, send_rgb, chip_id, 
    fw_version} from '../webusb'
import { FastFood, Send } from '@vicons/ionicons5';
import FuncSwitch from './FuncSwitch.vue';
import axios from 'axios';
export default {
    setup() {
        const is_admin=inject("$IS_ADMIN");
        return {
            is_admin,
            loading:ref(false),
            fw_version_text,
            latest_fw_version_text: "V1.2.0.5",
            reactive,
            conf_unserilize,
            conf_seri: ref(""),
            conf,
            chip_id,
            read_erom,
            controller_color_save,
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
                    disabled: true
                },
                {
                    label: '125',
                    value: 8,
                    disabled: false
                },
                {
                    label: '200',
                    value: 5,
                    disabled: false
                },
                {
                    label: '250',
                    value: 4,
                    disabled: false
                },
                {
                    label: '500',
                    value: 2,
                    disabled: true
                },
                {
                    label: '1000',
                    value: 1,
                    disabled: false
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
                return conf.bd_addr[0].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.bd_addr[0]=parseInt(str,16);
            }
        },
        bd_addr_1:{
            get(){
                return conf.bd_addr[1].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.bd_addr[1]=parseInt(str,16);
            }
        },
        bd_addr_2:{
            get(){
                return conf.bd_addr[2].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.bd_addr[2]=parseInt(str,16);
            }
        },
        bd_addr_3:{
            get(){
                return conf.bd_addr[3].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.bd_addr[3]=parseInt(str,16);
            }
        },
        bd_addr_4:{
            get(){
                return conf.bd_addr[4].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.bd_addr[4]=parseInt(str,16);
            }
        },
        bd_addr_5:{
            get(){
                return conf.bd_addr[5].toString(16).padStart(2, '0');
            },
            set(str:string){
                conf.bd_addr[5]=parseInt(str,16);
            }
        },
        usb_auto_recovery:{
            get():boolean{
                return (conf.config_bitmap1 & 0x80) == 0;
            },
            set(v:boolean){
                if(v)
                    conf.config_bitmap1 &= ~0x80;
                else
                    conf.config_bitmap1 |= 0x80;
            }
        },
        rgb_slow_start_period:{
            get():number{
                return conf.rgb_slow_start_period/20;
            },
            set(v:number){
                let r=v*10;
                if(r>200)r=200;
                else if(r<0)r=0;
                conf.rgb_slow_start_period=v*20;
            }
        },
    },
    methods: {
        async read_conf_cloud(){
            this.loading=true;
            const res = await axios.get('/api/config/'+chip_id.value) as any;
            if(res.code!='SUCCESS'){
                alert(res.code+":"+res.data.message);
            }else{
                if(res.data.chipId!=chip_id.value){
                    alert("chip id check failed.");
                }
                else{
                    this.conf_seri=res.data.config;
                    let p = JSON.parse(res.data.config);
                    conf_unserilize(p.conf);
                    this.color_shell=rgb_to_hex(p.controller_color[0]);
                    this.color_button=rgb_to_hex(p.controller_color[1]);
                    this.color_grip_left=rgb_to_hex(p.controller_color[2]);
                    this.color_grip_right=rgb_to_hex(p.controller_color[3]);
                    send_rgb(0x1);
                    controller_color_save(0x1);
                    send_conf(0xf);
                }
                //todo: firmware version auto fitting.
            }
            this.loading=false;
        },
        async save_conf_cloud(){
            this.loading=true;
            this.export_json_config();
            const res = await axios.post('/api/config',{chipId:chip_id.value,firmwareVersion:fw_version,config:this.conf_seri}) as any;
            console.log({chipId:chip_id.value,firmwareVersion:fw_version,config:this.conf_seri});
            if(res.code!='SUCCESS'){
                alert(res.code+":"+res.data.message);
            }else{
                alert("cloud save success");
            }
            this.loading=false;
        },
        generate_bd_addr() {
            gen_bt_addr();
        },
        export_json_config(){
            let p=Object();
            p.conf=conf;
            //p.factory_config=factory_config;
            p.controller_color=controller_color;
            this.conf_seri=JSON.stringify(p);
        },
        import_json_config(){
            let p=JSON.parse(this.conf_seri);
            conf_unserilize(p.conf);
            //Object.assign(controller_color,p.controller);
            this.color_shell=rgb_to_hex(p.controller_color[0]);
            this.color_button=rgb_to_hex(p.controller_color[1]);
            this.color_grip_left=rgb_to_hex(p.controller_color[2]);
            this.color_grip_right=rgb_to_hex(p.controller_color[3]);
            send_rgb(1);
            controller_color_save(0x1);
            send_conf(0xf);
        }
    },
    components:{
        FuncSwitch,
    },
    beforeDestroy() {
    }
}
</script>
<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Hardware Info</h1>
        </n-flex>
        <n-flex justify="center">
            <h4>{{ $t('hint.hw_setting') }}</h4>
        </n-flex>
        <n-flex justify="center">
            <n-card :title="$t('text.hw_settings')">
                <n-flex justify="space-between">
                    <span>pcb_typ:</span>
                    <n-select v-model:value="factory_config.pcb_typ" :options="pcb_typ_list" style="width: 150px" />
                </n-flex>
                <n-flex justify="space-between">
                    <span>{{ $t('text.pcb') }}{{ $t('word_sep') }}{{ $t('text.rev') }}:</span>
                    <n-select v-model:value="factory_config.pcb_rev" :options="pcb_rev_list" style="width: 240px" />
                </n-flex>
                <n-flex justify="space-between">
                    <span>indi_led_ofst:</span>
                    <n-input-number v-model:value="factory_config.indi_led_ofst" :step="1" :min="0" :max="85" size="small" style="width: 100px;"/>
                </n-flex>
                <n-flex justify="space-between">
                    <span>{{ $t('text.rgb') }}{{ $t('word_sep') }}{{ $t('text.cnt') }}:</span>
                    <n-input-number v-model:value="factory_config.rgb_cnt" :step="1" :min="0" :max="89" size="small" style="width: 100px;"/>
                    <!--<span>#default is 31</span>-->
                </n-flex>
                <n-divider/>
                <n-flex justify="space-around">
                    <n-button @click="read_erom(0x0000, 0x0c)">{{ $t('text.read') }}</n-button>
                    <n-button @click="factory_config_save(0xf)">{{ $t('text.save') }}</n-button>
                </n-flex>
            </n-card>
            
            <n-card :title="$t('text.product_info')">
                <template v-if="!is_admin">
                    <n-flex justify="space-between">
                    <span>{{ $t('text.chip_id') }}:</span>
                    <span>{{ chip_id }}</span>
                    </n-flex>
                    <div v-show="stock_info_inited">
                        <n-flex justify="space-between">
                            <span>{{ $t('text.mfgDate') }}:</span>
                            <span>{{ format(stock_info.mfgDate,'yyyy-MM-dd') }}</span>
                        </n-flex>
                        <n-flex justify="space-between">
                            <span>{{ $t('text.warrantyExp') }}:</span>
                            <span>{{ format(stock_info.warrantyExp,'yyyy-MM-dd') }}</span>
                        </n-flex>
                        <n-flex justify="space-between">
                            <span>{{ $t('text.hardware_model') }}:</span>
                            <span>{{ stock_info.model }}</span>
                        </n-flex>
                        <n-flex justify="space-between">
                            <span>{{ $t('text.hardware_version') }}:</span>
                            <span>{{ stock_info.hardwareVersion }}</span>
                        </n-flex>
                        <n-flex justify="center">
                            <span>{{ $t('text.order_info') }}</span>
                        </n-flex>
                        <n-flex justify="center">
                            <span>{{ stock_info.orderInfo }}</span>
                        </n-flex>
                    </div>
                    <div v-show="!stock_info_inited">
                        <n-flex justify="center">
                            <span>{{ $t('hint.stock_info_notfound') }}</span>
                        </n-flex> 
                    </div>
                </template>
                <template v-if="is_admin">
                    <n-flex justify="space-between">
                            {{ $t('text.chip_id') }}:<n-input v-model:value="cid" type="text" :placeholder="isEmpty(chip_id)?$t('text.chip_id'):chip_id" style="width:250px;"></n-input>
                    </n-flex>
                    <n-flex justify="space-between">
                        {{ $t('text.mfgDate') }}:<n-date-picker v-model:value="stock_info.mfgDate" type="date" style="width:250px;"/>
                    </n-flex>
                    <n-flex justify="space-between">
                        {{ $t('text.warrantyExp') }}:
                        <n-flex>
                            <n-date-picker v-model:value="stock_info.warrantyExp" type="date" style="width:168px;"/>
                            <n-input-number v-model:value="warrantyLengthInMonth" style="width:70px"></n-input-number>
                        </n-flex>
                    </n-flex>
                    <n-flex justify="center">
                        {{ $t('text.order_info') }}:
                    </n-flex>
                    <n-input v-model:value="stock_info.orderInfo" type="textaera" placeholder="order info."></n-input>
                    <n-flex justify="center">
                        {{ $t('text.order_note') }}:
                    </n-flex>
                    <n-input v-model:value="stock_info.orderNote" type="textaera" placeholder="order note."></n-input>
                    <n-flex justify="space-around">
                        <n-button :loading="loading" @click="read_stock_devinfo_cloud()"> {{ $t('text.read') }} </n-button>
                        <n-button :loading="loading" @click="save_stock_devinfo_cloud()"> {{ $t('text.save') }} </n-button>
                        <n-button :loading="loading" @click="remove_stock_devinfo_cloud()"> {{ $t('text.remove') }} </n-button>
                    </n-flex>
                </template>
            </n-card>
            <n-card :title="$t('text.imp_exp')">
                <n-flex vertical>
                    <n-input v-model:value="info_seri" type="textarea" :autosize="{
                        minRows: 1,
                        maxRows: 100,
                    }"></n-input>
                    <n-flex justify="space-around">
                        <n-button @click="() => { fac_conf_unserilize(JSON.parse(info_seri));console.log(factory_config); }">{{ $t('text.imp') }}</n-button>
                        <n-button @click="() => { info_seri = JSON.stringify(factory_config); }">{{ $t('text.exp') }}</n-button>
                    </n-flex>
                    <n-flex justify="space-around">
                        <n-button :loading.value="loading" @click="read_devinfo_cloud()">{{ $t('text.read') }} {{ $t('text.cloud') }}</n-button>
                        <n-button :loading.value="loading" @click="save_devinfo_cloud()">{{ $t('text.save') }} {{ $t('text.cloud') }}</n-button>
                        <n-button :loading.value="loading" @click="recover_stock_devinfo()">{{ $t('text.read') }} {{ $t('text.stock_info') }}</n-button>
                    </n-flex>
                </n-flex>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeMount, onMounted, ref, watch, type Ref } from 'vue';
import { chip_id, conf, dev_con_flg, fac_conf_unserilize, factory_config, factory_config_save,read_erom } from '../webusb'
import { useI18n } from 'vue-i18n';
import FuncSwitch from './FuncSwitch.vue';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { addMonths, differenceInMonths, format } from 'date-fns';
const { t } = useI18n();
let is_admin=inject('$IS_ADMIN');
const loading=ref(false);
const info_seri=ref("");
const cid=ref("");
interface stock{
    chipId?:string;
    hardwareVersion?:string;
    model?:string;
    mfgDate:number;
    warrantyExp:number;
    orderId?:number;
    orderInfo?:string;
    orderNote?:string;
    info?:string;
};
const stock_info_inited=ref(false);
const stock_info:Ref<stock>=ref({mfgDate:Date.now(),warrantyExp:addMonths(Date.now(),6).getTime()});
const warrantyLengthInMonth=computed({
        get():number{
            return differenceInMonths(stock_info.value.warrantyExp,stock_info.value.mfgDate);
        },
        set(v:number){
            stock_info.value.warrantyExp = addMonths(stock_info.value.mfgDate,v).getTime();
        }
});
const pcb_typ_list=[{
        label: 'SmashPro',
        value: 0
    },{
        label: 'SmashGC',
        value: 1
    }];
const pcb_rev_pro=[{
        label: 'Rev 2.00',
        value: 0
    },{
        label: 'Rev 2.13',
        value: 1,
    },{
        label: 'Rev 3.0x',
        value: 2,
    },{
        label: 'Rev 3.5x',
        value: 3
    },];
const pcb_rev_ngc=[{
    label: 'Rev 1.1.0',
    value: 0
}];
const pcb_rev_map = [pcb_rev_pro,pcb_rev_ngc];
const pcb_rev_list=computed(()=>{
    console.log("pcb_rev_list log");
    console.log(pcb_rev_map);
    console.log(factory_config.pcb_typ);
    console.log(pcb_rev_map[factory_config.pcb_typ]);
    return pcb_rev_map[factory_config.pcb_typ];
});
async function recover_stock_devinfo()
{
    if(!stock_info_inited.value){
        read_stock_devinfo_cloud();
    }
    fac_conf_unserilize(JSON.parse(stock_info.value.info));
}
async function read_devinfo_cloud(){
    loading.value=true;
    try{
        const res = await axios.get('/device/'+chip_id.value) as any;
        if(res.code!='SUCCESS'){
            alert(res.code+":"+res.data.message);
        }else{
            if(res.data.chipId!=chip_id.value){
                alert("chip id check failed.");
            }
            else{
                info_seri.value=res.data.info;
                fac_conf_unserilize(JSON.parse(res.data.info));
            }
        }
    }catch(e){}
    loading.value=false;
}
async function save_devinfo_cloud(){
    loading.value=true;
    info_seri.value = JSON.stringify(factory_config);
    try{
        const res = await axios.post('/device/',{chipId:chip_id.value,info:info_seri.value}) as any;
        if(res.code!='SUCCESS'){
            alert(res.code+":"+res.data.message);
        }else{
            alert(t('msg.save_success'));
        }
    }catch(e){}
    loading.value=false;
}
async function read_stock_devinfo_cloud(){
    loading.value=true;
    stock_info_inited.value=false;
    //console.log("read_stock_devinfo_cloud");
    try{
        const res = await axios.get('/stock/'+chip_id.value) as any;
        if(res.code!='SUCCESS'){
            //alert(res.code+":"+res.data.message);
            console.log(res.code+":"+res.data.message);
        }else{
            if(res.data.chipId!=chip_id.value){
                console.log("chip id check failed.");
            }
            else{
                stock_info.value=res.data;
                stock_info_inited.value=true;
                console.log(stock_info.value);
                //fac_conf_unserilize(JSON.parse(res.data.info));
            }
        }
    }catch(e){}
    loading.value=false;
}
async function save_stock_devinfo_cloud(){
    loading.value=true;
    info_seri.value = JSON.stringify(factory_config);
    stock_info.value.chipId=chip_id.value;
    console.log("pcb_rev_list.value ");
    console.log(pcb_rev_list.value);
    stock_info.value.hardwareVersion=pcb_rev_list.value[factory_config.pcb_rev].label;
    stock_info.value.model=pcb_typ_list[factory_config.pcb_typ].label;
    stock_info.value.info=info_seri.value;
    console.log(stock_info.value);
    try{
        const res = await axios.post('/stock/',stock_info.value) as any;
        if(res.code!='SUCCESS'){
            alert(res.code+":"+res.data.message);
        }else{
            alert("save stock device info success.");
        }
    }catch(e){}
    loading.value=false;
}
async function remove_stock_devinfo_cloud(){
    loading.value=true;
    let id=cid.value;
    if(isEmpty(id)){
        id=chip_id.value;
    }
    try{
        const res = await axios.post('/stock/remove/'+id,null) as any;
        if(res.code!='SUCCESS'){
            alert(res.code+":"+res.data.message);
        }else{
            alert(`stock device ${id} info removed.`);
        }
    }catch(e){}
    loading.value=false;
}
if(!isEmpty(chip_id.value))
    read_stock_devinfo_cloud();
watch(chip_id,(newVal)=>{if(!isEmpty(chip_id.value))read_stock_devinfo_cloud()});
watch(is_admin as any,(newVal)=>{if(!isEmpty(chip_id.value))read_stock_devinfo_cloud()});
watch(dev_con_flg,(newVal)=>{if(!isEmpty(chip_id.value))stock_info_inited.value=false;});
</script>
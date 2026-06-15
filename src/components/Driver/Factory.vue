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
                    <span>{{$t('text.pcb')}}{{ $t('word_sep') }}{{ $t('text.typ') }}:</span>
                    <n-select v-model:value="conf.hw.pcb_typ" :options="pcb_typ_list" style="width: 150px" />
                </n-flex>
                <n-flex justify="space-between">
                    <span>{{ $t('text.pcb') }}{{ $t('word_sep') }}{{ $t('text.rev') }}:</span>
                    <n-select v-model:value="conf.hw.pcb_rev" :options="pcb_rev_list" style="width: 240px" />
                </n-flex>
                <n-flex justify="space-between">
                    <span>{{ $t('text.indi_led_ofst') }}:</span>
                    <n-input-number v-model:value="conf.hw.indi_led_ofst" :step="1" :min="0" :max="85" size="small" style="width: 100px;"/>
                </n-flex>
                <n-flex justify="space-between">
                    <span>{{ $t('text.rgb') }}{{ $t('word_sep') }}{{ $t('text.cnt') }}:</span>
                    <n-input-number v-model:value="conf.hw.rgb_cnt" :step="1" :min="0" :max="89" size="small" style="width: 100px;"/>
                    <!--<span>#default is 31</span>-->
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
                    <n-button @click="read_stock_devinfo_cloud">{{ t('text.read') }}</n-button>
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
                        <n-button @click="read_stock_devinfo_cloud">{{ t('text.read') }}</n-button>
                        <n-button @click="save_stock_devinfo_cloud">{{ t('text.save') }}</n-button>
                        <n-button @click="remove_stock_devinfo_cloud">{{ t('text.remove') }}</n-button>
                    </n-flex>
                </template>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeMount, onMounted, ref, watch, type Ref } from 'vue';
import { chip_id, dev_con_flg,read_erom_sync } from '../Api/webusb'
import { useI18n } from 'vue-i18n';
import FuncSwitch from '../UI/FuncSwitch.vue';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { addMonths, differenceInMonths, format } from 'date-fns';
import { conf, GetConfigDTO } from '../Api/config.ts';
import type { ConfigDTO } from '../Api/struct.ts';
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
    return pcb_rev_map[conf.hw.pcb_typ];
});

async function read_stock_devinfo_cloud(){
    loading.value=true;
    stock_info_inited.value=false;
    //console.log("read_stock_devinfo_cloud");
    try{
        const res = await axios.get('/device/'+chip_id.value) as any;
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
    stock_info.value.chipId=chip_id.value;
    stock_info.value.hardwareVersion=pcb_rev_list.value[conf.hw.pcb_rev].label;
    stock_info.value.model=pcb_typ_list[conf.hw.pcb_typ].label;
    stock_info.value.info=info_seri.value;
    console.log(stock_info.value);
    try{
        const res = await axios.post('/device/',stock_info.value) as any;
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
        const res = await axios.post('/device/remove/'+id,null) as any;
        if(res.code!='SUCCESS'){
            alert(res.code+":"+res.data.message);
        }else{
            alert(`stock device ${id} info removed.`);
        }
    }catch(e){}
    loading.value=false;
}
</script>
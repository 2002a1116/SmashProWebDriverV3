<template>
    <n-flex justify="center">
        <n-flex vertical>
            <n-flex justify="center">
                <n-card :title="get_ver_text(ver)" style="width: 800px;">
                    <FormatCard v-model:value="configformats" :loading="formatsloading"></FormatCard>
                    <n-divider></n-divider>
                    <n-flex justify="space-between">
                        <n-flex>
                            Rev:
                            <n-select v-model:value="ver" :options="vers" 
                            style="width:200px"/>
                        </n-flex>
                        <n-button :loading="loading" @click="load()"> load </n-button>
                        <!--<n-button :loading="loading" @click="update_vers()"> update </n-button>-->
                        <n-button :loading="loading" @click="show_modal=true;"> add </n-button>
                    </n-flex>
                    <n-divider></n-divider>
                        <n-input v-model:value="str"></n-input>
                    <n-flex justify="space-around">
                        <n-button @click="imp()">import</n-button>
                        <n-button @click="exp()">export</n-button>
                    </n-flex>
                </n-card>
            </n-flex>
            <n-modal v-model:show="show_modal">
                <n-card style="max-width: 800px; width: 400px;">
                        <n-grid x-gap="0" :cols="40" collapsed-rows=1 item-responsive>
                            <n-gi span="6">
                                <span>Rev:</span>
                            </n-gi>
                            <n-gi span="10">
                                <n-input-number v-model:value="v1" clearable />
                            </n-gi>
                            <n-gi span="1">.</n-gi>
                            <n-gi span="10">
                                <n-input-number v-model:value="v2" clearable />
                            </n-gi>
                            <n-gi span="1">
                                <span>.</span>
                            </n-gi>
                            <n-gi span="10">
                                .X
                            </n-gi>
                            <n-gi span="2">.X</n-gi>
                        </n-grid>
                    <n-flex justify="space-around">
                        <n-button :loading="loading" @click="add();show_modal=false;"> add</n-button>
                        <n-button :loading="loading" @click="del();show_modal=false;"> del </n-button>
                    </n-flex>
                </n-card>
            </n-modal>
        </n-flex>
    </n-flex>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref, type VNode, type VNodeChild } from 'vue';
import { FormatDTO } from '../Api/struct';
import FormatCard from '../UI/FormatCard.vue';
import axios from 'axios';
import { GetConfigMapper, RemoveConfigMapper } from '../Api/wrapper';
import { Format } from 'bitmapper';
import { isNull, isUndefined, template, values } from 'lodash';
import { fw_version, get_fw_version_text } from '../Api/webusb.ts';
import type { SelectOption } from 'naive-ui';
import { format } from 'date-fns';
let vers = ref();
let ver = ref(0);
let show_modal = ref(false);
let v1=ref(0),v2=ref(0),v3=ref(0);
let configformats:Ref<Array<Format>> = ref(new Array<Format>());
let formatsloading = ref(false);
const loading=ref(false);
function get_ver_text(v:number){
    return 'Rev'+((v>>8)&0xff).toString(16)+'.'+((v)&0xff).toString(16)+'.'+0;
}
function get_ver(){
    return (v1.value<<8)+v2.value;
}
function renderLabel(option: SelectOption): VNodeChild{
    return get_ver_text(option.value as number);
}
async function update_vers(){
    const res = await axios.get('/format/vers') as any;
    if(res.code!='SUCCESS'){
        alert(res.code+":"+res.data.message);
    }else{
        let tmp = new Array<SelectOption>;
        res.data.forEach(e => {
            tmp.push({label:get_ver_text(e),value:e});
        });
        console.log(tmp);
        vers.value = tmp;
        if(res.data.length)
            ver.value = res.data[res.data.length-1];
        else{
            alert("error ver list empty");
        }
    }
}
async function load_format(id:number){
    formatsloading.value=true;
    //console.log(await GetConfigMapper(id));
    configformats.value = (await GetConfigMapper(id))?.format.formats;
    formatsloading.value=false;
}
async function load(){
    await load_format(ver.value);
}
watch(ver,async (new_val)=>{
    await load_format(new_val);
})
async function add(){
    let dto:FormatDTO = new FormatDTO();
    dto.firmwareVersion = get_ver();
    let f:Format = new Format();
    f.name="formats";
    f.type='o';
    f.formats=configformats.value;
    f.length=configformats.value.length;
    dto.format = JSON.stringify(f);
    console.log(dto);
    const res = await axios.post('/format/',dto) as any;
    if(res.code!='SUCCESS'){
        alert(res.code+":"+res.data.message);
    }
    RemoveConfigMapper(get_ver());
    update_vers();
}
async function del(){
    let id:number = get_ver();
    const res = await axios.post('/format/del/'+id.toString(10)) as any;
    if(res.code!='SUCCESS'){
        alert(res.code+":"+res.data.message);
    }else
        alert("remove success");
    RemoveConfigMapper(get_ver());
    update_vers();
}
let str = ref("");
function imp(){
    let tmp = JSON.parse(str.value) as Format;
    console.log(tmp.formats);
    configformats.value = tmp.formats;
}
function exp(){
    let f:Format = new Format();
    f.name="formats";
    f.type='o';
    f.formats=configformats.value
    str.value = JSON.stringify(f);
}
onMounted(update_vers);

let intr=null;
onMounted(()=>{
    intr = setInterval(()=>{
        let res = axios.get('/test/permissions');
        console.log(res);
    },1000);
})

onUnmounted(()=>{
    if(!isNull(intr)){
        clearInterval(intr);
        intr=null;
    }
})
</script>
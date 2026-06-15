import { reactive } from "vue";
import { ConfigMappers, GetConfigMapper, GetFormatVer } from "./wrapper";
import { chip_id, controller_color, fw_subversion, fw_ver_at_least, fw_version, get_fw_version_text, rgb, write_erom } from "./webusb";
import { ConfigDTO } from "./struct";
import axios from "axios";

const CONFIG_ADDR = 0xF000;

export let conf = reactive(new Object() as any);
export let fw_version_latest = null;

export async function conf_init(){
    let res = await axios.get('/format/latest') as any;
    if(res.code!='SUCCESS'){
        alert(res.code+":"+res.data);
    }else{
        fw_version_latest = res.data;
    }
    console.log("fw_version_latest:"+fw_version_latest.toString());
    let obj = (await GetConfigMapper(fw_version_latest)).NewObject();
    Object.assign(conf,obj);
    console.log("conf");
    console.log(conf);
    //generate rgb
}
export function GetConfigDTO():ConfigDTO{
    let data:ConfigDTO = new ConfigDTO();
    data.firmwareVersion = fw_version;
    data.firmwareVersionString = get_fw_version_text(fw_version,fw_subversion);
    data.config = JSON.stringify(conf);
    data.controllerColor = JSON.stringify(controller_color);
    console.log("DTO");
    console.log(data);
    return data;
}
export function ImplementConfigDTO(data:ConfigDTO){
    console.log(data);
    Object.assign(conf,JSON.parse(data.config));
    Object.assign(controller_color,JSON.parse(data.controllerColor));
}
export async function conf_upload_all(){
    let data = GetConfigDTO();
    const res = await axios.post('/config',{chipId:chip_id.value,...data}) as any;
    console.log({chipId:chip_id.value,...data});
    if(res.code!='SUCCESS'){
        alert(res.code+":"+res.data.message);
    }else{
        alert("cloud save success");
    }
}
export async function conf_download_all(){
    let data:ConfigDTO;
    const res = await axios.get("/config/"+chip_id.value) as any;
    if(res.code!='SUCCESS'){
       alert(res.code+":"+res.data.message);
    }else{
        ImplementConfigDTO(res.data);
    }
}

export async function conf_save(save:number){
    let buf = (await GetConfigMapper(GetFormatVer(fw_version))).ObjectToArray(conf);
    write_erom(CONFIG_ADDR,buf.length,save,buf);
}

export async function SaveStockConfig(){
    let dto = GetConfigDTO();
    const res = await axios.post('/config/stock',{chipId:chip_id.value,config:JSON.stringify(dto)}) as any;
    if(res.code!='SUCCESS'){
       alert(res.code+":"+res.data.message);
    }else{
        alert("stock save success");
    }
}
export async function ReadStockConfig(){
    const res = await axios.get("/config/stock/"+chip_id.value) as any;
    if(res.code!='SUCCESS'){
       alert(res.code+":"+res.data.message);
    }else{
        ImplementConfigDTO(JSON.parse(res.data.config));
    }
}

/*
by providing a bytestream formed like [id:16],we can have a somewhat introspective struct id=>Format
and by having an Format mapping table only adding new format.device can technically be introspectable.

cant be bother to do that.
*/
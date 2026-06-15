import { BitMapper } from "bitmapper";
import type { FormatDTO } from "./struct";
import axios from "axios";
import { isNull, isUndefined } from "lodash";
import { ref } from "vue";
export const text = ref(Map<string,string>);
text['o']='Object';
text['i']='int';
text['u']='uint';
text['p']='padding';
text['a']='array';
export const type_list=[{
    label:'Object',
    value:'o'
},{
    label:'Int',
    value:'i'
},{
    label:'Uint',
    value:'u'
},{
    label:'Padding',
    value:'p'
},{
    label:'Array',
    value:'a'
}];
export function get_text(s:string):string{
    if(isNull(s)||isUndefined(s))
        return "null";
    return text[s];
}

export let ConfigMappers = new Map<number,BitMapper>();
export function GetFormatVer(ver:number){
    return ver>>8;
}
export async function DownloadMappers(id:number){
    let res = await axios.get('/format/'+id.toString()) as any;
    if(res.code!='SUCCESS'){
        alert(res.code+":"+res.data.message);
    }else{
        res = res.data as FormatDTO;
        ConfigMappers.set(res.firmwareVersion,new BitMapper(JSON.parse(res.format)));
    }
    console.log("download "+id.toString()+" end");
}
export async function GetConfigMapper(ver:number):Promise<BitMapper>{
    if(ConfigMappers.has(ver)){
        return ConfigMappers.get(ver);
    }
    console.log("GetConfigMapper "+ver.toString());
    try{
        await DownloadMappers(ver);
    }catch(e){
        alert("init format info fail,pls retry");
        return null;
    }
    console.log(ConfigMappers);
    return ConfigMappers.get(ver);
}
export function RemoveConfigMapper(ver:number){
    ConfigMappers.delete(ver);
}
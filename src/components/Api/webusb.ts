// @ts-nocheck

import axios from "axios";
import { c } from "naive-ui";
import { factory } from "typescript";
import { reactive, ref, toRaw } from "vue";
import { GetConfigMapper, GetFormatVer } from "./wrapper";
import Factory from "../Driver/Factory.vue";
import { conf,conf_init } from "./config";
import { BitMapper } from "bitmapper";
import { Coord } from "./struct.ts";
import { BitStream } from "bitstream";
import _, { add } from 'lodash'
import { PromiseManager } from "./async.ts";

export class rgb{
    r:number=0;
    g:number=0;
    b:number=0;
    hex():string{
        return rgb_to_hex(this);
    }
    set(s:string){
        if(s.length<7)return;
        r=parseInt(s.slice(1,3),16);
        g=parseInt(s.slice(3,5),16);
        b=parseInt(s.slice(5,7),16);
    }
}
function push_to_bitstream(c:rgb,b:BitStream){
    b.writeByte(c.r);
    b.writeByte(c.g);
    b.writeByte(c.b);
}
export function u8a_to_rgb(buf:Uint8Array){
    let res:rgb={r:0,g:0,b:0};
    if(buf.length>=3)
    {
        res.r=buf[0];
        res.g=buf[1];
        res.b=buf[2];
    }
    return res;
}
export function rgb_to_hex(r:rgb){  
    if(r === undefined)
        return '#ffffff';
    else
        return '#'+r.r.toString(16).padStart(2, '0') + r.g.toString(16).padStart(2, '0') + r.b.toString(16).padStart(2, '0');
}
export function rgb_to_u8a(r:rgb){
    let res=new Uint8Array(3);
    res[0]=r.r;
    res[1]=r.g;
    res[2]=r.b;
    return res;
}
export function hex_to_rgb(s:string):rgb{
    let r:rgb={r:0,g:0,b:0};
    if(s.length<7)return r;
    r.r=parseInt(s.slice(1,3),16);
    r.g=parseInt(s.slice(3,5),16);
    r.b=parseInt(s.slice(5,7),16);
    //console.log(r);
    return r;
}
export function fetch_u16(arr: any[] | Uint8Array<ArrayBuffer>) {
    return arr[0] + (arr[1] << 8);
}
export function fetch_u32(arr: any[] | Uint8Array<ArrayBuffer>) {
    return arr[0] + (arr[1] << 8) + (arr[2] << 16) + (arr[3] << 24);
}
export function put_u16(v) {
    return new Uint8Array([v & 0xff, 0xff & (v >> 8)]);
}
let ConfigMapper:BitMapper;
export function unpack_conf(array:Uint8Array){
    //conf.value = ConfigWrapper.Unwrap(array);
    Object.assign(conf,ConfigMapper.Unwrap(array));
    //console.log("unwrap ");
    console.log(ConfigMapper.Unwrap(array));
}
export let controller_color=reactive(new Array<rgb>(4));
export let connection_status:number;
export let device: any; // 需要连接或已连接的设备
export let msg:String | null;
export let fw_version=0;
export let array = new Array();
export let red_cnt = 0;
export let snd_cnt = 0;
export let ofst = 0;
export const JS_FACTOR = 32.0;
export const AMP_FACTOR = 128.0;
export const PAYLOAD_LENGTH = 61;
export const GYRO_FACTOR =127.0;
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function gen_bt_addr() {
    let tmp = new Uint8Array(6);
    for (let i = 0; i < 6; ++i) {
        //tmp += getRandomInt(0, 255).toString(16).padStart(2, '0') + ":";
        tmp[i]=(getRandomInt(0, 255));
    }
    conf.basic.bd_addr = [...tmp];
}
export let button_sts=ref(0);
export let js_data=ref(Array<Coord>(2));
export function std_input_handler(buf:Uint8Array) {
    button_sts.value=buf[2]+(buf[3]<<8)+(buf[4]<<16);
    js_data.value = JsMapper.Unwrap(buf.slice(5,11));
    //console.log("mapping");
    if(button_sts.value)
        console.log(js_data.value);
}
export async function controller_reboot(){
    await fw_snd(0xFE, null);
}
let conf_buf=Array<number>(1024);
const erom_max_payload=56;
let ReadManager = new PromiseManager<string>();
let WriteManager = new PromiseManager<string>();
function erom_factory_handler(addr:number,size:number,buf:Uint8Array){
    switch(addr&0xff){
        case 0x46://todo
        case 0x3d://todo
            break;
        case 0x50:
            controller_color[0]=u8a_to_rgb(buf.slice(5, 8));
            controller_color[1]=u8a_to_rgb(buf.slice(8, 11));
            controller_color[2]=u8a_to_rgb(buf.slice(11, 14));
            controller_color[3]=u8a_to_rgb(buf.slice(14, 17));
            break;
        default:
            break;
    }
}
function erom_config_handler(addr:number,size:number,buf:Uint8Array){
    //console.log("recv addr:"+addr.toString(16)+" size:"+size.toString());
    let pos = addr & 0xfff;
    //console.log("pos :"+pos.toString());
    //console.log(...buf.slice(5,size+5));
    conf_buf=[...conf_buf.slice(0,pos),...buf.slice(5,size+5),...conf_buf.slice(pos+size)];
    //console.log(conf_buf);
    ReadManager.complete(addr,"read erom complete");
    /*if((addr&0xfff)+size>=ConfigMapper.Size()){
        unpack_conf(conf_buf);
        console.log("unpacked");
        console.log(ConfigMapper.format);
        console.log(conf);
        dev_con_flg.value=true;
    }*/
}
const read_erom_handler_cb=new Map<number,Function>();
function reg_read_erom_cb(addr:number,f:Function){
    read_erom_handler_cb.set(addr,f);
}   
function read_erom_handler(buf:Uint8Array) {
    let addr = buf[0] + (buf[1] << 8) + (buf[2] << 16) + (buf[3] << 24);
    let size = buf[4];
    //console.log("recv erom data addr: "+addr.toString(16)+" size:"+size.toString(10));
    if(size<0)size=0;
    let id:number=0;
    //console.log("erom read addr:"+addr.toString());
    //console.log(buf);
    if(read_erom_handler_cb.has(addr&0xffff)){
        read_erom_handler_cb.get(addr&0xffff)(addr,size,buf);
    }else if(read_erom_handler_cb.has(addr&0xfff0)){
        read_erom_handler_cb.get(addr&0xfff0)(addr,size,buf);
    }else if(read_erom_handler_cb.has(addr&0xff00)){
        read_erom_handler_cb.get(addr&0xff00)(addr,size,buf);
    }else if(read_erom_handler_cb.has(addr&0xf000)){
        read_erom_handler_cb.get(addr&0xf000)(addr,size,buf);
    }
    //read_erom_handler_cb[addr&0xf000](addr,buf);
}
export async function read_erom_sync(addr:number,size:number){
    while(size){
        let len = Math.min(size,erom_max_payload);
        let s = new BitStream();
        //s.writeUint32(addr);
        //s.writeByte(len);
        s.writeUint(addr,32);
        s.writeByte(len);
        size-=len;
        //console.log("read "+addr.toString(16)+" len:"+len.toString(10));
        let _addr = addr;
        ReadManager.add(addr,(resolve,reject)=>{
            let t = setTimeout(() => {
                reject(new Error("Error read erom timeout. addr:"+_addr.toString(16))); // 超时后拒绝Promise
            }, 1000);
            return ()=>clearTimeout(t);
        });
        addr+=len;
        let buf = s.toByteArray();
        //console.log(buf);
        //console.log("addr:"+addr.toString()+" size:"+size.toString());
        fw_snd(0x03,buf);
        //console.log("new size: "+size.toString());
    }
    try{
        await ReadManager.waitAll();
        ReadManager.cleanAll();
    }catch(error){
        alert(error.toString());
    }
}
export const read_erom = async (addr:number, size:number) => {
    //console.log("read erom addr:"+addr.toString(16));
    let buf = new Uint8Array(5);
    while(size>0xff){
        buf[4]=0xff;
        let a=addr;
        for (let i = 0; i < 4; ++i) {
            buf[i] = a & 0xff;
            a >>= 8;
        }//addr
        size-=0xff;
        addr+=0xff;
        fw_snd(0x03, buf);
    }
    if(size==0)return;
    buf[4] = size;//size
    for (let i = 0; i < 4; ++i) {
        buf[i] = addr & 0xff;
        addr >>= 8;
    }//addr
    fw_snd(0x03, buf);
}
const _write_erom = async (addr:number, size:number, save:number, data:Uint8Array|any[]) => {
    if(size>56)
        console.log("error erom payload too long");
    if(!size)return;
    let buf = new Uint8Array(6);
    buf[4] = size;
    buf[5] = save;
    for (let i = 0; i < 4; ++i) {
        buf[i] = addr & 0xff;
        addr >>= 8;
    }//addr
    buf =new Uint8Array([...buf, ...data]);
    //console.log("write");
    //console.log(buf);
    await fw_snd(0x04, buf);
}
export const write_erom = (addr:number, size:number, save:number, data:Uint8Array|any[]) => {
    while(size>56){
        _write_erom(addr,56,save,data.slice(0,56));
        addr+=56;
        size-=56;
        data=data.slice(56);
    }
    if(size)
        _write_erom(addr,size,save,data);
}
export async function write_erom_sync(addr:number, size:number, save:number, data:Uint8Array){
    while(size){
        let len = Math.min(size,erom_max_payload);
        //set_erom_promise(addr,"EROM:write timeout.",3000);
        //console.log("write addr:"+addr.toString(16));
        WriteManager.add(addr,(resolve,reject)=>{
            let t = setTimeout(() => {
                reject(new Error("Error write erom timeout")); // 超时后拒绝Promise
            }, 1000);
            return ()=>clearTimeout(t);
        });
        _write_erom(addr,len,save,data.slice(0,len));
        addr+=len;
        size-=len;
        data=data.slice(len);   
    }
    try{
        await WriteManager.waitAll();
        WriteManager.cleanAll();
        //console.log("send success");
        if(save)
            alert("save success");
    }catch(error){
        alert("send config data fail,error:"+error.toString());
    }
}
export function controller_color_save(save:number){
    let s = new BitStream();
    //console.log(controller_color);
    for(let i=0;i<4;++i)
        push_to_bitstream(controller_color[i],s);
    //write_erom_sync(0x6050,12,save,s.toByteArray());
    write_erom(0x6050,12,save,s.toByteArray());
}
export function hid_snd(id: number, buf: Uint8Array) {
    if (!(buf instanceof Array ||  buf instanceof Uint8Array)) {
        console.log("error snd buf isnt array id:" + id.toString());
        console.log(buf);
        return;
    }
    if (buf.length > 63) {
        buf = buf.slice(0, 63);
    } else if (buf.length < 63) {
        buf = new Uint8Array([...buf, ...(new Uint8Array(63 - buf.length).fill(0))]);
    }
    device.sendReport(id, buf);
}
export function fw_snd(id: number, buf: Uint8Array<ArrayBuffer> | null) {
    if (buf === null)
        buf = new Uint8Array(1).fill(0);
    if (!(buf instanceof Array || buf instanceof ArrayBuffer || buf instanceof Uint8Array)) {
        console.log("error fw buf isnt array id:" + id.toString());
        console.log(buf);
        return;
    }
    hid_snd(0xfe, new Uint8Array([id, ...buf]));
}
export const send_conf = async (save: number) => {
    try {
        if (!device?.opened) {
            throw "Device not opened";
        }
        //let array=GetConfigMapper(GetFormatVer(fw_version)).ObjectToArray(conf);
        //console.log(toRaw(conf));
        let array = ConfigMapper.ObjectToArray(toRaw(conf))
        write_erom_sync(0xF000,array.length,save,array);
        //write_erom(0xF000,array.length,save,array);
        fw_snd(0x02,null);//flush setting
    } catch (error) {
        msg = `${error}\n\n`;
        alert(msg);
        console.log(msg);
    }
};
export const read_conf = async () => {
    console.log("fw_version "+fw_version.toString());
    ConfigMapper = await GetConfigMapper(GetFormatVer(fw_version));
    //console.log(JSON.stringify(ConfigMapper));
    try {
        if (!device?.opened) {
            throw "Device not opened";
        }
        //fw_snd(0x01, null);//no payload
        //read_erom(0xF000,0xff);
        //read_erom(0xf000,ConfigMapper.Size());
        await read_erom_sync(0xf000,ConfigMapper.Size());
        console.log(ConfigMapper);
        fw_snd(0xFD, null);//READ STATUS
        //console.log(conf_buf);
        unpack_conf(conf_buf);
        dev_con_flg.value=true;
    } catch (error) {
        msg = `read_conf error:${error}\n\n`;
        alert(msg);
    }
};
(navigator as any).hid.ondisconnect = (event) => {
    if (device != null && device.vendorId == event.device.vendorId && device.productId == event.device.productId) {
        dev_con_flg.value = false;
        connection_status = 0;
        device = null;
        chip_id.value="";
        fw_Version = 0;
        //fac_conf_inited.value=false;
        //conf_inited.value=false;
        conf_init();
        alert("device unpluged!");
    }
};
export const get_fw_version = async () => {
    try {
        if (!device?.opened) {
            throw "Device not opened";
        }
        fw_snd(0xff, null);
        // 发送数据，第一个参数为reportId，填0表示不使用reportId
    } catch (error) {
        msg = `${error}\n\n`;
        alert(msg);
        console.log(msg);
    }
};
export function get_fw_version_text(v:number,v2:number){
    return "V"+((v>>16)&0xff).toString() + "." + ((v>>8)&0xff).toString()+"."+(v&0xff).toString()+"."+v2.toString();
}
export class status_pack{
    imu_ret:number;
    imu_id:number;
    looptick:number;
    loopcnt:number;
};
export let device_status:status_pack = ref(status_pack);
export let raw_js_data = ref(Array<Coord>);
export let adc_data = ref(Uint16Array);
export const fw_ver_at_least=0x00020000;
export let fw_version_text=ref("V0.0.0.0");
export let fw_subversion;
export const dev_con_flg=ref(false);
export let chip_id=ref("");
export const JsMapper = new BitMapper({type:'a',length:2,
    formats:[{type:'o',formats:[{name:'x',type:'u',length:12},{name:'y',type:'u',length:12}]}]});
export const RawJsMapper = new BitMapper({type:'a',length:2,
    formats:[{type:'o',formats:[{name:'x',type:'i',length:12},{name:'y',type:'i',length:12}]}]});
export const AdcMapper = new BitMapper({type:'a',length:4,formats:[{type:'u',length:16}]});
export async function open_device() {
    reg_read_erom_cb(0x6000,erom_factory_handler);
    reg_read_erom_cb(0xf000,erom_config_handler);
    try {
        // requestDevice方法将显示一个包含已连接设备列表的对话框，用户选择可以并授予其中一个设备访问权限
        const devices = await (navigator as any).hid.requestDevice({ filters: [{vendorId:0x057e,productId:0x2009}] });

        if (devices.length == 0) {
            alert("No device selected.");
            return;
        }

        device = devices[0]; // 选择列表中第一个设备
        let outputDataLength:number=0;
        let inputDataLength:number=0;
        if (!device.opened) {
            // 检查设备是否打开
            await device.open(); // 打开设备    

            // 下面几行代码和我的自定义的透传的HID设备有关
            // 我的设备中有一个collection，包含一个input、一个output
            // inputReports和outputReports数据是Array，reportSize是8
            // reportCount表示一包数据的字节数，USB-FS 和 USB-HS 设置的reportCount最大值不同
            if (device.collections[0].inputReports[0].items[0].isArray && device.collections[0].inputReports[0].items[0].reportSize === 8) {

                inputDataLength = device.collections[0].inputReports[0].items[0].reportCount ?? 0;
            }
            if (device.collections[0].outputReports[0].items[0].isArray && device.collections[0].outputReports[0].items[0].reportSize === 8) {
                // 发送数据包长度必须和报告描述符中描述的一致
                outputDataLength = device.collections[0].outputReports[0].items[0].reportCount ?? 0;
            }
            msg = `connected to: \n${device.productName}\nPID-${device.productId} VID-${device.vendorId}`;
            //alert(msg);
            connection_status = 1;
            get_fw_version();
        }
        // await device.close(); // 关闭设备
        // await device.forget() // 遗忘设备
        function fw_packet_dispatch(id: number, buffer: Uint8Array<ArrayBuffer>) {
            //console.log("fw dispatch: 0x" + id.toString(16).padStart(2, '0'));.
            let s = new BitStream();
            switch (id) {
                case 0xFF://fw version
                    fw_version = fetch_u32(buffer);
                    fw_subversion = fetch_u32(buffer.slice(4));
                    fw_version_text.value = get_fw_version_text(fw_version,fw_subversion);
                    console.log("fw version "+fw_version_text.value);
                    if (fw_version < fw_ver_at_least) {
                        alert("error: firmware "+fw_version_text.value+" is out-dated.");
                        console.log("firmware request "+get_fw_version_text(fw_subversion,0)+" or newer.");
                        device.close();
                        device = null;
                        connection_status = 0;
                        break;
                        //connection_status_text.innerHTML = "disconnected.";
                    }
                    chip_id.value="";
                    buffer.slice(8,20).forEach(element => {
                        chip_id.value+=element.toString(16);
                    });
                    console.log("cid: ",chip_id.value);
                    //dev_con_flg.value=true;
                    //document.querySelector("#fw_version").innerHTML = buffer[0].toString() + '.' + buffer[1].toString();
                    //inital read
                    //init_wrapper();
                    
                    read_erom(0x0000, 0x0c);
                    //read_erom(0x9000, 0xff);
                    read_conf();
                    read_erom(0x603d, 0x09);
                    read_erom(0x6046, 0x09);
                    //read_erom(0x8001, 0x08);
                    read_erom(0x6050, 0x0C);
                    //alert("Please makesure hardware info match your controller hardware.");
                    break;
                case 0x01:
                    break;
                case 0x02:
                case 0x05:
                    if (0 == buffer[0]) {
                        alert("calibrate success.");
                    } else {
                        alert("calibrate fail,error:" + buffer[1].toString());
                    }
                    break;
                case 0x03:
                    read_erom_handler(buffer);
                    break;
                case 0x04:
                    s.writeByteArray(buffer);
                    let addr = s.readUint(32);
                    let size = s.readByte();
                    let save = s.readByte();
                    let res = s.readByte();
                    WriteManager.complete(addr,"write success");
                    break;
                case 0x06:
                    //console.log(buffer);
                    raw_js_data.value = RawJsMapper.Unwrap(buffer);
                    adc_data.value = AdcMapper.Unwrap(buffer.slice(6));
                    break;
                case 0x07:
                    if (0 == buffer[0]) {
                        read_erom(0x8001, 8);
                        alert("reset success");
                        //reset success.
                    }
                    else {
                        alert("reset fail error:"+buffer[0].toString());
                    }
                    break;
                case 0xFD:
                    s.writeByteArray(buffer);
                    device_status.imu_ret = s.readByte();
                    device_status.imu_id = s.readByte();
                    device_status.looptick = s.readUint(32);
                    device_status.loopcnt = s.readUint(32);
                    break;
                default:
                    break;
            }
        }
        // 电脑接收到来自设备的消息回调
        device.oninputreport = (event) => {
            //console.log(event); // event中包含device、reportId、data等内容
            let buffer = new Uint8Array(event.data.buffer); // event.data.buffer就是接收到的inputreport包数据了
            switch (event.reportId) {
                case 0xFE://
                    //console.log("fw recv");
                    fw_packet_dispatch(buffer[0], buffer.slice(1));
                    break;
                case 0x30://std input report
                    std_input_handler(buffer);
                    //todo:
                    break;
                default:
                    break;
            }
        };

    } catch (error) {
        msg = `${error}\n\n`;
        alert(msg);
        console.log(msg);
    }
};
export function disconnect() {
    if (connection_status === 0) return;
    connection_status = 0;
    device.close();
    alert("device closed.")
}
// 发送数据相关操作
export function save_conf() {
    send_conf(1);
};
export function calibrate_sensor() {
    //alert("send cali");
    fw_snd(0x05, null);
}

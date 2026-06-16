// @ts-nocheck

import axios from "axios";
import { c } from "naive-ui";
import { factory } from "typescript";
import { reactive, ref } from "vue";

export class rgb{
    r:number=0;
    g:number=0;
    b:number=0;
}
export  function u8a_to_rgb(buf:Uint8Array){
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
export let conf;
export let factory_config;
export class factory_config_pack{
    config_bitmap0=0;
    pcb_rev=0;
    pcb_typ=0;
    indi_led_ofst=0;
    rgb_cnt=0;
};
export function fac_conf_unserilize(p:any){
    //factory_config=p as factory_config_pack;
    Object.assign(factory_config,p as factory_config_pack);
}
export const fac_conf_inited=ref(false);
function unpack_factory_config(buf:Uint8Array){
    factory_config.config_bitmap0=buf[0];
    factory_config.pcb_typ=buf[1];
    factory_config.pcb_rev=buf[2];
    factory_config.indi_led_ofst=buf[3];
    factory_config.rgb_cnt=buf[4];
    fac_conf_inited.value=true;
}
export class conf_pack{
    config_bitmap0=0;
    config_bitmap1=0;
    in_interval=(8);
    out_interval=(8);
    button_disable_mask=(0);
    hd_rumble_amp_ratio=[0,0,0,0];
    joystick_ratio=([0,0,0,0]);//len:4
    imu_sample_gap=(1750);//u16
    joystick_snapback_deadzone=([1400,1400]);//len:2
    joystick_snapback_filter_max_delay=(10000);//u16
    bd_addr=[0,0,0,0,0,0];//len:6
    imu_ratio_x=(127);//div 127
    imu_ratio_y=(127);//div 127
    imu_ratio_z=(127);//div 127
    pro_fw_version=(2);
    ns_pkt_timer_mode=(0);//0:stock(timestamp_div_5) 1:timestamp 2:pkt cnt
    dead_zone=([0,0,0,0]);//len:4
    dead_zone_mode=0;
    rgb_slow_start_period=0;
    rgb_data:rgb[]=([]);//len>=29
};
export const conf_inited=ref(false);
export function unpack_conf(array: number[],inited=true) {
    conf.config_bitmap0 = array[0];
    conf.config_bitmap1 = array[1];
    conf.in_interval = array[2];
    conf.out_interval = array[3];
    conf.button_disable_mask=fetch_u16(array.slice(5,7))<<8+array[4];
    conf.hd_rumble_amp_ratio = (array.slice(7, 11));
    conf.joystick_ratio = [...(new Int8Array(array.slice(11, 15)))];
    conf.imu_sample_gap = fetch_u16(array.slice(15, 17));
    conf.joystick_snapback_deadzone[0] = fetch_u16(array.slice(17,19));
    conf.joystick_snapback_deadzone[1] = fetch_u16(array.slice(19,21));
    conf.joystick_snapback_filter_max_delay = fetch_u16(array.slice(21, 23));
    conf.bd_addr = (array.slice(23, 29));
    conf.imu_ratio_x = array[29];
    conf.imu_ratio_y = array[30];
    conf.imu_ratio_z = array[31];
    conf.pro_fw_version = array[32];
    conf.ns_pkt_timer_mode = array[33];
    conf.dead_zone = (array.slice(34, 38));
    conf.dead_zone_mode = array[38];
    conf.rgb_slow_start_period = array[39];

    if(conf.out_interval<=2)conf.out_interval=8;
    if(inited)
        conf_inited.value=true;
}
//export let conf=reactive(new conf_pack());
export function conf_init(){
    conf=reactive(new conf_pack());
    factory_config=reactive(new factory_config_pack());
    unpack_conf(new Array(256).fill(0),false);
}
export function conf_unserilize(p:any){
    //conf = p as conf_pack;
    Object.assign(conf,p as conf_pack);
}
export class coord{
    x:number=0;
    y:number=0;
}
export function coord_max(a:coord,b:coord){
    let c:coord = {
        x:(a.x>b.x?a.x:b.x),
        y:(a.y>b.y?a.y:b.y)
    }
    return c;
}
export function coord_min(a:coord,b:coord){
    let c:coord = {
        x:(a.x<b.x?a.x:b.x),
        y:(a.y<b.y?a.y:b.y)
    }
    return c;
}
export class js_data{
    pos:coord=new coord;
    internal_center:coord=new coord;
    center:coord=new coord;
    max:coord=new coord;
    min:coord=new coord;
}
export let controller_color=reactive(new Array<rgb>(4));
export let js:js_data[]=[new js_data,new js_data]
export let connection_status:number;
export let device: any; // 需要连接或已连接的设备
export let msg:String | null;
export let fw_version=0;
export let array = new Array();
export let red_cnt = 0;
export let snd_cnt = 0;
export let ofst = 0;
export let js_cali_fsm = new Array<number>(2);
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
    conf.bd_addr = [...tmp];
}
export function get_radio_value(radios: string | any[]) {
    for (let i = 0; i < radios.length; ++i) {
        if (radios[i].checked === true) {
            return parseInt(radios[i].value, 10);
        }
    }
    return 0;
}
export function set_radio_value(radios: string | any[], v: number) {
    for (let i = 0; i < radios.length; ++i) {
        radios[i].checked = false;
    }
    for (let i = 0; i < radios.length; ++i) {
        if (radios[i].value == v) {
            radios[i].checked = true;
        }
    }
}
export async function js_start_calibrate(id:number) {
    if(id>1)return;
    js[id].center=js[id].pos;
    js[id].min=js[id].max=js[id].pos;
    //flush_js_cali_figure();
    js_cali_fsm[id] = 1;
    //we skip center cali cmd as its no longer used.
    //cali fsm 1 now set center pos on web.
    let buf = new Uint8Array([id]);
    await fw_snd(0x06, buf);
}
export let button_sts=ref(0);
export function std_input_handler(buf:Uint8Array) {
    //hori(lower 12 bit)
    //vert(higher 12 bit)
    //ljs:567 rjs:89a
    for(let id=0;id<2;++id)
    {
        let base = id * 3 + 5;
        js[id].pos.x = buf[base] + ((buf[base + 1] & 0xf) << 8);
        js[id].pos.y = (buf[base + 1] >> 4) + (buf[base + 2] << 4);
        if (js_cali_fsm[id] == 1) {
            js[id].center=js[id].pos;
            js_cali_fsm[id] = 2;
        }
        if (js_cali_fsm[id] == 2) {
            js[id].max=coord_max(js[id].max,js[id].pos);
            js[id].min=coord_min(js[id].min,js[id].pos);
        }
    }
    button_sts.value=buf[2]+(buf[3]<<8)+(buf[4]<<16);
    //flush_js_cali_figure();
}
/*btnJoystickSetCenter.onclick = async() => {
  await fw_snd(0x06,null);
}*/
export function import_config(conf_seri:string) {
    conf = JSON.parse(conf_seri);
    //flush_setting();
}
export function export_config() {
    return JSON.stringify(conf);
}
export async function controller_reboot(){
    await fw_snd(0xFE, null);
}
export async function js_save_calibration(id:number){
    if(id>2)return;
    if(js_cali_fsm[id]!=2)return;
    let xpr = js[id].max.x - js[id].center.x;
    let xnr = js[id].center.x - js[id].min.x;
    let ypr = js[id].max.y - js[id].center.y;
    let ynr = js[id].center.y - js[id].min.y;
    let buf = new Uint8Array(9);
    buf[0] = xpr & 0xff;
    buf[1] = ((xpr >> 8) & 0xf) + ((ypr & 0xf) << 4);
    buf[2] = (ypr >> 4) & 0xff;

    buf[3] = js[id].center.x & 0xff;
    buf[4] = ((js[id].center.x >> 8) & 0xf) + ((js[id].center.y & 0xf) << 4);
    buf[5] = (js[id].center.y >> 4) & 0xff;

    buf[6] = xnr & 0xff;
    buf[7] = ((xnr >> 8) & 0xf) + ((ynr & 0xf) << 4);
    buf[8] = (ynr >> 4) & 0xff;
    if(id==1){
        buf=new Uint8Array([...buf.slice(3,6),...buf.slice(6,9),...buf.slice(0,3)]);//we reset data order.
    }
    write_erom(0x603d + id * 0x09, 9, 1, buf);
    js_cali_fsm[id] = 0;
}
let conf_buf=Array(256);
let rgb_buf=Array(256);
export function read_erom_handler(buf:Uint8Array) {
    let addr = buf[0] + (buf[1] << 8) + (buf[2] << 16) + (buf[3] << 24);
    let size = buf[4];
    //console.log("recv erom data addr: "+addr.toString(16)+" size:"+size.toString(16));
    if(size<0)size=0;
    let id:number=0;
    switch (addr & 0xff00) {
        case 0x6000:
            switch (addr & 0xff) {
                case 0x46:
                    id=1;
                /*fall through*/
                case 0x3d:
                    let addr2 = 0x603d + id * 0x09;
                    if (addr != addr2) return;
                    //console.log("read success addr:" + addr.toString() + "|" + addr2.toString());
                    if (buf[4] != 9) return;
                    //console.log("decode erom");
                    //console.log(buf);
                    let base = 8;
                    base = 8;
                    js[id].center.x = buf[base] + ((buf[base + 1] & 0xf) << 8);
                    js[id].center.y = (buf[base + 1] >> 4) + (buf[base + 2] << 4);
                    base = 5;
                    js[id].max.x = buf[base] + ((buf[base + 1] & 0xf) << 8) + js[id].center.x;
                    js[id].max.y= (buf[base + 1] >> 4) + (buf[base + 2] << 4) + js[id].center.y;

                    base = 11;
                    js[id].min.x = js[id].center.x - (buf[base] + ((buf[base + 1] & 0xf) << 8));
                    js[id].min.y = js[id].center.y - ((buf[base + 1] >> 4) + (buf[base + 2] << 4));
                    js_cali_fsm[id] = 0;//we cancel cali as we sync data from controller erom.
                    //flush_js_cali_figure();
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
            break;
        case 0x8000:
            switch (addr & 0xff) {
                case 0x01:
                    js[0].internal_center.x=fetch_u16(buf.slice(5, 7));
                    js[0].internal_center.y=fetch_u16(buf.slice(7, 9));
                    js[1].internal_center.x=fetch_u16(buf.slice(9, 11));
                    js[1].internal_center.y=fetch_u16(buf.slice(11, 13));
                    break;
                case 0x40:
                    break;
                case 0x09:
                    break;
                default:
                    break;
            }
            break;
        case 0x0000://smashpro factory config
            unpack_factory_config(buf.slice(5,buf.length));
            break;
        case 0x9000:
            rgb_buf=[...rgb_buf.slice(0,addr&0xff),...buf.slice(5,size+5),...rgb_buf.slice((addr&0xff)+size)];
            if((addr&0xff)+size>=0xff){
                if(factory_config.rgb_cnt<=0)factory_config.rgb_cnt=31;
                for(let i=0;i<factory_config.rgb_cnt;i++){
                    conf.rgb_data[i]=u8a_to_rgb(new Uint8Array(rgb_buf.slice(i*3,3+i*3)));
                }
            }
            break;
        case 0xF000:
            conf_buf=[...conf_buf.slice(0,addr&0xff),...buf.slice(5,size+5),...conf_buf.slice((addr&0xff)+size)];
            if((addr&0xff)+size>=0xff){
                unpack_conf(conf_buf);
                //flush_setting();
                console.log(conf_buf);
                console.log("conf_buf");
                conf_buf=Array(256);
            }
        default:
            break;
    }
}
export const read_erom = async (addr:number, size:number) => {
    console.log("read erom addr:"+addr.toString(16));
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
    await fw_snd(0x03, buf);
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
    await fw_snd(0x04, buf);
}
export const write_erom = async (addr:number, size:number, save:number, data:Uint8Array|any[]) => {
    while(size>56){
        _write_erom(addr,56,save,data.slice(0,56));
        addr+=56;
        size-=56;
        data=data.slice(56);
    }
    if(size)
        _write_erom(addr,size,save,data);
}
export function factory_config_save(save:number) {
    factory_config.config_bitmap0&=0xfe;
    let buf=new Uint8Array([put_u8(factory_config.config_bitmap0),put_u8(factory_config.pcb_typ),
        put_u8(factory_config.pcb_rev),put_u8(factory_config.indi_led_ofst),put_u8(factory_config.rgb_cnt)
    ]);
    write_erom(0x0000, 0x0c, save, buf);
}
export function controller_color_save(save:number) {
    let buf=new Uint8Array([...rgb_to_u8a(controller_color[0]),
    ...rgb_to_u8a(controller_color[1]),...rgb_to_u8a(controller_color[2]),
    ...rgb_to_u8a(controller_color[3])]);
    write_erom(0x6050, 0x0C, save, buf);
}
export function read_js_cali(id:number){
    if(id>1)return;
    let addr = 0x603d + id * 0x09;
    read_erom(addr, 9);
}
export function put_u8(x:number)
{
    return x&0xff;
}
export function put_i8(x:number)
{
    let tmp=new Int8Array([x]);
    return tmp[0];
}
export function pack_conf():Uint8Array {
    conf.config_bitmap0&=0xfe;
    let array = [put_u8(conf.config_bitmap0), put_u8(conf.config_bitmap1), 
    put_u8(conf.in_interval), put_u8(conf.out_interval),
    put_u8(conf.button_disable_mask&0xff),...put_u16(conf.button_disable_mask>>8),
    ...(new Uint8Array(conf.hd_rumble_amp_ratio)), ...(new Int8Array(conf.joystick_ratio)),
    ...put_u16(conf.imu_sample_gap),
    ...put_u16(conf.joystick_snapback_deadzone[0]), ...put_u16(conf.joystick_snapback_deadzone[1]),
    ...put_u16(conf.joystick_snapback_filter_max_delay),
    ...(new Uint8Array(conf.bd_addr)),
    put_u8(conf.imu_ratio_x), put_u8(conf.imu_ratio_y), put_u8(conf.imu_ratio_z),
    put_u8(conf.pro_fw_version), put_u8(conf.ns_pkt_timer_mode),
    ...(new Uint8Array(conf.dead_zone)),put_u8(conf.dead_zone_mode),put_u8(conf.rgb_slow_start_period)
    ];
    return new Uint8Array(array);
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
export const send_rgb = async (save:number) => {
    let array=Array();
    conf.rgb_data.forEach(r => {
        array.push(...rgb_to_u8a(r));
    });
    write_erom(0x9000,array.length,save,array);
}
export const send_conf = async (save: number) => {
    try {
        if (!device?.opened) {
            throw "Device not opened";
        }
        
        let array=pack_conf();
        write_erom(0xF000,array.length,save,array);
        fw_snd(0x02,null);//flush setting
    } catch (error) {
        msg = `${error}\n\n`;
        alert(msg);
        console.log(msg);
    }
};
export const read_conf = async () => {
    console.log("read conf");
    try {
        if (!device?.opened) {
            throw "Device not opened";
        }
        //fw_snd(0x01, null);//no payload
        read_erom(0xF000,0xff);
        fw_snd(0xFD, null);//READ STATUS
    } catch (error) {
        msg = `${error}\n\n`;
        alert(msg);
    }
};
(navigator as any).hid.ondisconnect = (event) => {
    if (device != null && device.vendorId == event.device.vendorId && device.productId == event.device.productId) {
        dev_con_flg.value = false;
        connection_status = 0;
        device = null;
        chip_id.value="";
        fac_conf_inited.value=false;
        conf_inited.value=false;
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
export const fw_ver_at_least=0x00010400;
export let fw_version_text=ref("V0.0.0.0");
export const dev_con_flg=ref(false);
export let chip_id=ref("");
export async function open_device() {
    try {
        // requestDevice方法将显示一个包含已连接设备列表的对话框，用户选择可以并授予其中一个设备访问权限
        const devices = await (navigator as any).hid.requestDevice({ filters: [] });

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
            console.log("fw dispatch: 0x" + id.toString(16).padStart(2, '0'));
            switch (id) {
                case 0xFF://fw version
                    fw_version = fetch_u32(buffer);
                    let fw_subversion = fetch_u32(buffer.slice(4));
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
                    }else if(fw_version >= 0x00020000){
                        alert("error: firmware "+fw_version_text.value+" is too new.please use DriverNextGen instead.");
                        console.log("firmware request "+get_fw_version_text(fw_subversion,0)+" or newer.");
                        device.close();
                        device = null;
                        connection_status = 0;
                        break;
                    }
                    chip_id.value="";
                    buffer.slice(8,20).forEach(element => {
                        chip_id.value+=element.toString(16);
                    });
                    console.log("cid: ",chip_id.value);
                    dev_con_flg.value=true;
                    //document.querySelector("#fw_version").innerHTML = buffer[0].toString() + '.' + buffer[1].toString();
                    //inital read
                    read_erom(0x0000, 0x0c);
                    read_erom(0x9000, 0xff);
                    read_conf();
                    read_erom(0x603d, 0x09);
                    read_erom(0x6046, 0x09);
                    read_erom(0x8001, 0x08);
                    read_erom(0x6050, 0x0C);
                    alert("Please makesure hardware info match your controller hardware.");
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
                    if (buffer[0]) {
                        if(buffer[1]==0){
                            if(buffer[0]==0xf)
                                alert("Save Success.");
                        }
                        else
                            alert("Rom write fail,errorcode:" + buffer[0].toString());
                    }
                    break;
                case 0x06:
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

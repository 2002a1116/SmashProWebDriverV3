<template>
    <n-flex justify="space-around">
        <canvas :id="props.id" width="200" height="200"></canvas>
        <div>
            <n-flex vertical>
                <span>cursor:</span>
                <div>
                    X:{{ cursor?.x }}
                </div>
                <div>
                    Y:{{ cursor?.y }}
                </div>
            </n-flex>
        </div>
    </n-flex>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Coord } from '../../../Api/struct';
import { std_coord } from './JoystickApi';
import _, { isNil, isUndefined } from 'lodash';
import { computed, onMounted, onUnmounted } from 'vue';
import { js_data } from '../../../Api/webusb';
const { t } = useI18n();
let draw_interval;
const height=200;
const width=200;
const props = defineProps({
    id:{
        type:String,
        default:0
    },cursor:{
        type:Coord,
        default:new Coord()
    },dot:{
        type:Coord,
        default:null
    },showDot:{
        type:Boolean,
        default:false
    },showOcto:{
        type:Boolean,
        default:false
    }
});
function draw_octo(hdl){
    let f:Coord = undefined;
    std_coord.forEach((e,k) => {
        let tmp = {x:(e.x*0.8+1)/2,y:(e.y*0.8+1)/2};
        if(!isNil(f)){
            hdl.lineTo(tmp.x*width,tmp.y*height);
        }else
            f=tmp;
        hdl.moveTo(tmp.x*width,tmp.y*height);
    });
    if(!isNil(f))
        hdl.lineTo(f.x*width,f.y*height);
}
function draw_circle(hdl){
    hdl.beginPath();
    hdl.arc(width/2, height/2, width*0.8/2, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    hdl.closePath();//关闭当前路径
}
function draw_cross(hdl){
    hdl.moveTo(0, height/2);//起点坐标
    hdl.lineTo(width, height/2);//终点坐标
    hdl.moveTo(width/2, 0);//起点坐标
    hdl.lineTo(width/2, height);//终点坐标
    hdl.stroke();
}
function draw_point(hdl,x,y,color?){
    if(isNil(color))
        color = 'ffffff';
    hdl.strokeStyle = color;
    hdl.fillStyle = color;
    hdl.beginPath();
    hdl.arc(x, y, 2, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    hdl.closePath();
    hdl.fill();
    hdl.stroke();
    hdl.strokeStyle = 'black';
    hdl.fillStyle = 'black';
}
function draw(page) {
    //console.time("MyCodeExecutionTime");

    let canvas:any = document.getElementById(props.id);
    if(isNil(canvas))
        return;
    try {
        let hdl = canvas.getContext('2d');
        hdl.clearRect(0, 0, 200, 200);
        if(props.showOcto){
            draw_octo(hdl);
        }else{
            draw_circle(hdl);
        }
        draw_cross(hdl);
        if(!isNil(props.cursor))
            draw_point(hdl,props.cursor.x * 100 / 2047, (4096 - props.cursor.y) * 100 / 2047);
        //console.log(cursor);
        if(!isNil(props.dot))
            draw_point(hdl,(2047 + props.dot.x*0.95) * 100 / 2047, (2047 - props.dot.y*0.95) * 100 / 2047,'red');
        //console.log("draw ");
    //console.timeEnd("MyCodeExecutionTime");
    } catch (e: any) {
        console.log("draw error");
        console.log(e);
    }
}
onMounted(()=>{
    //console.log("mounted");
    draw(this); // 初始调用
    draw_interval = setInterval(draw, 1,this); // 每1ms轮询一次
})
onUnmounted(()=>{
    clearInterval(draw_interval); // 清除定时器，防止内存泄漏
})
</script>
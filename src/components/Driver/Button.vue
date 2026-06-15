<template>
    <n-flex vertical>
        <n-flex justify="center">
            <h1>Button</h1>
        </n-flex>
        <n-flex justify="center">
            <n-card style="height: 400px; max-width: 800px; width:100%;">
                <div class="rgb_background">
                    <RgbButton style="left: 467px; top: 128px; position: absolute;" :text="'Y'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(0)"
                    @click="key_switch_click(0)"/>
                    <RgbButton style="left: 507px; top: 95px; position: absolute;" :text="'X'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(1)"
                    @click="key_switch_click(1)"/>
                    <RgbButton style="left: 507px; top: 163px; position: absolute;" :text="'B'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(2)"
                    @click="key_switch_click(2)"/>
                    <RgbButton style="left: 546px; top: 128px; position: absolute;" :text="'A'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(3)"
                    @click="key_switch_click(3)"/>
                    <RgbButton style="left: 500px; top: 30px; position: absolute;" :text="'R'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(6)"
                    @click="key_switch_click(6)"/>
                    <RgbButton style="left: 530px; top: 60px; position: absolute;" :text="'ZR'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(7)"
                    @click="key_switch_click(7)"/>
                    <RgbButton style="left: 315.5px; top: 91.5px; position: absolute;" :text="'-'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(8)"
                    @click="key_switch_click(8)"/>
                    <RgbButton style="left: 437.5px; top: 91.5px; position: absolute;" :text="'+'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(9)"
                    @click="key_switch_click(9)"/>
                    <RgbButton style="left: 441.5px; top: 197px; position: absolute;" :text="'RS'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(10)"
                    @click="key_switch_click(10)"/>
                    <RgbButton style="left: 241px; top: 128px; position: absolute;" :text="'LS'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(11)"
                    @click="key_switch_click(11)"/>
                    <RgbButton style="left: 411px; top: 128px; position: absolute;" :text="'H'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(12)"
                    @click="key_switch_click(12)"/>
                    <RgbButton style="left: 342px; top: 128px; position: absolute;" :text="'CP'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(13)"
                    @click="key_switch_click(13)"/>
                    <RgbButton style="left: 300px; top: 220px; position: absolute;" :text="'↓'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(16)"
                    @click="key_switch_click(16)"/>
                    <RgbButton style="left: 300px; top: 170px; position: absolute;" :text="'↑'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(17)"
                    @click="key_switch_click(17)"/>
                    <RgbButton style="left: 325px; top: 196px; position: absolute;" :text="'→'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(18)"
                    @click="key_switch_click(18)"/>
                    <RgbButton style="left: 275px; top: 196px; position: absolute;" :text="'←'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(19)"
                    @click="key_switch_click(19)"/>
                    <RgbButton style="left: 250px; top: 30px; position: absolute;" :text="'L'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(22)"
                    @click="key_switch_click(22)"/>
                    <RgbButton style="left: 220px; top: 60px; position: absolute;" :text="'ZL'"
                    :text_color="'#FFFFFFFF'" :bg_color="key_color_bg(23)"
                    @click="key_switch_click(23)"/>
                </div>
            </n-card>
        </n-flex>
        <n-flex justify="center">
            <n-card>
                <func-switch v-model:value="conf.btn.a_b_swap" :text="$t('text.swap a&b')"/>
                <func-switch v-model:value="conf.btn.x_y_swap" :text="$t('text.swap x&y')"/>
                <func-switch v-model:value="conf.btn.dpad_mapping_js" :text="$t('text.dpad_map_js')"/>
            </n-card>
        </n-flex>
    </n-flex>
</template>
<style>
.rgb_background{
    background-image: url('../../desc.png');
    background-size: contain;
    background-position: center;
}
</style>
<script lang="ts">
/*
.rgb_background{
    position: absolute;
    background-image: url('../../desc.png');
    background-size:contain;
    background-position: center;
    height:400px;
    width:800px;
}*/
import { h, reactive, ref } from 'vue';
import { button_sts, hex_to_rgb, rgb_to_hex, send_conf } from '../Api/webusb';
import RgbButton from '../UI/RgbButton.vue'
import FuncSwitch from '../UI/FuncSwitch.vue';
import { conf } from '../Api/config.ts';
export default {
    setup() {
        return {
            conf
        };
    },
    components:{
        RgbButton,
        FuncSwitch
    },
    methods: {
        key_switch_click(id: number) {
            conf.button_disable_mask^=(1<<id);
            //console.log(v);
        }
    },
    computed:{
        key_color_bg: {
            get() {
                return (id: number): string => { 
                    return (conf.button_disable_mask&(1<<id))?
                    "#000000FF":(button_sts.value&(1<<id)?"#FF0000FF":"#00FF00FF"); 
                }
            },
            set(v:any){}
        }
    }
}
</script>
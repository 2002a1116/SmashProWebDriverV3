<template>
<n-flex vertical>
<n-flex justify="center">
    <h1>Info</h1>
</n-flex>
<n-flex justify="center">
    <n-card style="width: 1200px;">
        <n-flex vertical>
            <n-flex justify="center">
                <h2>Purchases:</h2>
            </n-flex>
            <n-button
                text
                tag="a"
                href="https://m.tb.cn/h.h7CWRGT?tk=XDOR4Y788NM"
                target="_blank"
                type="primary"
            >闲鱼连接,purchase here.Hope you will like it.</n-button>
            <n-flex justify="center">
                <span>If you arent in china mainland,and somehow PCB repo stays private.</span>
            </n-flex>
            <n-button
                text
                tag="a"
                href="https://handheldlegend.com/products/progcc-kit-wireless-wired-bundle"
                target="_blank"
                type="primary"
            >Handheldlegend Progcc 3.2</n-button>
            <n-flex justify="center">
            <span>This maybe cheaper for you due to shipping cost.</span>
            </n-flex>
            <n-flex justify="center">
                <h3>Web Driver:</h3>
            </n-flex>
            <n-button
                text
                tag="a"
                href="https://2002a1116.github.io/SmashProWebDriverV3/#/"
                target="_blank"
                type="primary"
            >Web Driver.this it where we r now,isnt it?</n-button>
            <n-flex justify="center">
                <h3>Project Repos:</h3>
                <h5>please leave a star if you like:</h5>
            </n-flex>
            <n-button
                text
                tag="a"
                href="https://github.com/2002a1116/SmashProWebDriverV3"
                target="_blank"
                type="primary"
            >WebDriver project,this programed whats you are looking right now LOL</n-button>
            <n-button
                text
                tag="a"
                href="https://github.com/2002a1116/SmashPro_WiredFirmware"
                target="_blank"
                type="primary"
            >Firmware for wired chip,the main mcu,or the south bridge sometime.</n-button>
            <n-button
                text
                tag="a"
                href="https://github.com/2002a1116/SmashPro_BasebandFirmware"
                target="_blank"
                type="primary"
            >Firmware for esp32 baseband.Where the dream begins.And it actually runs as the main mcu if its working.</n-button>
            <n-button
                text
                tag="a"
                href="https://github.com/2002a1116/SmashProPCB"
                target="_blank"
                type="primary"
            >Pcb design file.If this is private,it means the creater hasnt got the cost covered yet,sorry.</n-button>
            <n-flex justify="center">
            <h3>Thanks:</h3>
            <h5>this project will not be exist without following works.</h5>
            </n-flex>
            <n-button
                text
                tag="a"
                href="https://github.com/NathanReeves/BlueCubeMod"
                target="_blank"
                type="primary"
            >NathanReeves/BlueCubeMod</n-button>
            <n-button
                text
                tag="a"
                href="https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering"
                target="_blank"
                type="primary"
            >dekuNukem/Nintendo_Switch_Reverse_Engineering</n-button>
            <n-button
                text
                tag="a"
                href="https://github.com/ndeadly/MissionControl"
                target="_blank"
                type="primary"
            >ndeadly/MissionControl</n-button>
            
            <n-flex justify="center">
            <h4>An useful tool for switch controller,you may need it:</h4>
            </n-flex>
            <n-button
                text
                tag="a"
                href="https://github.com/CTCaer/jc_toolkit"
                target="_blank"
                type="primary"
            >CTCaer/jc_toolkit</n-button>
                <n-flex vertical>
            <n-flex justify="center">
                    <h3>QQ groups:</h3>
                    
            <h5>If you dont konw what this is,theres nothing i can help.</h5>
                </n-flex>
            <n-flex justify="center">
                    <span>839973286,Controller group,手柄交流反馈群</span>
                    </n-flex>
            <n-flex justify="center">
                    <span>967431986,Hangzhou Smash Bros group,杭州任斗群</span>
                    </n-flex>
            <n-flex justify="center">
                    <h3>Bilibili uploaders(like Youtubers):</h3>
                    </n-flex>
                </n-flex>
            <n-button
                text
                tag="a"
                href="https://space.bilibili.com/1867875"
                target="_blank"
                type="primary"
            >Hangzhou Smash Bros and Street Fighters,杭州任斗&街霸</n-button>
            <n-button
                text
                tag="a"
                href="https://space.bilibili.com/38493714"
                target="_blank"
                type="primary"
            >聚合凝胶，感谢教学烤肉man，if u cant understand whats above,u dont need it.</n-button>
            <n-button
                text
                tag="a"
                href="https://space.bilibili.com/33603335"
                target="_blank"
                type="primary"
            ><del>byd</del>贝丝莉,the best smash bro player in china mainland by far.</n-button>
        </n-flex>
    </n-card>
</n-flex>
</n-flex>
</template>
<script lang="ts">
import {open_device,device} from './Api/webusb'
export default{
setup() {
return{
    open_device,
    device,
};
}
}
</script>
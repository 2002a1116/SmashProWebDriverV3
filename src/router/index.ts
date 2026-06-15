import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Index from "../components/Driver/Index.vue";
import Joystick from "../components/Driver/Joystick.vue";
import Rumble from "../components/Driver/Rumble.vue";
import Gyro from "../components/Driver/Gyro.vue";
import Rgb from "../components/Driver/Rgb.vue";
import Others from "../components/Driver/Others.vue";
import Info from "../components/Info.vue";
import Factory from "../components/Driver/Factory.vue";
import Button from '../components/Driver/Button.vue';
import Format from '../components/Driver/Format.vue';
import Drag from '../components/Driver/drag.vue';

const routes = [
    { path: '/', name: 'Home', component: Index, meta: {keepAlive:false}},
    { path: '/Joystick', name: 'Joystick', component: Joystick, meta: {keepAlive:false}},
    { path: '/Rumble', name: 'Rumble', component: Rumble, meta: {keepAlive:false}},
    { path: '/Gyro', name: 'Gyro', component: Gyro, meta: {keepAlive:false}},
    { path: '/Rgb', name: 'Rgb', component: Rgb, meta: {keepAlive:false}},
    { path: '/Others', name: 'Others', component: Others, meta: {keepAlive:false}},
    { path: '/Factory', name:'Factory',component: Factory, meta: {keepAlive:true}},
    { path: '/Info', name:'Info',component: Info, meta: {keepAlive:false}},
    { path: '/Button', name:'Button',component: Button, meta: {keepAlive:false}},
    { path: '/Format', name:'Format',component: Format, meta:{keepAlive:false}},
    { path: '/Drag', name:'Drag',component: Drag, meta:{keepAlive:false}},
  ];
const router = createRouter({
    history: createWebHashHistory(''),
    routes, // 路由配置
  });
export default router;
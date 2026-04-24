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

const routes = [
    { path: '/', name: 'Home', component: Index },
    { path: '/Joystick', name: 'Joystick', component: Joystick},
    { path: '/Rumble', name: 'Rumble', component: Rumble},
    { path: '/Gyro', name: 'Gyro', component: Gyro},
    { path: '/Rgb', name: 'Rgb', component: Rgb},
    { path: '/Others', name: 'Others', component: Others},
    { path: '/Factory', name:'Factory',component: Factory},
    { path: '/Info', name:'Info',component: Info},
    { path: '/Button', name:'Button',component: Button},
  ];
const router = createRouter({
    history: createWebHashHistory('/SmashProWebDriverV3/'),
    routes, // 路由配置
  });
export default router;
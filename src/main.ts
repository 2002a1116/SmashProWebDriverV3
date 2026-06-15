import { createApp, h, ref, type Component } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts';
import naive, { NIcon } from 'naive-ui'
//import 'default-passive-events';


// createApp(App).mount('#app') 

import { createI18n } from 'vue-i18n'
import zhCN from './localization/zh.json'
import enUS from './localization/en.json'
import axios from 'axios';
import { marked } from 'marked';
// 创建i18n实例并设置初始语言环境和其他配置
const i18n = createI18n({
  locale: 'en-US', // 设置默认语言环境为英语
  globalInjection: true,
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  }
});

axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_PATH;

axios.interceptors.request.use(function (config) {
  //console.log('发请求')
  return config;
}, function (error) {
    // 出错执行
  return Promise.reject(error);
});
// 设置响应拦截器
axios.interceptors.response.use(function (response) {
  //console.log('收到响应')
  return response.data;
  //return response;
}, function (error) {
  // 出错执行
  return Promise.reject(error);
});

// 捕获所有未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', event => {
  console.warn('未捕获的 Promise 拒绝:', event.reason);
  event.preventDefault(); // 阻止默认错误提示
});


const app = createApp(App);

app.config.warnHandler = () => null;

app.use(router);
app.use(naive);
app.use(i18n);

app.mount('#app');

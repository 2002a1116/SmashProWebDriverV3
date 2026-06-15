<template>
  <div id="app">
    <n-layout has-sider>
      <Sidebar></Sidebar>
      <n-layout class="n-layout-content">
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" />
        </router-view>
      </n-layout>
    </n-layout has-sider>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, provide, ref, watch, type Component } from 'vue';
import Sidebar from './components/Sidebar.vue'
import { chip_id, controller_color, controller_color_save, 
          dev_con_flg, 
          rgb_to_hex, send_conf } from './components/Api/webusb';
import { NIcon } from 'naive-ui';
import { marked } from 'marked';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { conf, conf_download_all, conf_init, ImplementConfigDTO } from './components/Api/config.ts';
import _ from 'lodash';
const role = ref("ROLE_USER");
const { t } = useI18n();
console.log(import.meta.env);
provide('$ROLE',role);
provide('$IS_ADMIN',ref(false));
provide('$normalize', (obj:Object)=>Object.assign({}, ...Object.entries(obj).map(pair => ({[pair[0]]: pair[1]}))));
provide('$renderIcon',(icon: Component)=> () => h(NIcon, null, { default: () => h(icon) }));
provide('$renderMarkdown',(text:String)=>marked((text.valueOf()==null)?"":text.valueOf()));
onMounted(()=>{conf_init();});
watch(conf,async (new_val)=>{
  if(dev_con_flg.value){
    if(!conf.magic && !_.isNil(chip_id.value)){
      let data=null;
      let res = await axios.get("/config/"+chip_id.value) as any;
      if(res.code!='SUCCESS'){
        let res = await axios.get("/config/stock/"+chip_id.value) as any;
        if(res.code!='SUCCESS'){
          console.log("recover fail.");
        }else{
          alert(t('msg.user_config_recoverd'));
          data=JSON.parse(res.data.config);
        }
      }else{
          alert(t('msg.user_config_recoverd'));
          data=res.data;
      }
      ImplementConfigDTO(data);
    }
    conf.magic=0x55;
    send_conf(0);
  }
})
</script>
<style scoped>
</style>
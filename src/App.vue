<template>
  <div id="app">
    <n-layout has-sider>
        <Sidebar></Sidebar>
      <n-layout class="n-layout-content">
        <router-view></router-view>
      </n-layout>
    </n-layout has-sider>
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, provide, ref, watch, type Component } from 'vue';
import Sidebar from './components/Sidebar.vue'
import { chip_id, conf, conf_init, conf_inited, conf_unserilize, controller_color, controller_color_save, 
        fac_conf_inited, fac_conf_unserilize, factory_config, factory_config_save, rgb_to_hex, send_conf, send_rgb } from './components/webusb';
import { NIcon } from 'naive-ui';
import { marked } from 'marked';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
const role = ref("ROLE_USER");
const { t } = useI18n();
provide('$ROLE',role);
provide('$IS_ADMIN',ref(false));
provide('$normalize', (obj:Object)=>Object.assign({}, ...Object.entries(obj).map(pair => ({[pair[0]]: pair[1]}))));
provide('$renderIcon',(icon: Component)=> () => h(NIcon, null, { default: () => h(icon) }));
provide('$renderMarkdown',(text:String)=>marked((text.valueOf()==null)?"":text.valueOf()));
onMounted(()=>{conf_init();});
watch(conf_inited,async(newVal)=>{
  if(newVal){
    if(conf.config_bitmap0&0x1){//not inited
      const res = await axios.get('/api/config/'+chip_id.value) as any;
      if(res.code!='SUCCESS'){
          //alert(res.code+":"+res.data.message);
      }else{
          if(res.data.chipId!=chip_id.value){
          }
          else{
              let p = JSON.parse(res.data.config);
              conf_unserilize(p.conf);
              controller_color[0]=(p.controller_color[0]);
              controller_color[1]=(p.controller_color[1]);
              controller_color[2]=(p.controller_color[2]);
              controller_color[3]=(p.controller_color[3]);
              send_rgb(0x1);
              controller_color_save(0x1);
              send_conf(0x1);
              alert(t('msg.user_config_recoverd'));
              return;
              //auto save
          }
      }
      alert(t('msg.user_config_recover_failed'));
    }
  }
});
watch(fac_conf_inited,async(newVal)=>{
  if(newVal&&(factory_config.config_bitmap0&0x1)){
    let stock=0;
    let res = await axios.get('/api/device/'+chip_id.value) as any;
    if(res.code!='SUCCESS'){
        //alert(res.code+":"+res.data.message);
        res = await axios.get('/api/stock/'+chip_id.value) as any;
        stock=1;
        if(res.code!='SUCCESS'){
          alert('msg.factory_config_recover_failed');
          return;
        }
    }
    if(res.data.chipId!=chip_id.value){
        alert('msg.factory_config_recover_failed');
    }
    else{
        fac_conf_unserilize(JSON.parse(res.data.info));
        factory_config_save(0x1);
        if(stock)
          alert(t('msg.factory_config_recovered_stock'));
        else
          alert(t('msg.factory_config_recovered'));
    }
  }
})
</script>
<style scoped>
</style>
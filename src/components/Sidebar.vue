<template>
  <div id="sidebar">
    <n-layout-sider 
      bordered
      collapse-mode="width"
      :width="240"
      :collapsed-width="64"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :native-scrollbar="false"
      content-style="padding: 16px;">
      <n-layout>
        <n-menu :collapsed-width="32" :collapsed-icon-size="22" :options="navs" />
      </n-layout>
      <n-divider>{{ $t('label.opts') }}</n-divider>
      <n-layout>
        <n-menu :collapsed-width="32" :collapsed-icon-size="22" 
        :value="null" :options="buttons" @update:value="buttons_handler"/>
      </n-layout>
      <n-divider></n-divider>
      <n-layout>
            <n-menu :collapsed-width="32" :collapsed-icon-size="22" 
            :value="lang" :options="langs_outlayer" @update:value="langs_handler" :default-expanded-keys="[]"/>
      </n-layout>
    </n-layout-sider>
  </div>
  <n-modal v-model:show="show_modal">
      <login v-model:show="show_modal"></login>
  </n-modal>
</template>
<style scoped>
.Sidebar {
  background: rgba(128, 128, 128, 0.3);
}
</style>

<script lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component, Ref } from 'vue'
import {
  LogOutOutline as HomeIcon,
  LaptopOutline as WorkIcon,
  ArrowUpOutline as ReadIcon,
  ArrowDownOutline as DownloadIcon,
  SaveOutline as SaveIcon,
  PowerOutline as RestartIcon,
  OpenOutline as OpenIcon,
  RefreshCircleOutline as ResetIcon,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { computed, defineComponent, h, inject, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { fw_snd, open_device, read_conf, send_conf, read_erom_sync, dev_con_flg, controller_color_save } from './Api/webusb'
import { useI18n } from 'vue-i18n'
import router from '../router'
import Login from './UI/Login.vue'
import { conf } from './Api/config.ts'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
let show_modal=ref(false);
let role:Ref<string>;
export default defineComponent({
  setup() {
    const { t } = useI18n();
    role=inject('$ROLE');
    const is_admin=inject('$IS_ADMIN') as Ref<boolean>;
    const navs = computed(()=>[
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Home'}},
            {default: () => t('label.index')}
          ),
        key: 'Home',
        icon: renderIcon(HomeIcon)
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Others'}},
            {default: () => t('label.home')}
          ),
        key: 'Others',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Rgb'}},
            {default: () => t('label.rgb')}
          ),
        key: 'Rgb',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Joystick'}},
            {default: () => t('label.joystick')}
          ),
        key: 'Joystick',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Button'}},
            {default: () => t('label.button')}
          ),
        key: 'Button',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Rumble'}},
            {default: () => t('label.rumble')}
          ),
        key: 'Rumble',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Gyro'}},
            {default: () => t('label.gyro')}
          ),
        key: 'Gyro',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Factory'}},
            {default: () => t('label.hw')}
          ),
        key: 'Info',
        icon: renderIcon(HomeIcon),
        show: dev_con_flg.value
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Format'}},
            {default: () => t('label.format')}
          ),
        key: 'Format',
        icon: renderIcon(HomeIcon),
        show: is_admin.value
        //show: true
      }, {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Drag'}},
            {default: () => 'Drag'}
          ),
        key: 'Drag',
        icon: renderIcon(HomeIcon),
        //show: is_admin.value
        show: false
      },
      {
        label: () =>
          h(
            RouterLink,
            {to: {name: 'Info'}},
            {default: () => t('label.info')}
          ),
        key: 'Info',
        icon: renderIcon(HomeIcon)
      },
    ]);
    var langs:MenuOption[]=[
      {
        label: "English",
        key: 'en-US',
        icon:renderIcon(DownloadIcon),
      },{
        label: "Chinese",
        key: 'zh-CN',
        icon:renderIcon(DownloadIcon),
      }
    ]
    var langs_outlayer:MenuOption[]=[
      {
        label: "Langs",
        key: 'top',
        icon:renderIcon(DownloadIcon),
        children: langs
      }
    ]
    const buttons = computed(() => [
      {
        label: t('label.open'),
        key: 'open',
        icon:renderIcon(OpenIcon)
      },
      {
        label: t('label.read'),
        key: 'read',
        icon:renderIcon(ReadIcon),
        disabled: !dev_con_flg.value
      },
      {
        label: t('label.set'),
        key: 'set',
        icon:renderIcon(DownloadIcon),
        disabled: !dev_con_flg.value
      },
      {
        label: t('label.save'),
        key: 'save',
        icon:renderIcon(SaveIcon),
        disabled: !dev_con_flg.value
      },
      {
        label: t('label.restart'),
        key:'restart',
        icon:renderIcon(RestartIcon),
        disabled: !dev_con_flg.value
      },{
        label: t('text.login'),
        key: 'login',
        icon:renderIcon(OpenIcon),
        disabled: false
      }
    ]);
    watch(dev_con_flg,
      (newVal, oldVal) => {
        //console.log("watched");
        router.replace({ name: 'Home' });
      },
      { immediate: true });
    watch(role,
      (newVal, oldVal) => {
        //console.log("watched");
        console.log(newVal);
        if(newVal=="ROLE_ADMIN")
          is_admin.value=true;
      },
      { immediate: true });
    return {
      navs,
      buttons,
      langs_outlayer,
      lang:ref("en-US"),
      collapsed:ref(false),
      open_device,
      show_modal
    }
  },
  methods:{
    buttons_handler(key: string, item: MenuOption) {
      //item.callback();
      if(key=='open'){
        open_device();
      }else if(key=='read'){
        read_conf();
       //read_erom_sync(0x9000,0xff);
      }else if(key=='set'){
        send_conf(0);
      }else if(key=='save'){
        //factory_config_save(2);
        conf.magic = 0x55;
        controller_color_save(0x1);
        send_conf(0xf);
      }else if(key=='restart'){
        fw_snd(0xFE, null);
      }else if(key=='login'){
        this.show_modal=true;
      }
    },
    langs_handler(key:string, item:MenuOption){
      this.$i18n.locale = key;
      this.lang = key;
      localStorage.setItem('userLanguage', key);
    }
  },
  mounted(){
    console.log("lang init "+this.$i18n.locale);
    let lang = localStorage.getItem("userLanguage") || navigator.language;
    if (lang) {
      this.$i18n.locale = lang;
    }else
      this.$i18n.locale = 'en-US';
    this.lang=this.$i18n.locale;
  },
  components:{
    Login,
  }
})

</script>
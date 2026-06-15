<template>
    <n-card hoverable title="Login" :bordered="false" size="large">
        <n-flex vertical justify="center">
            <n-input v-model:value="info.username" type="text" :placeholder="$t('text.username')" style="width: 400px"/>    
            <n-input v-model:value="info.password" type="text" :placeholder="$t('text.password')" style="width: 400px"/>
            <n-grid x-gap="0" :cols="24" collapsed-rows=1>
                <n-gi span="11">
                    <n-flex vertical justify="center">
                        <n-button :loading="loading" @click="show=false;">
                            {{ $t('text.cancel') }}
                            <template #icon>
                            <n-icon>
                                <Cash/>
                            </n-icon>
                            </template>
                        </n-button>
                    </n-flex>
                </n-gi>
                <n-gi span="2"></n-gi>
                <n-gi span="11">
                    <n-flex vertical justify="center">
                        <n-button :loading="loading" @click="handleClick">
                            {{ $t('text.login') }}
                            <template #icon>
                            <n-icon>
                                <Cash/>
                            </n-icon>
                            </template>
                        </n-button>
                    </n-flex>
                </n-gi>
            </n-grid>
        </n-flex>
    </n-card>
</template>
<script setup lang="ts">
import axios from 'axios';
import { inject, ref, type Ref } from 'vue';
import router from '../../router';
import { Cash } from '@vicons/ionicons5';
interface login_info{
    username:string,
    password:string
}
const is_admin=inject("$IS_ADMIN");
const role:Ref<string>=inject('$ROLE');
const info=ref<login_info>({username:"",password:""});
const loading=ref(false);
const show = defineModel("show", {
  type: Boolean,
  default: false,
});
async function handleClick(){
    loading.value=true;
    //alert(JSON.stringify(info.value));
    try{
        //username=user&password=password
        let res = await axios.post("/login",info.value) as any;
        console.log(res);
        if(res.code=='SUCCESS'){
            console.log("login success");
            if(res.data.find(r => r.authority == 'ROLE_ADMIN')){
                role.value='ROLE_ADMIN';
                console.log('role:'+role.value);
                alert("login success.");
            }
        }
    }catch(e){
        console.log(e);
        alert("login failed.");
    }
    loading.value=false;
    show.value=false;
}
</script>
<template>
    <n-flex vertical>
        <n-flex justify="space-around">
            <n-select v-model:value="js_mode" :options="modeList" style="width: 150px" />
            <div>
                {{ t('text.show_octo') }}:
                <n-switch v-model:value="showOcto" />
            </div>
        </n-flex>
        <JoystickGraphic :id="canvasID" :cursor="cursor"
            :show-dot="false" :show-octo="showOcto"></JoystickGraphic>
        <template v-if="js_mode == 0">
            <JoystickRatio :chnl="chnl"></JoystickRatio>
        </template>
        <template v-else-if="js_mode == 1">
            <JoystickAffine :chnl="chnl"></JoystickAffine>
        </template>
    </n-flex>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Coord } from '../../../Api/struct.ts';
import JoystickRatio from './ratio/JoystickRatio.vue'
import JoystickAffine from './affine/JoystickAffine.vue';
import JoystickGraphic from './JoystickGraphic.vue';
import { js_data, raw_js_data } from '../../../Api/webusb.ts';
import { useI18n } from 'vue-i18n';
const props = defineProps<{chnl:number,canvasID:string,modeList:Array<{}>}>();
const js_mode = defineModel<number>("mode");
const showOcto = ref(true);
const { t } = useI18n();
const cursor = computed(()=>{
    //console.log("cursor ",JSON.stringify(js_data.value[props.chnl]));
    return js_data.value[props.chnl];
})
</script>
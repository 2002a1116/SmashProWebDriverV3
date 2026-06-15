<template>
    <n-flex justify="center">
      <FuncSwitch v-model:value="conf.affine[chnl].x_rev" :text="'X'+$t('text.axis')+$t('text.reverse')"/>
      <FuncSwitch v-model:value="conf.affine[chnl].y_rev" :text="'Y'+$t('text.axis')+$t('text.reverse')"/>
    </n-flex>
    <JoystickAffineList v-model:value="list" :chnl="chnl"></JoystickAffineList>
</template>
<script setup lang="ts">
import { Coord } from '../../../../Api/struct.ts';
import JoystickAffineList from './JoystickAffineList.vue';
import { conf } from '../../../../Api/config.ts';
import { computed, onMounted } from 'vue';
import FuncSwitch from '../../../../UI/FuncSwitch.vue';
const props = defineProps({
  chnl:{
    type:Number,
    default:0
  },
});
const list = computed({
  get:():Array<{notch:Coord,angle:Coord}> => {
    return conf.affine[props.chnl].map.slice(0,conf.affine[props.chnl].cnt);
  },
  set:(v:Array<{notch:Coord,angle:Coord}>)=>{
    conf.affine[props.chnl].map = [...v,...conf.affine[props.chnl].map.slice(v.length)];
    conf.affine[props.chnl].cnt=v.length;
    itemsSort();
  }
})

function calcPolarAngle(x, y) {
  const nx = x ?? 0
  const ny = y ?? 0
  if (nx === 0 && ny === 0) return 0
  let deg = Math.atan2(ny, nx) * 180 / Math.PI
  return deg < 0 ? deg + 360 : deg
}
function itemsSort(){
  console.log("sort");
  conf.affine[props.chnl].map = [...conf.affine[props.chnl].map.slice(0,conf.affine[props.chnl].cnt)
      .sort((a, b) => calcPolarAngle(a.notch.x, a.notch.y) - calcPolarAngle(b.notch.x, b.notch.y)),
      ...conf.affine[props.chnl].map.slice(conf.affine[props.chnl].cnt,16)];
}

onMounted(()=>{
  // 坐标变化时 items 会自动重新计算
  //itemsSort();
});
</script>
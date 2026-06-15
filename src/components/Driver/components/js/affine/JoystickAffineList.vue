<template>
  <!--div class="coordinate-manager"-->
  <div>
    <!-- 头部操作栏 -->
    <div class="manager-header">
      <div class="manager-title">
        <span class="icon-dot" />
        {{ affine_legit }}
      </div>
      <div class="manager-actions">
        <span class="item-count">共 {{ items.length }} 项</span>
        <!--<n-button type="primary" :disabled="items.length>=16" @click="addItem()">
          添加项目
        </n-button>-->
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-button>{{t('affine.add')}}</n-button>
        </n-dropdown>
        <n-popconfirm v-if="items.length" @positive-click="clearAll">
          <template #trigger>
            <n-button secondary>{{t('affine.clear')}}</n-button>
          </template>
        </n-popconfirm>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="items.length === 0" class="empty-state">
      <span class="empty-icon">📭</span>
      <p>暂无项目，点击「添加项目」开始</p>
    </div>

    <!-- 项目列表（带过渡动画） -->
    <transition-group v-else name="list" tag="div" class="items-list">
      <div v-for="(item, index) in items" class="item-row">
        <!-- 第一组坐标 -->
        <n-grid x-gap="0" :cols="10" collapsed-rows=1 item-responsive>
          <n-gi span="8">
            <n-flex vertical>
              <div style="height:28px; padding-top: 4px;">
                <n-grid x-gap="0" :cols="20" collapsed-rows=1 item-responsive>
                  <n-gi span="3">
                    <span class="group-label">{{t('affine.notch')}}:</span>
                  </n-gi>
                  <n-gi span="4">
                    X: {{ items[index].notch.x }}
                  </n-gi>
                  <n-gi span="2">
                    <span class="comma">,</span>
                  </n-gi>
                  <n-gi span="4">
                    Y: {{ items[index].notch.y }}
                  </n-gi>
                  <n-gi span="5" offset="2">
                    ∠: {{ calcPolarAngle(items[index].notch.x,items[index].notch.y).toFixed(2) }}
                  </n-gi>
                </n-grid>
              </div>

              <!-- 第二组坐标（排序依据） -->
              <div style="height:28px; padding-top: 0px;">
                <n-grid x-gap="0" :cols="20" collapsed-rows=1 item-responsive>
                  <n-gi span="3">
                    <span class="group-label label-2">{{t('affine.angle')}}:</span>
                  </n-gi>
                  <n-gi span="4">
                    X: {{ items[index].angle.x }}
                  </n-gi>
                  <n-gi span="2">
                    <span class="comma">,</span>
                  </n-gi>
                  <n-gi span="4">
                    Y: {{ items[index].angle.y }}
                  </n-gi>
                  <n-gi span="5" offset="2">
                    ∠: {{ calcPolarAngle(items[index].angle.x,items[index].angle.y).toFixed(2) }}
                  </n-gi>
                </n-grid>
              </div>
            </n-flex>
          </n-gi>
            <!-- 操作按钮 -->
          <n-gi span="2" offset="0">
            <div class="item-actions">
              <n-flex vertical style="margin-left: auto">
                <n-button tertiary type="error" size="small" @click="trigger_item(index)">
                  {{ t('affine.mod') }}
                </n-button>
                <n-popconfirm @positive-click="deleteItem(index)">
                  <template #trigger>
                    <n-button tertiary type="error" size="small">
                      {{ t('affine.del') }}
                    </n-button>
                  </template>
                  确定删除此项目？
                </n-popconfirm>
              </n-flex>
            </div>
          </n-gi>
        </n-grid>
      </div>
    </transition-group>

    <!-- 底部提示 -->
    <div v-if="items.length" class="footer-tip">
      💡 列表按notch极坐标角度自动重排（0°→360°）
    </div>
  </div>
  <n-modal v-model:show="show_modal">
    <n-card style="width:500px">
      <n-flex justify="center">
        <JoystickAffineItem v-model:notch="items[cur_indx].notch" v-model:angle="items[cur_indx].angle" 
          v-model:showModal="show_modal" :showOcto="showOcto"></JoystickAffineItem>
      </n-flex>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, } from 'vue'
import {
  NButton,
  NInputNumber,
  NPopconfirm,
  NIcon,
  NTooltip,
  configProviderProps,
  type DropdownOption
} from 'naive-ui'
import JoystickAffineItem from './JoystickAffineItem.vue'
import { Coord } from '../../../../Api/struct.ts'
import { conf } from '../../../../Api/config.ts';
import { js_data, raw_js_data } from '../../../../Api/webusb.ts';
import { Watch } from '@vicons/ionicons5';
import { std_coord } from '../JoystickApi.ts';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';

const { t } = useI18n();

const items = defineModel<Array<{notch:Coord,angle:Coord}>>("value");
const props = defineProps({
  chnl:{
    type:Number,
    default:false
  },showOcto:{
    type:Boolean,
    default:false
  }
});
const options = computed(()=>{
  let tmp:DropdownOption[] = [];
  std_coord.forEach((e,k)=>{
    tmp.push({
      label:t("dir."+k),
      key:k,
      disabled:false
    });
  });
  return tmp;
})
/*
const options:DropdownOption[] = [];
onMounted(()=>{
  options.splice(0);
  std_coord.forEach((e,k)=>{
    options.push({
      label:k,
      key:k,
      disabled:false
    });
  });
})
*/
function handleSelect(key: string) {
  let tmp = _.cloneDeep(std_coord.get(key));
  tmp.x=Math.round(tmp.x*2047);
  tmp.y=Math.round(tmp.y*2047);
  let t2 = _.cloneDeep(items.value);
  items.value = [...t2,{notch:tmp,angle:new Coord}];
}

let show_modal = ref(false);
let cur_indx = ref(0);
function trigger_item(indx) {
  cur_indx.value=indx;
  show_modal.value = true;
}
function addItem(){
  //items.value.push({notch:new Coord,angle:new Coord});
  items.value = [...items.value,{notch:new Coord,angle:new Coord}];
}
function canComputeAffineMatrices(sequence) {
    if (!Array.isArray(sequence) || sequence.length < 2) return false;
    const n = sequence.length;
    for (let i = 0; i < n; i++) {
        const a = sequence[i].angle;
        const b = sequence[(i + 1) % n].angle;
        // 检查 angle 是否为零向量
        if ((a.x === 0 && a.y === 0) || (b.x === 0 && b.y === 0)) return false;
        // 检查叉积是否非零
        const cross = a.x * b.y - a.y * b.x;
        if (cross === 0) return false;
    }
    return true;
}
let legit = canComputeAffineMatrices(items.value);
watch(items,(new_val)=>{
  legit = canComputeAffineMatrices(items.value);
})
const affine_legit = computed(()=>{
  return legit?t('affine.legit'):t('affine.illegit');
})
// ==================== 数据 ====================
//const items = ref([])
let nextId = 1
const highlightedId = ref(null)

// 工具函数：计算极坐标角度 (0~360)
function calcPolarAngle(x, y) {
  const nx = x ?? 0
  const ny = y ?? 0
  if (nx === 0 && ny === 0) return 0
  let deg = Math.atan2(ny, nx) * 180 / Math.PI
  return deg < 0 ? deg + 360 : deg
}

// 获取象限
function getQuadrant(deg) {
  if (deg >= 0 && deg < 90) return 1
  if (deg >= 90 && deg < 180) return 2
  if (deg >= 180 && deg < 270) return 3
  return 4
}

// ==================== 方法 ====================

function deleteItem(indx) {
  items.value = [...items.value.slice(0,indx),...items.value.slice(indx+1)];
  //items.value.splice(indx,1);
}

function clearAll() {
  items.value = items.value.slice(0,0);
  //items.value.splice(0,items.value.length);
}

function formatAngle(deg) {
  return deg.toFixed(1) + '°'
}
</script>

<style scoped>
.coordinate-manager {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 头部 */
.manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.manager-title {
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a1a2e;
}

.icon-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #5b8def;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(91, 141, 239, 0.5);
  }

  50% {
    box-shadow: 0 0 0 10px rgba(91, 141, 239, 0);
  }
}

.manager-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-count {
  font-size: 0.85rem;
  color: #909399;
  background: #f0f2f5;
  padding: 4px 12px;
  border-radius: 20px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #b0b5be;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 10px;
}

.tip {
  font-size: 0.8rem;
  margin-top: 6px;
}

/* 列表 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

/* 单行 */
.item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.25s;
  flex-wrap: wrap;
}

.item-row:hover {
  background: #f3f6fb;
  border-color: #dce3f0;
}

.item-row.is-highlight {
  animation: flash 0.6s ease;
}

@keyframes flash {
  0% {
    background: #eef4ff;
    border-color: #5b8def;
  }

  100% {
    background: #fafbfc;
    border-color: transparent;
  }
}

/* 序号圆圈 */
.item-index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: #fff;
  flex-shrink: 0;
}

.q-1 {
  background: #52c41a;
}

.q-2 {
  background: #fa9550;
}

.q-3 {
  background: #e85555;
}

.q-4 {
  background: #4da3f5;
}

/* 坐标组 */
.coord-group {
  display: flex;
  align-items: center;
  gap: 0px;
  flex-shrink: 0;
}

.group-label {
  font-size: 0.75rem;
  color: #909399;
  font-weight: 500;
  white-space: nowrap;
}

.label-2 {
  color: #e68a3a;
}

.coord-input {
  width: 85px;
}

.comma {
  color: #c0c4cc;
}

/* 角度显示 */
.angle-display {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.angle-tag {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 14px;
}

.tag-q1 {
  background: #eaf7e4;
  color: #389e0d;
}

.tag-q2 {
  background: #fff3e6;
  color: #d46b08;
}

.tag-q3 {
  background: #fff0f0;
  color: #cf1322;
}

.tag-q4 {
  background: #e8f4fd;
  color: #1d6ec7;
}

.arrow-box {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #d0d5dd;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.arrow-char {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 0.8rem;
  color: #555;
}

.dir-text {
  font-size: 0.72rem;
  color: #909399;
  white-space: nowrap;
}

/* 操作按钮 */
.item-actions {
  display: flex;
  gap: 5px;
  margin-left: auto;
  flex-shrink: 0;
}

/* 底部提示 */
.footer-tip {
  margin-top: 16px;
  font-size: 0.78rem;
  color: #909399;
  border-top: 1px solid #e8ecf1;
  padding-top: 12px;
}

/* 过渡动画 */
.list-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}

.list-move {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
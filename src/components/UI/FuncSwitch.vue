<template>
    <n-flex justify="start">
        <n-grid x-gap="0" :cols="24" collapsed-rows=1 item-responsive>
            <n-gi span="16">
                <n-flex justify="start">
                    {{ props.text }}:
                </n-flex>
            </n-gi>
            <n-gi span="5">
                <n-flex justify="start">
                    {{ $t('text.status') }}:{{ $t(status_text_cal) }}
                </n-flex>
            </n-gi>
            <n-gi span="3">
                <n-flex justify="end">
                    <n-switch v-model:value="comp_value"/>
                </n-flex>
            </n-gi>
        </n-grid>
    </n-flex>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name:'FuncSwitch',
    props: {
        text:String,
        //reversed:Boolean,
        value:Number
    },
    emits:['update:value'],
    setup(props, ctx){
        return{
            props,
        };
    },
    methods:{
    },
    computed:{
        status_text_cal:{
            get():string{
                //let v = this.props.reversed?!this.props.value:this.props.value;
                let v = this.props.value;
                return v?"text.on":"text.off";
            },
            set(v:string){}
        },
        comp_value:{
            get():Boolean{
                return this.props.value!=0;
            },
            set(v:Boolean){
                this.$emit('update:value',v);
            }
        }
    }
})
</script>
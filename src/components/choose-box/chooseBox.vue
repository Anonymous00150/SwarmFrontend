<script setup lang='ts'>
import { DefineProps } from 'vue';
import { string } from 'vue-types';
let boxInfo = [{
  title: '2核(vCPU) 2GiB',
  intro: '专为中小应用打造，轻松满足开发测试和小型应用构造'
}, {
  title: '2核(vCPU) 4GiB',
  intro: '专为中小应用打造，轻松满足开发测试和小型应用构造'
}]
const props = defineProps({
  type: string
});
</script>
<template>
  <el-card class="fast-box choose-box" shadow="hover">
    <div slot="header" class="clearfix">
      <span></span>
    </div>
    <div>
      
    </div>
  </el-card>
</template>


<style lang='scss' scoped>
.choose-box:hover{
  border-top: 2px #1F91DC solid;
}
</style>

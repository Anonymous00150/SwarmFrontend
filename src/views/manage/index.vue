<script lang='ts' setup>
import { operateInstance } from '@/api/user';
import { useUserStoreHook } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { resolve } from 'path';
import { onBeforeMount, reactive } from 'vue';
onBeforeMount(() => {
});
defineOptions({
  name: "Info"
});
const tableData = reactive( [
])
onBeforeMount(() => {
  refreshTableData();
})
const refreshTableData = () => {
  useUserStoreHook()
    .getMyInstanceByToken()
    .then(res => {
      tableData.length = 0; // 清空原数据
      tableData.push(...res.data.myInstances); // 替换为新数据
    });
};

const onOperate = (id: string, operation: string) => {
  operateInstance({
    innerInstanceId: id,
    operation: operation
  })
    .then(res => {
      console.log(res);
      if (res.code == 200) {
        ElMessage({
          message: res.message,
          type:'success'
        })
        setTimeout(() => {
          refreshTableData()
        }, 6000);
      }
    });
}
</script>
<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="instanceId" label="服务器ID" width="180" />
      <el-table-column prop="instanceIpStr" label="公网IP" width="180" />
      <el-table-column prop="instanceStatus" label="运行状态" width="180" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" :disabled="row.instanceStatus !== 'Stopped'" @click="onOperate(row.instanceId,'Start')">
            启动
          </el-button>
          <el-button link type="primary" size="small" :disabled="row.instanceStatus !== 'Running'" @click="onOperate(row.instanceId,'Stop')">
            停止
          </el-button>
          <el-button link type="primary" size="small" :disabled="row.instanceStatus !== 'Running'" @click="onOperate(row.instanceId,'Reboot')">
            重启
          </el-button>
          <el-button link type="primary" size="small" @click="onOperate(row.instanceId,'Delete')">
            释放
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>



<style lang='scss' scoped>

</style>

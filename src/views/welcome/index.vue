<script setup lang="ts">
import { ECSResourcesResult, getZoneResouce } from "@/api/user";
import chooseBox from "@/components/choose-box/chooseBox.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, ElTable } from 'element-plus';
import type { FormInstance, FormRules } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { ref, onBeforeMount, reactive } from "vue";
import { useRouter } from "vue-router";
import { choiceToBeConvert, createInstanceParam, paramGenerator, queryParam } from "@/api/param";
import { loginRules } from "../login/utils/rule";
import { message } from "@/utils/message";
defineOptions({
  name: "Welcome"
});
const router = useRouter();
const ecsPassword = ref("");
const onInputIsNull = () => {
  if (search.value == '') {
    handleValueChange();
  }
}
const selectedECS = ref();
const generateDiskName = (param: any) => {
  if (param == "cloud_efficiency") {
    return "高效云盘";
  }
  else if(param == "cloud_ssd") {
    return "SSD云盘";
  }
}
const listValue = ref('');
const listOptions = ref();
const handleSelectChange = (value: string) => {
  handleValueChange();
};
const ECSInstanceDialog = ref(false);

const createECSInstance = async (index: number, row: any) => {
  ECSInstanceDialog.value = true;
  selectedECS.value = row;
   await useUserStoreHook()
    .getZoneResourceByToken(row)
    .then(data => {
      console.log(data.data.availableZones[0].zoneAvailableResources);
      options.value = data.data.availableZones[0].zoneAvailableResources;
    });
  await useUserStoreHook()
    .getECSImageByToken(selectedECS.value)
    .then(data => {
      console.log(data);
      listOptions.value = data.data.images;
    });
}
const optionalValue = ref('')
const options = ref();
const diskChecker = ref();
const confirmCreate = async (formEl: FormInstance | undefined) => {

  const valid = await formEl.validate();
  if (!valid) {
    return;
  }
  ECSInstanceDialog.value = false;
  const param = createInstanceParam(selectedECS.value, createInput);

  await useUserStoreHook()
    .createInstanceSimplyByToken(param)
    .then(data => {
      console.log(data);
      if (data.code=='200') {
        ElMessage({
          message: '创建实例成功',
          type:'success'
        });
        setTimeout( () => {
          router.push('/manage');
        },2000)
      }
    });
}
const cpuValidator = (rule: any, value: any, callback: any) => {
  if (optionalInput.maxCpu && optionalInput.minCpu) {
    if (optionalInput.minCpu > optionalInput.maxCpu) {
      callback(new Error('最小 CPU 值大于最大 CPU'));
    }
    callback();  
  } else {
    callback();
  }          
}
const memoryValidator = (rule: any, value: any, callback: any) => {
  if (optionalInput.maxMemory && optionalInput.minMemory) {
    if (optionalInput.minMemory > optionalInput.maxMemory) {
      callback(new Error('最小 CPU 值大于最大 CPU'));
    }  
    callback();
  } else {
    callback();
  }          
}
const dialogVisible = ref(false);
const filterRules = reactive<FormRules<typeof optionalInput>>({
  minCpu: [{
    validator: cpuValidator,trigger: 'blur'
  }],
  maxCpu: [{
    validator: cpuValidator,trigger: 'blur'
  }],
  minMemory:[{
    validator: memoryValidator,trigger: 'blur'
  }],
  maxMemory: [{
    validator: memoryValidator,trigger: 'blur'
  }]
})
const regionKey = ref("");
const isGPUNeeded = ref('否');
const search = ref('');
const image = ref('');
const optionFormRef = ref<FormInstance>();
const createFormRef = ref<FormInstance>();
const architecture = ref('all');
const total = ref(0);
const onFilter = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    console.log('valid');
    handleValueChange();
  }
};

const activeName = ref("second");
const optionalInput = reactive({
  minCpu: '',
  maxCpu: '',
  minMemory: '',
  maxMemory: ''
});
const createInput = reactive({
  optionalValue: '',
  listValue: '',
  ecsPassword: ''
});
const cpu = ref('暂不选择');
const memory = ref('暂不选择');
const singleTable = ref<InstanceType<typeof ElTable> | null>(null);
const customTable = ref<InstanceType<typeof ElTable> | null>(null);
const defaultECSResourcesResult: ECSResourcesResult = {
  code: 0,
  message: '',
  data: {
    NextToken: '',
    availableInstanceTypes: [
      {
        baselineCredit: '',
        cpuArchitecture: '',
        cpuCoreCount: 0,
        cpuOptions: {
          core: 0,
          coreFactor: 0,
          hyperThreadingAdjustable: '',
          supportedTopologyTypes: '',
          threadsPerCore: 0
        },
        cpuSpeedFrequency: 0,
        cpuTurboFrequency: 0,
        diskQuantity: 0,
        enhancedNetwork: {
          sriovSupport: '',
          vfQueueNumberPerEni: ''
        },
        eniIpv6AddressQuantity: 0,
        eniPrivateIpAddressQuantity: 0,
        eniQuantity: 0,
        eniTotalQuantity: 0,
        eniTrunkSupported: false,
        eriQuantity: 0,
        GPUAmount: 0,
        GPUMemorySize: '',
        GPUSpec: '',
        initialCredit: '',
        instanceBandwidthRx: 0,
        instanceBandwidthTx: 0,
        instanceCategory: '',
        instanceFamilyLevel: '',
        instancePpsRx: 0,
        instancePpsTx: 0,
        instanceTypeFamily: '',
        instanceTypeId: '',
        jumboFrameSupport: false,
        localStorageAmount: 0,
        localStorageCapacity: '',
        localStorageCategory: '',
        maximumQueueNumberPerEni: 0,
        memorySize: 0,
        networkCardQuantity: 0,
        networkCards: '',
        networkEncryptionSupport: null,
        nvmeSupport: 'required',
        physicalProcessorModel: 'YiTian710',
        primaryEniQueueNumber: 0,
        queuePairNumber: 0,
        secondaryEniQueueNumber: '',
        supportedBootModes: {
          supportedBootMode: ['']
        },
        totalEniQueueQuantity: 0,
        gpuamount: 0,
        gpumemorySize: '',
        gpuspec: ''
      }
    ]
  }
};

// 使用 Vue 3 的 ref 包裹对象
const ECSResources = ref<ECSResourcesResult>(defaultECSResourcesResult);


const defaultParam = {
  "size": 10,
  "nextToken": ""
}
const handleClickNext = () => {
  let param: queryParam = {
    size: 10,
    nextToken: ECSResources.value.data.NextToken
  }
  useUserStoreHook()
    .getECSresourcesByToken(param)
    .then(res => {
      console.log('next');
      ECSResources.value.data.availableInstanceTypes = [
        ...ECSResources.value.data.availableInstanceTypes,
        ...res.data.availableInstanceTypes
      ];
      total.value += 10;
    });
}
const handleFastRowClick = (row, column, event) => {
  singleTable.value.toggleRowSelection(row);
}
const region = ref<string>("");
const regionOptions = ref();
onBeforeMount(() => {
  useUserStoreHook()
    .getECSresourcesByToken(defaultParam)
    .then(res => {
      console.log(res.data.availableInstanceTypes);
      ECSResources.value = res;
      total.value += 10;
    });
})
const handleClick = (tab, event) =>{

}
const handleValueChange = () => {
  let choice: choiceToBeConvert = {
    isGPUNeeded: isGPUNeeded.value,
    architecture: architecture.value,
    optional: optionalInput,
    search: search.value,
  }
  let param = paramGenerator.getParameters(choice);
  useUserStoreHook()
    .getECSresourcesByToken(param)
    .then(res => {
      console.log('available resources type----');
      console.log(res);
      ECSResources.value = res;
      total.value = 10;
    });
}
</script>

<template>
  <div class="root-container  pl-8 pt-4">
    <div class="head-container">
      <div class="head">⚡️云服务器ECS资源</div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="自定义筛选" name="second">
          <div class="gpu-container mt-5 mb-5 flex">
            📟️
            <span class="mr-5">是否需要GPU</span>
            <el-input @change="onInputIsNull" v-model="search" class="ml-3 mr-3" size="default" placeholder="Type to search" style="float:right;width: 200px;"/>
            <el-button :icon="Search" @click="handleValueChange" plain/>
          </div>
          <el-form
            ref="optionFormRef"
            :model="optionalInput"
            style="display: flex; align-items: center;"
            :rules="filterRules"
            size="large">
            <div>cpu核数</div>
            <el-form-item
              style="margin-bottom: 0 !important;margin-left: 15px;"
              prop="minCpu">
              <el-input
                  v-model.number="optionalInput.minCpu"
                  type="text"
                  placeholder="最小cpu核数"
                />
            </el-form-item>
            <el-form-item
              style="margin-bottom: 0 !important;margin-left: 15px;margin-right: 15px;"
              prop="maxCpu">
              <el-input
                  v-model.number="optionalInput.maxCpu"
                  type="text"
                  placeholder="最大cpu核数"
                />
            </el-form-item>
            <span>内存</span>
            <el-form-item
              style="margin-bottom: 0 !important;margin-left: 15px;"
              prop="minMemory">
              <el-input
                  v-model.number="optionalInput.minMemory"
                  type="text"
                  placeholder="最小内存"
                />
            </el-form-item>
            <el-form-item
              style="margin-bottom: 0 !important;margin-left: 15px;"
              prop="maxMemory">
              <el-input
                  v-model.number="optionalInput.maxMemory"
                  type="text"
                  placeholder="最大内存"
                />
            </el-form-item>
            <el-form-item
            style="margin-left: 10px;">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                @click = "onFilter(optionFormRef)"
              >
                筛选
              </el-button>
            </el-form-item>
          </el-form>
          <div class="mt-5 mb-5 flex custom-container items-center">

          </div>
          <el-table
            ref="customTable"
            :data="ECSResources.data.availableInstanceTypes"
            highlight-current-row
            size="large"
            max-height="650"
            style="width: 100%">
            <el-table-column
              property="instanceType"
              label="实例规格"
              width="200">
              <template #header>
                <div style="display: flex; align-items: center">
                  <el-icon><Operation/></el-icon>
                  <span>实例规格</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              property="cpuCoreCount"
              label="vCPU内核"
              width="120">
            </el-table-column>
            <el-table-column
              property="memorySize"
              label="内存(GB)"
              width="120">
            </el-table-column>
            <el-table-column
              label="GPU型号">
              <template #default="scope">
                {{ scope.row.gpuSpec || '----' }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="createECSInstance(scope.$index, scope.row)"
                >
                  创建实例
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        v-model="dialogVisible"
        title="查看可用磁盘"
        width="500"
      >
        <el-select
          v-model="optionalValue"
          placeholder="Select"
          size="large"
          style="width: 240px"
        >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="generateDiskName(item.value)"
              :value="item.value"
            />
        </el-select>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">
              确定分配
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog
        v-model="ECSInstanceDialog"
        title="是否确定创建实例？"
        width="500"
      >
        <!-- <el-select
          v-model="optionalValue"
          placeholder="分配可用磁盘"
          size="large"
          style="width: 240px"
        >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="generateDiskName(item.value)"
              :value="item.value"
            />
        </el-select>
        <el-select
          v-model="listValue"
          placeholder="分配可用镜像"
          size="large"
          style="width: 240px"
        >
            <el-option
              v-for="item in listOptions"
              :key="item.imageId"
              :label="item.OSName"
              :value="item.imageId"
            />
        </el-select> -->
        <el-form
          ref="createFormRef"
          :model="createInput"
          style="display: flex; flex-direction: column;"
          :rules="loginRules"
          size="large">
          <el-form-item
            style="margin-bottom: 0 !important;margin-left: 15px;margin-bottom: 20px;"
            prop="optionalValue"
            :rules="[{required: true, message: '不能为空！'}]"
            >
            <el-select
          v-model="createInput.optionalValue"
          placeholder="分配可用磁盘"
          size="large"
          style="width: 240px"
        >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="generateDiskName(item.value)"
              :value="item.value"
            />
        </el-select>
          </el-form-item>
          <el-form-item
            style="margin-bottom: 0 !important;margin-left: 15px;margin-bottom: 20px;"
            :rules="[{required: true, message: '不能为空！'}]"
            prop="listValue">
            <el-select
          v-model="createInput.listValue"
          placeholder="分配可用镜像"
          size="large"
          style="width: 240px"
        >
            <el-option
              v-for="item in listOptions"
              :key="item.imageId"
              :label="item.OSName"
              :value="item.imageId"
            />
            </el-select>
          </el-form-item>
          <el-form-item
            style="margin-bottom: 0 !important;margin-left: 15px;"
            prop="ecsPassword">
            <el-input
                v-model="createInput.ecsPassword"
                style="width: 240px;"
                placeholder="请输入密码"
              />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="ECSInstanceDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmCreate(createFormRef)">
              创建实例
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/welcome.css");
</style>

import { number } from "echarts"
import { StepInstance } from "element-plus";
import { create } from "sortablejs";
import { string } from "vue-types"
export interface queryParam {
  "size": number,
  "nextToken"?: string,
  "minimumEniPrivateIpAddressQuantity"?: number,
  "gpuSpec"?: string,
  "cpuArchitecture"?: string,
  "minimumCpuCoreCount"?: string,
  "maximumCpuCoreCount"?: string,
  "minimumMemorySize"?: string,
  "maximumMemorySize"?: string,
  "minimumGPUAmount"?: number,
  "maximumGPUAmount"?: number,
  "maximumCpuSpeedFrequency"?: number,
  "minimumInstancePpsRx"?: number,
  "minimumInstancePpsTx"?: number,
  "minimumInstanceBandwidthRx"?: number,
  "minimumInstanceBandwidthTx"?: number,
  "minimumPrimaryEniQueueNumber"?: number,
  "minimumSecondaryEniQueueNumber"?: number,
  "minimumEniQuantity"?: number,
  "minimumQueuePairNumber"?: number,
  "minimumEriQuantity"?: number,
  "minimumEniIpv6AddressQuantity"?: number,
  "minimumLocalStorageAmount"?: number,
  "minimumLocalStorageCapacity"?: number,
  "minimumDiskQuantity"?: number,
  "physicalProcessorModel"?: string,
  "localStorageCategory"?: string,
  "minimumCpuSpeedFrequency"?: number
}
export interface choiceToBeConvert {
  isGPUNeeded: string;
  architecture: string;
  optional?: {
    minCpu?: string;
    maxCpu?: string;
    minMemory?: string;
    maxMemory?: string;
  }
  nextToken?: string;
  search?: string;
  region?: string;
}
export class paramGenerator {
  constructor() {

  }
  static getParameters(choice: choiceToBeConvert): queryParam {
    let param: queryParam = {
      size: 10
    }
    if (choice.nextToken) {
      param.nextToken = choice.nextToken;
    }
    if (choice.search != '') {
      param.gpuSpec = choice.search;
      param.minimumGPUAmount = 1;
      param.maximumGPUAmount = 1;
    }
    else {
      param.minimumGPUAmount = 0;
      param.maximumGPUAmount = 0;
    }
    if (choice.optional.minCpu) {
      param.minimumCpuCoreCount = choice.optional.minCpu;
    }
    if (choice.optional.maxCpu) {
      param.maximumCpuCoreCount = choice.optional.maxCpu;
    }
    if (choice.optional.minMemory) {
      param.minimumMemorySize = choice.optional.minMemory;
    }
    if (choice.optional.maxMemory) {
      param.maximumMemorySize = choice.optional.maxMemory;
    }
    console.log(param);
    return param;
  }

}
export function createInstanceParam(ECS: any, createInput: any) {
  console.log(createInput);
  return {
    "instanceType": ECS.instanceType,
    "systemDickType": createInput.optionalValue,
    "imageId": createInput.listValue,
    "internetMaxBandwidth": 1,
    "password": createInput.ecsPassword,
    "dryRun": false
  }
}
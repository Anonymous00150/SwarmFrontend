import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import { getToken } from "@/utils/auth";
import { string } from "vue-types";

export interface queryECSParam {
  "size": number,
  "nextToken": string,
  "minimumEniPrivateIpAddressQuantity": number,
  "gpuspec": string,
  "cpuArchitecture": string,
  "minimumCpuCoreCount": number,
  "maximumCpuCoreCount": number,
  "minimumMemorySize": number,
  "maximumMemorySize": number,
  "minimumGPUAmount": number,
  "maximumGPUAmount": number,
  "maximumCpuSpeedFrequency": number,
  "minimumInstancePpsRx": number,
  "minimumInstancePpsTx": number,
  "minimumInstanceBandwidthRx": number,
  "minimumInstanceBandwidthTx": number,
  "minimumPrimaryEniQueueNumber": number,
  "minimumSecondaryEniQueueNumber": number,
  "minimumEniQuantity": number,
  "minimumQueuePairNumber": number,
  "minimumEriQuantity": number,
  "minimumEniIpv6AddressQuantity": number,
  "minimumLocalStorageAmount": number,
  "minimumLocalStorageCapacity": number,
  "minimumDiskQuantity": number,
  "physicalProcessorModel": string,
  "localStorageCategory": string,
  "minimumCpuSpeedFrequency": number
}

export interface queryECSParam {
  "regionId": string,
  "zoneId": string,
  "destinationResource": string,
  "instanceType": string,
  "instanceChargeType": string,
  "spotStrategy": string,
  "spotDuration": number
}
export type ECSResourcesResult = {
  "code": number,
  "message": string,
  "data": {
    "NextToken": string,
    "availableInstanceTypes": Array<
      {
        "baselineCredit": string,
        "cpuArchitecture": string,
        "cpuCoreCount": number,
        "cpuOptions": {
          "core": number,
          "coreFactor": number,
          "hyperThreadingAdjustable": string,
          "supportedTopologyTypes": string,
          "threadsPerCore": number
        },
        "cpuSpeedFrequency": number,
        "cpuTurboFrequency": number,
        "diskQuantity": number,
        "enhancedNetwork": {
          "sriovSupport": string,
          "vfQueueNumberPerEni": string
        },
        "eniIpv6AddressQuantity": number,
        "eniPrivateIpAddressQuantity": number,
        "eniQuantity": number,
        "eniTotalQuantity": number,
        "eniTrunkSupported": boolean,
        "eriQuantity": number,
        "GPUAmount": number,
        "GPUMemorySize": string,
        "GPUSpec": string,
        "initialCredit": string,
        "instanceBandwidthRx": number,
        "instanceBandwidthTx": number,
        "instanceCategory": string,
        "instanceFamilyLevel": string,
        "instancePpsRx": number,
        "instancePpsTx": number,
        "instanceTypeFamily": string,
        "instanceTypeId": string,
        "jumboFrameSupport": boolean,
        "localStorageAmount": number,
        "localStorageCapacity": string,
        "localStorageCategory": string,
        "maximumQueueNumberPerEni": number,
        "memorySize": number,
        "networkCardQuantity": number,
        "networkCards": string,
        "networkEncryptionSupport": null,
        "nvmeSupport": "required",
        "physicalProcessorModel": "YiTian710",
        "primaryEniQueueNumber": number,
        "queuePairNumber": number,
        "secondaryEniQueueNumber": string,
        "supportedBootModes": {
          "supportedBootMode": [
            string
          ]
        },
        "totalEniQueueQuantity": number,
        "gpuamount": number,
        "gpumemorySize": string,
        "gpuspec": string
      }
    >
  }
}
export type UserResult = {
  code?: string;
  success: boolean;
  message: string;//我改的是否登录成功
  token: string;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** 按钮级别权限 */
    permissions: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
    token: string;
    id?: string;
    email?: string;
    phone?: string;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi(`/users/login?username=admin&password=admin123`), { data });
};

export const getModifiedLogin = (data?: { username: string; password: string }) => {
  return http.request<UserResult>("post", baseUrlApi(`/users/login?username=${data.username}&password=${data.password}`), { data });
};

export const getModifiedRegister = (data?: { username: string; password: string; email: string; phone: string }) => {
  return http.request<UserResult>("post", baseUrlApi(`/users/register?username=${data.username}&password=${data.password}&email=${data.email}&phone=${data.phone}`), { data });
};

export const getModifiedUpdate = (data?: { password: string; email: string; phone: string }) => {
  console.log(data);
  return http.request<UserResult>("put", baseUrlApi(`/users/update?email=${data.email}&phone=${data.phone}&password=${data.password}`), { data });
};

export const getModifiedToken = () => {
  return http.request<UserResult>("get", baseUrlApi(`/users/profile`));
};

export const getECSResources = (param: queryECSParam) => {
  const params = Object.entries(param).map(([key, value]) => `${key}=${value}`);
  const AddParam = `?${params.join('&')}`;

  return http.request<ECSResourcesResult>("get", baseUrlApi(`/AlibabaCloud/ECS/availableInstanceType${AddParam}`));
};
export const getECSRegion = () => {
  return http.request<ECSResourcesResult>("get", baseUrlApi(`/AlibabaCloud/ECS/regions`));
};

export const getECSImage = (selected: any) => {
  return http.request<ECSResourcesResult>("get", baseUrlApi(`/AlibabaCloud/ECSImage/list?regionId=cn-shenzhen&instanceType=${selected.instanceType}`));
};

export const getZoneResouce = (row: any) => {
  return http.request<ECSResourcesResult>("get", baseUrlApi(`/AlibabaCloud/ECS/availableZoneResource?zoneId=${row.zoneId}&destinationResource=SystemDisk&instanceType=${row.instanceType}`));
};
export const createInstanceSimply = (param?: object) => {
  return http.request<ECSResourcesResult>("post", baseUrlApi(`/AlibabaCloud/ECS/createInstanceSimply`), { data: param });
};

export const getMyInstance = () => {
  return http.request<any>("get", "/api/AlibabaCloud/ECS/myInstance")
};

export const operateInstance = (data?: object) => {
  return http.request<any>("post", "/api/AlibabaCloud/ECS/operateInstance", { data });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

export const refreshModifiedTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

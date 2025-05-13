import { defineStore } from "pinia";
import { message } from "@/utils/message";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type UserResult,
  type RefreshTokenResult,
  getLogin,
  refreshTokenApi,
  getModifiedLogin,
  getModifiedRegister,
  getModifiedToken,
  getModifiedUpdate,
  getECSResources,
  ECSResourcesResult,
  getECSRegion,
  getECSImage,
  getZoneResouce,
  createInstanceSimply,
  getMyInstance,
  operateInstance
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
import { data } from "autoprefixer";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getModifiedLogin(data)
          .then(data => {
            if (data?.message === "登录成功") {
              console.log("出现data");
              console.log(data);
              setToken(data.token);
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async register(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getModifiedRegister(data)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async update(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getModifiedUpdate(data)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    async getProfileByToken() {
      return new Promise<UserResult>((resolve, reject) => {
        getModifiedToken()
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          })
      })
    },
    async getECSresourcesByToken(param) {
      return new Promise<ECSResourcesResult>((resolve, reject) => {
        getECSResources(param)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      })
    },
    async getECSregionByToken() {
      return new Promise<any>((resolve, reject) => {
        // 获取ECS资源所需的region
        getECSRegion()
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      })
    },
    async getECSImageByToken(selected: any) {
      return new Promise<any>((resolve, reject) => {
        // 获取ECS资源所需的region
        getECSImage(selected)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      })
    },
    async getZoneResourceByToken(row: any) {
      return new Promise<any>((resolve, reject) => {
        // 获取ECS资源所需的region
        getZoneResouce(row)
          .then(data => {
            resolve(data);
          })
      });
    },

    async createInstanceSimplyByToken(param: any) {
      return new Promise<any>((resolve, reject) => {
        createInstanceSimply(param)
          .then(data => {
            resolve(data);
          })
      });
    },
    async getMyInstanceByToken() {
      return new Promise<any>((resolve, reject) => {
        getMyInstance()
          .then(data => {
            resolve(data);
          });
      })
    },
    async operateInstanceByToken(param: any) {
      return new Promise<any>((resolve, reject) => {
        operateInstance(param)
          .then(data => {
            resolve(data);
          });
      })
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    // async handRefreshToken(data) {
    //   return new Promise<RefreshTokenResult>((resolve, reject) => {
    //     refreshTokenApi(data)
    //       .then(data => {
    //         if (data) {
    //           setToken(data.token);
    //           resolve(data);
    //         }
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    //直接删除token,不存在refreshToken
    deleteToken() {

    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}

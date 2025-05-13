<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import RelationGraph from 'relation-graph-vue3';
import ForceGraph from 'force-graph';
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import { componentToSlot } from "element-plus/es/components/table-v2/src/utils.mjs";
import type { RGJsonData, RGNode, RGLine, RGLink, RGUserEvent, RGOptions, RelationGraphComponent } from 'relation-graph-vue3';

defineOptions({
  name: "Update"
});


const graphRef = ref<RelationGraphComponent | null>(null);
const graphOptions: RGOptions = {
    debug: false,
    defaultNodeBorderWidth: 0,
    allowSwitchLineShape: true,
    allowSwitchJunctionPoint: true,
    defaultLineShape: 1,
    isMoveByParentNode: true,
    layout: {
      layoutName: 'force'
    },
    defaultJunctionPoint: 'border'
};
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const jumptonew = () => {
  router.push("/register");
}
const N = 40;
const gData = {
  nodes: [...Array(N).keys()].map(i => ({ id: i })),
  links: [...Array(N).keys()]
    .filter(id => id)
    .map(id => ({
      source: id,
      target: Math.round(Math.random() * (id - 1))
    }))
};

let graphInstance: any;
const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "",
  password: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({ username: ruleForm.username, password: ruleForm.password })
        .then(res => {
          if (res?.message == "登录成功") {
            // 获取后端路由
            return initRouter().then(() => {
              router.push(getTopMenu(true).path).then(() => {
                console.log(getTopMenu(true).path)
                message("登录成功", { type: "success" });
              });
            });
          } else {
            message("登录失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

function onRegister() {
  router.push("/register");
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
      const container = document.getElementById('graph');
    if (container) {
      const graph = new ForceGraph(container)
        .zoom(0.8)
        .nodeRelSize(6)

        .width(0.5*window.innerWidth) 
        .linkDirectionalParticles(2)  // 设置链接的粒子数
        .graphData(gData);            // 设置图数据
    }
});
 
onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

</script>

<template>
  <div class="select-none" style="width: 100%;">
    <!-- <img :src="bg" class="wave" /> -->
    <div class="flex-c absolute right-5 top-3">
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="flex font-bold" style="width: 100%;justify-content: space-around;">
      <div style="position: relative;" >
        <div style="position: absolute;top: 30px;left: 40px;font-size: 2.3rem;font-family: 'AlimamaShuHeiTi';color: #2b3f50;">分布式fuzz系统</div>
        <div id="graph" style="height: 100vh;position: relative;">
        </div>
      </div>
      <div class="login-container">
        <!--<div class="img">
          <component :is="toRaw(illustration)" />
        </div>-->
        <div class="login-box">
          <div class="login-form">
            <avatar class="avatar" />
            <Motion>
              <h2 class="outline-none">{{ title }}</h2>
            </Motion>

            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="loginRules"
              size="large">
              <Motion :delay="100">
                <el-form-item
                  :rules="[
                    {
                      required: true,
                      message: '请输入账号',
                      trigger: 'blur'
                    }
                  ]"
                  prop="username"
                >
                  <el-input
                    v-model="ruleForm.username"
                    clearable
                    placeholder="账号"
                    :prefix-icon="useRenderIcon(User)"
                  />
                </el-form-item>
              </Motion>

              <Motion :delay="150">
                <el-form-item prop="password">
                  <el-input
                    v-model="ruleForm.password"
                    clearable
                    show-password
                    placeholder="密码"
                    :prefix-icon="useRenderIcon(Lock)"
                  />
                </el-form-item>
              </Motion>

              <Motion :delay="250">
                <el-button
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  :loading="loading"
                  @click="onLogin(ruleFormRef)"
                >
                  登录
                </el-button>
                <div class="reg-container">
                  <el-link type="primary" :underline="false" @click="onRegister()">
                    注册
                  </el-link>
                </div>
              </Motion>
            </el-form>
          
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
@font-face {
  font-family: 'AlimamaShuHeiTi';
  src: url('@/dist/static/font/AlimamaShuHeiTi-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}
</style>

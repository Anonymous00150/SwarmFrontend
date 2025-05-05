<template>
  <div class="bg">
    <video autoplay muted loop class="background-video">
      <source src="/static/wbeb.mp4" type="video/mp4" />
    </video>
    <div class="content">
      <img class="logo" src="/static/logo.svg" alt="">

      <div class="item mg-u-80 flex items-center">
        <div class="label" style="width: 50px;">账号</div>
        <el-input class="input" type="text" v-model="username" placeholder="请输入账号"></el-input> 
      </div>
      <div class="item mg-u-30 flex items-center mb-5">
        <div style="width: 50px;">密码</div>
        <el-input class="input" type="password" v-model="password" placeholder="请输入密码"></el-input> 
      </div>
      <el-button @click="onLogin" type="primary" class="mb-5" style="width: 150px;margin-left: 0 !important;">
        登录
      </el-button>
      <el-button @click="onRegister" type="primary" class="mb-5" style="width: 150px;margin-left: 0 !important;">
        注册
      </el-button>
    </div>
  </div>
  <Register ref="registerRef" ></Register>
</template>
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
import Register from '../register/Register.vue';
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import { componentToSlot } from "element-plus/es/components/table-v2/src/utils.mjs";
const registerRef = ref(null);
defineOptions({
  name: "Update"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  username: "",
  password: ""
});
//formEl: FormInstance | undefined
const onLogin = async () => {
  // if (!formEl) return;
  loading.value = true;
      useUserStoreHook()
        .loginByUsername({ username: ruleForm.username, password: ruleForm.password })
        .then(res => {
          if (res?.message == "登录成功") {
            // 获取后端路由
            return initRouter().then(() => {
              router.push(getTopMenu(true).path).then(() => {
                message("登录成功", { type: "success" });
              });
            });
          } else {
            message("登录失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
  // await formEl.validate((valid, fields) => {
  //   if (valid) {
      
  //   }
  // });
};

// function onRegister() {
//   router.push("/register");
// }

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}
const onRegister = () => {
  registerRef.value?.show();
}
onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>
<!-- <script>
export default {
  components:{Register},
  data() {
    return {
      username:"",
      password:""
    }
  },
  created() {
  },
  methods: {

  }
};
</script> -->

<style lang="scss">
.bg {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.content {
  position: relative;
  z-index: 2;
  color: red;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15%;

  .logo {
    width: 690px;
    height: 180px
  }

  .item {
    color: white;
    font-weight: bold;
    font-size: 16px;
  }
  
}


.mg-u-80 {
  margin-top: 80px;
}
.mg-u-50 {
  margin-top: 50px;
}
.mg-u-30 {
  margin-top: 30px;
}
.mg-u-10 {
  margin-top: 15px;
}
</style>

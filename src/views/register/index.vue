<script lang='ts' setup>
import Motion from "../login/utils/motion";
import { loginRules } from "../login/utils/rule";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { useNav } from "@/layout/hooks/useNav";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { initRouter, getTopMenu } from "@/router/utils";
import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import type { FormInstance } from "element-plus";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { bg, avatar, illustration } from "../login/utils/static";
import { useUserStoreHook } from "@/store/modules/user";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
const router = useRouter();
const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
const loading = ref(false);
const { title } = useNav();
const ruleForm = reactive({
  username: "",
  password: "",
  checkPass: "",
  email: "",
  phone: ""
});
const ruleFormRef = ref<FormInstance>();
const onRegister = async (formEl: FormInstance | undefined)=> {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    //表单格式验证成功
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .register({ username: ruleForm.username, password: ruleForm.password, email: ruleForm.email, phone: ruleForm.phone })
        .then(res => {
          if (res?.message == "注册成功") {
            // 获取后端路由
            return initRouter().then(() => {
              router.push("/login").then(() => {
                message("注册成功，请重新登录", { type: "success" });
              });
            });
          } else {
            message("注册失败，用户名、邮箱或电话已存在", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
}
</script>

<template>
  <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
  </div>
  <div class="login-container">
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
            size="large"
          >
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
                  class="bar"
                  autocomplete="off"
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
                  class="bar"
                  autocomplete="off"
                />
              </el-form-item>
            </Motion>
            <Motion :delay="150">
              <el-form-item prop="checkPass">
                <el-input
                  v-model="ruleForm.checkPass"
                  clearable
                  show-password
                  placeholder="再次输入密码"
                  :prefix-icon="useRenderIcon(Lock)"
                  class="bar"
                  autocomplete="off"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="email">
                <el-input
                  v-model="ruleForm.email"
                  clearable
                  placeholder="请输入邮箱"
                  class="bar"
                  autocomplete="off"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="phone">
                <el-input
                  v-model="ruleForm.phone"
                  clearable
                  placeholder="请输入电话"
                  class="bar"
                  autocomplete="off"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4 bar"
                size="default"
                type="primary"
                :loading="loading"
                @click="onRegister(ruleFormRef)"
              >
                注册
              </el-button>
            </Motion>
          </el-form>
        </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
@import url("@/style/register.css");
</style>

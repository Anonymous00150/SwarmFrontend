<script setup lang="ts">
import { loginRules } from "../login/utils/rule";
import { message } from "@/utils/message";
import { ref, reactive, onMounted, onBeforeMount } from 'vue';
import { useRouter } from "vue-router";
import type { FormInstance } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
const router = useRouter();
const loading = ref(false);
const username = ref<string>(''); 
const id = ref<string>('');
const email = ref<string>('');
const phone = ref<string>('');
const changePassword = ref<string>('修改密码');
const password = ref<string>('');
const showInput = ref(false); 
const ruleFormRef = ref<FormInstance>();
defineOptions({
  name: "Info"
});
const getProfile = async () => {
  loading.value = true;
  useUserStoreHook()
    .getProfileByToken()
    .then(res => {
      console.log(res.data);
      username.value = res.data.username;
      id.value = res.data.id;
      email.value = res.data.email;
      phone.value = res.data.phone;
    })
        .finally(() => (loading.value = false));
  
}
const ruleForm = reactive({
  password: ""
});
onBeforeMount(() => {
  getProfile();
})

const onUpdate = () => {
  showInput.value = !showInput.value;
  if (showInput.value) {
    changePassword.value = "取消修改";
  }
  else {
    changePassword.value = "修改密码";
  }
};

const onModify = async (formEl: FormInstance | undefined)=> {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    //表单格式验证成功
    if (valid) {
      useUserStoreHook()
        .update({ password: ruleForm.password, email: email.value, phone: phone.value })
        .then(res => {
          console.log(res);
          if (res?.code == "200") {
            message("更改成功", { type: "success" });
            onUpdate();
          } else {
            message("更改失败", { type: "error" });
          }
        })
    }
  });
}

</script>

<template>
  <div>
    <el-card shadow="hover" class="card">
      <div class="clearfix  avatar-container flex items-center">
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        <div>{{ username }}</div>
        <div class="ml-auto flex flex-col justify-end flex-col floater">
          <el-button type="primary" class="Modi-button ml-auto mb-5" @click="onUpdate()">{{changePassword}}</el-button>
          <div v-if="showInput">
            <el-form :rules="loginRules" :model="ruleForm" ref="ruleFormRef">
              <el-form-item label="确认新密码" prop="password">
                <el-input v-model="ruleForm.password" placeholder="请输入新密码"></el-input>
                <el-button type="primary" @click="onModify(ruleFormRef)">
                  <el-icon style="vertical-align: middle">
                    <Check />
                  </el-icon>
                </el-button>
              </el-form-item>
            </el-form>
            
          </div>
        </div>
      </div>
      <div>
        用户ID: {{ id }}
      </div>
      <div>
        邮箱: {{ email }}
      </div>
      <div>
        电话: {{ phone }}
      </div>
    </el-card>
  </div>
</template>

<style scoped>
@import url("@/style/info.css");
</style>
import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
let valiPass: string = "";
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;


var checkPhone = (rule, value, callback) => {
  const phoneReg = /^1[34578]\d{9}$$/
  if (!value) {
    return callback(new Error('电话号码不能为空'))
  }
  setTimeout(() => {
    // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
    // 所以在前面加了一个+实现隐式转换

    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话号码格式不正确'))
      }
    }
  }, 100)
}
var checkEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}
/** 登录校验 */
const loginRules = reactive(<FormRules>{
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
          );
        } else {
          valiPass = value;
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  ecsPassword: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入密码"));
        }

        // 密码必须 8~30 位，并包含至少 1 个大写字母、1 个小写字母、1 个数字、1 个特殊字符
        const strongPwdRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/;

        if (!strongPwdRegex.test(value)) {
          return callback(
            new Error("密码需要同时包含大小写英文字母、数字及特殊符号，长度8~30位")
          );
        }

        valiPass = value;
        callback();
      },
      trigger: "blur"
    }
  ],
  checkPass: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== valiPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    }
  ],
  phone: [
    {
      validator: checkPhone,
      trigger: "blur"
    }
  ],
  email: [
    {
      validator: checkEmail,
      trigger: "blur"
    }
  ]
});

export { loginRules };

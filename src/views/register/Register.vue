<template>
    <div class="modal" v-if="showModal" @click.prevent>
        <div class="regcontent">
            <img src="/static/logo2.svg" alt="">

            <div class="mg-u-50">
                <div class="item">
                    <div>账号:</div>
                    <input class="input" type="text" v-model="request.username" />
                </div>
                <div class="item">
                    <div>密码:</div>

                    <input class="input" type="password" v-model="request.password" />
                </div>
                <div class="item">
                    <div>确认密码:</div>

                    <input class="input" type="password" v-model="password2" />
                </div>
                <div class="item">
                    <div>手机号码:</div>

                    <input class="input" type="text" v-model="request.phone" />
                </div>
                <div class="item">
                    <div>邮箱:</div>

                    <input class="input" type="text" v-model="request.email" />
                </div>
                <div class="item mg-u-5">
                    <div></div>

                    <div class="rule">{{ rule }}</div>
                </div>
            </div>

            <div class="button bgreen mg-u-50" @click="onClickReg">
                注册
            </div>

            <img class="close" src="/static/close.svg" alt="" @click="showModal = false">
        </div>
    </div>
</template>
  
<script>
import Http from "../../libs/Http"
export default {
    data() {
        return {
            showModal: false,
            rule: "",
            request: {
                username: "",
                password: "",
                phone: "",
                email: "",
            },
            password2: ""

        }
    },
    methods: {
        show() {
            this.showModal = true
        },
        verify() {
            if (this.password2.length < 6) {
                return "密码长度不能小于6位"
            }
            if (this.request.password != this.password2) {
                return "两次密码不一致"
            }
            const phoneRegex = /^1[3-9]\d{9}$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (phoneRegex.test(this.request.phone) == false) {
                return "手机号码格式错误"
            }
            if (emailRegex.test(this.request.email) == false) {
                return "邮箱格式错误"
            }
            return null
        },
        onClickReg() {
            let v = this.verify()
            if (!!v) {
                this.rule = v
                return
            }
            console.log(this.request)
            Http.post("/users/register",this.request, (data) => {
                console.log("data:",data)
                alert(data.message)
                if(data.code == 200){
                    this.showModal = false
                }
            })
        }
    }
}
</script>
  
<style lang="scss" scoped>
/* 可以在这里添加样式 */
.modal {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background-color: #00000088;

    display: flex;
    justify-content: center;
    align-items: center;
}

.regcontent {
    width: 660px;
    height: 510px;
    background-color: white;
    border-radius: 10px;
    position: relative;

    text-align: center;
    padding: 30px 10px;
    font-size: 16px;
    color: black;

    .item {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        align-items: center;

        :nth-child(1) {
            width: 80px;
            text-align: right;
        }

        .rule {
            text-align: left;
            color: red;
            padding-left: 10px;
            width: 262px;
        }
    }

    .mg-u-5 {
        margin-top: 5px;
    }

    .input {
        border: 1px solid #ccc;
        background-color: #F8F8F8;
        margin-left: 10px;
    }

    .input:hover {
        box-shadow: none;
    }

    .button {
        margin: 50px auto;
    }

    .close {
        position: absolute;
        top: 20px;
        right: 10px;
        cursor: pointer;
    }
}
</style>
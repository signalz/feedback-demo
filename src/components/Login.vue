<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-label">{{ $t("login.login-form") }}</div>
      <FormModel class="login-form" ref="ruleForm" :model="formInline" :rules="rules">
        <Item ref="user" prob="user" required>
          <Input
            v-model="formInline.user"
            :placeholder="$t('login.username')"
            @blur="
              () => {
                $refs.user.onFieldBlur();
              }
            "
          >
            <Icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </Input>
        </Item>
        <Item ref="password" prob="password" required>
          <Input
            v-model="formInline.password"
            type="password"
            :placeholder="$t('login.pass')"
            @blur="
              () => {
                $refs.password.onFieldBlur();
              }
            "
          >
            <Icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </Input>
        </Item>
        <Item>
          <Button
            @click="handleSubmit"
            class="login-btn"
            type="primary"
            html-type="submit"
          >{{ $t("login.login") }}</Button>
        </Item>
      </FormModel>
      <div class="message" v-if="isShowMessage">{{ messageToShow }}</div>
    </div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
  </div>
</template>
<script>
import { Button, FormModel, Input, Icon } from "ant-design-vue";

import { request } from "../api";
import { END_POINT } from "../config";
import Loading from "./Loading";

const { Item } = FormModel;

export default {
  name: "Login",
  components: {
    Loading,
    Button,
    FormModel,
    Input,
    Icon,
    Item
  },
  data: () => {
    return {
      isLoading: false,
      isShowMessage: false,
      messageToShow: "",
      formInline: {
        user: "",
        password: ""
      },
      rules: {
        user: [
          {
            required: true,
            message: "Please fill in User Name",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in Password",
            trigger: "blur"
          },
          {
            min: 4,
            message: "Length should be more than 4",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.isShowMessage = false;
      const username = this.formInline.user;
      const password = this.formInline.password;

      this.$refs.ruleForm.validate(() => {
        if (username && password) {
          this.isShowMessage = false;
          this.isLoading = true;
          request(`${END_POINT}/signin`, {
            method: "POST",
            body: JSON.stringify({
              username,
              password
            })
          })
            .then(data => {
              localStorage.setItem("jwt", data.token);
              this.isLoading = false;
              this.$router.push("/");
            })
            .catch(e => {
              this.isLoading = false;
              this.messageToShow = this.$t("login.wrong-user-pass");
              this.isShowMessage = true;
              console.log(e);
            });
        } else {
          this.messageToShow = this.$t("login.missing-user-pass");
          this.isShowMessage = true;
          return false;
        }
      });
      //this.isLoading = true;
      //this.$router.push("/");
    }
  }
};
</script>
<style scoped lang="scss">
.login-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  background: $primary-color;
  display: flex;
  .login-container {
    margin: auto;
    background: white;
    width: 450px;
    position: relative;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    .login-form {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
      height: 250px;
      padding: 40px;
      input {
        background: #f2f2f2;
        border: 0;
        padding: 15px;
        font-size: 14px;
        outline: 0;
        color: black;
        margin-bottom: 10px;
      }
      .login-btn {
        text-transform: uppercase;
        background: $dark-blue-color;
        border: 0;
        padding: 15px;
        color: #ffffff;
        font-size: 14px;
        outline: 0;
        cursor: pointer;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
    }
    .login-label {
      background: $dark-blue-color;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
    }
    .message {
      color: red;
      display: flex;
      justify-content: flex-start;
      font-size: 16px;
      position: absolute;
      bottom: 15px;
      left: 95px;
    }
  }
}
</style>

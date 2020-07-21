<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-label">{{ $t("login.login-form") }}</div>
      <Form class="login-form" :form="form" @submit="handleSubmit">
        <Item>
          <Input
            :placeholder="$t('login.username')"
            v-decorator="[
              'username',
              {
                rules: [
                  { required: true, message: $t('login.missing-username') }
                ]
              }
            ]"
          >
            <Icon slot="prefix" type="user" class="icon" />
          </Input>
        </Item>
        <Item>
          <Input
            type="password"
            :placeholder="$t('login.pass')"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: $t('login.missing-password') }
                ]
              }
            ]"
          >
            <Icon slot="prefix" type="lock" class="icon" />
          </Input>
        </Item>
        <Item>
          <Button
            @click="handleSubmit"
            class="login-btn"
            type="primary"
            html-type="submit"
            >{{ $t("login.login") }}</Button
          >
        </Item>
      </Form>
    </div>
    <Loading :isSpin="true" v-if="isLoading" />
  </div>
</template>
<script>
import { Button, Form, Icon, Input, message } from "ant-design-vue";

import { request } from "../api";
import { END_POINT, JWT, UNAUTHORIZED_CODE } from "../config";
import { LOGIN_ACTION } from '../store'
import Loading from "./Loading";

const { Item } = Form;

export default {
  name: "LoginPage",
  components: {
    Button,
    Form,
    Icon,
    Input,
    Item,
    Loading
  },
  beforeMount() {
    this.form = this.$form.createForm(this, { name: "login" });
  },
  data: () => {
    return {
      isLoading: false,
      form: {},
      message
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const { username, password } = values;
          this.isLoading = true;
          request(`${END_POINT}/signin`, {
            method: "POST",
            body: JSON.stringify({
              username,
              password
            })
          })
            .then(data => {
              localStorage.setItem(JWT, data.token);
              this.$store.commit(LOGIN_ACTION, data)
              this.isLoading = false;
              this.$router.push("/");
            })
            .catch(e => {
              this.isLoading = false;
              this.$store.commit(LOGIN_ACTION, {})
              if (e.response && e.response.status === UNAUTHORIZED_CODE) {
                // unauthorized
                this.message.error(this.$t("login.wrong-user-pass"));
              } else {
                this.message.error(e.message);
              }
            });
        }
      });
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

    .icon {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>

<template>
  <div class="login-wrapper">
    <Modal v-model="redirectModal">
      <div class="modal-wrapper">
        <div class="label">{{ $t("reset.changed-success") }}</div>
      </div>
    </Modal>
    <div class="login-container">
      <div class="login-label">{{ $t("login.reset") }}</div>
      <div class="welcome-label">
        {{ $t("reset.hello") }} {{ this.username }},<br />
        {{ $t("reset.content-description") }}
      </div>
      <Form class="login-form" :form="form" @submit="handleSubmit">
        <Item class="form-item">
          <Input
            :placeholder="$t('login.pass')"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    min: 6,
                    message: $t('admin.missing-pass')
                  },
                  {
                    validator: validateToNextPassword
                  }
                ]
              }
            ]"
          >
            <Icon slot="prefix" type="lock" class="icon" />
          </Input>
        </Item>
        <Item class="form-item">
          <Input
            :placeholder="$t('admin.pass-confirm')"
            type="password"
            v-decorator="[
              'passwordConfirm',
              {
                rules: [
                  {
                    required: true,
                    min: 6,
                    message: $t('admin.missing-confirm-pass')
                  },
                  {
                    validator: compareToFirstPassword
                  }
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
            >{{ $t("login.apply") }}</Button
          >
        </Item>
      </Form>
    </div>
    <Loading :isSpin="true" v-if="isLoading" />
  </div>
</template>
<script>
import { Button, Form, Icon, Input, message, Modal } from "ant-design-vue";
import { request } from "../api";
import { END_POINT } from "../config";
import Loading from "./Loading";

const { Item } = Form;
const { success } = Modal;

export default {
  name: "LoginPage",
  components: {
    Button,
    Form,
    Icon,
    Input,
    Item,
    Loading,
    Modal
  },
  beforeMount() {
    this.form = this.$form.createForm(this, { name: "login" });
    this.username = this.$route.query.username;
    this.key = this.$route.query.key;
    if(!this.username || !this.key){
      this.redirectToLoginPage();
    }
  },
  data: () => {
    return {
      isLoading: false,
      form: {},
      message,
      success,
      redirectModal: false,
      forgetEmailModel: "",
      username: "",
      key: ""
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const { password, passwordConfirm } = values;
          const bodyObj = {
            newPassword: password,
            confirmNewPassword: passwordConfirm,
            username: this.username,
            key: this.key
          };
          this.isLoading = true;
          request(`${END_POINT}/api/reset-password/`, {
            method: "PATCH",
            body: JSON.stringify(bodyObj)
          })
            .then(() => {
              this.isLoading = false;
              this.success({
                title: "Changed password",
                content: "Your password has been changed successfully!",
                onOk: this.redirectToLoginPage,
                onCancel: this.redirectToLoginPage
              });
            })
            .catch(e => {
              this.isLoading = false;
              console.log(e);
              this.message.error(e.message);
            });
        }
      });
    },

    redirectToLoginPage() {
      this.$router.push("/");
    },

    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },

    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    }
  }
};
</script>
<style scoped lang="scss">
.description {
  margin-top: 20px;
}

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

    .welcome-label {
      font-size: 15px;
      padding: 0 40px;
      padding-top: 20px;
      font-weight: bold;
      color: black;

      @media screen and (max-width: $phone-width) {
        font-size: 13px;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
      height: 230px;
      padding: 25px 40px;
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

  .forget-pass-btn {
    color: #40a9ff;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }
}
</style>

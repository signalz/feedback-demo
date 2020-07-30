<template>
  <div class="bar-menu-wrapper">
    <Modal v-model="visibleProfileModal" @ok="onConfirmChangePass">
      <Form class="detail-form" :form="formChangePass">
        <Item class="form-item form-full-width">
          <div class="label-form">{{$t('admin.pass-old')}}</div>
          <Input
            :placeholder="$t('admin.pass-old')"
            type="password"
            v-decorator="[
              'passwordOld',
              {
                rules: [
                  {
                    required: true,
                    min: 6,
                    message: $t('admin.missing-old-pass')
                  }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">{{$t('login.pass')}}</div>
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
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">{{$t('admin.pass-confirm')}}</div>
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
          ></Input>
        </Item>
      </Form>
    </Modal>

    <MobileMenuButton
      class="bar-menu-button"
      :isClicked="isOpen"
      @click.native="onMobileMenuClick"
    />
    <div class="bar-menu-information">
      <div class="bar-menu-project">
        <div class="bar-menu-project-label">{{ $t("menu.bar.project-label") }}</div>
        <div class="bar-menu-project-name">{{ project || $t("menu.bar.no-project") }}</div>
      </div>
      <div class="bar-menu-event">
        <div>
          <Dropdown :trigger="['click']" placement="bottomRight">
            <a class="bar-menu-profile-action" @click="e => e.preventDefault()">
              {{this.$store.state.user.firstName}} {{this.$store.state.user.lastName}}
              <Icon type="down" />
            </a>
            <Menu slot="overlay">
              <MenuItem key="0">
                <a @click="onClickChangePass">Change Password</a>
              </MenuItem>
              <MenuItem key="1">
                <a @click="onClickLogout">{{$t("login.logout")}}</a>
              </MenuItem>
            </Menu>
          </Dropdown>
        </div>
        <Button v-if="false" class="logout-btn" @click="onClickLogout">{{$t("login.logout")}}</Button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Button,
  Dropdown,
  Menu,
  Icon,
  message,
  Modal,
  Input,
  Form
} from "ant-design-vue";
import { JWT, END_POINT } from "../config";
import { LOGIN_ACTION } from "../store";
import { request } from "../api";
import { handleError } from "../utils";
import MobileMenuButton from "./MobileMenuButton";
const { Item: MenuItem } = Menu;
const { Item } = Form;

export default {
  name: "BarMenu",
  components: {
    MobileMenuButton,
    Button,
    Dropdown,
    Menu,
    Item,
    MenuItem,
    Icon,
    Modal,
    Input,
    Form
  },

  data: () => {
    return {
      visibleProfileModal: false,
      formChangePass: {},
      message
    };
  },

  props: {
    isOpen: Boolean,
    event: String,
    project: String
  },

  mounted() {
    this.formChangePass = this.$form.createForm(this, { name: "changePass" });
  },

  methods: {
    onConfirmChangePass(e) {
      e.preventDefault();
      this.formChangePass.validateFields((err, values) => {
        const {
          passwordOld: password,
          password: newPassword,
          passwordConfirm: confirmNewPassword
        } = values;
        const obj = {
          password,
          newPassword,
          confirmNewPassword
        };
        if (!err) {
          request(`${END_POINT}/api/users/password`, {
            method: "POST",
            body: JSON.stringify(obj)
          })
            .then(() => {
              this.visibleProfileModal = false;
              this.message.info("Change password successful!");
            })
            .catch(e => {
              if (e.response.status === 409) {
                this.message.error("Incorrect password!");
                this.formChangePass.setFieldsValue({
                  passwordOld: ""
                });
                this.formChangePass.validateFields(["passwordOld"], () => {});
              } else {
                this.visibleProfileModal = false;
                handleError(e, this.$router, this.$t("expired"));
              }
            });
        }
      });
    },

    onMobileMenuClick() {
      this.$emit("open", { isOpen: !this.isOpen });
    },

    onClickChangePass() {
      this.formChangePass.resetFields();
      this.visibleProfileModal = true;
    },

    onClickLogout() {
      localStorage.removeItem(JWT);
      this.$store.commit(LOGIN_ACTION, {});
      this.$router.push("/login");
    },

    compareToFirstPassword(rule, value, callback) {
      const form = this.formChangePass;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },

    validateToNextPassword(rule, value, callback) {
      const form = this.formChangePass;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    }
  }
};
</script>
<style scoped lang="scss">
.bar-menu-wrapper {
  height: $header-height;
  position: fixed;
  width: 100%;
  background-color: $primary-color;
  display: flex;
  align-items: center;
  padding: 0 20px 0 20px;
  font-size: 19px;
  z-index: 99;
  min-width: $min-width;

  .bar-menu-information {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    overflow-y: auto;
    overflow-x: hidden;

    .bar-menu-project {
      display: flex;

      .bar-menu-project-label {
        margin-right: 5px;
      }

      .bar-menu-project-name {
        word-break: break-all;
      }
    }

    .bar-menu-event {
      display: flex;

      .bar-menu-profile-action {
        color: white;
      }

      .bar-menu-event-container {
        display: flex;
      }

      .bar-menu-event-label {
        margin-right: 5px;
      }

      .bar-menu-event-name {
        word-break: break-all;
      }

      .logout-btn {
        margin: 0 10px;
        background: #16619c;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  }

  @media screen and (max-width: $desktop-width) {
    .bar-menu-information {
      font-size: 17px;
      justify-content: flex-end;
    }

    .bar-menu-project {
      display: none !important;
    }

    .bar-menu-event-label {
      display: none;
    }

    .bar-menu-event-name {
      display: none;
    }
  }

  @media screen and (max-width: $extra-small-phone-width) {
    .bar-menu-information {
      font-size: 15px;
    }
  }

  @media screen and (min-width: $desktop-width) {
    .bar-menu-button {
      display: none;
    }
  }
}
</style>

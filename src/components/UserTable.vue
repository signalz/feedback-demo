<template>
  <div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <Modal
      @ok="onConfirmDelete"
      v-model="deleteModalVisible"
    >{{$t('admin.confirm-delete')}} {{ selectedUser }}?</Modal>
    <Modal @ok="onConfirmChangePass" v-model="changePassModalVisible">
      <div class="change-modal-label">{{$t('admin.change-pass-for')}} {{ selectedUser }}</div>
      <Form class="detail-form" :form="formChangePass" @submit="onConfirmChangePass">
        <Item v-if="false" class="form-item form-full-width">
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
    <Modal @ok="onConfirmDetail" v-model="detailModalVisible">
      <div class="form-header">{{ typeDetailModal }}</div>
      <Form class="detail-form" :form="form" @submit="onConfirmDetail">
        <Item class="form-item form-full-width">
          <div class="label-form">{{ $t("admin.email") }}</div>
          <Input
            :placeholder="$t('admin.email')"
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: $t('admin.missing-email') }]
              }
            ]"
          ></Input>
        </Item>
        <Item v-if="false" class="form-item">
          <div class="label-form">{{ $t("admin.phone") }}</div>
          <Input
            :placeholder="$t('admin.phone')"
            v-decorator="[
              'email',
              {
                rules: [
                  { required: true, message: 'Please input your phone number!' }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item v-if="typeDetailModal == 'Add'" class="form-item">
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
        <Item v-if="typeDetailModal == 'Add'" class="form-item">
          <div class="label-form">{{$t('admin.pass-confirm')}}</div>
          <Input
            :placeholder="$t('admin.pass-confirm')"
            type="password"
            v-decorator="[
              'passwordConfirm',
              {
                rules: [
                  {
                    required: true, message: $t('admin.missing-confirm-pass')
                  },
                  {
                    validator: compareToFirstPassword
                  }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">{{$t('admin.first-name')}}</div>
          <Input
            :placeholder="$t('admin.first-name')"
            v-decorator="[
              'firstName',
              {
                rules: [
                  { required: true, message: $t('admin.missing-first-name') }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">{{$t('admin.last-name')}}</div>
          <Input
            :placeholder="$t('admin.last-name')"
            v-decorator="[
              'lastName',
              {
                rules: [
                  { required: true, message: $t('admin.missing-last-name') }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item radio-wrapper form-full-width">
          <Group v-model="roleModel" button-style="solid">
            <div class="radio-title">{{$t('admin.roles')}}:</div>
            <RadioButton value="USER">{{$t('admin.user')}}</RadioButton>
            <RadioButton value="ADMIN">{{$t('admin.admin')}}</RadioButton>
            <RadioButton value="SUPERVISOR">{{$t('admin.supervisor')}}</RadioButton>
          </Group>
        </Item>
      </Form>
    </Modal>
    <Button @click="onClickAdd" class="add-btn" type="primary">{{$t('admin.add-user')}}</Button>
    <Table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="users"
      class="table-wrapper"
    >
      <a slot="username" slot-scope="text">{{ text }}</a>
      <span slot="roles" slot-scope="roles">
        <Tag v-for="role in roles" :key="role" :color="handleColor(role)">
          {{
          role.toUpperCase()
          }}
        </Tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a
          v-if="record.roles.length == 1"
          @click="onClickChangePass(record)"
        >{{$t('admin.change-password')}}</a>
        <Divider v-if="record.roles.length == 1" type="vertical" />
        <a v-if="record.roles.length == 1" @click="onClickEdit(record)">{{$t('admin.edit')}}</a>
        <!-- <Divider v-if="record.roles.length == 1" type="vertical" /> -->
        <!-- <a v-if="record.roles.length == 1" @click="onClickDelete(record)"
          >Delete</a
        >-->
      </span>
    </Table>
  </div>
</template>
<script>
import {
  Table,
  Form,
  Tag,
  Divider,
  Modal,
  Radio,
  message,
  Input
} from "ant-design-vue";
import Loading from "./Loading";
import { request } from "../api";
import { END_POINT, ROLE_ADMIN, ROLE_SUPERADMIN, ROLE_SUPERVISOR } from "../config";
import { handleError } from "../utils";
const { Button: RadioButton, Group } = Radio;
const { Item } = Form;
export default {
  components: {
    Table,
    Modal,
    Loading,
    Tag,
    Divider,
    Form,
    Item,
    Group,
    RadioButton,
    Input
  },
  computed: {
    columns() {
      return [
        {
          dataIndex: "username",
          key: "username",
          title: this.$t("admin.email"),
          scopedSlots: { customRender: "username" },
          defaultSortOrder: "ascend",
          sorter: (a, b) => {
            return a.username.localeCompare(b.username);
          }
        },
        {
          title: this.$t("admin.first-name"),
          dataIndex: "firstName",
          key: "firstName",
          sorter: (a, b) => {
            return a.firstName.localeCompare(b.firstName);
          }
        },
        {
          title: this.$t("admin.last-name"),
          dataIndex: "lastName",
          key: "lastName",
          sorter: (a, b) => {
            return a.lastName.localeCompare(b.lastName);
          }
        },
        {
          title: this.$t("admin.roles"),
          key: "roles",
          dataIndex: "roles",
          scopedSlots: { customRender: "roles" },
          sorter: (a, b) => {
            return a.roles[0].localeCompare(b.roles[0]);
          }
        },
        {
          title: this.$t("admin.actions"),
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ];
    }
  },
  data() {
    return {
      isLoading: true,
      deleteModalVisible: false,
      changePassModalVisible: false,
      detailModalVisible: false,
      typeDetailModal: "",
      selectedUser: "",
      selectedID: "",
      roleModel: "USER",
      form: {},
      formChangePass: {},
      users: [],
      message
    };
  },
  mounted() {
    this.form = this.$form.createForm(this, { name: "detail" });
    this.formChangePass = this.$form.createForm(this, { name: "changePass" });
    Promise.all([
      request(`${END_POINT}/api/users`, {
        method: "GET"
      })
    ])
      .then(([users]) => {
        if (users && users.length > 0) {
          this.users = users;
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        handleError(e, this.$router, this.$t("expired"));
      });
  },
  methods: {
    handleColor(role) {
      if (role === ROLE_ADMIN || role === ROLE_SUPERADMIN) {
        return "green";
      }
      if (role === ROLE_SUPERVISOR) {
        return "pink";
      } else {
        return "geekblue";
      }
    },

    _reloadForm() {
      this.isLoading = true;
      request(`${END_POINT}/api/users`, {
        method: "GET"
      })
        .then(resultGetAllUser => {
          this.isLoading = false;
          this.users = resultGetAllUser;
        })
        .catch(e => {
          handleError(e, this.$router, this.$t("expired"));
        });
    },

    compareToFirstPassword(rule, value, callback) {
      let form = {};
      if (this.changePassModalVisible) {
        form = this.formChangePass;
      } else {
        form = this.form;
      }
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },

    validateToNextPassword(rule, value, callback) {
      let form = {};
      if (this.changePassModalVisible) {
        form = this.formChangePass;
      } else {
        form = this.form;
      }
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },

    onClickChangePass(record) {
      this.formChangePass.resetFields();
      this.selectedID = record.id;
      this.selectedUser = record.username;
      this.changePassModalVisible = true;
    },

    onConfirmChangePass(e) {
      e.preventDefault();
      this.formChangePass.validateFields((err, values) => {
        const {
          //passwordOld: password,
          password: newPassword,
          passwordConfirm: confirmNewPassword
        } = values;
        const obj = {
          //password,
          newPassword,
          confirmNewPassword
        };
        if (!err) {
          request(`${END_POINT}/api/users/` + this.selectedID, {
            method: "PUT",
            body: JSON.stringify(obj)
          })
            .then(() => {
              this.changePassModalVisible = false;
              this.message.info("Change password successful!");
            })
            .catch(e => {
              this.changePassModalVisible = false;
              handleError(e, this.$router, this.$t("expired"));
            });
        }
      });
    },

    onClickEdit(record) {
      this.typeDetailModal = "Edit";
      this.selectedID = record.id;
      this.roleModel = record.roles[0];
      this.form.getFieldDecorator("username", { initialValue: "" });
      this.form.getFieldDecorator("firstName", { initialValue: "" });
      this.form.getFieldDecorator("lastName", { initialValue: "" });
      this.form.setFieldsValue({
        username: record.username,
        firstName: record.firstName,
        lastName: record.lastName
      });
      this.detailModalVisible = true;
    },

    onClickDelete(record) {
      this.selectedUser = record.username;
      this.selectedID = record.id;
      this.deleteModalVisible = true;
    },

    onConfirmDelete() {
      request(`${END_POINT}/api/users/` + this.selectedID, {
        method: "DELETE"
      })
        .then(() => {
          this.deleteModalVisible = false;
          this._reloadForm();
          this.message.info("Delete user successful!");
        })
        .catch(e => {
          this.deleteModalVisible = false;
          handleError(e, this.$router, this.$t("expired"));
        });
    },

    onClickAdd() {
      this.typeDetailModal = "Add";
      this.form.resetFields();
      this.roleModel = "USER";
      this.detailModalVisible = true;
    },

    onConfirmDetail(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        const { username, firstName, lastName, password } = values;
        const obj = {
          username,
          //email,
          firstName,
          lastName,
          password,
          roles: [this.roleModel]
        };
        if (!err) {
          if (this.typeDetailModal == "Add") {
            request(`${END_POINT}/api/users`, {
              method: "POST",
              body: JSON.stringify(obj)
            })
              .then(() => {
                this.detailModalVisible = false;
                this._reloadForm();
                this.message.info("Add new user successful!");
              })
              .catch(e => {
                this.detailModalVisible = false;
                handleError(e, this.$router, this.$t("expired"));
              });
          } else {
            delete obj.password;
            request(`${END_POINT}/api/users/` + this.selectedID, {
              method: "PATCH",
              body: JSON.stringify(obj)
            })
              .then(() => {
                this.detailModalVisible = false;
                this._reloadForm();
                this.message.info("Edit user successful!");
              })
              .catch(e => {
                this.detailModalVisible = false;
                handleError(e, this.$router, this.$t("expired"));
              });
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
::placeholder {
  color: #bfbfbf;
}

.table-wrapper {
  margin: 30px 0;
}

.add-btn {
  background: #52c41a;
  border: 1px solid #52c41a;
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
}

.form-header {
  font-size: 20px;
  font-weight: bold;
  text-align: start;
  text-transform: uppercase;
}

.change-modal-label {
  font-size: 17px;
  font-weight: bold;
}

.detail-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .form-item {
    width: 45%;

    input {
      line-height: 35px;
      outline: none;
      border-radius: 5px;
      border: 1px solid #d9d9d9;
      padding: 0 10px;
    }
  }

  .form-full-width {
    width: 100% !important;
  }

  .radio-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    .radio-title {
      line-height: 40px;
    }
  }
}
</style>

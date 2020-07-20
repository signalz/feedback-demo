<template>
  <div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <Modal @ok="onConfirmDelete" v-model="deleteModalVisible"
      >Are you sure to delete {{ selectedUser }}?</Modal
    >
    <Modal @ok="onConfirmChangePass" v-model="changePassModalVisible">
      <div class="change-modal-label">
        Change password for {{ selectedUser }}
      </div>
      <Form
        class="detail-form"
        :form="formChangePass"
        @submit="onConfirmChangePass"
      >
        <Item v-if="false" class="form-item form-full-width">
          <div class="label-form">Old Password</div>
          <Input
            :placeholder="$t('admin.pass-old')"
            type="password"
            v-decorator="[
              'passwordOld',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input your old password!'
                  }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">Password</div>
          <Input
            :placeholder="$t('login.pass')"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!'
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
          <div class="label-form">Confirm Password</div>
          <Input
            :placeholder="$t('admin.pass-confirm')"
            type="password"
            v-decorator="[
              'passwordConfirm',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input your confirm password!'
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
                rules: [{ required: true, message: 'Please input your email!' }]
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
          <div class="label-form">Password</div>
          <Input
            :placeholder="$t('login.pass')"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!'
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
          <div class="label-form">Confirm Password</div>
          <Input
            :placeholder="$t('admin.pass-confirm')"
            type="password"
            v-decorator="[
              'passwordConfirm',
              {
                rules: [
                  {
                    required: true, message: 'Please input your confirm password!'
                  },
                  {
                    required: true,
                    message: 'Please input your confirm password!'
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
          <div class="label-form">First Name</div>
          <Input
            :placeholder="$t('admin.first-name')"
            v-decorator="[
              'firstName',
              {
                rules: [
                  { required: true, message: 'Please input your first name!' }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">Last Name</div>
          <Input
            :placeholder="$t('admin.last-name')"
            v-decorator="[
              'lastName',
              {
                rules: [
                  { required: true, message: 'Please input your last name!' }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item radio-wrapper">
          <Group v-model="roleModel" button-style="solid">
            <div class="radio-title">Role:</div>
            <radioButton value="USER">User</radioButton>
            <radioButton value="ADMIN">Admin</radioButton>
          </Group>
        </Item>
      </Form>
    </Modal>
    <Button @click="onClickAdd" class="add-btn" type="primary">Add user</Button>
    <Table
      :columns="columns"
      :row-key="record => record.id"
      :data-source="users"
      class="table-wrapper"
    >
      <a slot="username" slot-scope="text">{{ text }}</a>
      <span slot="roles" slot-scope="roles">
        <Tag v-for="role in roles" :key="role" :color="handleColor(role)">{{
          role.toUpperCase()
        }}</Tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="record.roles.length == 1" @click="onClickChangePass(record)"
          >Change Password</a
        >
        <Divider v-if="record.roles.length == 1" type="vertical" />
        <a v-if="record.roles.length == 1" @click="onClickEdit(record)">Edit</a>
        <!-- <Divider v-if="record.roles.length == 1" type="vertical" /> -->
        <!-- <a v-if="record.roles.length == 1" @click="onClickDelete(record)"
          >Delete</a
        > -->
      </span>
    </Table>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "username",
    key: "username",
    title: "Email",
    scopedSlots: { customRender: "username" },
    defaultSortOrder: "ascend",
    sorter: (a, b) => {
      return a.username.localeCompare(b.username);
    }
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => {
      return a.firstName.localeCompare(b.firstName);
    }
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => {
      return a.lastName.localeCompare(b.lastName);
    }
  },
  {
    title: "Roles",
    key: "roles",
    dataIndex: "roles",
    scopedSlots: { customRender: "roles" },
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

import {
  Table,
  Form,
  Tag,
  Divider,
  Modal,
  Radio,
  message
} from "ant-design-vue";
import Loading from "./Loading";
import { request } from "../api";
import { END_POINT } from "../config";
import Vue from "vue";
import { handleError } from "../utils";

const { Button: radioButton, Group } = Radio;
const { Item } = Form;
Vue.use(Modal);
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
    radioButton
  },
  data() {
    return {
      columns,
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
    this.formChangePass.getFieldDecorator("password", {
      initialValue: ""
    });
    this.formChangePass.getFieldDecorator("passwordConfirm", {
      initialValue: ""
    });
    this.formChangePass.getFieldDecorator("passwordOld", {
      initialValue: ""
    });
    this.form.getFieldDecorator("username", {
      initialValue: ""
    });
    this.form.getFieldDecorator("password", {
      initialValue: ""
    });
    this.form.getFieldDecorator("firstName", {
      initialValue: ""
    });
    this.form.getFieldDecorator("lastName", {
      initialValue: ""
    });
    this.form.getFieldDecorator("email", {
      initialValue: ""
    });
    this.form.getFieldDecorator("passwordConfirm", {
      initialValue: ""
    });
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
      if (role.includes("ADMIN")) {
        return "green";
      } else {
        return "geekblue";
      }
    },

    _reloadForm() {
      this.isLoading = true;
      request(`${END_POINT}/api/users`, {
        method: "GET"
      }).then(resultGetAllUser => {
        this.isLoading = false;
        this.users = resultGetAllUser;
      }).catch(e => {
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
      this.selectedID = record.id;
      this.selectedUser = record.username;
      this.formChangePass.setFieldsValue({
        password: "",
        passwordOld: "",
        passwordConfirm: ""
      });
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
            .catch((e) => {
              this.changePassModalVisible = false;
              handleError(e, this.$router, this.$t("expired"));
            });
        }
      });
    },

    onClickEdit(record) {
      this.typeDetailModal = "Edit";
      this.selectedID = record.id;
      this.form.setFieldsValue({
        username: record.username,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email
      });
      this.roleModel = record.roles[0];
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
        .catch((e) => {
          this.deleteModalVisible = false;
          handleError(e, this.$router, this.$t("expired"));
        });
    },

    onClickAdd() {
      this.typeDetailModal = "Add";
      this.form.getFieldDecorator("password", {
        initialValue: ""
      });
      this.form.getFieldDecorator("passwordConfirm", {
        initialValue: ""
      });
      this.form.setFieldsValue({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        passwordConfirm: ""
      });
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
              .catch((e) => {
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
              .catch((e) => {
                this.detailModalVisible = false;
                handleError(e, this.$router, this.$t("expired"));
              });
          }
        } else {
          //console.log("loi");
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

  .form-item {
    width: 50%;

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

<template>
  <div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <Modal
      @ok="onConfirmDelete"
      v-model="deleteModalVisible"
    >Are you sure to delete {{selectedUser}}?</Modal>
    <Modal @ok="onConfirmChangePass" v-model="changePassModalVisible">
      <div class="change-modal-label">Change password for {{selectedUser}}</div>
      <Form class="detail-form" :form="formChangePass" @submit="onConfirmChangePass">
        <Item class="form-item form-full-width">
          <div class="label-form">Old Password</div>
          <Input
            :placeholder="$t('admin.pass-old')"
            type="password"
            v-decorator="[
              'passwordOld',
              {
                rules: [
                  { 
                    required: true, message: 'Please input your old password!' 
                  },
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
                    required: true, message: 'Please input your password!' 
                  },
                  {
                    validator: validateToNextPassword,
                  },
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
                    required: true, message: 'Please input your confirm password!' 
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ]
              }
            ]"
          ></Input>
        </Item>
      </Form>
    </Modal>
    <Modal @ok="onConfirmDetail" v-model="detailModalVisible">
      <div class="form-header">{{typeDetailModal}}</div>
      <Form class="detail-form" :form="form" @submit="onConfirmDetail">
        <Item class="form-item">
          <div class="label-form">Project Name</div>
          <Input
            placeholder="Project Name"
            v-decorator="[
              'projectName',
              {
                rules: [
                  { required: true, message: 'Please input your project name!' }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item class="form-item">
          <div class="label-form">Manager</div>
          manager typeahead single choice
        </Item>
        <Item class="form-item">
          <div class="label-form">Survey</div>
          survey dropdown list
        </Item>
        <Item class="form-item">
          <div class="label-form">Associate</div>
          Associate multy choice
        </Item>
      </Form>
    </Modal>
    <Button @click="onClickAdd" class="add-btn" type="primary">Add Project</Button>
    <Table
      :columns="columns"
      :row-key="record => record.key"
      :data-source="mockData"
      class="table-wrapper"
    >
      <a slot="projectName" slot-scope="text">{{ text }}</a>
      <span slot="associate" slot-scope="associate">
        <Tag v-for="user in associate" :key="user" :color="handleColor(user)">{{ user.toUpperCase() }}</Tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="onClickChangePass(record)">Change Password</a>
        <Divider type="vertical" />
        <a @click="onClickEdit(record)">Edit</a>
        <Divider type="vertical" />
        <a @click="onClickDelete(record)">Delete</a>
      </span>
    </Table>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "projectName",
    key: "projectName",
    title: "Project Name",
    scopedSlots: { customRender: "projectName" }
  },
  {
    title: "Manager",
    dataIndex: "manager",
    key: "manager"
  },
  {
    title: "Survey",
    dataIndex: "survey",
    key: "survey"
  },
  {
    title: "Associate",
    key: "associate",
    dataIndex: "associate",
    scopedSlots: { customRender: "associate" }
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

import { Table, Form, Tag, Divider, Modal, Radio } from "ant-design-vue";
import Loading from "./Loading";
import { request } from "../api";
import { END_POINT } from "../config";
import Vue from "vue";
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
      mockData: [{
          key: "1",
          projectName: "Du an 1",
          manager: "Son Nguyen Ngoc",
          survey: "Foundation Survey",
          associate: [
              "Thanh Nguyen Khac",
              "Son Nguyen Ngoc",
              "Quang Nguyen Phan"
              ]
      }],
      users: []
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
          console.log(users);
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
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
          request(`${END_POINT}/api/users/` + this.selectedID, {
            method: "PUT",
            body: JSON.stringify(obj)
          })
            .then(() => {
              console.log("da sua pass");
            })
            .catch(e => {
              console.log("sua pass fail");
              console.log(e);
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
      this.deleteModalVisible = false;
      request(`${END_POINT}/api/users/` + this.selectedID, {
        method: "DELETE"
      }).then(() => {
        this._reloadForm();
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
        const { username, email, firstName, lastName, password } = values;
        const obj = {
          username,
          email,
          firstName,
          lastName,
          password,
          roles: [this.roleModel]
        };
        if (!err) {
          if (this.typeDetailModal == "Add") {
            console.log("add");
            request(`${END_POINT}/api/users`, {
              method: "POST",
              body: JSON.stringify(obj)
            })
              .then(() => {
                this.detailModalVisible = false;
                this._reloadForm();
                console.log("add thanh cong");
              })
              .catch(e => {
                this.detailModalVisible = false;
                console.log("add fail");
                console.log(e);
              });
          } else {
            console.log("edit");
            delete obj.password;
            request(`${END_POINT}/api/users/` + this.selectedID, {
              method: "PATCH",
              body: JSON.stringify(obj)
            })
              .then(() => {
                this.detailModalVisible = false;
                this._reloadForm();
                console.log("edit thanh cong");
              })
              .catch(e => {
                this.detailModalVisible = false;
                console.log("edit fail");
                console.log(e);
              });
          }
        } else {
          console.log("loi");
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
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
    width: 100%;

    input {
      line-height: 35px;
      outline: none;
      border: 1px solid black;
      border-radius: 3px;
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

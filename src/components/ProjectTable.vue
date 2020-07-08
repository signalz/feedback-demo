<template>
  <div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <Modal
      @ok="onConfirmDelete"
      v-model="deleteModalVisible"
    >Are you sure to delete {{selectedUser}}?</Modal>
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
          <div class="label-form">
            Manager:
            <Tag
              v-if="managerSelected.name != ''"
              :color="handleColor(managerSelected.name)"
              closable
              @close="clearSelectedManager"
            >{{ managerSelected.name }}</Tag>
          </div>
          <AutoComplete
            @search="handleSearchManager"
            @select="handleSelectManager"
            placeholder="Seach manager"
            :dataSource="resultManager"
            v-model="managerSearchModel"
          />
        </Item>
        <Item class="form-item">
          <div class="label-form">Survey</div>survey dropdown list
        </Item>
        <Item class="form-item">
          <div class="label-form">
            Associate:
            <div v-if="associateSelected.length > 0">
              <Tag
                v-for="user in associateSelected"
                :key="user.value"
                :color="handleColor(user.name)"
                closable
                @close="popTag(user.value, associateSelected)"
              >{{ user.name }}</Tag>
            </div>
          </div>
          <AutoComplete
            @search="handleSearchAssociate"
            @select="handleSelectAssociate"
            placeholder="Seach associate"
            :dataSource="resultAssociate"
            v-model="associateSearchModel"
          />
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
        <Tag
          v-for="user in associate"
          :key="user"
          :color="handleColor(user)"
        >{{ user.toUpperCase() }}</Tag>
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

import { Table, Form, Tag, Divider, Modal, AutoComplete } from "ant-design-vue";
import Loading from "./Loading";
import { request } from "../api";
import { END_POINT } from "../config";
import Vue from "vue";
const { Item } = Form;
Vue.use(Modal);
export default {
  components: {
    Table,
    AutoComplete,
    Modal,
    Loading,
    Tag,
    Divider,
    Form,
    Item
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
      mockData: [
        {
          key: "1",
          projectName: "Du an 1",
          manager: "Son Nguyen Ngoc",
          survey: "Foundation Survey",
          associate: [
            "Thanh Nguyen Khac",
            "Son Nguyen Ngoc",
            "Quang Nguyen Phan"
          ]
        }
      ],
      projects: [],
      users: [],
      resultManager: [],
      resultAssociate: [],
      managerSelected: {
        value: "",
        name: ""
      },
      associateSelected: [],
      associateSearchModel: "",
      managerSearchModel: ""
    };
  },
  mounted() {
    this.form = this.$form.createForm(this, { name: "detail" });
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
      request(`${END_POINT}/api/projects`, {
        method: "GET"
      }),
      request(`${END_POINT}/api/users`, {
        method: "GET"
      })
    ])
      .then(([projects, users]) => {
        if (projects && projects.length > 0) {
          this.projects = projects;
          console.log(projects);
        }
        if (users && users.length > 0) {
          users.map(function(value) {
            value.name = value.firstName + " " + value.lastName;
          });
          this.users = users;
          this.handleSearchManager();
          this.handleSearchAssociate();
          console.log(this.users);
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  methods: {
    handleColor(text) {
      if (text.includes("ADMIN")) {
        return "green";
      } else {
        return "geekblue";
      }
    },

    _reloadForm() {
      this.isLoading = true;
      request(`${END_POINT}/api/projects`, {
        method: "GET"
      }).then(projects => {
        this.isLoading = false;
        this.projects = projects;
      });
    },

    popTag(id, array) {
      array.splice(array.indexOf(id), 1);
      if(array.length == 0){
          this.handleSearchAssociate();
      }
    },

    clearSelectedManager() {
      this.managerSelected = {
        value: "",
        name: ""
      };
      this.handleSearchManager();
    },

    handleSearchManager(value) {
      let result = [];
      if (!value) {
        this.users.map(record => {
          result.push({
            value: record.id,
            text: record.name
          });
        });
      } else {
        this.users.map(record => {
          if (record.name.includes(value)) {
            result.push({
              value: record.id,
              text: record.name
            });
          }
        });
      }
      if (result.length > 5) {
        result.splice(5, result.length - 5);
      }
      this.resultManager = result;
    },

    handleSearchAssociate(value) {
      let result = [];
      if (!value) {
        this.users.map(record => {
          result.push({
            value: record.id,
            text: record.name
          });
        });
      } else {
        this.users.map(record => {
          if (record.name.includes(value)) {
            result.push({
              value: record.id,
              text: record.name
            });
          }
        });
      }
      if (result.length > 5) {
        result.splice(5, result.length - 5);
      }
      this.resultAssociate = result;
    },

    handleSelectAssociate(value) {
      const selectedObj = this.users.filter(e => {
        return e.id == value;
      });
      let existAssociate = false;
      this.associateSelected.filter(e => {
        if (e.value == value) {
          existAssociate = true;
        }
      });
      if (!existAssociate) {
        this.associateSelected.push({
          value: selectedObj[0].id,
          name: selectedObj[0].name
        });
      }
      this.associateSearchModel = "";
      this.resultAssociate = [];
    },

    handleSelectManager(value) {
      const selectedObj = this.users.filter(e => {
        return e.id == value;
      });
      this.managerSelected.value = selectedObj[0].id;
      this.managerSelected.name = selectedObj[0].name;
      this.managerSearchModel = "";
      this.resultManager = [];
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

.ant-tag {
  margin: 3px;
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

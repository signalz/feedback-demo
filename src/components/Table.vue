<template>
  <div>
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <Modal @ok="onConfirmDelete" v-model="deleteModalVisible">Delete user {{selectedUser}}</Modal>
    <Modal @ok="onConfirmDetail" v-model="detailModalVisible">
      <div>{{typeDetailModal}}</div>
      <Form class="detail-form" :form="form" @submit="onConfirmDetail">
        <Item>
          <div class="label-form">User Name</div>
          <Input
            :placeholder="$t('login.username')"
            v-decorator="[
              'username',
              {
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item>
          <div class="label-form">Password</div>
          <Input
            :placeholder="$t('login.pass')"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: 'Please input your password!' }
                ]
              }
            ]"
          ></Input>
        </Item>
        <Item>
          <div class="label-form">First Name</div>
          <Input
            placeholder="$t('login.firstName')"
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
        <Item>
          <div class="label-form">Last Name</div>
          <Input
            placeholder="$t('login.lastName')"
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
        <Item>
          <div class="label-form">Email</div>
          <Input
            placeholder="$t('login.email')"
            v-decorator="[
              'email',
              {
                rules: [
                  { required: true, message: 'Please input your email!' }
                ]
              }
            ]"
          ></Input>
        </Item>
      </Form>
    </Modal>
    <Button @click="onClickAdd" class="add-btn" type="primary">Add user</Button>
    <Table :columns="columns" :data-source="data" class="table-wrapper">
      <a slot="email" slot-scope="text">{{ text }}</a>
      <span slot="tags" slot-scope="tags">
        <Tag
          v-for="tag in tags"
          :key="tag"
          :color="tag === 'admin' ? 'green' : 'geekblue'"
        >{{ tag.toUpperCase() }}</Tag>
      </span>
      <span slot="action" slot-scope="text, record">
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
    dataIndex: "username",
    key: "username",
    title: "User Name"
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName"
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName"
  },
  {
    dataIndex: "email",
    key: "email",
    title: "Email",
    scopedSlots: { customRender: "email" }
  },
  {
    title: "Roles",
    key: "tags",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const data = [
  {
    key: "1",
    username: "John Brown",
    firstName: "John",
    lastName: "Brown",
    email: "johnbrown@gmail.com",
    tags: ["admin", "user"],
    password: "1234"
  },
  {
    key: "2",
    username: "Jim Green",
    firstName: "Jim",
    lastName: "Green",
    email: "jimgreen@gmail.com",
    tags: ["user"],
    password: "1234"
  },
  {
    key: "3",
    username: "Joe Black",
    firstName: "Joe",
    email: "joeblack@gmail.com",
    lastName: "Black",
    tags: ["admin", "user"],
    password: "1234"
  }
];
import { Table, Form, Tag, Divider, Modal } from "ant-design-vue";
import Loading from "./Loading";
import { request } from "../api";
import { END_POINT } from "../config";
import Vue from "vue";
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
    Item
  },
  data() {
    return {
      data,
      columns,
      isLoading: true,
      deleteModalVisible: false,
      detailModalVisible: false,
      typeDetailModal: "",
      selectedUser: "",
      form: {},
      users: []
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
    onClickEdit(record) {
      this.typeDetailModal = "Edit";
      this.form.setFieldsValue({
        username: record.username,
        password: record.password,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email
      });
      this.detailModalVisible = true;
    },

    onClickDelete(record) {
      this.selectedUser = record.username;
      this.deleteModalVisible = true;
    },

    onConfirmDelete() {
      this.deleteModalVisible = false;
    },

    onClickAdd() {
      this.typeDetailModal = "Add";
      this.form.setFieldsValue({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
      });
      this.detailModalVisible = true;
    },

    onConfirmDetail(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        console.log(values);
        if (!err) {
          console.log("ok");
          if (this.typeDetailModal == "Add") {
            console.log("add");
          } else {
            console.log("Edit");
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
</style>

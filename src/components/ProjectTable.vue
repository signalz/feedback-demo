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
          <div class="label-form">
            Survey:
            <Tag
              v-if="surveySelected.name != ''"
              :color="handleColor(surveySelected.name)"
              closable
              @close="clearSelectedSurvey"
            >{{ surveySelected.name }}</Tag>
          </div>
          <AutoComplete
            @search="handleSearchSurvey"
            @select="handleSelectSurvey"
            placeholder="Seach survey"
            :dataSource="resultSurvey"
            v-model="surveySearchModel"
          />
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
        <Item class="form-item">
          <div class="label-form">Description</div>
          <Input
            placeholder="Description"
            v-decorator="[
              'description',
              {
                rules: [
                  { required: false, message: 'Please input your description!' }
                ]
              }
            ]"
          ></Input>
        </Item>
      </Form>
    </Modal>
    <Button @click="onClickAdd" class="add-btn" type="primary">Add Project</Button>
    <Table
      :columns="columns"
      :row-key="record => record.key"
      :data-source="projects"
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
        <a @click="onClickEdit(record)">Edit</a>
        <!-- <Divider type="vertical" />
        <a @click="onClickDelete(record)">Delete</a> -->
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
    dataIndex: "managerName",
    key: "managerName"
  },
  {
    title: "Survey",
    dataIndex: "surveyName",
    key: "surveyName"
  },
  {
    title: "Associate",
    key: "associate",
    dataIndex: "associate",
    scopedSlots: { customRender: "associate" }
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
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
  // Divider,
  Modal,
  AutoComplete,
  message
} from "ant-design-vue";
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
    // Divider,
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
      form: {},
      message,
      formChangePass: {},
      projects: [],
      users: [],
      resultManager: [],
      resultSurvey: [],
      resultAssociate: [],
      managerSelected: {
        value: "",
        name: ""
      },
      surveySelected: {
        value: "",
        name: ""
      },
      associateSelected: [],
      associateSearchModel: "",
      managerSearchModel: "",
      surveySearchModel: ""
    };
  },
  mounted() {
    this.form = this.$form.createForm(this, { name: "detail" });
    this.form.getFieldDecorator("projectName", {
      initialValue: ""
    });
    this.form.getFieldDecorator("description", {
      initialValue: ""
    });
    Promise.all([
      request(`${END_POINT}/api/projects`, {
        method: "GET"
      }),
      request(`${END_POINT}/api/users`, {
        method: "GET"
      }),
      request(`${END_POINT}/api/surveys`, {
        method: "GET"
      })
    ])
      .then(([projects, users, surveys]) => {
        if (users && users.length > 0) {
          users.map(function(value) {
            value.name = value.firstName + " " + value.lastName;
          });
          this.users = users;
          this.handleSearchManager();
          this.handleSearchAssociate();
        }
        if (surveys && surveys.length > 0) {
          this.surveys = surveys;
          this.handleSearchSurvey();
        }
        if (projects && projects.length > 0) {
          projects.forEach(e => {
            e.key = e.id;
            e.projectName = e.name;
            if (Object.keys(e.manager).length > 0) {
              e.managerName = e.manager.firstName + " " + e.manager.lastName;
            } else {
              e.managerName = "";
            }
            if (Object.keys(e.survey).length > 0) {
              e.surveyName = e.survey.description;
            } else {
              e.surveyName = "";
            }
            e.associate = [];
            if (e.associates.length > 0) {
              e.associates.forEach(record => {
                const name = record.firstName + " " + record.lastName;
                e.associate.push(name);
              });
            }
          });
          this.projects = projects;
        }
        this.isLoading = false;
      })
      .catch(e => {
        this.isLoading = false;
        this.message.error(e);
      });
  },
  methods: {
    handleColor() {
      return "geekblue";
    },

    _reloadForm() {
      this.isLoading = true;
      request(`${END_POINT}/api/projects`, {
        method: "GET"
      }).then(projects => {
        projects.forEach(e => {
          e.key = e.id;
          e.projectName = e.name;
          if (Object.keys(e.manager).length > 0) {
            e.managerName = e.manager.firstName + " " + e.manager.lastName;
          } else {
            e.managerName = "";
          }
          if (Object.keys(e.survey).length > 0) {
            e.surveyName = e.survey.description;
          } else {
            e.surveyName = "";
          }
          e.associate = [];
          if (e.associates.length > 0) {
            e.associates.forEach(record => {
              const name = record.firstName + " " + record.lastName;
              e.associate.push(name);
            });
          }
        });
        this.projects = projects;
        this.isLoading = false;
      });
    },

    popTag(id, array) {
      array.splice(
        array
          .map(function(e) {
            return e.value;
          })
          .indexOf(id),
        1
      );
      if (array.length == 0) {
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

    clearSelectedSurvey() {
      this.surveySelected = {
        value: "",
        name: ""
      };
      this.handleSearchSurvey();
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
          const recordName = record.name.toUpperCase();
          const valueName = value.toUpperCase();
          if (recordName.includes(valueName)) {
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

    handleSearchSurvey(value) {
      let result = [];
      if (!value) {
        this.surveys.map(record => {
          result.push({
            value: record.id,
            text: record.description
          });
        });
      } else {
        this.surveys.map(record => {
          const recordDescription = record.description.toUpperCase();
          const valueDescription = value.toUpperCase();
          if (recordDescription.includes(valueDescription)) {
            result.push({
              value: record.id,
              text: record.description
            });
          }
        });
      }
      if (result.length > 5) {
        result.splice(5, result.length - 5);
      }
      this.resultSurvey = result;
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
          const recordName = record.name.toUpperCase();
          const valueName = value.toUpperCase();
          if (recordName.includes(valueName)) {
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
      this.handleSearchAssociate();
    },

    handleSelectManager(value) {
      const selectedObj = this.users.filter(e => {
        return e.id == value;
      });
      this.managerSelected.value = selectedObj[0].id;
      this.managerSelected.name = selectedObj[0].name;
      this.managerSearchModel = "";
      this.handleSearchManager();
    },

    handleSelectSurvey(value) {
      const selectedObj = this.surveys.filter(e => {
        return e.id == value;
      });
      this.surveySelected.value = selectedObj[0].id;
      this.surveySelected.name = selectedObj[0].description;
      this.surveySearchModel = "";
      this.handleSearchSurvey();
    },

    onClickEdit(record) {
      this.typeDetailModal = "Edit";
      this.selectedID = record.id;
      this.form.setFieldsValue({
        projectName: record.projectName
      });
      this.form.setFieldsValue({
        description: record.description
      });
      if (Object.keys(record.manager).length > 0) {
        this.managerSelected = {
          name: record.managerName,
          value: record.manager.id
        };
      } else {
        this.managerSelected = {
          name: "",
          value: ""
        };
      }
      this.managerSearchModel = "";
      this.associateSearchModel = "";
      this.associateSelected = [];
      if (record.associates.length > 0) {
        record.associates.forEach(e => {
          const name = e.firstName + " " + e.lastName;
          this.associateSelected.push({
            value: e.id,
            name: name
          });
        });
      }
      this.surveySearchModel = "";
      this.surveySelected = {
        name: record.survey.description,
        value: record.survey.id
      };

      this.detailModalVisible = true;
    },

    onClickDelete(record) {
      this.selectedUser = record.projectName;
      this.selectedID = record.id;
      this.deleteModalVisible = true;
    },

    onConfirmDelete() {
      this.deleteModalVisible = false;
      request(`${END_POINT}/api/projects/` + this.selectedID, {
        method: "DELETE"
      }).then(() => {
        this._reloadForm();
        this.message.info("Delete project successful!");
      });
    },

    onClickAdd() {
      this.typeDetailModal = "Add";
      this.form.setFieldsValue({
        projectName: "",
        description: ""
      });
      this.managerSelected = {
        name: "",
        value: ""
      };
      this.managerSearchModel = "";
      this.associateSearchModel = "";
      this.associateSelected = [];
      this.surveySearchModel = "";
      this.surveySelected = {
        name: "",
        value: ""
      };
      this.detailModalVisible = true;
    },

    onConfirmDetail(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        const { projectName: name, description } = values;
        let associates = [];
        this.associateSelected.forEach(e => {
          associates.push(e.value);
        });
        const obj = {
          name,
          manager: this.managerSelected.value,
          associates,
          surveyId: this.surveySelected.value,
          description
        };
        if (!err && obj.manager && obj.surveyId && obj.associates.length > 0) {
          if (this.typeDetailModal == "Add") {
            request(`${END_POINT}/api/projects`, {
              method: "POST",
              body: JSON.stringify(obj)
            })
              .then(() => {
                this.detailModalVisible = false;
                this._reloadForm();
                this.message.info("Add project successfully!");
              })
              .catch(e => {
                this.detailModalVisible = false;
                this.message.error("Add project fail!");
                console.log(e);
              });
          } else {
            request(`${END_POINT}/api/projects/` + this.selectedID, {
              method: "PATCH",
              body: JSON.stringify(obj)
            })
              .then(() => {
                this.detailModalVisible = false;
                this._reloadForm();
                this.message.info("Edit project successfully!");
              })
              .catch(e => {
                this.detailModalVisible = false;
                this.message.error("Edit project fail!");
                console.log(e);
              });
          }
        } else {
          this.message.error("Please fill all the fields!");
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
      border-radius: 5px;
      width: 100%;
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

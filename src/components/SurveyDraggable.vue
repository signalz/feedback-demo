<template>
  <div class="survey-component-wrapper">
    <Loading :isSpin="true" v-if="isLoading" class="menu-loading-wrapper" />
    <div v-if="viewDetailMode" class="survey-detail-content">
      <div class="save-btn-wrapper">
        <Button class="save-btn" @click="onClickBackSurvey">Back to Survey table</Button>
      </div>
      <div class="name-survey">
        <div class="name-label">
          Name of Survey:
          <span v-if="!nameSurvey" style="color: red">*</span>
        </div>
        <Input v-model="nameSurvey" />
      </div>
      <div class="survey-content">
        <draggable :list="survey" ghost-class="ghost">
          <div class="survey-item" v-for="(element, index) in survey" :key="index">
            <Collapse>
              <Panel class="survey-header" :header="'Section ' + (index + 1)+ ': ' + element.name">
                <div class="section-title-wrapper">
                  <div class="section-title">Section title:</div>
                  <Input v-model="element.name" />
                </div>
                <div>
                  <draggable
                    :list="element.questions"
                    v-if="element.questions.length > 0"
                    ghost-class="ghost"
                    class="questions-wrapper"
                  >
                    <div
                      class="question-item"
                      v-for="(question, index) in element.questions"
                      :key="index"
                    >
                      <div class="question-label">Question {{index + 1}}:</div>
                      <Input v-model="question.questionName" />
                      <Icon
                        @click="onClickDeleteQuestion(element.questions, index)"
                        slot="prefix"
                        type="delete"
                        class="delete-btn"
                      />
                    </div>
                  </draggable>
                </div>
                <div class="add-btn-wrapper">
                  <div class="add-label">Add a question:</div>
                  <Icon
                    @click="addQuestion(element, element.name)"
                    type="plus-circle"
                    theme="twoTone"
                    class="add-icon"
                    v-bind:class="{ disabled: !abstractModel[element.name] }"
                  />
                  <Input v-model="abstractModel[element.name]" />
                </div>
              </Panel>
            </Collapse>
            <Icon
              @click="onDeleteSurvey(survey, index)"
              slot="prefix"
              type="delete"
              class="delete-btn"
            />
          </div>
        </draggable>
      </div>
      <div class="add-btn-wrapper">
        <div class="add-label">Add a section:</div>
        <Icon
          @click="addSection"
          v-bind:class="{ disabled: !addSectionModel }"
          type="plus-circle"
          theme="twoTone"
          class="add-icon"
        />
        <Input v-model="addSectionModel" />
      </div>
      <div class="save-btn-wrapper">
        <Button
          class="save-btn"
          v-bind:class="disabledSaveButton"
          @click="onClickSaveSurvey"
        >Save survey</Button>
      </div>
    </div>
    <div v-if="!viewDetailMode" class="survey-table">
      <div style="margin-bottom: 30px;" class="save-btn-wrapper">
        <Button class="save-btn" @click="onClickAddSurvey">Add new Survey</Button>
      </div>
      <Table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="surveys"
        class="table-wrapper"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="viewDetailSurvey(record)">View Detail</a>
        </span>
      </Table>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { request } from "../api";
import { END_POINT } from "../config";
import Loading from "./Loading";
import { Collapse, Input, Button, Icon, message, Table } from "ant-design-vue";

const { Panel } = Collapse;
const columns = [
  {
    title: "Survey Name",
    dataIndex: "description",
    defaultSortOrder: "ascend",
    sorter: (a, b) => {
      return a.description.localeCompare(b.description);
    }
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  components: {
    draggable,
    Collapse,
    Table,
    Input,
    Icon,
    Panel,
    Button,
    Loading
  },
  computed: {
    disabledSaveButton: function() {
      let flag = false;
      if (this.survey.length == 0) {
        flag = true;
      } else {
        if (!this.nameSurvey) {
          flag = true;
        } else {
          flag = false;
        }
      }
      return {
        disabled: flag
      };
    }
  },
  data() {
    return {
      survey: [],
      surveys: [],
      surveyId: "",
      columns,
      isLoading: true,
      abstractModel: {},
      addSectionModel: "",
      message,
      nameSurvey: "",
      viewDetailMode: false
    };
  },

  mounted() {
    this._loadTableForm();
  },

  methods: {
    _loadTableForm() {
      this.isLoading = true;
      request(`${END_POINT}/api/surveys`, {
        method: "GET"
      })
        .then(surveys => {
          this.isLoading = false;
          if (surveys && surveys.length > 0) {
            this.surveys = surveys;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    viewDetailSurvey(survey) {
      this.surveyId = survey.id;
      this.nameSurvey = survey.description;
      this.survey = survey.sections.map(section => ({
        name: section.title,
        questions: section.questions.map(question => ({
          questionName: question.text
        }))
      }));
      this.viewDetailMode = true;
    },

    onClickBackSurvey() {
      this.viewDetailMode = false;
    },

    onClickAddSurvey() {
      this.surveyId = "";
      this.nameSurvey = "";
      this.survey = [];
      this.viewDetailMode = true;
    },

    addSection() {
      this.survey.push({ name: this.addSectionModel, questions: [] });
      this.addSectionModel = "";
    },

    addQuestion(section, questionModel) {
      section.questions.push({
        questionName: this.abstractModel[questionModel]
      });
      this.abstractModel[questionModel] = "";
    },

    onClickDeleteQuestion(array, index) {
      array.splice(index, 1);
    },

    onDeleteSurvey(array, index) {
      array.splice(index, 1);
    },

    onClickSaveSurvey() {
      let emptySection = false;
      this.survey.forEach(section => {
        if (section.questions.length == 0) {
          emptySection = true;
        }
      });
      if (emptySection) {
        this.message.error("Section have to define at least one question!");
      } else {
        const requestBody = this.survey.map((section, idx) => ({
          title: section.name,
          order: idx,
          questions: section.questions.map((question, index) => ({
            text: question.questionName,
            order: index
          }))
        }));
        const objSurvey = {
          description: this.nameSurvey,
          sections: requestBody
        };
        let requestUrl = "";
        let method = "";
        if (this.surveyId) {
          requestUrl = `${END_POINT}/api/surveys/` + this.surveyId;
          method = "PATCH";
        } else {
          requestUrl = `${END_POINT}/api/surveys`;
          method = "POST";
        }
        request(requestUrl, {
          method: method,
          body: JSON.stringify(objSurvey)
        })
          .then(response => {
            this.surveyId = response.id;
            this._loadTableForm();
            this.message.info("Save survey successful!");
          })
          .catch(() => {
            this.message.error("Save survey fail!");
          });
        console.log(objSurvey);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.survey-header {
  color: black;
  font-size: 18px;
  font-weight: bold;
}

.survey-item {
  position: relative;
}

.questions-wrapper {
  border-top: 2px solid #dadada;
  margin: 5px;
}

.question-item {
  margin: 10px 0px;
  position: relative;
  display: flex;
  align-items: center;

  .question-label {
    margin-right: 20px;
    color: black;
    font-size: 15px;
    width: 100px;
  }

  .delete-btn {
    top: 7px !important;
  }
}

.delete-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  color: black;
  font-size: 17px;
}

.section-title-wrapper {
  display: flex;
  padding: 5px;

  .section-title {
    color: black;
    font-size: 15px;
    width: 100px;
    margin-right: 20px;
  }
}

.add-btn-wrapper {
  display: flex;
  align-items: center;
  margin: 30px 5px 0 5px;
  border-top: 2px solid #dadada;
  padding-top: 5px;

  .add-label {
    font-size: 15px;
    color: black;
    width: 150px;
  }

  i {
    margin: 0 10px;
    font-size: 21px;
  }

  i.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.save-btn-wrapper {
  display: flex;
  align-items: center;
  margin: 10px 5px 0 5px;
  padding-top: 5px;

  .save-btn {
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

  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.name-survey {
  display: flex;
  align-items: center;
  margin: 30px 5px;

  .name-label {
    width: 150px;
  }
}
</style>
<template>
  <div class="survey-component-wrapper">
    <div class="survey-content">
      <draggable :list="survey" ghost-class="ghost">
        <div v-for="(element, index) in survey" :key="index">
          <Collapse>
            <Panel :header="element.name">
              <div>
                <draggable :list="element.questions" ghost-class="ghost" class="questions-wrapper">
                  <div v-for="(question, index) in element.questions" :key="index">
                    <Input v-model="question.questionName"></Input>
                    <Button
                      @click="onClickDeleteQuestion(element.questions, index)"
                    >Delete {{ question.questionName }}</Button>
                  </div>
                </draggable>
              </div>
              <Input v-model="abstractModel[element.name]" />
              <Button
                class="btn btn-secondary"
                :disabled="!abstractModel[element.name]"
                @click="addQuestion(element, element.name)"
              >Add Question</Button>
            </Panel>
          </Collapse>
          <div class="survey-delete">
            <Icon @click="onDeleteSurvey(survey, index)" slot="prefix" type="delete" style="color:rgba(0,0,0,.25)" />
          </div>
        </div>
      </draggable>
    </div>
    <Input v-model="addSectionModel" />
    <Button :disabled="!addSectionModel" class="add-btn" @click="addSection">Add Section</Button>
    <div class="col-3" title="List">{{ survey }}</div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { Collapse, Input, Button, Icon } from "ant-design-vue";

const { Panel } = Collapse;

export default {
  components: {
    draggable,
    Collapse,
    Input,
    Icon,
    Panel,
    Button
  },

  data() {
    return {
      survey: [],
      abstractModel: {},
      addSectionModel: ""
    };
  },

  methods: {
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

    onDeleteSurvey(array, index){
      array.splice(index, 1);
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
</style>
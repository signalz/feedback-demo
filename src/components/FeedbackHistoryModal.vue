<template>
  <Modal :visible="isVisible" @cancel="onClickClose">
    <template slot="footer">
      <Button key="back" @click="onClickClose" type="primary">{{
        $t("feedback-history.close")
      }}</Button>
    </template>
    <div class="feedback-history-modal-label">
      {{ $t("feedback.history-modal-label") }}
    </div>
    <Table
      :columns="columns"
      :row-key="feedback => feedback.id"
      :data-source="feedbacks"
      class="feedback-history-modal-table"
    >
      <span slot="action" slot-scope="text, feedback">
        <a @click="onViewDetail(feedback)">{{
          $t("feedback-history.view-detail")
        }}</a>
      </span>
    </Table>
  </Modal>
</template>

<script>
import { Button, Modal, Table } from "ant-design-vue";

export default {
  name: "FeedbackHistoryModal",
  components: {
    Button,
    Modal,
    Table
  },
  props: {
    isVisible: Boolean,
    feedbacks: Array
  },
  methods: {
    onClickClose() {
      this.$emit("close");
    },

    onViewDetail(feedback) {
      this.$emit("viewDetail", { feedback });
    }
  },
  computed: {
    columns() {
      return [
        {
          title: this.$t("feedback-history.event"),
          dataIndex: "event",
          defaultSortOrder: "ascend",
          sorter: (a, b) => {
            return a.event.localeCompare(b.event);
          }
        },
        {
          title: this.$t("feedback-history.created-date"),
          dataIndex: "createdDate",
          sorter: (a, b) => {
            return a.createdDate.localeCompare(b.createdDate);
          }
        },
        {
          title: this.$t("feedback-history.action"),
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ];
    }
  }
};
</script>

<style scoped lang="scss">
.feedback-history-modal-label {
  font-size: 20px;
  color: black;
  font-weight: bold;
  margin-top: 10px;
}

.feedback-history-modal-table {
  margin: 10px 0;
}
</style>

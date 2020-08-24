<template>
  <Modal
    :visible="isVisibleNotification"
    @cancel="onClickCancelNoti"
    @ok="onClickOkNoti"
    :closable="true"
    dialogClass="noti-dialog-wrapper"
  >
    <div class="noti-wrapper">
      <div class="noti-icon">
        <Icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      </div>
      <div class="noti-container">
        <div class="noti-head">{{ $t("feedback.sent-feedback") }}</div>
        <div class="noti-body">
          <div class="description">
            {{ $t("feedback.description-survey") }}
          </div>
          <div class="survey-wrapper">
            <div
              class="survey-item"
              :key="index"
              v-for="(item, index) in answersChanged"
            >
              <div class="survey-question">{{ item.question }}</div>
              <div class="survey-from-to">
                <div class="survey-from">
                  <img v-if="item.oldPoint == 1" src="../assets/bronze.png" />
                  <img v-if="item.oldPoint == 2" src="../assets/silver.png" />
                  <img v-if="item.oldPoint == 3" src="../assets/gold.png" />
                  <img v-if="item.oldPoint == 4" src="../assets/platinum.png" />
                </div>
                <div class="arrow">
                  <Icon
                    v-if="item.typeChanged == 'des'"
                    type="fall"
                    style="color: #e63d3d;"
                  />
                  <Icon
                    v-if="item.typeChanged == 'asc'"
                    type="rise"
                    style="color: #52c41a;"
                  />
                </div>
                <div class="survey-to">
                  <img v-if="item.newPoint == 1" src="../assets/bronze.png" />
                  <img v-if="item.newPoint == 2" src="../assets/silver.png" />
                  <img v-if="item.newPoint == 3" src="../assets/gold.png" />
                  <img v-if="item.newPoint == 4" src="../assets/platinum.png" />
                </div>
              </div>
              <div class="survey-comment">
                <Input
                  :placeholder="$t('feedback.changed-comment')"
                  v-model="item.comment"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { Modal, Icon, Input } from "ant-design-vue";

export default {
  name: "FeedbackHistoryModal",
  components: {
    Modal,
    Icon,
    Input
  },
  props: {
    isVisibleNotification: Boolean,
    answersChanged: Array
  },
  methods: {
    onClickCancelNoti() {
      this.$emit("cancel");
    },

    onClickOkNoti() {
      this.$emit("ok");
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
<style lang="scss">
.noti-dialog-wrapper {
  top: 15px;
  width: 760px !important;
}

@media screen and (max-width: 767px) {
  .noti-dialog-wrapper {
    width: auto !important;
  }

  .survey-from-to{
    width: auto !important;

  }
}
</style>

<style scoped lang="scss">
.noti-wrapper {
  display: flex;

  .noti-icon {
    width: 40px;
    padding-top: 2px;

    i {
      font-size: 21px;
    }
  }

  .noti-container {
    width: calc(100% - 80px);
    color: black;

    .noti-head {
      font-size: 16px;
      font-weight: 500;
    }

    .noti-body {
      .description {
        font-style: italic;
        margin: 20px;
      }

      .survey-wrapper {
        .survey-item {
          padding: 20px;
          margin: 20px 0;
          background: #eeeeee;
          border-radius: 5px;
          img {
            width: 50px;
          }

          .survey-from-to {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 300px;
            margin: 10px auto;

            .arrow {
              font-size: 23px;
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="bar-menu-wrapper">
    <MobileMenuButton
      class="bar-menu-button"
      :isClicked="isOpen"
      @click.native="onMobileMenuClick"
    />
    <div class="bar-menu-information">
      <div class="bar-menu-project">
        <div class="bar-menu-project-label">{{$t('menu.bar.project-label')}}</div>
        <div class="bar-menu-project-name">{{project || $t('menu.bar.no-project')}}</div>
      </div>
      <div class="bar-menu-event">
        <div class="bar-menu-event-container" v-if="event && state != feedbackStates.NEW_FEEDBACK && project">
          <div class="bar-menu-event-label">{{$t('menu.bar.event-label')}}</div>
          <div class="bar-menu-event-name">{{event || $t('menu.bar.no-event')}}</div>
        </div>
        <div class="bar-menu-event-container" v-else-if="state != feedbackStates.NEW_FEEDBACK && project">
          <div class="bar-menu-event-label">{{$t('menu.bar.no-event-label')}}</div>
          <div class="bar-menu-event-name">{{ createdAtValue }}</div>
        </div>
        <Button class="logout-btn" @click="onClickLogout">{{$t('login.logout')}}</Button>
      </div>
    </div>
  </div>
</template>
<script>
import MobileMenuButton from "./MobileMenuButton";
import { Button } from "ant-design-vue";
import moment from "moment";
import { FEEDBACK_STATE } from "../config";

export default {
  name: "BarMenu",
  components: {
    MobileMenuButton,
    Button
  },
  data: () => {
    return {
      feedbackStates: FEEDBACK_STATE
    };
  },
  props: {
    isOpen: Boolean,
    event: String,
    state: String,
    project: String,
    createdAt: String
  },
  computed: {
    createdAtValue() {
      return moment(this.createdAt).format("YYYY-MM-DD");
    }
  },
  methods: {
    onMobileMenuClick() {
      this.$emit("open", { isOpen: !this.isOpen });
    },

    onClickLogout() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped lang="scss">
.bar-menu-wrapper {
  height: $header-height;
  position: fixed;
  width: 100%;
  background-color: $primary-color;
  display: flex;
  align-items: center;
  padding: 0 20px 0 20px;
  font-size: 19px;
  z-index: 99;
  min-width: $min-width;

  .bar-menu-information {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    overflow-y: auto;
    overflow-x: hidden;

    .bar-menu-project {
      display: flex;

      .bar-menu-project-label {
        margin-right: 5px;
      }

      .bar-menu-project-name {
        word-break: break-all;
      }
    }

    .bar-menu-event {
      display: flex;

      .bar-menu-event-container {
        display: flex;
      }

      .bar-menu-event-label {
        margin-right: 5px;
      }

      .bar-menu-event-name {
        word-break: break-all;
      }

      .logout-btn {
        margin: 0 10px;
        background: #16619c;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  }

  @media screen and (max-width: $desktop-width) {
    .bar-menu-information {
      font-size: 17px;
      justify-content: flex-end;
    }

    .bar-menu-project {
      display: none !important;
    }

    .bar-menu-event-label {
      display: none;
    }

    .bar-menu-event-name {
      display: none;
    }
  }

  @media screen and (max-width: $extra-small-phone-width) {
    .bar-menu-information {
      font-size: 15px;
    }
  }

  @media screen and (min-width: $desktop-width) {
    .bar-menu-button {
      display: none;
    }
  }
}
</style>

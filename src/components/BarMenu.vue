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
        <div class="bar-menu-event-label">{{$t('menu.bar.event-label')}}</div>
        <div class="bar-menu-event-name">{{event || $t('menu.bar.no-event')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import MobileMenuButton from "./MobileMenuButton";

export default {
  name: "BarMenu",
  components: {
    MobileMenuButton
  },
  props: {
    isOpen: Boolean,
    event: String,
    project: String
  },
  methods: {
    onMobileMenuClick() {
      this.$emit("open", { isOpen: !this.isOpen });
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
  font-size: 24px;
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

      .bar-menu-event-label {
        margin-right: 5px;
      }

      .bar-menu-event-name {
        word-break: break-all;
      }
    }
  }

  @media screen and (max-width: $desktop-width) {
    .bar-menu-information {
      font-size: 17px;
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

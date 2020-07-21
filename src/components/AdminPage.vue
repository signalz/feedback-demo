<template>
  <div class="admin-page-wrapper">
    <Layout class="admin-page-menu-layout">
      <Sider class="menu-sider" v-model="collapsed" :trigger="null" collapsible>
        <div class="logo">{{$t('admin.banner')}}</div>
        <Menu theme="dark" mode="inline" :default-selected-keys="[menu[0].key]">
          <Item
            v-for="component in menu"
            :key="component.key"
            @click="onSelectMenuItem"
          >
            <Icon :type="component.type" />
            <span>{{ $t(component.text) }}</span>
          </Item>
        </Menu>
      </Sider>
      <Layout>
        <Header class="header-wrapper">
          <Icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <Button class="logout-btn" @click="onClickLogout">{{
            $t("login.logout")
          }}</Button>
        </Header>
        <Content class="content-wrapper">
          <div>
            <div class="content-label">{{$t(selectedItem.label)}}</div>
            <component :is="selectedItem.component" />
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { Button, Icon, Layout, Menu } from "ant-design-vue";

import { JWT } from "../config";
import { LOGIN_ACTION } from "../store";

import FeedbackHistory from "./FeedbackHistory.vue";
import ProjectTable from "./ProjectTable.vue";
import SurveyDraggable from "./SurveyDraggable.vue";
import UserTable from "./UserTable.vue";

const { Content, Header, Sider } = Layout;
const { Item } = Menu;

const ADMIN_MENU = [
  {
    key: "USER",
    type: "user",
    text: "admin.user",
    label: "admin.user-label",
    component: UserTable
  },
  {
    key: "PROJECT",
    type: "project",
    text: "admin.project",
    label: "admin.project-label",
    component: ProjectTable
  },
  {
    key: "SURVEY",
    type: "unordered-list",
    text: "admin.survey",
    label: "admin.survey-label",
    component: SurveyDraggable
  },
  {
    key: "HISTORY",
    type: "history",
    text: "admin.history",
    label: "admin.history-label",
    component: FeedbackHistory
  }
];

export default {
  name: "Admin",
  components: {
    Button,
    Content,
    Header,
    Icon,
    Item,
    Layout,
    Menu,
    Sider,
  },
  data: () => {
    return {
      collapsed: false,
      menuSelected: ADMIN_MENU[0].key,
      menu: ADMIN_MENU
    };
  },
  computed: {
    selectedItem() {
      return ADMIN_MENU.find(item => item.key === this.menuSelected)
    }
  },
  methods: {
    onClickLogout() {
      localStorage.removeItem(JWT);
      this.$store.commit(LOGIN_ACTION, {});
      this.$router.push("/login");
    },

    handleBarMenu({ isOpen }) {
      this.isOpen = isOpen;
    },

    onSelectMenuItem({ key }) {
      if (this.menuSelected != key) {
        this.menuSelected = key;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.admin-page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  .admin-page-menu-layout .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: white;
  }

  .admin-page-menu-layout .logo {
    height: 60px;
    font-weight: bold;
    font-size: 15px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
  }

  .header-wrapper {
    background-color: $primary-color;
    padding: 0;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logout-btn {
      margin: 0 10px;
      background: #16619c;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      margin-right: 48px;
    }
  }

  .menu-sider {
    background: $primary-color;
    ul {
      background: $primary-color;
      li {
        margin: 0;
      }
      .ant-menu-item-selected {
        background-color: white;
        i {
          color: black;
        }
        span {
          color: black;
        }
      }
    }
  }

  .content-wrapper {
    color: black;
    overflow: auto;
    margin: 24px 16px;
    padding: 24px;
    background: #fff;
    min-height: 280px;

    .group-label {
      font-size: 18px;
      font-weight: bold;
    }

    .content-label {
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .group-wrapper {
      display: flex;

      .radio-button {
        position: relative;
        display: flex;
        padding: 15px 20px;
        cursor: pointer;
        transition: color 0.3s, background 0.3s, border-color 0.3s;
        width: 120px;
        justify-content: center;
        font-size: 17px;
        align-items: center;
        font-weight: bold;
      }
    }

    .suggest-banner {
      font-size: 40px;
      font-weight: lighter;
      opacity: 0.4;
      text-align: center;
      margin: 50px;
    }
  }
}
</style>

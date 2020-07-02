<template>
  <div class="admin-page-wrapper">
    <Layout id="menu-layout">
      <Sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo" />
        <Menu theme="dark" mode="inline" :default-selected-keys="['1']">
          <Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Item>
          <Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Item>
          <Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style="background: #fff; padding: 0">
          <Icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </Header>
        <Content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
        >Content</Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { DEFAULT } from "../config";

import Loading from "./Loading";
import { Layout, Menu, Icon } from "ant-design-vue";
const { Header, Content, Footer, Sider } = Layout;
const { Item, SubMenu } = Menu;

export default {
  name: "Admin",
  components: {
    Layout,
    Loading,
    Menu,
    Icon,
    Header,
    Sider,
    Content,
    Footer,
    SubMenu,
    Item
  },
  data: () => {
    return {
      collapsed: false
    };
  },
  methods: {
    handleBarMenu({ isOpen }) {
      this.isOpen = isOpen;
    }
  }
};
</script>
<style scoped lang="scss">
.admin-page-wrapper {
  #menu-layout .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: $default-color;
  }

  #menu-layout .trigger:hover {
    color: #1890ff;
  }

  #menu-layout .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
}
</style>

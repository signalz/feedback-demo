<template>
  <div class="admin-page-wrapper">
    <Layout id="menu-layout">
      <Sider class="menu-sider" v-model="collapsed" :trigger="null" collapsible>
        <div class="logo">Admin Page</div>
        <Menu theme="dark" mode="inline" :default-selected-keys="['1']">
          <Item key="1" @click="onSelectMenuItem">
            <Icon type="user" />
            <span>User</span>
          </Item>
          <Item key="2" @click="onSelectMenuItem">
            <Icon type="project" />
            <span>Project</span>
          </Item>
          <Item key="3" @click="onSelectMenuItem">
            <Icon type="unordered-list" />
            <span>Survey</span>
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
          <Button class="logout-btn" @click="onClickLogout">{{$t('login.logout')}}</Button>
        </Header>
        <Content
          class="content-wrapper"
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
        >
          <div class="group-label">Select an operator:</div>
          <Group class="group-wrapper" buttonStyle="solid" :value="this.operatorSelected">
            <radioButton
              class="radio-button"
              value="Add"
              @click="()=>(this.operatorSelected = 'Add')"
            >Add</radioButton>
            <radioButton
              class="radio-button"
              value="Edit"
              @click="()=>(this.operatorSelected = 'Edit')"
            >Edit</radioButton>
            <radioButton
              class="radio-button"
              value="Delete"
              @click="()=>(this.operatorSelected = 'Delete')"
            >Delete</radioButton>
          </Group>
          <div v-if="operatorSelected == ''" class="suggest-banner">Please select an operator!</div>
          <div v-if="menuSelected == 1 && operatorSelected ">
            <AddUser v-if="operatorSelected == 'Add'"></AddUser>
          </div>
          <div v-if="menuSelected == 2 && operatorSelected ">2</div>
          <div v-if="menuSelected == 3 && operatorSelected ">3</div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>


import { Layout, Menu, Icon, Button, Radio } from "ant-design-vue";
import AddUser from "./AddUser.vue";
const { Header, Content, Sider } = Layout;
const { Item } = Menu;
const { Group, Button: radioButton } = Radio;

export default {
  name: "Admin",
  components: {
    AddUser,
    Group,
    radioButton,
    Layout,
    Menu,
    Icon,
    Header,
    Sider,
    Content,
    Item,
    Button
  },
  data: () => {
    return {
      collapsed: false,
      menuSelected: 1,
      operatorSelected: ""
    };
  },
  methods: {
    onClickLogout() {
      localStorage.removeItem("jwt");
      this.$router.push("/login");
    },

    handleBarMenu({ isOpen }) {
      this.isOpen = isOpen;
    },

    onChangeOperator(e) {
      console.log(e);
    },

    onSelectMenuItem({ key }) {
      if (this.menuSelected != key) {
        this.menuSelected = key;
        this.operatorSelected = "";
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
  #menu-layout .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    color: white;
  }

  #menu-layout .logo {
    height: 60px;
    font-weight: bold;
    font-size: 17px;
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
    .group-label {
      font-size: 18px;
      font-weight: bold;
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

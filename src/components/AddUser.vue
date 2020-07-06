<template>
  <div class="add-user-wrapper">
    Add User
    <Form>
      <div class="form-row">
        <formItem class="form-col-50 form-padding-right">
          <div class="form-label">First Name <span style="color: red">*</span></div>
          <Input placeholder="Please input your First Name" />
        </formItem>
        <formItem class="form-col-50 form-padding-left">
          <div class="form-label">Last Name <span style="color: red">*</span></div>
          <Input placeholder="Please input your Last Name" />
        </formItem>
      </div>
    </Form>
  </div>
</template>
<script>
import { Form, Input } from "ant-design-vue";
const { Item: formItem } = Form;
export default {
  name: "AddUser",
  components: {
    Form,
    formItem,
    Input
  },
  data: () => {
    return {
      isOpen: false
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
.add-user-wrapper {
  .form-row {
    display: flex;
    width: 100%;

    .form-col-50 {
      width: 50%;
    }

    .form-padding-right {
      padding-right: 50px;
    }

    .form-padding-left {
      padding-left: 50px;
    }

    .form-label {
      font-weight: bold;
    }
  }
}
</style>

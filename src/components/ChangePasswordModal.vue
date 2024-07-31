<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header">修改密码</div>
        <button class="close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="input-group">
          <p>原密码：</p>
          <input type="password" v-model="oldPassword" />
          <a @click="forgotPassword">忘记密码</a>
        </div>
        <div class="input-group">
          <p>新密码：</p>
          <input type="password" v-model="newPassword" />
        </div>
        <div class="input-group">
          <p>确认密码：</p>
          <input type="password" v-model="confirmPassword" />
          <div v-if="passwordMismatch" class="error">两次输入不一致</div>
        </div>
        <div class="btn" @click="changePassword">确认修改</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ChangePasswordModal",
  props: {
    phone: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordMismatch: false,
      errorMessage: "",
    };
  },
  methods: {
    forgotPassword() {
      this.$emit("close");
      // 这里可以调用显示忘记密码弹窗的逻辑
      this.$router.push({
        path: "/newpsd",
        query: { from: "change-password", phone: this.phone },
      });
    },
    changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      // 检查原密码是否正确的逻辑
      axios
        .post(
          "https://apifoxmock.com/m1/4808550-4462943-default/api/checkPassword",
          {
            oldPassword: this.oldPassword,
          }
        )
        .then((response) => {
          if (response.data.success) {
            // 更新密码的逻辑
            axios
              .post(
                "https://apifoxmock.com/m1/4808550-4462943-default/api/updatePassword",
                {
                  newPassword: this.newPassword,
                }
              )
              .then((response) => {
                if (response.data.success) {
                  this.$emit("close");
                  alert("密码修改成功");
                } else {
                  this.errorMessage = response.data.message;
                }
              });
          } else {
            this.errorMessage = "原密码不正确";
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorMessage = "修改密码失败，请稍后再试";
        });
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  line-height: 40px;
  color: #d68c37;
  font-family: "Roboto", sans-serif; /* 使用自定义字体 */
  text-shadow: 2px 2px 4px rgba(251, 251, 103, 0.5); /* 添加文字阴影 */
}

.close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.input-group {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.input-group p {
  margin: 0;
  width: 80px;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
  margin-left: 10px;
}

.btn {
  text-align: center;
  padding: 10px;
  margin-top: 20px;
  background-color: #de6700;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #ff8e24;
}
</style>

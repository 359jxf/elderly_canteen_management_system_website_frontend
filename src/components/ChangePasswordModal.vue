<template>
  <div class="modal">
    <transition name="fade">
      <div v-if="showMessage" class="message-popup">{{ showMessage }}</div>
    </transition>
    <div class="modal-content">
      <div class="modal-header">
        <div class="header">修改密码</div>
        <button class="close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="input-group">
          <p>原密码：</p>
          <input type="password" v-model="oldPassword" />
          <a @click="forgotPassword">忘记密码?</a>
        </div>
        <div class="input-group">
          <p>新密码：</p>
          <input
            type="password"
            v-model="newPassword"
            @input="validatePasswordLength"
            placeholder="最大16个字符"
          />
        </div>
        <div class="input-group">
          <p>确认密码：</p>
          <input type="password" v-model="confirmPassword" />
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
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showMessage: "",
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
    async changePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.showError("请输入原密码、新密码和确认密码");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.showError("新密码和确认密码不一致");
        return;
      }

      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          `http://8.136.125.61/api/Account/alterPassword`,
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // this.$emit("close");
          this.showSuccess(response.data.msg);
        } else {
          this.showError(response.data.msg);
        }
      } catch (error) {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          if (error.response.status === 400) {
            this.showError("原密码不正确");
          }
        } else {
          // 一些其他的错误
          console.error("密码修改失败", error);
          this.showError("密码修改失败，请稍后再试");
        }
      }
    },
    showError(message) {
      this.showMessage = message;
      setTimeout(() => {
        this.showMessage = "";
      }, 3000); // 错误信息3秒后消失
    },

    showSuccess(message) {
      this.showMessage = message;
      setTimeout(() => {
        this.showMessage = "";
        this.$emit("close");
      }, 2000);
    },
    validatePasswordLength() {
      if (this.newPassword.length > 16) {
        // 如果密码长度超过16个字符，截取前16个字符并显示提示信息
        this.newPassword = this.newPassword.slice(0, 16);
        this.showError("密码超出最长限制,最多16个字符");
      }
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
  z-index: 900;
}

.modal-content {
  background-color: #fff;
  padding: 0 0px 10px 0px; /* 上边距为0，其余边距为10px */
  border-radius: 10px;
  width: 500px;
  height: 25%;
  position: relative;
}

.modal-header {
  background-color: #d68c37;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px 10px 0 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 120%;
  font-weight: bold;
  color: white;
  padding: 15px 20px;
  margin-bottom: -1px;
  position: sticky;
  top: 0;
  z-index: 900;
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
  margin: 10px 15px;
}

.input-group p {
  margin: 0;
  width: 80px;
  font-weight: bold; /* 加粗字体 */
  color: #d38f35; /* 修改颜色 */
  font-size: large;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 300px; /* 限制输入框最大宽度为200px，调整为你需要的值 */
}

.error {
  color: red;
  margin-left: 10px;
}

.btn {
  display: block; /* 使按钮变成块级元素 */
  margin: 20px auto; /* 上边距为20px，左右自动 */
  text-align: center;
  padding: 10px;
  background-color: #de6700;
  color: white;
  border-radius: 10px;
  width: 50%;
  cursor: pointer;
}

.btn:hover {
  background-color: #ff8e24;
}

a {
  text-decoration: underline; /* 添加下划线 */
  color: rgb(186, 143, 42); /* 设置颜色为蓝色 */
  cursor: pointer; /* 鼠标悬停时显示为指针 */
}

a:hover {
  color: rgb(175, 196, 35); /* 可选：鼠标悬停时颜色变为深蓝色 */
}

.message-popup {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: rgb(255, 255, 255);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 999;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
</style>

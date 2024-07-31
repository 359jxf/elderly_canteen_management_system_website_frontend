<template>
  <div class="container">
    <div class="info-wrapper">
      <div class="login-wrapper">
        <div class="header">个人信息</div>
        <div class="form-wrapper">
          <div class="input-group">
            <p><span class="required">*</span>昵称</p>
            <div v-if="!isEditing">{{ username }}</div>
            <input v-else type="text" v-model="username" class="input-item" />
          </div>
          <div class="input-group">
            <p><span class="required">*</span>密码</p>
            <div v-if="!isEditing">******</div>
            <div v-else>
              ******
              <button class="action-btn" @click="showChangePasswordModal">
                修改密码
              </button>
            </div>
          </div>
          <div class="input-group">
            <p><span class="required">*</span>手机号</p>
            <div v-if="!isEditing">{{ phone }}</div>
            <div v-else>
              {{ phone }}
              <button class="action-btn" @click="showChangePhoneModal">
                手机改绑
              </button>
            </div>
          </div>
          <div class="input-group">
            <p><span class="required">*</span>性别</p>
            <div v-if="!isEditing">{{ gender }}</div>
            <select v-else v-model="gender" class="input-item">
              <option value="">选择性别</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div class="input-group">
            <p>出生日期</p>
            <div v-if="!isEditing">{{ birthdate }}</div>
            <input
              v-else
              type="date"
              v-model="birthdate"
              :disabled="!isEditing"
              class="input-item"
            />
          </div>
          <div class="input-group">
            <p>头像</p>

            <input
              v-if="isEditing"
              type="file"
              @change="handleAvatarUpload"
              :disabled="!isEditing"
            />
          </div>
          <div class="avatar-preview">
            <img :src="avatarPreview || defaultAvatar" alt="头像预览" />
          </div>
          <div
            class="btn"
            @click="isEditing ? updateProfile() : (isEditing = true)"
          >
            {{ isEditing ? "确认修改" : "编辑个人信息" }}
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="errorMessage" class="error-popup">{{ errorMessage }}</div>
    </transition>
    <!-- 确保添加以下两个组件 -->
    <change-password-modal
      v-if="isChangePasswordModalVisible"
      @close="isChangePasswordModalVisible = false"
    />
    <change-phone-modal
      v-if="isChangePhoneModalVisible"
      @close="isChangePhoneModalVisible = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import ChangePasswordModal from "../components/ChangePasswordModal.vue";
import ChangePhoneModal from "../components/ChangePhoneModal.vue";

export default {
  components: {
    ChangePasswordModal,
    ChangePhoneModal,
  },
  data() {
    return {
      isEditing: false,
      username: "",
      password: "",
      phone: "",
      gender: "",
      birthdate: "",
      avatar: null,
      avatarPreview: null,
      defaultAvatar: new URL("../assets/defaultportrait.png", import.meta.url)
        .href,
      errorMessage: "",
      isChangePasswordModalVisible: false,
      isChangePhoneModalVisible: false,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.username = user.name;
      this.phone = user.phone || "";
      this.gender = user.gender || "";
      this.birthdate = user.birthdate || "";
      this.avatarPreview = user.avatar || this.defaultAvatar;
    }
  },
  methods: {
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.avatar = file;
        this.avatarPreview = URL.createObjectURL(file); // 生成预览 URL
      }
    },
    updateProfile() {
      if (!this.username || !this.phone || !this.gender) {
        this.showError("请填写所有必填项");
        return;
      }

      // 构建请求数据
      const data = {
        username: this.username,
        password: this.password,
        phone: this.phone,
        gender: this.gender,
        birthdate: this.birthdate,
        avatar: this.avatar ? this.avatar : this.avatarPreview, // 如果没有上传新头像，则使用当前头像
      };

      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const config = {
        method: "post",
        url: "https://apifoxmock.com/m1/4808550-4462943-default/api/updateProfile",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      axios(config)
        .then((response) => {
          if (response.data.status === "success") {
            // 更新 localStorage 中的用户信息
            const updatedUser = {
              name: this.username,
              avatar: this.avatar
                ? URL.createObjectURL(this.avatar)
                : this.avatarPreview,
              phone: this.phone,
              gender: this.gender,
              birthdate: this.birthdate,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            this.showSuccess("个人信息修改成功！");
            this.isEditing = false;
          } else {
            this.showError(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          this.showError("个人信息修改失败，请稍后再试");
        });
    },
    showChangePasswordModal() {
      this.isChangePasswordModalVisible = true;
    },
    showChangePhoneModal() {
      this.isChangePhoneModalVisible = true;
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = "";
      }, 3000); // 错误信息3秒后消失
    },
    showSuccess(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = "";
      }, 2000); // 成功信息2秒后消失
    },
  },
};
</script>

<style scoped>
/* 样式保持不变 */
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("https://images.unsplash.com/photo-1571162478581-ad3d0c1057ab?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 半透明黑色覆盖层 */
  transition: none;
  /* 禁用过渡效果 */
  z-index: 1;
  pointer-events: none;
  /* 禁用指针事件 */
}

.info-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: center;
  align-items: center;
  background-color: white;
  border-radius: 5px;
}

.login-wrapper {
  position: relative;
  z-index: 2;
  /* 确保内容位于覆盖层之上 */
  width: 400px;
  height: 680px;
  /* 增加高度以适应更多字段 */
  padding: 10px 50px;
  font-size: 15px;
  margin-top: 40px; /* 增加这一行以向下移动内容，具体数值可以调整 */
}

a {
  text-decoration: none;
  color: gray;
}

a:hover {
  text-decoration: none;
  color: #d06a10;
}

.header {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  line-height: 40px;
  color: #dd8e0e;
  font-family: "Roboto", sans-serif; /* 使用自定义字体 */
  text-shadow: 2px 2px 4px rgba(251, 251, 103, 0.5); /* 添加文字阴影 */
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;

  width: 100%;
  margin: 20px 0;
  position: relative; /* 新增 */
}

.input-group p {
  margin: 0;
  width: 80px;
  /* 设定固定宽度，根据需要调整 */
}

.input-item {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 10px;
}

.required {
  color: red;
  margin-right: 5px;
}

button {
  margin-left: 10px;
}

.btn {
  width: 40%;
  padding: 15px;
  margin: 20px 0;
  text-align: center;
  background-color: #de6700;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #ff8e24;
}

.action-btn {
  padding: 5px 10px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: absolute; /* 固定 */
  right: 0; /* 右侧 */
}

.action-btn:hover {
  background-color: darkorange;
}
.error-popup {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 999;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to
  
  /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.avatar-preview {
  margin-top: 10px;
}

.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  /* 圆形头像 */
  object-fit: cover;
}
</style>

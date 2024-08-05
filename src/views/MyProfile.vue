<template>
  <div class="container">
    <div class="board"></div>
    <div class="info-wrapper">
      <div class="login-wrapper">
        <div class="header">个人信息</div>
        <div class="form-wrapper">
          <div class="input-group">
            <p>昵称</p>
            <div v-if="!isEditing">{{ username }}</div>
            <input v-else type="text" v-model="username" class="input-item" />
          </div>
          <div class="input-group">
            <p>密码</p>
            <div v-if="!isEditing">******</div>
            <div v-else>
              ****** <button class="action-btn" @click="showChangePasswordModal">修改密码</button>
            </div>
            <change-password-modal
              v-if="isChangePasswordModalVisible"
              @close="isChangePasswordModalVisible = false"
              :phone="phone"
              :old-password="password" />
          </div>
          <div class="input-group">
            <p>手机号</p>
            <div v-if="!isEditing">{{ phone }}</div>
            <div v-else>
              {{ phone }} <button class="action-btn" @click="showChangePhoneModal">手机改绑</button>
            </div>
          </div>
          <div class="input-group">
            <p>性别</p>
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
            <input v-else type="date" v-model="birthdate" :disabled="!isEditing" class="input-item" />
          </div>
          <div class="input-group">
            <p>头像</p>
            <input v-if="isEditing" type="file" @change="handleAvatarUpload" :disabled="!isEditing" />
          </div>
          <div class="avatar-preview">
            <img :src="avatarPreview || defaultAvatar" alt="头像预览" />
          </div>
          <div class="btn" @click="isEditing ? updateProfile() : isEditing = true">
            {{ isEditing ? '确认修改' : '编辑个人信息' }}
          </div>
        </div>
      </div>
    </div>
    <change-password-modal v-if="isChangePasswordModalVisible" @close="isChangePasswordModalVisible = false" />
    <change-phone-modal v-if="isChangePhoneModalVisible" @close="isChangePhoneModalVisible = false" />
  </div>
</template>


  
  <script>
  import axios from "axios";
  import ChangePasswordModal from '../components/ChangePasswordModal.vue';
  import ChangePhoneModal from '../components/ChangePhoneModal.vue';

  export default {
    components: {
      ChangePasswordModal,
      ChangePhoneModal,
    },
    data() {
      return {
        isEditing: false, // 控制是否处于编辑状态
        username: "", // 用户名
        password: "", // 密码
        phone: "", // 手机号
        gender: "", // 性别
        birthdate: "", // 出生日期
        avatar: null, // 上传的头像文件
        avatarPreview: null, // 头像预览URL
        defaultAvatar: new URL('../assets/defaultportrait.png', import.meta.url).href, // 默认头像
        isChangePasswordModalVisible: false, // 控制修改密码弹窗显示状态
        isChangePhoneModalVisible: false, // 控制修改手机号弹窗显示状态
      };
    },
    created() {
      this.fetchUserData(); // 组件创建时获取用户数据
    },
    methods: {
      // 获取用户数据
      fetchUserData() {
        const token = localStorage.getItem('token'); // 获取存储的 token

        const config = {
          method: "get",
          url: "http://127.0.0.1:4523/m1/4808550-0-default/api/account/getPersonInfo",
          headers: {
            "Authorization": `Bearer ${token}` // 在请求头中包含 token
          }
        };

        axios(config)
          .then(response => {
            if (response.data.getSuccess) {
              const user = response.data.response;
              // 设置用户数据
              this.username = user.accountName;
              this.phone = user.phoneNum;
              this.gender = user.gender;
              this.birthdate = user.birthDate;
              this.avatarPreview = user.portrait || this.defaultAvatar;
            } else {
              alert(response.data.msg); // 显示错误信息
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            alert("获取用户数据失败，请稍后再试");
          });
      },
      // 处理头像上传
      handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.avatar = file;
          this.avatarPreview = URL.createObjectURL(file); // 生成预览 URL
        }
      },
      // 更新用户信息
      updateProfile() {
        const token = localStorage.getItem('token'); // 获取存储的 token

        // 构建请求数据
        const data = {
          accountName: this.username,
          phoneNum: this.phone,
          gender: this.gender,
          birthDate: this.birthdate,
          portrait: this.avatar ? this.avatar : this.avatarPreview, // 如果没有上传新头像，则使用当前头像
          address: "", // 你可以在这里添加或处理地址字段
          name: "" // 你可以在这里添加或处理其他字段
        };

        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }

        const config = {
          method: "post",
          url: "http://127.0.0.1:4523/m1/4808550-0-default/api/Account/alterPersonInfo",
          headers: {
            "Authorization": `Bearer ${token}` // 在请求头中包含 token
          },
          data: formData,
        };

        axios(config)
          .then((response) => {
            if (response.data.alterSuccess) {
              alert("个人信息修改成功！"); // 修改成功提示
              // 更新 localStorage 中的用户信息
              const updatedUser = {
                accountName: this.username,
                portrait: this.avatar ? URL.createObjectURL(this.avatar) : this.avatarPreview,
                phoneNum: this.phone,
                gender: this.gender,
                birthDate: this.birthdate
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              this.isEditing = false; // 退出编辑状态
            } else {
              alert("修改失败，请稍后重试！"); // 修改失败提示
            }
          })
          .catch((error) => {
            console.log(error);
            alert("个人信息修改失败，请稍后再试");
          });
      },
      // 显示修改密码弹窗
      showChangePasswordModal() {
        this.isChangePasswordModalVisible = true;
      },
      // 显示修改手机号弹窗
      showChangePhoneModal() {
        this.isChangePhoneModalVisible = true;
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
  .board {
  background-image: url('@/assets/board.png'); /* 新的背景图片 */
  background-size:28%;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: -8%;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* 确保在 info-wrapper 之下 */
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
    color: #cb820d;
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
  
  .input-item {
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 10px;
  }
  .input-group p {
    margin: 0;
    width: 80px;
    font-weight: bold; /* 加粗字体 */
    color: #d38f35; /* 修改颜色 */
    font-size: large;
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
    font-weight: bold;
    font-size: 120%;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn:hover {
    background-color: #ff8e24;
  }
  
  .action-btn {
    padding: 7px 20px;
    background-color: orange;
    color: white;
    font-size: 100%;
    font-weight: bold;
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
    
  
  
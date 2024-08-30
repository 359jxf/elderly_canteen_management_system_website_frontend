<template>
  <div class="container">
    <div class="login-register-wrapper">
      <div class="login-section">
        <div class="header">用户登录</div>
        <div class="form-wrapper">
          <input
            type="tel"
            v-model="phonenumber"
            placeholder="请输入手机号"
            class="input-item"
            @input="validatePhoneNumber"
          />
          <div class="psd">
            <input
              type="password"
              v-model="password"
              placeholder="请输入密码"
              class="input-item"
              style="width: 70%"
            />
            <a href="/newpsd">忘记密码？</a>
          </div>
          <a href="/OTP">切换到手机号验证码登录>></a>
          <div class="btn" @click="login">登录</div>
        </div>
        <div class="msg">
          没有账号？
          <a href="/register">注册</a>
        </div>
      </div>
      <div class="poster-section"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      phonenumber: "",
      password: "",
    };
  },
  methods: {
    validatePhoneNumber() {
      // 只保留数字
      this.phonenumber = this.phonenumber.replace(/\D/g, "");
      // 限制最大长度为11位
      if (this.phonenumber.length > 11) {
        this.phonenumber = this.phonenumber.slice(0, 11);
      }
    },
    async login() {
      if (this.phonenumber.length !== 11) {
        alert("手机号必须为11位数字");
        return;
      }
      if (!this.phonenumber || !this.password) {
        alert("手机号和密码不能为空！");
        return;
      }
      try {
        const res = await axios.post("http://8.136.125.61/api/account/login", {
          phoneNum: this.phonenumber,
          password: this.password,
        });
        console.log(res.data.response);
        if (res.data.loginSuccess) {
          console.log("Login successful");
          console.log("Token:", res.data.response.token);
          console.log("Role:", res.data.response.identity);
          console.log("Username:", res.data.response.accountName);

          // 将 Token 存储在 localStorage
          localStorage.setItem("token", res.data.response.token);
          // 跳转到 /home 页面
          this.$router.push("/home");
        } else {
          console.log("Login not successful");
          alert(res.data.msg);
        }
      } catch (error) {
        console.log("Login error");
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          if (error.response.status === 404) {
            alert("记录不存在");
          } else if (error.response.status === 400) {
            alert("密码不正确");
          } else {
            alert("登录失败");
          }
        } else {
          // 一些其他的错误
          alert("登录失败");
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("https://images.unsplash.com/photo-1571162478581-ad3d0c1057ab?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2); /* 半透明黑色覆盖层 */
  z-index: 1;
}

.login-register-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  background-color: rgba(191, 136, 65, 0.7);
  width: 700px;
  height: 500px;
  box-shadow: 10px 20px 10px rgba(0, 0, 0, 0.5);
}

.login-section {
  width: 50%;
  padding: 40px;
  background-color: rgba(0, 0, 0, 0);
}

.poster-section {
  width: 80%;
  background-image: url("@/assets/poster.png");
  background-size: cover; /* 使背景图片覆盖整个元素 */
  background-position: center; /* 使背景图片居中 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
}

.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
}

.input-item {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 10px 0;
  background: none;
  font-size: 16px;
  outline: none;
  color: #fff;
  transition: border-color 0.3s;
}

.input-item::placeholder {
  color: #ccc;
}

.input-item:focus {
  border-bottom-color: darkorange;
}

.btn {
  text-align: center;
  padding: 10px;
  width: 100%;
  margin-top: 40px;
  margin-left: -10px;
  color: #fff;
  cursor: pointer;
  background-color: orange;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: darkorange;
}

.msg {
  text-align: center;
  line-height: 88px;
  color: #fff;
}

a {
  text-decoration: none;
  color: #ffe281;
}

a:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}

.psd {
  display: flex;
  align-items: center;
}

.psd a {
  margin-left: 10px;
  color: #d6d5d5;
  font-size: 12px;
}
</style>

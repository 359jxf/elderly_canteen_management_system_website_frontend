<template>
  <div class="container">
    <div class="wrapper">
      <div class="header">忘记密码</div>

      <div class="inputpart" v-if="step === 1">
        <label for="phonenumber">请输入手机号:</label>
        <input
          type="text"
          v-model="phonenumber"
          id="phonenumber"
          placeholder="手机号"
          @input="validatePhoneNumber"
        />
        <button :disabled="isButtonDisabled || !phonenumber" @click="sendOTP">
          {{ buttonText }}
        </button>

        <label
          for="otp"
          v-if="otpSent"
          style="margin-top: 10px; font-size: 15px"
          >请输入验证码:</label
        >
        <input
          type="text"
          v-if="otpSent"
          v-model="otp"
          id="otp"
          placeholder="验证码"
        />
        <button v-if="otpSent" @click="verifyOTP">下一步</button>
      </div>

      <div class="inputpart" v-else-if="step === 2">
        <label for="newPassword">请输入新的密码:</label>
        <input
          type="password"
          v-model="newPassword"
          id="newPassword"
          placeholder="新的密码"
        />

        <label for="confirmPassword">确认密码:</label>
        <input
          type="password"
          v-model="confirmPassword"
          id="confirmPassword"
          placeholder="确认密码"
        />

        <button @click="resetPassword">重置密码</button>
      </div>

      <div v-if="showSuccessMessage" class="success-message">
        密码重置成功,2秒后跳转...
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      step: 1,
      phonenumber: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
      buttonText: "发送验证码",
      isButtonDisabled: false,
      countdown: 60,
      showSuccessMessage: false,
      otpSent: false, // 标识是否已经发送了验证码
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
    sendOTP() {
      if (this.phonenumber.length !== 11) {
        alert("手机号必须为11位数字");
        return;
      }

      this.isButtonDisabled = true;
      this.buttonText = `成功发送，${this.countdown}s后重新发送`;

      // 发送验证码请求
      axios
        .post(
          "http://127.0.0.1:4523/m1/4808550-4462943-default/api/account/sendOTP",
          { phoneNum: this.phonenumber }
        )
        .then((response) => {
          if (response.data.success) {
            alert("验证码已发送到您的手机");
            this.otpSent = true;
            this.startCountdown();
          } else {
            alert(response.data.msg || "验证码发送失败，请稍后重试");
            this.resetButton();
          }
        })
        .catch((error) => {
          console.error("发送验证码失败", error);
          alert("验证码发送失败，请稍后再试");
          this.resetButton();
        });
    },
    startCountdown() {
      const countdownInterval = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--;
          this.buttonText = `成功发送，${this.countdown}s后重新发送`;
        } else {
          clearInterval(countdownInterval);
          this.resetButton();
        }
      }, 1000);
    },
    resetButton() {
      this.buttonText = "发送验证码";
      this.isButtonDisabled = false;
      this.countdown = 60;
    },
    verifyOTP() {
      if (!this.otp) {
        alert("请输入验证码");
        return;
      }

      // 验证验证码请求
      axios
        .post(
          "http://127.0.0.1:4523/m1/4808550-4462943-default/api/account/verifyOTP",
          {
            phoneNum: this.phonenumber,
            verifyCode: this.otp,
          }
        )
        .then((response) => {
          if (response.data.success) {
            alert("验证码验证成功");
            this.step = 2;
          } else {
            alert(response.data.msg || "验证码验证失败，请重试");
          }
        })
        .catch((error) => {
          console.error("验证码验证失败", error);
          alert("验证码验证失败，请稍后再试");
        });
    },
    resetPassword() {
      if (!this.newPassword || !this.confirmPassword) {
        alert("请输入新密码和确认密码");
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert("两次输入的密码不一致");
        return;
      }

      const data = {
        phoneNum: this.phonenumber,
        verifyCode: this.otp,
        newPassword: this.newPassword,
      };

      axios
        .post(
          "http://127.0.0.1:4523/m1/4808550-4462943-default/changePassword",
          data
        )
        .then((response) => {
          if (response.data.changeSuccess) {
            console.log("Login successful");
            console.log("Token:", response.data.response.token);
            console.log("Role:", response.data.response.identity);
            console.log("Username:", response.data.resposnse.accountName);

            // 将 Token 存储在 localStorage
            localStorage.setItem("token", response.data.response.token);

            this.showSuccessMessage = true;
            alert(response.data.msg);
            setTimeout(() => {
              this.$router.push("/Home");
            }, 2000);
          } else {
            alert(response.data.msg || "密码重置失败，请稍后重试");
          }
        })
        .catch((error) => {
          console.error("密码重置失败", error);
          alert("密码重置失败，请稍后再试");
        });
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

.wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(191, 136, 65, 0.7);
  width: 500px;
  height: 400px;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 10px 20px 10px rgba(0, 0, 0, 0.5);
}

.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  margin: 20px;
  color: orange;
}

.inputpart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  color: white;
  background-color: orange;
  border-radius: 10px;
  transition: background-color 0.3s;
  cursor: pointer;
}

button:hover {
  background-color: darkorange;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

input {
  margin: 20px;
  display: block;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 10px 0;
  background: none;
  font-size: 16px;
  outline: none;
  color: #fff;
  transition: border-color 0.3s;
}

input::placeholder {
  color: #ccc;
}

input:focus {
  border-bottom-color: darkorange;
}

label {
  color: #fff;
  font-size: 20px;
}

.success-message {
  color: #c6c4c4;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}
</style>

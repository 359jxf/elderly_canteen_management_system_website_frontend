<template>
  <div class="container">
    <div class="wrapper">
      <div class="header">忘记密码</div>

      <div class="inputpart" v-if="step === 1">
        <label for="phone">请输入手机号:</label>
        <input type="text" v-model="phone" id="phone" placeholder="手机号" />
        <button :disabled="isButtonDisabled || !phone" @click="sendOTP">
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
export default {
  data() {
    return {
      step: 1,
      phone: "",
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
    sendOTP() {
      if (!this.phone) {
        alert("请输入手机号");
        return;
      }

      this.isButtonDisabled = true;
      this.buttonText = `成功发送，${this.countdown}s后重新发送`;

      // 模拟发送验证码请求
      setTimeout(() => {
        alert("验证码已发送到您的手机");
        this.otpSent = true;
      }, 1000);

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

      // 模拟验证码验证请求
      setTimeout(() => {
        alert("验证码验证成功");
        this.step = 2;
      }, 1000);
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

      // 模拟重置密码请求
      setTimeout(() => {
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.$router.push("/Home");
        }, 2000);
      }, 1000);
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

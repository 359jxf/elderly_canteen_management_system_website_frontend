<template>
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="header">改绑手机</div>
          <button class="close" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <p>新手机号：</p>
            <input type="text" v-model="newPhone" />
            <button
              :class="{ disabledButton: isButtonDisabled, enabledButton: !isButtonDisabled }"
              :disabled="isButtonDisabled"
              @click="sendOTP"
            >
              {{ buttonText }}
            </button>
            <div v-if="otpSent" class="info">验证码已发送</div>
          </div>
          <div class="input-group">
            <p>验证码：</p>
            <input type="text" v-model="otp" />
            <div v-if="verificationStatus === 'success'" class="success">验证成功</div>
            <div v-if="verificationStatus === 'failure'" class="error">验证失败</div>
          </div>
          <div class="btn" @click="changePhone">确认改绑</div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
    import axios from 'axios';

    export default {
    name: 'ChangePhoneModal',
    data() {
        return {
        newPhone: '',
        otp: '',
        otpSent: false,
        verificationStatus: '', // 'success' or 'failure'
        buttonText: "发送验证码",
        isButtonDisabled: false,
        countdown: 60,
        };
    },
    methods: {
        async sendOTP() {
        if (!this.newPhone) {
            alert("请输入新手机号");
            return;
        }

        this.isButtonDisabled = true;
        this.buttonText = `成功发送，${this.countdown}s后重新发送`;

        try {
            // 发送验证码逻辑
            await axios.post('https://localhost:7289/api/accounts/sendOTP', { phone: this.newPhone });

            alert("验证码已发送到您的手机");
            this.otpSent = true;

            const countdownInterval = setInterval(() => {
            if (this.countdown > 1) {
                this.countdown--;
                this.buttonText = `成功发送，${this.countdown}s后重新发送`;
            } else {
                clearInterval(countdownInterval);
                this.resetButton();
            }
            }, 1000);
        } catch (error) {
            alert("发送验证码失败，请稍后再试");
            this.resetButton();
        }
        },
        resetButton() {
        this.buttonText = "发送验证码";
        this.isButtonDisabled = false;
        this.countdown = 60;
        },
        async changePhone() {
        if (!this.otp) {
            alert("请输入验证码");
            return;
        }

        try {
            // 验证验证码逻辑
            const res = await axios.post('https://localhost:7289/api/accounts/verifyOTP', {
            phone: this.newPhone,
            otp: this.otp,
            });

            if (res.data.success) {
            this.verificationStatus = 'success';

            // 更新手机号逻辑
            const updateRes = await axios.post('https://localhost:7289/api/accounts/updatePhone', {
                newPhone: this.newPhone,
            });

            if (updateRes.data.success) {
                alert('改绑成功');
                this.$emit('close');
                this.$router.push('/profile');
            } else {
                alert(updateRes.data.message);
            }
            } else {
            this.verificationStatus = 'failure';
            alert(res.data.message);
            }
        } catch (error) {
            this.verificationStatus = 'failure';
            alert("验证失败，请稍后再试");
        }
        }
    }
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
    font-family: 'Roboto', sans-serif; /* 使用自定义字体 */
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

    .input-group button {
    margin-left: 10px;
    padding: 5px 10px;
    border: none;
    background: orange;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    }

    .input-group .info {
    color: green;
    margin-left: 10px;
    }

    .input-group .success {
    color: green;
    margin-left: 10px;
    }

    .input-group .error {
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

    .disabledButton {
    background: grey;
    cursor: not-allowed;
    }
</style>


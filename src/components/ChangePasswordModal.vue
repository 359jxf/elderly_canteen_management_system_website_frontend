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
            <a @click="forgotPassword">忘记密码?</a>
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
  export default {
    name: 'ChangePasswordModal',
    props: {
        phone: {
            type: String,
            required: true
        }
    },
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        passwordMismatch: false,
        errorMessage: '',
      };
    },
    methods: {
      forgotPassword() {
        this.$emit('close');
        // 这里可以调用显示忘记密码弹窗的逻辑
        this.$router.push({ path: '/newpsd', query: { from: 'change-password', phone:this.phone} });
      },
      changePassword() {
        if (this.newPassword !== this.confirmPassword) {
          this.passwordMismatch = true;
          return;
        }
  
        // 检查原密码是否正确的逻辑
        axios.post('https://apifoxmock.com/m1/4808550-4462943-default/api/checkPassword', {
          oldPassword: this.oldPassword,
        }).then(response => {
          if (response.data.success) {
            // 更新密码的逻辑
            axios.post('https://apifoxmock.com/m1/4808550-4462943-default/api/updatePassword', {
              newPassword: this.newPassword,
            }).then(response => {
              if (response.data.success) {
                this.$emit('close');
                alert('密码修改成功');
              } else {
                this.errorMessage = response.data.message;
              }
            });
          } else {
            this.errorMessage = '原密码不正确';
          }
        }).catch(error => {
          console.log(error);
          this.errorMessage = '修改密码失败，请稍后再试';
        });
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
    padding: 0 0px 10px 0px; /* 上边距为0，其余边距为10px */
    border-radius: 10px;
    width: 500px;
    height:25%;
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
    color:white;
    padding: 15px 20px;
    margin-bottom: -1px;
    position: sticky;
    top: 0;
    z-index: 1000;
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
  </style>
  
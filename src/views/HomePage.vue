<template>
  <div>
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-left">
        <span class="canteen-name">老人食堂</span>
      </div>
      <div class="header-right">
        <img :src="user.avatar" alt="Avatar" class="avatar" @click="goToProfile">
        <span class="username">{{ user.name }}，你好！</span>
      </div>
    </div>

    <!-- 老人图片 -->
    <div class="old-banner">
      <img src="@/assets/old.png" alt="Donate" class="old-image">
    </div>
    <!-- 轮播图和捐赠公示 -->
    <div class="main-section">
      <div class="showImg">
        <!-- 轮播图片 -->
        <img @mouseover="changeInterval(true)" 
             @mouseleave="changeInterval(false)"  
             v-for="(item) in imgArr" 
             :key="item.id"
             :src="item.url" 
             alt="暂无图片" 
             v-show="item.id===currentIndex">

        <!-- 左侧按钮 -->
        <div @click="clickIcon('up')" class="iconDiv icon-left">
          <i class="el-icon-caret-left"></i>
        </div>

        <!-- 右侧按钮 -->
        <div @click="clickIcon('down')" class="iconDiv icon-right">
          <i class="el-icon-caret-right"></i>
        </div>

        <!-- 控制圆点 -->
        <div class="banner-circle">
          <ul>
            <li @click="changeImg(item.id)" 
                v-for="(item) in imgArr" 
                :key="item.id"
                :class="item.id===currentIndex ? 'active' : ''">
            </li>
          </ul>
        </div>
      </div>
      <!-- 捐赠公示部分 -->
      <div class="donation-section" :style="{ backgroundImage: `url(${donateImage})` }">
       <div class="donation-info">
        <h3>捐赠公示</h3>
        <ul>
          <li v-for="(item, index) in donationList" :key="index">
            <span>{{ item.name }}</span>
            <span>{{ item.amount }}元</span>
            <span>{{ item.date }}</span>
          </li>
        </ul>
        <button @click="showDonationModal" class="donate-button">我也要捐赠</button>
       </div>
      </div>

      <!-- 捐赠弹窗 -->
      <div v-if="isDonationModalVisible" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>我要捐赠</h3>
            <button class="close" @click="closeDonationModal">&times;</button>
          </div>
          <div class="modal-body">
            <label>姓名:</label>
            <input type="text" v-model="donorName">
            <label>金额:</label>
            <input type="number" v-model="donationAmount">
            <img :src="qrCodeImage" alt="QR Code" class="qr-code">
            <button @click="donate" class="confirm-button">确认捐赠</button>
            <!-- 提示信息 -->
            <transition name="fade">
              <div v-if="message" class="toast">{{ message }}</div>
            </transition>
          </div>
        </div> 
      </div>
    </div>
    
    <!-- 菜单部分 -->
    <div class="menu-section">
      <div class="menu-header">本周菜单</div>
      <div class="menu-content">
        <div v-for="(menu, index) in weeklyMenu" :key="index" class="menu-day">
          <div class="menu-day-header">{{ menu.day }}</div>
          <ul>
            <li v-for="(dish, dishIndex) in menu.dishes" :key="dishIndex">{{ dish }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 餐厅促销 -->
    <div class="promotion-section">
      <div class="promotion-header">本周促销</div>
      <div class="promotion-content">
        <div v-for="(promotion, index) in promotions" :key="index" class="promotion-item">
          <img :src="promotion.image" alt="Promotion Image">
          <div class="promotion-info">
            <div class="promotion-name">{{ promotion.name }}</div>
            <div class="promotion-price">{{ promotion.price }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 餐厅评价 -->
    <div class="reviews-section">
      <div class="reviews-header">餐厅评价</div>
      <div class="reviews-content">
        <div v-for="(review, index) in reviews" :key="index" class="review-item">
          <div class="review-rating">
            <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= review.rating }">&#9733;</span>
          </div>
          <div class="review-text">{{ review.text }}</div>
          <div class="review-date">{{ review.date }}</div>
        </div>
      </div>
    </div>

    <!-- 底部餐厅信息 -->
    <div class="footer">
      <div class="contact-info">
        <div class="contact-header">联系方式</div>
        <p>地址: XXXXXXXXX</p>
        <p>电话: XXXXXXXXX</p>
      </div>
      <div class="qrcode">
        <div class="qrcode-header">点餐小程序码</div>
        <img src="@/assets/qr-code.png" alt="QR Code" class="qr-code">
      </div>
      <div class="restaurant-info">
        <div class="restaurant-name">老人食堂</div>
        <img src="@/assets/logo.png" alt="Restaurant Logo" class="restaurant-logo">
      </div>
    </div>
  </div>
</template>

<script>
import donateImage from '@/assets/donate.png';
import qrCodeImage from '@/assets/qr-code.png';

export default {
  data() {
    return {
      donateImage, // 将背景图片路径添加到 data 中
      user: {
        name: "",
        avatar: ""
      },
      currentIndex: 0,
      timer: null,
      imgArr: [
        { id: 0, url: new URL('../assets/1.png', import.meta.url).href },
        { id: 1, url: new URL('../assets/2.png', import.meta.url).href },
        { id: 2, url: new URL('../assets/3.png', import.meta.url).href },
        { id: 3, url: new URL('../assets/4.png', import.meta.url).href },
        { id: 4, url: new URL('../assets/5.png', import.meta.url).href }
      ],
      donationList: [
        { name: '张三', amount: '200', date: '2024/07/09' },
        { name: '李四', amount: '400', date: '2024/07/10' },
        { name: '王五', amount: '50', date: '2024/07/11' },
        { name: '赵六', amount: '1000', date: '2024/07/12' },
        { name: '孙七', amount: '200', date: '2024/07/13' }
      ],
      weeklyMenu: [
        { day: '周一', dishes: ['蒸煮排骨', '炒青菜', '米饭'] },
        { day: '周二', dishes: ['红烧肉', '炒青菜', '米饭'] },
        { day: '周三', dishes: ['清蒸鱼', '炒青菜', '米饭'] },
        { day: '周四', dishes: ['土豆炖牛肉', '炒青菜', '米饭'] },
        { day: '周五', dishes: ['红烧排骨', '炒青菜', '米饭'] },
        { day: '周六', dishes: ['清蒸鸡', '炒青菜', '米饭'] },
        { day: '周日', dishes: ['红烧鸭', '炒青菜', '米饭'] }
      ],
      promotions: [
        { name: '番茄炒蛋', price: '¥9', image: new URL('../assets/1.png', import.meta.url).href },
        { name: '西红柿炒牛肉', price: '¥10', image: new URL('../assets/2.png', import.meta.url).href },
        { name: '红烧排骨', price: '¥12', image: new URL('../assets/3.png', import.meta.url).href }
      ],
      reviews: [
        { rating: 4, text: '很好吃！', date: '2024/07/11' },
        { rating: 5, text: '非常棒的体验。', date: '2024/07/10' },
        { rating: 3, text: '一般般。', date: '2024/07/09' }
      ],
      isDonationModalVisible: false,
      donationName: '',
      donationAmount: 0,
      donateImage,
      qrCodeImage,
      message: "" // 新增的 message 数据属性,用于捐赠弹窗
    };
  },
  methods: {
    startInterval() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > this.imgArr.length - 1) {
          this.currentIndex = 0;
        }
      }, 3000);
    },
    clickIcon(val) {
      if (val === 'down') {
        this.currentIndex++;
        if (this.currentIndex === this.imgArr.length) {
          this.currentIndex = 0;
        }
      } else {
        if (this.currentIndex === 0) {
          this.currentIndex = this.imgArr.length;
        }
        this.currentIndex--;
      }
    },
    changeImg(index) {
      this.currentIndex = index;
    },
    changeInterval(val) {
      if (val) {
        clearInterval(this.timer);
      } else {
        this.startInterval();
      }
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    fetchUserData() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.user.name = user.name;
        this.user.avatar = user.avatar || new URL('../assets/defaultportrait.png', import.meta.url).href;
      }
      else{
        this.user.avatar = new URL('../assets/defaultportrait.png', import.meta.url).href;
      }
    },
    showDonationModal() {
      this.isDonationModalVisible = true;
    },
    closeDonationModal() {
      this.isDonationModalVisible = false;
    },
    submitDonation() {
      if (this.donationName && this.donationAmount > 0) {
        this.donations.push({
          name: this.donationName,
          amount: `${this.donationAmount}元`,
          date: new Date().toISOString().split('T')[0],
        });
        alert('捐赠成功，感谢您的支持~');
        this.isDonationModalVisible = false;
        this.donationName = '';
        this.donationAmount = 0;
      } else {
        alert('请填写姓名和捐赠金额');
      }
    },
    donate() {
      this.message = "捐赠成功，感谢您的支持~";
      setTimeout(() => {
        this.message = "";
        this.closeDonationModal();
      }, 2000); // 提示信息显示2秒后消失
    },
  },
  mounted() {
    this.startInterval();
    this.fetchUserData();
  }
};
</script>


<style scoped>
* {
  padding: 0;
  margin: 0;
}
/* 清除li前面的圆点 */
li {
  list-style-type: none;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ecaf6e;
  padding: 20px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-left {
  font-size: 24px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.canteen-name {
  color: #333;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
.username {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}
/* 老人图片样式 */
.old-banner {
  width: 100%;
  display: flex;
  justify-content: center;
}

.old-image {
  width: 100%;
  height: auto;
}
.showImg {
  position: relative;
  width: 80%;
  height: 400px;
  margin: 50px auto;
  overflow: hidden;
}
/* 轮播图片 */
.showImg img {
  width: 100%;
  height: 100%;
}

/* 箭头图标 */
.iconDiv {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border: 1px solid #666;
  border-radius: 15px;
  background-color: rgba(125, 125, 125, 0.2);
  line-height: 30px;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
}
.iconDiv:hover {
  background-color: white;
}
.icon-left {
  left: 10px;
}
.icon-right {
  right: 10px;
}

/* 控制圆点 */
.banner-circle {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20px;
}
.banner-circle ul {
  margin: 0 50px;
  height: 100%;
  text-align: right;
}
.banner-circle ul li {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 5px;
  border-radius: 7px;
  background-color: rgba(125, 125, 125, 0.8);
  cursor: pointer;
}
.active {
  background-color: black !important; 
}

.main-section {
  display: flex;
  justify-content: space-between;
}
.showImg{
  position: relative;
  width: 100%;
  padding-top: 16.25%; /* 16:9 的比例，可以根据需要调整 */
  margin: 0 auto;
  overflow: hidden;
}

/* 轮播图片 */
.showImg img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持图片的长宽比，裁剪部分内容以适应容器 */
  object-position: center; /* 将图片居中显示 */
}

/* 捐赠公示样式 */
.donation-section {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url('@/assets/donate.png');
  background-size: cover;
  background-position: center;
  padding: 20px;
  border-radius: 10px;
  margin: 35px 0;
  width:40%;
}

.donation-info {
  position:absolute;
  top: 15%;
  left: 52%;
  height: 72%;
  transform: translateX(-50%);
  background: rgba(243, 246, 198, 0.834);
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  width: 100%;
}

.donation-info h3 {
  margin-bottom: 10px;
}

.donation-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.donation-info li {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
  line-height: 1.8; /* 调整行距 */
}

.donation-info li span {
  flex: 1;
  text-align: center;
}

.donate-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ef607a;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.donate-button:hover {
  background-color: #0056b3;
}

/* 捐赠弹窗样式 */
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

.close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.qr-code {
  width: 100px;
  height: 100px;
  display: block;
  margin: 10px auto;
}

.confirm-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #0056b3;
}
.toast {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  opacity: 0.9;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
/*其他菜单部分*/
.menu-section, .promotion-section, .reviews-section {
  margin: 20px;
}

.menu-header, .promotion-header, .reviews-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.menu-content {
  display: flex;
  justify-content: space-between;
}

.menu-day {
  width: 13%;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
}

.menu-day-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.promotion-content {
  display: flex;
  justify-content: space-between;
}

.promotion-item {
  width: 30%;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
}

.promotion-info {
  margin-top: 10px;
}

.promotion-name {
  font-size: 18px;
  font-weight: bold;
}

.promotion-price {
  color: red;
  font-size: 18px;
}

.reviews-content {
  display: flex;
  overflow-x: scroll;
}

.review-item {
  width: 30%;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
}

.review-rating {
  margin-bottom: 10px;
}

.star {
  color: #ffd700;
  font-size: 20px;
}

.filled {
  color: #ffd700;
}

.review-text {
  font-size: 16px;
}

.review-date {
  margin-top: 10px;
  font-size: 14px;
  color: gray;
}

.footer {
  display: flex;
  justify-content: space-between;
  background-color: #ffddb1;
  padding: 20px;
  border-top: 1px solid #e7e7e7;
}

.contact-info, .restaurant-info {
  width: 30%;
  color:#e1810b;
  
}
.qrcode {
  color:#e1810b;
  margin-right: 50px;
}

.contact-header, .qrcode-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;

}

.restaurant-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.restaurant-logo {
  display: block;
  margin: 0 auto;
}
</style>




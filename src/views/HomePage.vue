<template>
  <div>
    <!-- 顶部栏 -->
    <div class="header">
      <div class="header-left">
        <span class="canteen-name">老人食堂</span>
      </div>
      <div class="header-right">
        <img
          :src="user.avatar"
          alt="Avatar"
          class="avatar"
          @click="goToProfile"
        />
        <span class="username">{{ user.name }}，你好！</span>
      </div>
    </div>

    <!-- 老人图片 -->
    <div class="old-banner">
      <img src="@/assets/old.png" alt="Donate" class="old-image" />
    </div>
    <!-- 介绍和轮播图 -->
    <div class="main-section">
      <div class="buttons" @click="prevSlide">←</div>

      <div class="intro">
        <div class="text-carousel">
          <div
            v-for="(item, index) in texts"
            :key="index"
            :class="['text-slide', { active: currentIndex === index }]"
            :style="item.style"
          >
            <span v-html="item.text"></span>
          </div>
          <div
            v-for="(item, index) in subtexts"
            :key="index"
            :class="['text-slide', { active: currentIndex === index }]"
            :style="item.style"
          >
            <span v-html="item.text"></span>
          </div>
        </div>
      </div>

      <div class="showImg">
        <div class="image-carousel">
          <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            :class="['image-slide', { active: currentIndex === index }]"
          />
        </div>
      </div>
      <div class="buttons" @click="nextSlide">→</div>
    </div>

    <!-- 菜品列表 -->
    <div class="chartFrame">
      <div class="chartLeft">
        <h1 style="color: orange; margin-bottom: 20px">
          【轻松搜寻】你的美食指南
        </h1>
        <p>不确定今天吃什么？只需输入关键词，快速找到你想吃的菜品！</p>
        <div class="search">
          <img src="../assets/search.png" alt="Search Icon" />
          <input
            type="text"
            name="menuSearch"
            id="menuSearch"
            placeholder="搜索您感兴趣的菜"
            @input="searchMenuItems"
            v-model="temSearchQuery"
          />
        </div>
        <div class="menucharttext">
          <div>
            <h1 style="color: darkblue; font-size: 25px; margin-bottom: 20px">
              【人气榜单】最受欢迎的美味
            </h1>
            <p>查看最热门的菜品，跟着大家的选择，享受美味！</p>
          </div>
          <div class="rankpoint">
            <img src="../assets/rankpoint.gif" alt="Search Icon" />
          </div>
        </div>
      </div>
      <div class="menuChart">
        <!--没有进行搜索的情况（初始化）-->
        <div v-if="searchResult.length == 0 && searchQuery == ''">
          <div v-for="item in menuItems" :key="item.id" class="menuItem">
            <div class="rank">{{ item.RANK }}</div>
            <div class="dishImg"><img :src="item.PICTURE" /></div>
            <!-- 根据class名称修改 -->
            <div class="dishIofo">
              <div class="dishName" style="font-size: 20px; margin-bottom: 5px">
                {{ item.DISH_NAME }}
              </div>
              <div class="dishCat">类别：{{ item.DISH_NAME }}</div>
              <div class="dishSale" style="color: #218380">
                销量：{{ item.DISH_NAME }}
              </div>
            </div>
            <!-- 稍微对齐一下 -->
            <div
              class="dishPrice"
              style="color: #db962b; font-weight: bold; margin-left: 10px"
            >
              ￥{{ item.DISH_NAME }}
            </div>
          </div>
        </div>
        <!--成功搜索的情况-->
        <div v-else-if="searchResult.length != 0">
          <div v-for="item in searchResult" :key="item.id" class="menuItem">
            <div class="rank">{{ item.RANK }}</div>
            <div class="dishImg"><img :src="item.PICTURE" /></div>
            <div class="dish">{{ item.DISH_NAME }}</div>
          </div>
        </div>
        <!--搜索失败-->
        <div v-else>
          <div class="menuItem" id="noneItem">暂无信息</div>
        </div>
      </div>
    </div>

    <!-- 每周菜单 -->
    <div>
      <h1>本周菜单</h1>
      <div class="menuFrame">
        <div v-for="(day, index) in weekMenu" :key="index" :class="day.name">
          <h2>{{ day.name }}</h2>
          <div
            v-for="item in day.items"
            :key="item.DISH_ID"
            class="weeklyMenuItem"
          >
            {{ item.DISH_NAME }}
          </div>
        </div>
      </div>
    </div>

    <!-- 本周促销 -->
    <div class="weekDiscount">
      <h1>本周促销</h1>
      <div class="menuFrame">
        <div v-for="item in dishOnSale" :key="item.id" class="dishOnSaleItem">
          <div class="dishImg"><img :src="item.PICTURE" /></div>
          <div class="dishName">{{ item.DISH_NAME }}</div>
          <div class="oriPrice">￥{{ item.PRICE }}</div>
          <div class="disPrice">￥{{ item.DIS_PRICE }}</div>
        </div>
      </div>
    </div>

    <!-- 餐厅评价 -->
    <div class="reviewsToCanteen">
      <div class="head">
        <div class="canteenScore">
          <h2 id="comprehensiveScoreText">综合评分：</h2>
          <div class="comprehensiveStars">
            <template v-for="n in 5" :key="n">
              <span
                :class="
                  n <= comprehensiveScore / 2 ? 'star yellow' : 'star gray'
                "
              ></span>
            </template>
          </div>
          <h2 id="comprehensiveScore">{{ comprehensiveScore }} 分</h2>
        </div>
        <h1 >您的评分是我们最大的动力!</h1>
      </div>
      <div class="commentFrame">
        <div
          v-for="(comment, index) in comments"
          :key="index"
          class="singleComment"
        >
          <div class="singleCommentHead">
            <div class="commentStars">
              <template v-for="n in 5" :key="n">
                <span
                  :class="
                    n <= comment.C_STARS / 2 ? 'star yellow' : 'star gray'
                  "
                ></span>
              </template>
            </div>
            <h4 id="commentScore">{{ comment.C_STARS }} 分</h4>
          </div>
          <div class="commentText">
            {{ comment.C_REVIEW_TEXT || "该用户未留下评价文本。" }}
          </div>
        </div>
      </div>
    </div>

    <!-- 捐赠公示部分 -->
    <div
      class="donation-section"
      :style="{ backgroundImage: `url(${donateImage})` }"
    >
      <div class="donation-info">
        <h3>捐赠公示</h3>
        <ul>
          <li v-for="(item, index) in donationList" :key="index">
            <span>{{ item.name }}</span>
            <span>{{ item.amount }}元</span>
            <span>{{ item.date }}</span>
          </li>
        </ul>
        <button @click="showDonationModal" class="donate-button">
          我也要捐赠
        </button>
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
          <div class="image-column">
            <img src="@/assets/donating.png" alt="Donating" class="donating-image" />
          </div>
          <div class="form-column">
            <label><b>请输入您的署名:</b></label>
            <input type="string" v-model="donationName" />
            <label><b>请输入您的捐赠金额:</b></label>
            <input type="number" v-model="donationAmount" @input="validateDonationAmount" />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div class="payment-methods">
              <button class="wechat" @click="selectPaymentMethod('wechat')" :class="{ selected: paymentMethod === 'wechat' }">微信支付</button>
              <button class="alipay" @click="selectPaymentMethod('alipay')" :class="{ selected: paymentMethod === 'alipay' }">支付宝支付</button>
            </div>
            <img v-if="paymentMethod === 'wechat'" :src="qrCodeImage" alt="WeChat QR Code" class="qr-code" />
            <img v-if="paymentMethod === 'alipay'" :src="qrCodeImage" alt="Alipay QR Code" class="qr-code" />
            <button @click="donate" class="confirm-button">确认捐赠</button>
          </div>
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
        <img src="@/assets/qr-code.png" alt="QR Code" class="qr-code" />
      </div>
      <div class="restaurant-info">
        <div class="restaurant-name">老人食堂</div>
        <img
          src="@/assets/logo.png"
          alt="Restaurant Logo"
          class="restaurant-logo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import donateImage from "@/assets/donate.png";
import qrCodeImage from "@/assets/qr-code.png";

export default {
  data() {
    return {
      user: {
        name: "",
        avatar: "",
      },

      currentIndex: 0,
      texts: [
        {
          text: "在这里，每一口都是关爱",
          style: {
            color: "#FC6621",
            fontSize: "40px",
            fontWeight: "bold",
          },
        },
        {
          text: "便捷生活，从一餐开始",
          style: { color: "#218380", fontSize: "40px", fontWeight: "bold" },
        },
        {
          text: "邻里相约，共话桑麻",
          style: { color: "#ff85cb", fontSize: "40px", fontWeight: "bold" },
        },
      ],
      subtexts: [
        {
          text: "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; —— 长者食堂，让晚年不缺味道",
          style: { fontSize: "25px" },
        },
        {
          text: "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; —— 老人认证，轻松享用美味",
          style: { fontSize: "25px" },
        },
        {
          text: "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; —— 在这里，每一次相聚都充满意义",
          style: { fontSize: "25px" },
        },
      ],
      images: [
        "https://images.unsplash.com/photo-1562571708-527276a391ac?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1560341208-305f47d5e901?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1559560329-e4b17eb5726b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      timer: null,

      donationList: [],
      menuItems: [],
      temSearchQuery: "",
      searchQuery: "",
      searchResult: [],

      weekMenu: [
        { name: "周一", date: "", items: [] },
        { name: "周二", date: "", items: [] },
        { name: "周三", date: "", items: [] },
        { name: "周四", date: "", items: [] },
        { name: "周五", date: "", items: [] },
        { name: "周六", date: "", items: [] },
        { name: "周日", date: "", items: [] },
      ],

      dishOnSale: [],

      comprehensiveScore: 0,
      comments: [],

      isDonationModalVisible: false,
      donationName: "",
      donationAmount: 0,
      donateImage,
      qrCodeImage,
      message: "", // 新增的 message 数据属性,用于捐赠弹窗
      errorMessage: "",//错误消息，提示输入的金额有误
    };
  },
  created() {
    this.fetchDishs();
    this.getWeekDates();
    this.fetchMenus();
    this.findDishOnSale();
    this.getScoreAndComments();
    this.fetchDonations();
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.texts.length) % this.texts.length;
    },
    startAutoSlide() {
      this.timer = setInterval(this.nextSlide, 3000);
    },
    stopAutoSlide() {
      clearInterval(this.timer);
    },

    showDonationModal() {
      this.isDonationModalVisible = true;
    },
    closeDonationModal() {
      this.isDonationModalVisible = false;
      this.message = ""; // 清空提示信息
      this.errorMessage = ""; // 清空错误消息
      this.paymentMethod = null;
    },
   //获取捐赠列表
    fetchDonations() {
      axios.get('http://127.0.0.1:4523/m1/4808550-0-default/getDonationList/')
      .then(res => {
        console.log(res.data); // 检查完整的返回数据
        if (res.data && Array.isArray(res.data.responce)) {
          // 先对数据进行排序，然后再格式化金额
          this.donationList = res.data.responce
          .sort((a, b) => new Date(b.financeDate) - new Date(a.financeDate))
          .map(item => ({
            name: item.origin,
            amount: item.price.toFixed(2), // 将金额格式化为小数点后两位
            date: item.financeDate
          }));
        } else {
          console.error('Unexpected response data:', res.data);
        }
      })
      .catch(error => {
        console.error('Error fetching donations:', error);
      });
    },
    donate() {
      // 验证输入金额是否大于0
      if (this.donationAmount <= 0) {
        this.errorMessage = "请输入大于0的金额";
        return;
      }

      // 清空错误消息
      this.errorMessage = "";

      const donationAPI = "http://127.0.0.1:4523/m1/4808550-0-default/postDonation";
      const donationData = {
        accountId: this.user.accountId,
        amount: this.donationAmount,
        origin: this.donationName
      };

      axios
        .post(donationAPI, donationData)
        .then((response) => {
          if (response.data.success) {
            this.message = "捐赠成功！感谢您的支持！";
            alert(this.message);
            this.fetchDonations(); // 重新获取捐赠列表
            this.closeDonationModal(); // 关闭捐赠弹窗
          } else {
            this.message = "捐赠失败，请重试。";
            alert(this.message);
            this.fetchDonations(); // 重新获取捐赠列表
            this.closeDonationModal(); // 关闭捐赠弹窗
          }
        })
        .catch((error) => {
          console.error("捐赠失败", error);
          this.message = "捐赠失败，请重试。";
          alert(this.message);
            this.fetchDonations(); // 重新获取捐赠列表
            this.closeDonationModal(); // 关闭捐赠弹窗
        })
        .finally(() => {
          setTimeout(() => {
            this.closeDonationModal();
          }, 1500);
        });
    },
    selectPaymentMethod(method) {
      this.paymentMethod = method;
    },
    validateDonationAmount() {
      const value = this.donationAmount.toString();
      const decimalIndex = value.indexOf('.');

      if (decimalIndex >= 0 && value.length - decimalIndex - 1 > 2) {
        this.donationAmount = parseFloat(value).toFixed(2);
      }
    },
    fetchDishs() {
      const url =
        "http://127.0.0.1:4523/m1/4808550-4462943-default/getDishesList";
      axios
        .get(url)
        .then((res) => {
          console.log(res.data); // 检查完整的返回数据
          if (Array.isArray(res.data.response)) {
            this.menuItems = res.data.response;
          } else {
            console.error("Expected array but got:", res.data.response);
            this.menuItems = []; // 处理非数组数据
          }
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
          this.menuItems = [];
        });
    },

    searchMenuItems() {
      if (!Array.isArray(this.menuItems)) {
        console.error("menuItems is not an array:", this.menuItems);
        return;
      }
      this.searchQuery = this.temSearchQuery;
      this.searchResult = this.menuItems.filter((item) =>
        item.DISH_NAME.includes(this.searchQuery)
      );
    },

    getWeekDates() {
      const now = new Date();
      const day = now.getDay(); // 当前是周几，0 表示周日
      const currentMonday = new Date(now);

      // 确定本周一的日期
      currentMonday.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // 如果是周日，则回退6天；否则回退到上一个周一

      this.weekMenu.forEach((dayObj, index) => {
        const date = new Date(currentMonday);
        date.setDate(currentMonday.getDate() + index); // 将日期设置为当前周的某一天
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        dayObj.date = `${year}-${month}-${day}`;
      });
    },

    async fetchMenus() {
      try {
        // const response = await axios.get(
        //   "http://127.0.0.1:4523/m1/4808550-4462943-default/getWeekmenu"
        // );
        // const menuItems = response.data.response;
        //数据集不够，暂用静态数据代替，改week
        const menuItems = [
          {
            DISH_ID: "98",
            DISH_NAME: "身但金很命",
            WEEK: "2024-07-29",
          },
          {
            DISH_ID: "28",
            DISH_NAME: "使那来公强布",
            WEEK: "2024-07-30",
          },
          {
            DISH_ID: "98",
            DISH_NAME: "身但金很命",
            WEEK: "2024-07-31",
          },
          {
            DISH_ID: "28",
            DISH_NAME: "使那来公强布",
            WEEK: "2024-08-01",
          },
          {
            DISH_ID: "98",
            DISH_NAME: "身但金很命",
            WEEK: "2024-08-02",
          },
          {
            DISH_ID: "28",
            DISH_NAME: "使那来公强布",
            WEEK: "2024-08-03",
          },
          {
            DISH_ID: "98",
            DISH_NAME: "身但金很命",
            WEEK: "2024-08-04",
          },
        ];
        this.weekMenu.forEach((dayObj) => {
          dayObj.items = menuItems.filter((item) => item.WEEK === dayObj.date);
        });
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    },

    async findDishOnSale() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:4523/m1/4808550-4462943-default/getWeekDiscount"
        );
        const menuItems = response.data.response;
        this.dishOnSale = menuItems.filter(
          (item) => "DIS_PRICE" in item && item.DIS_PRICE !== undefined
        );
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    },

    async getScoreAndComments() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:4523/m1/4808550-4462943-default/getReviews"
        );
        this.comments = response.data.response;
        let totalStars = 0;
        let commentsCount = 0;
        this.comments.forEach((comment) => {
          if (comment.C_STARS != null) {
            totalStars += comment.C_STARS;
            commentsCount++;
          }
        });
        this.comprehensiveScore =
          commentsCount > 0
            ? parseFloat((totalStars / commentsCount).toFixed(2))
            : 0;
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    },
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
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
  background-color: rgba(255, 184, 73);
  padding: 10px 20px;
  margin-bottom: -1px;
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
  color: #ffffff;
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
  color: #ffffff;
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

/* 轮播图片 */
.main-section {
  background-image: url("@/assets/bg.png"); /* 背景图片路径 */
  background-size: 100% auto; /* 背景图片宽度对齐，高度自动调整 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  background-position: top; /* 背景图片居中对齐 */
  display: flex; /* 使用 flex 布局 */
  justify-content: center; /* 子元素水平居中 */
  align-items: center; /* 子元素垂直居中 */
  height: 70vh; /* 设置高度，根据需要调整 */
  width: 100%; /* 设置宽度 */
  margin-top: -2px;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: auto;
}

.intro,
.showImg {
  width: 50%;
}

.image-carousel {
  position: relative;
  width: 100%;
  height: 450px; /* 根据需要调整高度 */
  overflow: hidden;
  border-radius: 15px;
}

.image-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
}

.image-slide.active {
  opacity: 1;
}
.text-slide,
.image-slide {
  display: none;
}

.text-slide.active,
.image-slide.active {
  display: block;
}

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 7vw;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: #d6d6d6;
}

.buttons:hover {
  background-color: #8e8e8e;
}

/*其他菜单部分*/
h1 {
  margin-left: 15px;
  margin-bottom: 5px;
}
.chartFrame {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
  margin-top: -10vh;
}

.search {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  margin-bottom: 70px;
}
.search img {
  width: 40px;
  height: 40px;
  margin: 20px;
}
#menuSearch {
  width: 300px;
  height: 60px;
  border-radius: 30px;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 10px;
  border-color: #db962b;
  outline: none;
  box-shadow: 0 0px 15px rgba(180, 109, 27, 0.3);
}
.rankpoint {
  width: 100px;
  height: 100px;
  margin-left: 50px;
}
.rankpoint img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.menucharttext {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chartLeft {
  margin: 3vw;
  width: 30%;
  margin-left: 8vw;
}

.menuChart {
  margin: 5vw;
  margin-right: 8vw;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 70%;
  height: 500px;
}
.menuChart::-webkit-scrollbar {
  width: 5px; /* 滚动条宽度 */
}
.menuChart::-webkit-scrollbar-thumb {
  background-color: #cccccc; /* 滚动条滑块的颜色 */
  border-radius: 2.5px; /* 滚动条滑块的圆角 */
  opacity: 90%;
}
.menuChart::-webkit-scrollbar-track {
  opacity: 100%;
}
.menuChart .menuItem {
  display: flex;
  height: 120px;
  align-items: center;
  border-bottom: 1.5px solid #c5c5c5; /* 在每个列表项底部添加一条横线 */
}
.menuChart .menuItem:last-child {
  border-bottom: none; /* 移除最后一个列表项底部的横线 */
}
.rank {
  background-color: #db962b;
  height: 30px;
  width: 30px;
  margin: 10px;
  text-align: center;
  line-height: 2;
  color: #ccc;
}

.dishImg {
  height: 80px;
  width: 80px;
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止图片超出容器 */
  border-radius: 50%;
}
.dishImg img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

#noneItem {
  justify-content: center;
}

.menuFrame {
  height: 250px;
  padding: 5px;
  background-color: #fff3e0;
  border-radius: 15px;
  display: flex;
}
.menuFrame div {
  flex: 0 0 14.2857%;
  box-sizing: border-box;
  border-right: 1.5px solid #db962b;
  overflow-y: auto;
  overflow-x: hidden;
}

.menuFrame .SUN {
  border-right: none;
}
.menuFrame div h2 {
  height: 40px;
  color: #ffa822;
  background-color: #fff3e0;
  text-align: center;
  margin-top: 0px;
  margin-bottom: 5px;
  padding-top: 15px;
  position: sticky;
  top: 0px;
  z-index: 1;
}
.menuFrame .weeklyMenuItem {
  border: none;
  width: auto;
  text-align: center;
  font-size: 13px;
  margin-top: 7px;
  margin-bottom: 7px;
}
.menuFrame .weeklyMenuItem:first-child {
  margin-top: 0px;
}
.menuFrame .weeklyMenuItem:last-child {
  margin-bottom: 0px;
}

.dishOnSaleItem {
  flex: 0 0 14.2857%;
  border-right: 1.5px solid #db962b;
  box-sizing: border-box; /* 确保边框和内边距包含在元素的总宽度内 */
  display: flex;
  flex-direction: column; /* 垂直堆叠内容 */
  align-items: center;
  overflow: hidden;
}
.dishName {
  font-size: 14px;
  font-weight: bolder;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
}
.oriPrice {
  color: #cccccc;
  text-decoration: line-through;
  font-size: smaller;
  margin-top: 15px;
  margin-bottom: 15px;
  border: none;
}
.disPrice {
  color: red;
  font-weight: bolder;
  font-size: 17px;
  border: none;
}

.reviewsToCanteen {
  display: flex;
  flex-direction: column;
}
.head {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canteenScore {
  display: flex;
  align-items: center;
  margin: 30px;
  background-color: orange;
  padding: 15px 50px;
  height: 50px;
  border-radius: 50px;
  box-shadow: 0 0px 15px rgba(180, 109, 27, 0.5);
}
h2 {
  font-size: 20px;
  font-weight: lighter;
  margin-left: 10px;
}
.star {
  display: inline-block;
  width: 23px;
  height: 23px;
  margin: 3px 2px;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
}
.yellow {
  background-color: gold;
}
.gray {
  background-color: lightgray;
}
.commentFrame {
  display: flex;
  padding: 5px 0;
  height: 250px;
  background-color: #ffffff;
  border-radius: 15px;
  overflow-x: auto;
  align-items: center;
  box-sizing: border-box;
  border-left: 25px solid #ffffff;
  border-right: 25px solid #ffffff;
  margin: 20px;
}
.commentFrame::-webkit-scrollbar {
  height: 5px;
}
.commentFrame::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 2.5px;
}
.singleComment {
  background-color: white;
  height: 85%;
  flex: 0 0 25%;
  margin-left: 25px;
  border-radius: 5px;
  padding: 0 3%;
  box-sizing: border-box;
  box-shadow: 0 0px 15px rgba(149, 149, 149, 0.3);
}
.singleCommentHead {
  display: flex;
}
.commentStars {
  display: flex;
  margin-top: 25px;
}
.commentStars .star {
  width: 18px;
  height: 18px;
  margin: 5px 1px 0;
}
h4 {
  margin: 30px 0 0 auto;
}
.commentText {
  overflow-y: auto;
}
.commentText::-webkit-scrollbar {
  width: 5px;
}
.commentText::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 2.5px;
}

/* 捐赠公示样式 */
.donation-section {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url("@/assets/donate.png");
  background-size: cover;
  background-position: center;
  padding: 20px;
  border-radius: 10px;
  margin: 35px 0;
  width: 360px;
  height: 300px;
}

.donation-info {
  position: absolute;
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
  border-radius: 10px;
  width: 35%;
  display: flex;
  flex-direction:column;
  box-sizing: border-box;
  
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fcaa26; /* 背景色 */
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.modal-body {
  display: flex;
  flex-direction:row;
  align-items: center;
  padding: 20px;
  overflow: auto; /* 添加滚动条以防止内容溢出 */
  gap: 10px;
}

.close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.image-column {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  padding: 0;
  margin-bottom: 20px;
}

.donating-image {
  max-width: 100%;
  height: auto;
}

.form-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 10px; /* 设置各组件之间的边距 */
}

.form-column label {
  margin-bottom: 10px;
  font-size:150%;
  color:#e1810b;
}

.form-column input {
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}

.payment-methods,
.confirm-button {
  margin-bottom: 10px;
  width: 100%;
}

.payment-methods {
  display: flex;
  justify-content: space-around;
}

.wechat,
.alipay {
  padding: 10px;
  border: none;
  background-color: #3dc041;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  flex-grow: 1;
  margin: 0 5px;
}

.alipay {
  background-color: #5995ef;
}



.payment-methods button:hover {
  background-color: #d8a773;
  color: #fff;
}

.qr-code {
  width: 150px;
  height: 150px;
  display: block;
  margin: 10px auto;
  height: auto;
}

.error-message {
  color: red;
}

.confirm-button {
  padding: 5%;
  background-color: #ff5f82;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #a93c49;
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





.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/*食堂信息*/
.footer {
  display: flex;
  justify-content: space-between;
  background-color: #ffddb1;
  padding: 20px;
  border-top: 1px solid #e7e7e7;
}

.contact-info,
.restaurant-info {
  width: 30%;
  color: #e1810b;
}
.qrcode {
  color: #e1810b;
  margin-right: 50px;
}

.contact-header,
.qrcode-header {
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
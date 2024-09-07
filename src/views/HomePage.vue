<!-- views/HomePage.vue -->
<template>
  <div class="back">
    <Header :loggedIn="isLoggedIn" :user="currentUser" />
    <Banner />
    <Carousel :texts="texts" :subtexts="subtexts" :images="images" />
    <main>
      <MenuSearch :menuItems="menuItems" />
      <WeekMenu
        :mon="mon"
        :tue="tue"
        :wed="wed"
        :thu="thu"
        :fri="fri"
        :sat="sat"
        :sun="sun"
      />
      <WeekPromotion :dishOnSale="dishOnSale" />
      <RestaurantReviews
        :comprehensiveScore="comprehensiveScore"
        :comments="comments"
      />
      <DonationSection
        :loggedIn="isLoggedIn"
        :user="currentUser"
        :donationList="donationList"
        :scrollDuration="scrollDuration"
      />
      <Footer />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

import Header from "@/components/HomeHeader.vue";
import Banner from "@/components/HomeBanner.vue";
import Carousel from "@/components/HomeCarousel.vue";
import MenuSearch from "@/components/MenuSearch.vue";
import WeekMenu from "@/components/WeekMenu.vue";
import WeekPromotion from "@/components/WeekPromotion.vue";
import RestaurantReviews from "@/components/RestaurantReviews.vue";
import DonationSection from "@/components/DonationSection.vue";
import Footer from "@/components/HomeFooter.vue";

export default {
  components: {
    Header,
    Banner,
    Carousel,
    MenuSearch,
    WeekMenu,
    WeekPromotion,
    RestaurantReviews,
    DonationSection,
    Footer,
  },
  data() {
    return {
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

      menuItems: [],
      //weekdays[0]~weekdays[6]分别记录周一到周日的日期，格式为YYYY-MM-DD的string
      weekdays: [],
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],

      dishOnSale: [],

      comprehensiveScore: 0,
      comments: [],

      donationList: [],
      scrollDuration: 40,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "currentUser"]),
  },
  created() {
    this.checkAuth(); // 在页面创建时验证 token 是否有效
    this.fetchUserData();
    this.fetchDishs();
    this.getWeekDate();
    this.fetchMenus();
    this.findDishOnSale();
    this.getScoreAndComments();
    this.fetchDonations();
  },
  methods: {
    ...mapActions(["checkAuth", "login", "logout"]),
    fetchUserData() {
      if (this.isLoggedIn) {
        const token = localStorage.getItem("token");
        const config = {
          method: "get",
          url: "http://8.136.125.61/api/account/getPersonInfo",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios(config)
          .then((response) => {
            if (response.data.getSuccess) {
              const user = response.data.response;
              this.login({
                name: user.accountName,
                avatar: user.portrait || this.defaultAvatar,
                id: user.accountId,
              });
            } else {
              alert(response.data.msg);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            alert("获取用户数据失败，请稍后再试");
          });
      }
    },

    fetchDishs() {
      const url = "http://8.136.125.61/api/HomePage/dishes";
      axios
        .get(url)
        .then((res) => {
          console.log(res.data); // 检查完整的返回数据
          if (Array.isArray(res.data.response)) {
            const temMenuItems = res.data.response.sort(
              (a, b) => b.sale - a.sale
            ); // 暂时接收response并按销售量降序排序，等待下一步添加RANK属性
            this.menuItems = [...temMenuItems].map((item, index) => ({
              ...item,
              rank: index + 1, // 排名从1开始
            }));
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

    getWeekDate() {
      //获取本周一周七天的日期，格式YYYY-MM-DD
      const now = new Date();
      let day = now.getDay();
      if (day == 0) day = 7;
      let year = now.getFullYear();
      let month = now.getMonth() + 1; // 月份从0开始，所以需要加1
      let date = now.getDate();

      let monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 存每个月最大日期
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        // 判断是否闰年
        monthDay[1]++;
      }

      for (let i = 0; i < 7; i++) {
        // 形成本周每天的日期，放到weekdays中（同时处理日期边界问题）
        let targetDate = date - day + i + 1;
        let targetMonth = month;
        let targetYear = year;
        if (targetDate <= 0) {
          targetMonth--;
          if (targetMonth < 1) {
            targetMonth = 12;
            targetYear--;
          }
          targetDate += monthDay[targetMonth - 1];
        } else if (targetDate > monthDay[targetMonth - 1]) {
          targetDate -= monthDay[targetMonth - 1];
          targetMonth++;
          if (targetMonth > 12) {
            targetMonth = 1;
            targetYear++;
          }
        }
        this.weekdays[i] = `${targetYear}-${String(targetMonth).padStart(
          2,
          "0"
        )}-${String(targetDate).padStart(2, "0")}`;
      }
    },

    async fetchMenus() {
      try {
        const response = await axios.get(
          "http://8.136.125.61/api/HomePage/getWeekmenuAndWeekDiscount"
        );
        const menuItems = response.data.response;
        this.mon = menuItems.filter((item) => item.week === this.weekdays[0]);
        this.tue = menuItems.filter((item) => item.week === this.weekdays[1]);
        this.wed = menuItems.filter((item) => item.week === this.weekdays[2]);
        this.thu = menuItems.filter((item) => item.week === this.weekdays[3]);
        this.fri = menuItems.filter((item) => item.week === this.weekdays[4]);
        this.sat = menuItems.filter((item) => item.week === this.weekdays[5]);
        this.sun = menuItems.filter((item) => item.week === this.weekdays[6]);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    },

    async findDishOnSale() {
      try {
        const response = await axios.get(
          "http://8.136.125.61/api/HomePage/getDayDiscount"
        );
        const menuItems = response.data.response;
        // 初始化一个空对象来存储已遇到的菜品名称  
        const seenNames = {};    
        menuItems.forEach(item => {  
            // 检查菜品名称是否已被记录  
            if (!seenNames[item.dishName]) {  
              // 如果没有，则添加到dishOnSale和seenNames中  
              this.dishOnSale.push(item);  
              seenNames[item.dishName] = true;  
            }  
          
        });
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    },

    async getScoreAndComments() {
      try {
        const response = await axios.get(
          "http://8.136.125.61/api/HomePage/getReviews"
        );
        this.comments = response.data.response;
        let totalStars = 0;
        let commentsCount = 0;
        this.comments.forEach((comment) => {
          if (comment.cStars != null) {
            totalStars += comment.cStars;
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

    fetchDonations() {
      axios
        .get("http://8.136.125.61/api/Donate/getDonationList")
        .then((res) => {
          console.log(res.data); // 检查完整的返回数据
          if (res.data && Array.isArray(res.data.responce)) {
            // 先对数据进行排序，然后再格式化金额
            this.donationList = res.data.responce
              .sort((a, b) => new Date(b.financeDate) - new Date(a.financeDate))
              .map((item) => ({
                name: item.origin,
                amount: item.price.toFixed(2), // 将金额格式化为小数点后两位
                date: item.financeDate,
              }));
          } else {
            console.error("Unexpected response data:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching donations:", error);
        });
    },
  },
};
</script>

<style scoped>
.back {
  background-color: rgb(255, 255, 255);
}
</style>
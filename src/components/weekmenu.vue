<template>
    <div>
        <h1>本周菜单</h1>
        <div class="menuFrame">
            <div class="MON">
                <h2>周一</h2>
                <div v-for="item in mon" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
            <div class="TUE">
                <h2>周二</h2>
                <div v-for="item in tue" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
            <div class="WED">
                <h2>周三</h2>
                <div v-for="item in wed" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
            <div class="THU">
                <h2>周四</h2>
                <div v-for="item in thu" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
            <div class="FRI">
                <h2>周五</h2>
                <div v-for="item in fri" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
            <div class="SAT">
                <h2>周六</h2>
                <div v-for="item in sat" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
            <div class="SUN">
                <h2>周日</h2>
                <div v-for="item in sun" class="weeklyMenuItem">{{ item.DISH_NAME }}</div>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'weekmenu',
    data() {  
      return {  
        //weekdays[0]~weekdays[6]分别记录周一到周日的日期，格式为YYYY-MM-DD的string
        weekdays: [],
        //没加“day”的是数组，接收菜品
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
      };  
    },
    created() {
      this.getWeekDate();
      this.fetchMenus();  
    },
    methods: {  
      getWeekDate() {  //获取本周一周七天的日期，格式YYYY-MM-DD
        const now = new Date();
        const day = now.getDay();
        const year = now.getFullYear();  
        const month = now.getMonth() + 1; // 月份从0开始，所以需要加1
        const date = now.getDate();

        let monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 存每个月最大日期
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 ==0) { // 判断是否闰年
          monthDay[1]++;
        }

        for (let i=0; i<7; i++) { // 形成本周每天的日期，放到weekdays中（同时处理日期边界问题）
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
          }
          else if (targetDate > monthDay[targetMonth - 1]) {
            targetDate -= monthDay[targetMonth - 1];
            targetMonth++;
            if (targetMonth > 12) {
              targetMonth = 1;
              targetYear++;
            }
          }
          this.weekdays[i] = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(targetDate).padStart(2, '0')}`
        }
      },
      async fetchMenus() {
        try {  
          const response = await axios.get('http://127.0.0.1:4523/m1/4808550-4462943-default/getWeekmenuAndWeekDiscount');
          const menuItems = response.data.response;
          this.mon = menuItems.filter(item => item.WEEK === this.weekdays[0]);
          this.tue = menuItems.filter(item => item.WEEK === this.weekdays[1]);
          this.wed = menuItems.filter(item => item.WEEK === this.weekdays[2]);
          this.thu = menuItems.filter(item => item.WEEK === this.weekdays[3]);
          this.fri = menuItems.filter(item => item.WEEK === this.weekdays[4]);
          this.sat = menuItems.filter(item => item.WEEK === this.weekdays[5]);
          this.sun = menuItems.filter(item => item.WEEK === this.weekdays[6]);
        } catch (error) {  
          console.error('Failed to fetch menus:', error);
        }  
      }
    } 
  };
</script>

<style scoped>
h1 {
  margin-left: 15px;
  margin-bottom: 5px;
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
    box-sizing: border-box; /* 确保边框和内边距包含在元素的总宽度内 */ 
    border-right: 1.5px solid #db962b;
    overflow-y: auto;
    overflow-x: hidden;
}
.menuFrame div::-webkit-scrollbar {  
    width: 5px; /* 滚动条宽度 */  
}
.menuFrame div::-webkit-scrollbar-thumb {  
    background-color: #cccccc; /* 滚动条滑块的颜色 */  
    border-radius: 2.5px; /* 滚动条滑块的圆角 */  
    opacity: 90%;
}
.menuFrame div::-webkit-scrollbar-track {  
    opacity: 100%;  
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
.menuFrame .weeklyMenuItem :first-child {
    margin-top: 0px;
}
.menuFrame .weeklyMenuItem :last-child {
    margin-bottom: 0px;
}
</style>
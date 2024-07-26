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
        //加了“day”的是字符串，记录日期YYYY-MM-DD
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
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
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
        this.monday = `${year}-${month}-${String(now.getDate() - day + 1).padStart(2, '0')}`;
        this.tuesday = `${year}-${month}-${String(now.getDate() - day + 2).padStart(2, '0')}`;
        this.wednesday = `${year}-${month}-${String(now.getDate() - day + 3).padStart(2, '0')}`;
        this.thursday = `${year}-${month}-${String(now.getDate() - day + 4).padStart(2, '0')}`;
        this.friday = `${year}-${month}-${String(now.getDate() - day + 5).padStart(2, '0')}`;
        this.saturday = `${year}-${month}-${String(now.getDate() - day + 6).padStart(2, '0')}`;
        this.sunday = `${year}-${month}-${String(now.getDate() - day + 7).padStart(2, '0')}`;
      },
      async fetchMenus() {
        try {  
          const response = await axios.get('http://127.0.0.1:4523/m1/4808550-4462943-default/getWeekmenu');
          const menuItems = response.data.response;
          this.mon = menuItems.filter(item => item.WEEK === this.monday);
          this.tue = menuItems.filter(item => item.WEEK === this.tuesday);
          this.wed = menuItems.filter(item => item.WEEK === this.wednesday);
          this.thu = menuItems.filter(item => item.WEEK === this.thursday);
          this.fri = menuItems.filter(item => item.WEEK === this.friday);
          this.sat = menuItems.filter(item => item.WEEK === this.saturday);
          this.sun = menuItems.filter(item => item.WEEK === this.sunday);
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
<template>  
    <div class="dishesList">  
      <h1>菜品</h1>
      <div class="chartFrame">
        <div class="search">
          <img src="../assets/search.png" alt="Search Icon">
          <input type="text" name="menuSearch" id="menuSearch" @input="searchMenuItems" v-model="temSearchQuery">
        </div>
        <div class="menuChart"> 
          <!--没有进行搜索的情况（初始化）-->
          <div v-if="searchResult.length == 0 && searchQuery == ''">
            <div v-for="item in menuItems" class="menuItem"> 
            <div class="rank">{{ item.RANK }}</div>
            <div class="dishImg"><img src="item.PICTURE"></div>
            <div class="dish">{{ item.DISH_NAME }}</div></div>
          </div>
          <!--成功搜索的情况-->
          <div v-else-if="searchResult.length != 0">
            <div v-for="item in searchResult" class="menuItem">
            <div class="rank">{{ item.RANK }}</div>
            <div class="dishImg"><img src="item.PICTURE"></div>
            <div class="dish">{{ item.DISH_NAME }}</div></div>
          </div>
          <!--搜索失败-->
          <div v-else>
            <div class="menuItem" id="noneItem">暂无信息</div>
          </div>    
        </div>
      </div>  
    </div>  
</template>  
    
<script>    
  import axios from 'axios';
  export default {
    name: 'dishesList',
    data() {  
      return {  
        menuItems: [],
        temSearchQuery: '',
        searchQuery: '',
        searchResult: []
      };  
    },
    created() {  
      this.fetchMenus();  
    },  
    methods: {  
      async fetchMenus() {  
        try {  
          const response = await axios.get('http://127.0.0.1:4523/m1/4808550-4462943-default/getDishesList');  
          const temMenuItems = response.data.response.sort((a, b) => b.SALES - a.SALES); // 暂时接收response并按销售量降序排序，等待下一步添加RANK属性
          this.menuItems = [...temMenuItems].map((item, index) => ({  
            ...item,  
            RANK: index + 1 // 排名从1开始  
            }));
        } catch (error) {  
          console.error('Failed to fetch menus:', error);
        }  
      },
      searchMenuItems() {
        this.searchQuery = this.temSearchQuery;
        if (this.searchQuery != '') {this.searchResult = this.menuItems.filter(item => {  
          return item.DISH_NAME.includes(this.searchQuery);
        });}
        else { this.searchResult = this.menuItems; }
      }
    } 
  };
</script>

<style scoped>
.dishesList {
  height: 660px;
}
h1 {
  margin-left: 15px;
  margin-bottom: 5px;
}
.chartFrame {
  height: 86.5%;
  width:88%;
  background-color: #fff3e0;
  padding: 10px;
  overflow-y: auto;
  border-radius: 15px;
}
.chartFrame::-webkit-scrollbar {  
  width: 5px; /* 滚动条宽度 */  
}
.chartFrame::-webkit-scrollbar-thumb {  
  background-color: #cccccc; /* 滚动条滑块的颜色 */  
  border-radius: 2.5px; /* 滚动条滑块的圆角 */  
  opacity: 90%;
}
.chartFrame::-webkit-scrollbar-track {  
  opacity: 100%;  
}
.search {
  display: flex;
  justify-content: center;
  position: sticky;
  top: -10px;
  z-index: 1;
  margin-top: -10px;
  background-color: #fff3e0;
  width :100%;
  height: 70px;
}
.search img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  margin-top: 20px;
}
#menuSearch {
  width: 70%;
  height: 35px;
  border-radius: 20px;
  border: none;
  outline: none;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 20px;
}
.dishesList .menuItem{
  display: flex;
  height: 60px;
  align-items: center;
  border-bottom: 1.5px solid #db962b; /* 在每个列表项底部添加一条横线 */
}
.dishesList .menuItem:last-child {  
  border-bottom: none; /* 移除最后一个列表项底部的横线 */  
}
.rank {
  background-color: white;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin: 10px;
  text-align: center;
  line-height: 2;
}
.dishImg {
  height: 40px;
  width: 40px;
  margin-left: 5px;
  margin-right: 10px;
  display: flex; 
  justify-content: center;  
  align-items: center;  
  overflow: hidden; /* 防止图片超出容器 */  
  border: 1.5px solid #db962b;  
}
.dishImg img {  
  max-width: 100%;
  max-height: 100%; 
  object-fit: cover;  
} 
#noneItem {
  justify-content: center;
}
</style>
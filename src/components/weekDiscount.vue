<template>
    <div class="weekDiscount">
        <h1>本周促销</h1>
        <div class="menuFrame">
            <div v-for="item in dishOnSale" class="dishOnSaleItem">
                <div class="dishImg"><img src="item.PICTURE"></div>
                <div class="dishName">{{ item.DISH_NAME }}</div>
                <div class="oriPrice">￥{{ item.PRICE }}</div>
                <div class="disPrice">￥{{ item.DIS_PRICE }}</div>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'weekDiscount',
    data() {  
      return {  
        dishOnSale: []
      };  
    },
    created() {
      this.findDishOnSale();
    },
    methods: {  
      async findDishOnSale() {
        try {  
          const response = await axios.get('http://127.0.0.1:4523/m1/4808550-4462943-default/getWeekDiscount');
          const menuItems = response.data.response;
          this.dishOnSale = menuItems.filter(item => 'DIS_PRICE' in item && item.DIS_PRICE !== undefined);
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
    display: flex;
    width: 100%;
    height: 250px;
    padding: 5px;
    background-color: #fff3e0;
    border-radius: 15px;
    overflow-x: auto;
}
.menuFrame::-webkit-scrollbar {  
    height: 5px; /* 滚动条高度 */  
}
.menuFrame::-webkit-scrollbar-thumb {  
    background-color: #cccccc; /* 滚动条滑块的颜色 */  
    border-radius: 2.5px; /* 滚动条滑块的圆角 */  
    opacity: 90%;
}
.menuFrame::-webkit-scrollbar-track {  
    opacity: 100%; /* 滚动背景透明 */
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
.menuFrame :last-child {
    border-right: none; /* 最后一项去掉右边框 */
}
.dishImg {  
    width: 70px;  
    height: 70px; 
    margin-top: 35px; 
    margin-bottom: 20px;
    display: flex;  
    justify-content: center;  
    align-items: center;  
    border: 1.5px solid #db962b;  
    overflow: hidden; /* 防止图片超出容器 */  
}  
.dishImg img {  
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
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
</style>
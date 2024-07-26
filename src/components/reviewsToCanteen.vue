<template>
    <div class="reviewsToCanteen">
        <div class="head">
          <h1>餐厅评价</h1>
          <div class="canteenScore">
            <h2 id="comprehensiveScoreText">综合评分：</h2>
            <div class="comprehensiveStars">
              <div v-if="comprehensiveScore < 1">
                <img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
              </div>
              <div v-else-if="comprehensiveScore >= 1 && comprehensiveScore < 3 ">
                <img src="../assets/yellowstar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
              </div>
              <div v-else-if="comprehensiveScore >= 3 && comprehensiveScore < 5 ">
                <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
              </div>
              <div v-else-if="comprehensiveScore >= 5 && comprehensiveScore < 7 ">
                <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
              </div>
              <div v-else-if="comprehensiveScore >= 7 && comprehensiveScore < 9 ">
                <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/graystar.png">
              </div>
              <div v-else-if="comprehensiveScore >= 9 ">
                <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png">
              </div>
            </div>
            <h2 id="comprehensiveScore">{{ comprehensiveScore }} 分</h2>
          </div>
        </div>
        <div class="commentFrame">
          <div v-for="comment in comments" class="singleComment">
            <div class="singleCommentHead">
              <div class="commentStars">
                <div v-if="comment.C_STARS < 1">
                  <img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
                </div>
                <div v-else-if="comment.C_STARS >= 1 && comment.C_STARS < 3 ">
                  <img src="../assets/yellowstar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
                </div>
                <div v-else-if="comment.C_STARS >= 3 && comment.C_STARS < 5 ">
                  <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
                </div>
                <div v-else-if="comment.C_STARS >= 5 && comment.C_STARS < 7 ">
                  <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/graystar.png"><img src="../assets/graystar.png">
                </div>
                <div v-else-if="comment.C_STARS >= 7 && comment.C_STARS < 9 ">
                  <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/graystar.png">
                </div>
                <div v-else-if="comment.C_STARS >= 9 ">
                  <img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png"><img src="../assets/yellowstar.png">
                </div>
              </div>
              <h4 id="commentScore">{{ comment.C_STARS }} 分</h4>
            </div>
            <div v-if="comment.C_REVIEW_TEXT !== undefined && comment.C_REVIEW_TEXT !== null" class="commentText">{{ comment.C_REVIEW_TEXT }}</div>
            <div v-else class="commentText">该用户未留下评价文本。</div>
          </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'reviewsToCanteen',
    data() {  
      return {  
        comprehensiveScore: 0,
        comments: []
      };  
    },
    created() {
      this.getScoreAndComments();
    },
    methods: {  
      async getScoreAndComments() {
        try {  
          const response = await axios.get('http://127.0.0.1:4523/m1/4808550-4462943-default/getReviews');
          this.comments = response.data.response;
          let totalStars = 0;
          let commentsCount = 0;
          this.comments.forEach(comment => { //计算餐厅平均分
            if (comment.C_STARS !== undefined && comment.C_STARS !== null) { // 确保C_STAR存在且不是null  
                totalStars += comment.C_STARS;  
                commentsCount++;  
            }  
          });
          //若有评分，则正常计算平均分并四舍五入保留两位；无评分则平均分暂时记为0
          this.comprehensiveScore = commentsCount > 0 ? parseFloat((totalStars / commentsCount).toFixed(2)) : 0; 
        } catch (error) {  
          console.error('Failed to fetch menus:', error);
        }
      }
    }      
  };
</script>

<style scoped>
.reviewsToCanteen {
  display: flex;
  flex-direction: column;
}
.head {
    display: flex;
    flex-direction: row;
}
h1 {
    margin-left: 30px;
    margin-right: 30px;
}
.canteenScore {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
}
h2 {
    font-size: 20px;
    font-weight: light;
    margin-left: 10px;
}
img {
    height: 23px;
    width: 23px;
    margin-left: 2px;
    margin-right: 2px;
    margin-top: 3px;
}
.commentFrame {
    display: flex;
    padding-top: 5px;
    padding-bottom: 5px;
    height: 250px;
    width: 100%;
    background-color: #fff3e0;
    border-radius: 15px;
    overflow-x: auto;
    align-items: center;
    border-left: 25px solid #fff3e0;
    border-right: 25px solid #fff3e0;
    box-sizing: border-box;
}
.commentFrame::-webkit-scrollbar {  
    height: 5px; /* 滚动条高度 */  
}
.commentFrame::-webkit-scrollbar-thumb {  
    background-color: #cccccc; /* 滚动条滑块的颜色 */  
    border-radius: 2.5px; /* 滚动条滑块的圆角 */  
    opacity: 90%;
}
.commentFrame::-webkit-scrollbar-track {  
    opacity: 100%; /* 滚动背景透明 */
}
.singleComment {
    background-color: white;
    height: 85%;
    flex: 0 0 25%;
    margin-left: 25px;
    border-radius: 5px;
    padding-left: 3%;
    padding-right: 3%;
    box-sizing: border-box;
}
.commentFrame :first-child {
    margin-left: 0px;
}
.commentFrame :last-child {
    margin-right: 0px;
}
.singleCommentHead {
    display: flex;
}
.commentStars {
    width: fit-content;
    height: fit-content;
    margin-top: 25px;
}
.commentStars img {
    height: 18px;
    width: 18px;
    margin-left: 1px;
    margin-right: 1px;
    margin-top: 5px;
}
h4 {
    width: fit-content;
    height: fit-content;
    justify-self: end;
    margin-top:30px;
    margin-left: auto;
}
.commentText {
    overflow-y: auto;
}
.commentText::-webkit-scrollbar {  
    width: 5px; /* 滚动条高度 */  
}
.commentText::-webkit-scrollbar-thumb {  
    background-color: #cccccc; /* 滚动条滑块的颜色 */  
    border-radius: 2.5px; /* 滚动条滑块的圆角 */  
    opacity: 90%;
}
.commentText::-webkit-scrollbar-track {  
    opacity: 100%; /* 滚动背景透明 */
}
</style>
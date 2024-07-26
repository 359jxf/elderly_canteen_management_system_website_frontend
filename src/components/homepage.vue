<template>
  <div class="homepageContents">
    <div class="dishes">
      <dishesList class="dishesList" />  
      <div class="weekItems">
        <weekmenu class="weekmenu" />
        <weekDiscount class="weekDiscount" />  
      </div>
    </div>
    <div class="reviews">
      <reviewsToCanteen class="reviewsToCanteen" />  
    </div>
  </div>
</template>

<script>
import dishesList from './dishesList.vue'
import weekmenu from './weekmenu.vue'
import weekDiscount from './weekDiscount.vue'
import reviewsToCanteen from './reviewsToCanteen.vue'

export default {  
  components: {  
    'dishesList': dishesList,  
    'weekmenu': weekmenu,  
    'weekDiscount': weekDiscount,  
    'reviewsToCanteen': reviewsToCanteen  
  }  
}
</script>

<style>
.dishes {
  display: flex;
  justify-content: center;
}
.dishesList {
  width:25%;
}
.weekItems {
  margin-left: 2.5%;
  width: 65%;
}
.reviews {
  display: flex;
  justify-content: center;
}
.reviewsToCanteen {
  width: 92.5%;
}
</style>
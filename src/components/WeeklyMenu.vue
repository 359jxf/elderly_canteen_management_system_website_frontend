<!-- components/WeeklyMenu.vue -->
<template>
  <section id="menuNav">
    <div>
      <h1 style="color: rgb(229, 107, 78)">本周菜单</h1>
      <div class="menuFrame">
        <div class="MON">
          <h2>周一</h2>
          <div v-for="item in mon" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
        <div class="TUE">
          <h2>周二</h2>
          <div v-for="item in tue" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
        <div class="WED">
          <h2>周三</h2>
          <div v-for="item in wed" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
        <div class="THU">
          <h2>周四</h2>
          <div v-for="item in thu" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
        <div class="FRI">
          <h2>周五</h2>
          <div v-for="item in fri" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
        <div class="SAT">
          <h2>周六</h2>
          <div v-for="item in sat" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
        <div class="SUN">
          <h2>周日</h2>
          <div v-for="item in sun" :key="item.id" class="weeklyMenuItem">
            {{ item.DISH_NAME }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    mon: Array,
    tue: Array,
    wed: Array,
    thu: Array,
    fri: Array,
    sat: Array,
    sun: Array,
  },
};
</script>

<style scoped>
.menuFrame {
  height: 250px;
  padding: 5px;
  display: flex;
  border-radius: 10px;
  margin: 20px 0;
  background-color: #fffcf7;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.MON,
.TUE,
.WED,
.THU,
.FRI,
.SAT,
.SUN {
  flex: 0 0 14.2857%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 0.5mm dashed #cacaca;
}

.menuFrameItem {
  border-right: 0.5mm dashed #cacaca;
}
.menuFrame div:last-child {
  border-right: none;
}
.menuFrame div h2 {
  height: 40px;
  color: rgb(229, 107, 78);
  text-align: center;
  margin-top: 0px;
  margin-bottom: 5px;
  padding-top: 15px;
  position: sticky;
  top: 0px;
  z-index: 1;
  font-weight: bold;
}
.menuFrame .weeklyMenuItem {
  border: none;
  width: auto;
  text-align: center;
  font-size: 15px;
  margin-top: 7px;
  margin-bottom: 7px;
}
.menuFrame .weeklyMenuItem:first-child {
  margin-top: 0px;
}
.menuFrame .weeklyMenuItem:last-child {
  margin-bottom: 0px;
}
</style>

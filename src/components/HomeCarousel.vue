<!-- components/Carousel.vue -->
<template>
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
</template>

<script>
export default {
  props: {
    texts: Array,
    subtexts: Array,
    images: Array,
  },
  data() {
    return {
      currentIndex: 0,
      timer: null,
    };
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
/* Carousel 相关样式 */
.main-section {
  background-image: url("@/assets/bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -2px;
}

.intro,
.showImg {
  width: 50%;
}

.image-carousel {
  position: relative;
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
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: #d6d6d6;
  margin: 5vw;
}

.buttons:hover {
  background-color: #8e8e8e;
}
</style>

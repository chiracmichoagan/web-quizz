<script setup lang="ts">
import { computed } from 'vue';
import ButtonNext from '../ButtonNext.vue';
import Question from '../Question.vue';
import store from '../../store';
import Progress from '../Progress.vue';
const activeQuestion = computed(() => store.getters.getActiveQuestion());
const activeQuestionAnswer = computed(() => store.getters.getActiveQuestionAnswer());
const activeQuestionNumber = computed(() => store.getters.getActiveQuestionNumber());
const footerStyle = computed(() => {
  if (activeQuestionAnswer.value) {
    return { padding: '30px', flex: 1 };
  }
  return { padding: '0' };
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-800 to-purple-900 px-2 py-6 sm:px-4 sm:py-10"
  >
    <section class="c-quiz bg-indigo-500 text-white font-bold">
      <div class="container">
        <div class="header bg-indigo-500 text-white font-bold">
          <Progress />
        </div>

        <Transition
          enter-active-class="animate__animated animate__zoomIn animate-duration"
          leave-active-class="animate__animated animate__zoomOut animate-duration"
          mode="out-in"
        >
          <div class="body" v-if="activeQuestion.question" :key="activeQuestion.question">
            <Question
              :question="activeQuestion"
              :question-number="activeQuestionNumber"
              :show-answer="false"
            />
          </div>
        </Transition>

        <div class="footer" :style="footerStyle">
          <Transition
            enter-active-class="animate__animated animate__zoomIn animate-duration"
            leave-active-class="animate__animated animate__zoomOut animate-duration"
          >
            <ButtonNext v-if="activeQuestionAnswer" @click="store.mutations.handleNext()" />
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables/_index.scss';
@import '@/scss/local/_mixins.scss';

.c-quiz {
  display: grid;
  box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  max-width: $br_sm;
  margin: 0 auto;
  width: 100%;
  // background-color: $colorWhite;
  border-radius: 8px;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
}

.header,
.body,
.footer {
  display: grid;
  padding: 30px;
  width: 100%;
}

.header {
  padding: 30px;
  // background-color: $colorNeutral50;
  // border-bottom: 1px solid $colorGray300;
}

.body {
  @include breakpoint('lg') {
    padding: 50px 30px;
  }
}

.footer {
  flex-basis: 0;
  transition: 0.3s all linear;
}

.animate-duration {
  --animate-duration: 0.25s;
}
</style>

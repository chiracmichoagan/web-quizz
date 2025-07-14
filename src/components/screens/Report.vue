<script setup lang="ts">
import { computed } from 'vue';
import Question from '../Question.vue';
import store from '../../store';

const questions = computed(() => store.getters.getQuestions());
const report = computed(() => store.getters.getActiveQuizResult());
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-800 to-purple-900 px-2 py-6 sm:px-4 sm:py-10"
  >
    <section
      class="c-report rounded-2xl shadow-lg flex flex-col gap-2 bg-gradient-to-br from-fuchsia-800 to-purple-900"
    >
      <div class="bg-indigo-500 rounded-2xl shadow-lg text-white">
        <h1 class="title">
          Vous avez obtenu {{ report.correctAnswersNumber }} reponse sur
          {{ report.totalQuestionsNumber }} questions !!
        </h1>
        <h3 class="description" v-if="report.hasAllQuizzesSuccessRate">
          votre meilleur score {{ report.allQuizzesSuccessRate }}%
        </h3>
      </div>

      <div class="queston text-white rounded-2xl mt-5 shadow-lg bg-indigo-500">
        <div class="questions-title text-white">vos resultats</div>

        <Question
          v-for="(question, index) in questions"
          :question="question"
          :question-number="index"
          :show-answer="true"
        />
      </div>

      <div class="flex justify-center pt-4 md:pt-6">
        <button
          class="btn-primary bg-gradient-to-r from-blue-500 to-pink-500 text-white text-lg sm:text-xl md:text-2xl font-bold py-4 px-8 md:px-12 rounded-full w-full max-w-md shadow-lg transform hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out"
          @click="store.mutations.newQuiz()"
        >
          Commencer à nouveau
        </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/variables/_index.scss';
@import '@/scss/local/_mixins.scss';
@import '@/scss/partials/_button.scss';

.c-report {
  display: grid;
  // box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.1);
  max-width: $br_sm;
  width: 100%;
  margin: 0 auto;
  // background-color: $colorWhite;
  // border-radius: 8px;
  overflow: hidden;
  padding: 30px;
}

.title {
  // color: $colorBlack;
  font-size: 18px;
  line-height: 28px;
  text-align: center;

  @include breakpoint('md') {
    font-size: 20px;
  }

  @include breakpoint('xl') {
    font-size: 24px;
  }
}

.description {
  margin-top: 15px;
  // color: $colorGray500;
  text-align: center;
  font-size: 13px;

  @include breakpoint('md') {
    font-size: 15px;
  }

  @include breakpoint('xl') {
    font-size: 16px;
  }
}

.questions {
  margin: 60px 0 30px;
  display: grid;
  gap: 30px;

  @include breakpoint('lg') {
    gap: 60px;
  }
}

.questions-title {
  // color: $colorGray500;
  padding-bottom: 8px;
  border-bottom: 1px solid $colorGray300;
  font-size: 20px;

  @include breakpoint('md') {
    font-size: 24px;
  }

  @include breakpoint('xl') {
    font-size: 30px;
  }
}

.title,
.description,
.questions-title {
  text-align: center;
}

:deep(.question) {
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 30px;
}

.btn-new-quiz {
  max-width: $br_2xs;
  margin: 0 auto;
  width: 100%;
}
</style>

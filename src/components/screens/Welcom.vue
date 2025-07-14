<script lang="ts" setup>
import { ScreenComponents } from '../../enums';
import store from '../../store';

const startQuiz = () => {
  store.mutations.setActiveComponent(ScreenComponents.Options);
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col justify-around items-center bg-gradient-to-br from-fuchsia-800 to-purple-900 px-2 py-6 sm:px-4 sm:py-10"
  >
    <!-- Title (en haut) -->
    <div class="text-center space-y-4">
      <div class="text-pink-500 text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-extrabold">?</div>
      <div
        class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold border-2 xs:border-4 border-pink-500 rounded-full w-[90vw] max-w-[500px] h-20 xs:h-24 md:h-28 py-3 px-2 xs:px-6 text-center flex items-center justify-center mx-auto"
      >
        QUESTIONNAIRE
      </div>
    </div>

    <!-- Start Button (en bas) -->
    <button
      @click="startQuiz"
      class="bg-gradient-to-r from-blue-500 to-pink-500 text-white text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold py-2 xs:py-3 px-6 xs:px-10 rounded-full w-[70vw] max-w-[300px] h-14 xs:h-16 shadow-lg hover:scale-105 transition duration-300"
    >
      Commencer
    </button>
  </div>
</template>

<style scoped>
/* Pour xs breakpoint (ex: 375px) */
@media (max-width: 400px) {
  .xs\:text-3xl {
    font-size: 1.75rem;
  }
  .xs\:text-6xl {
    font-size: 3.5rem;
  }
  .xs\:border-4 {
    border-width: 4px;
  }
  .xs\:h-24 {
    height: 6rem;
  }
  .xs\:py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .xs\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .xs\:text-xl {
    font-size: 1.25rem;
  }
  .xs\:py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .xs\:px-10 {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
  .xs\:h-16 {
    height: 4rem;
  }
}
</style>

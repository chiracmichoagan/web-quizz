<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import type { ICategory, IDifficulty } from '../../types';
import CustomSelect from '../CustomSelect.vue';
import store from '../../store';
import { ScreenComponents } from '../../enums';

const Loader = defineAsyncComponent(() => import('../Loader.vue'));

const difficulties: IDifficulty[] = [
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' },
];

const selectedDifficulty = ref<any>(difficulties[0]);
const selectedCategory = ref<any>();
const categories = computed<ICategory[]>(() => store.getters.getCategories());
const isLoadedCategories = computed(() => store.getters.getApiLoadState().categories?.isLoaded);
const isLoadedQuestions = computed(() => store.getters.getApiLoadState().questions?.isLoaded);
const isCalledQuestions = computed(() => store.getters.getApiLoadState().questions?.isCalled);

watch(
  () => isLoadedCategories.value,
  () => setInitialSelectedCategory(),
  {
    immediate: true,
  }
);

function setInitialSelectedCategory() {
  if (categories.value.length) {
    selectedCategory.value = categories.value[0];
  }
}

async function handleSelectedOptions() {
  if (!selectedCategory.value) return;

  await store.actions.fetchQuestions(selectedCategory.value.id, selectedDifficulty.value.id);

  if (store.getters.getQuestions().length) {
    store.mutations.setActiveComponent(ScreenComponents.Quiz);
  }
}
</script>

<template>
  <section
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-800 to-purple-900 px-2 py-6 sm:px-4 sm:py-10"
  >
    <div
      class="w-400 h-100 max-w-[100vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-indigo-500 text-white font-bold p-6 sm:p-10 rounded-2xl shadow-lg flex flex-col gap-8 flex items-center justify-center"
    >
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-xs sm:text-sm md:text-base font-semibold"
            >Sélectionnez une catégorie</label
          >
          <CustomSelect
            :clearable="false"
            @selected="selectedCategory = $event"
            :selected-option="selectedCategory"
            :options="categories"
            class="mt-1 block w-full h-10 p-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-black"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs sm:text-sm md:text-base font-semibold"
            >Sélectionnez une difficulté</label
          >
          <CustomSelect
            @selected="selectedDifficulty = $event"
            :selected-option="selectedDifficulty"
            :clearable="false"
            :options="difficulties"
            class="mt-1 block h-10 w-full p-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-black"
          />
        </div>
      </div>

      <button
        type="button"
        @click="handleSelectedOptions"
        class="bg-gradient-to-r from-blue-500 to-pink-500 text-white text-base xs:text-lg sm:text-xl md:text-2xl font-bold py-2 xs:py-3 px-6 xs:px-10 rounded-full w-full max-w-xs h-14 xs:h-16 shadow-lg hover:scale-105 transition duration-300"
      >
        Commencer
      </button>
    </div>

    <Teleport to="body">
      <Loader v-if="isCalledQuestions && !isLoadedQuestions" />
    </Teleport>
  </section>
</template>

<!-- Plus besoin de SCSS, tout est géré par Tailwind -->
<style scoped></style>

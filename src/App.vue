<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';
import { ScreenComponents } from './enums';
import Options from './components/screens/Options.vue';
import store from './store';
import Alert from './components/Alert.vue';
import Welcom from '../src/components/screens/Welcom.vue';

const Quiz = defineAsyncComponent(() => import('./components/screens/Quiz.vue'));
const Report = defineAsyncComponent(() => import('./components/screens/Report.vue'));
const components = {
  [ScreenComponents.Welcom]: {
    name: ScreenComponents.Welcom,
    component: Welcom,
  },
  [ScreenComponents.Options]: {
    name: ScreenComponents.Options,
    component: Options,
  },
  [ScreenComponents.Quiz]: {
    name: ScreenComponents.Quiz,
    component: Quiz,
  },
  [ScreenComponents.Report]: {
    name: ScreenComponents.Report,
    component: Report,
  },
};

const activeComponent = computed(() => {
  const activeComponentName = store.getters.getActiveComponent();
  return components[activeComponentName as keyof typeof components];
});

store.actions.fetchCategories();
</script>

<template>
  <main class="main">
    <Transition
      enter-active-class="animate__animated animate__slideInLeft  animate-duration"
      leave-active-class="animate__animated animate__animated animate-duration"
      mode="out-in"
    >
      <component :is="activeComponent.component" />
    </Transition>

    <div class="alerts">
      <Alert v-for="alert in store.getters.getWarnings()" :alert="alert" />
    </div>
  </main>
</template>

<style lang="scss">
@import '../src/scss/_main.scss';
</style>

<style lang="scss" scoped>
@import '../src/scss/variables/_index.scss';
@import '../src/scss/local/_mixins.scss';

.animate-duration {
  --animate-duration: 0.25s;
}

.title {
  font-weight: bold;
  // color: $colorBlack;
  font-size: 20px;
  margin: 25px 0px 50px;
  width: 100%;
  text-align: center;

  @include breakpoint('lg') {
    font-size: 28px;
  }

  @include breakpoint('xl') {
    font-size: 35px;
  }

  @include breakpoint('2xl') {
    font-size: 40px;
  }
}

.alerts {
  position: absolute;
  left: 15px;
  bottom: 15px;
  right: 15px;
}
</style>

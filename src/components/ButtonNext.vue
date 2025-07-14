<template>
  <button
    class="bg-gradient-to-r from-blue-500 to-pink-500 text-white text-base xs:text-lg sm:text-xl md:text-2xl font-bold py-2 xs:py-3 px-6 xs:px-10 rounded-full w-full max-w-xs h-14 xs:h-16 shadow-lg hover:scale-105 transition duration-300 btn-next"
  >
    <span>Suivant</span>
  </button>
</template>

<style lang="scss" scoped>
@import '@/scss/variables/_index.scss';
@import '@/scss/partials/_button.scss';

.btn-next {
  max-width: $br_2xs;
  margin: 0 auto;
  width: 100%;
}
</style>

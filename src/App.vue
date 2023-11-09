<script lang="ts" setup>
import { ref } from "vue";
import GameField from "./components/GameField.vue";
import StartWindow from "./components/StartWindow.vue";

const isGame = ref<boolean>(false);
const lang = ref<"rus" | "eng">("rus");
const selectedTheme = ref<string>("rus");

const startGame = ({ language, theme }: { language: "rus" | "eng"; theme: string }) => {
  lang.value = language;
  selectedTheme.value = theme;
  isGame.value = true;
};
</script>

<template>
  <div class="game">
    <h1 v-if="!isGame">
      Alphabet game
    </h1>
    <StartWindow v-if="!isGame" @start="startGame" />
    <GameField v-else @end="isGame = false" :lang="lang" :theme="selectedTheme" />
  </div>
</template>

<style scoped>
h1 {
  position: absolute;
  top: 120px;
  left: 50%;
  text-transform: uppercase;
  transform: translateX(-50%);
}
</style>

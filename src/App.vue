<script lang="ts" setup>
// Libraries
import { ref } from "vue";
// Types
import { LangValue } from "@/types/global";
// Components
import GameField from "@/components/Views/GameField.vue";
import StartWindow from "@/components/Views/StartWindow.vue";

const isGame = ref<boolean>(false);
const lang = ref<LangValue>("rus");
const selectedTheme = ref<string>("rus");
const selectedTime = ref<string>("1");

const startGame = ({ language, theme, gameTime }: { language: LangValue; theme: string; gameTime: string }) => {
  lang.value = language;
  selectedTheme.value = theme;
  selectedTime.value = gameTime;
  isGame.value = true;
};
</script>

<template>
  <div class="game">
    <h1
      v-if="!isGame"
      class="absolute top-[80px] left-1/2 -translate-x-1/2 whitespace-nowrap uppercase text-3xl font-semibold">
      Alphabet game
    </h1>
    <StartWindow v-if="!isGame" @start="startGame" />
    <GameField v-else @end="isGame = false" :lang="lang" :theme="selectedTheme" :time="selectedTime" />
  </div>
</template>

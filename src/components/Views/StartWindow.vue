<script setup lang="ts">
// Libraries
import { computed, ref, watch } from "vue";
// Constants
import { engTopicsConst, rusTopicsConst } from "@/constants/topics";
import { alphabetEngTopics, alphabetRusTopics } from "@/constants/keys";
import { languages } from "@/constants/languages";
import { timeOptions } from "@/constants/time-options";
// Types
import { LangValue } from "@/types/global";
// Utils
import { getRandomIndex } from "@/utils/getRandomIndex";
// Components
import AddThemeModal from "@/components/Modals/AddThemeModal.vue";
import UiSelect from "@/components/UI/select/UiSelect.vue";

interface Emits {
  (e: "start", value: { language: LangValue; theme: string; gameTime: string }): void;
}

const emits = defineEmits<Emits>();

// Topics
const topicsRus = ref<string[]>([]);
const topicsEng = ref<string[]>([]);

function startingSetup() {
  const alphabetRusThemesJSON = localStorage.getItem(alphabetRusTopics);
  const alphabetEngThemesJSON = localStorage.getItem(alphabetEngTopics);

  if (alphabetRusThemesJSON && Array.isArray(JSON.parse(alphabetRusThemesJSON))) {
    topicsRus.value = JSON.parse(alphabetRusThemesJSON);
  } else {
    topicsRus.value = rusTopicsConst;
    localStorage.setItem(alphabetRusTopics, JSON.stringify(topicsRus.value));
  }

  if (alphabetEngThemesJSON && Array.isArray(JSON.parse(alphabetEngThemesJSON))) {
    topicsEng.value = JSON.parse(alphabetEngThemesJSON);
  } else {
    topicsEng.value = engTopicsConst;
    localStorage.setItem(alphabetEngTopics, JSON.stringify(topicsEng.value));
  }
}

startingSetup();

// Game settings
const language = ref<LangValue>("rus");
const selectedTopic = ref<string>("Города");
const gameTime = ref<string>("1");
const openedAddTopicModal = ref<boolean>(false);

const topicOptions = computed(() => (language.value === "rus" ? topicsRus.value : topicsEng.value));

watch(
  () => language.value,
  () => {
    selectedTopic.value = topicOptions.value[0];
  }
);

// Labels
const languageLabel = computed(() => (language.value === "rus" ? "Язык" : "Language"));
const topicLabel = computed(() => (language.value === "rus" ? "Тема" : "Topic"));
const timeLabel = computed(() => (language.value === "rus" ? "Время игры" : "Game time"));
const randomButtonText = computed(() => (language.value === "rus" ? "Случайная тема" : "Random topic"));
const startButtonText = computed(() => (language.value === "rus" ? "Начать" : "Start"));
const addTopicButtonText = computed(() => (language.value === "rus" ? "Добавить тему" : "Add topic"));
const rules = computed(() =>
  language.value === "rus"
    ? "Правила игры: нужно назвать слова на каждую букву алфавита по выбранной теме."
    : "Rules of the game: you need to name words for each letter of the alphabet on the chosen topic."
);

// Methods
function setRandomTopic() {
  const randomIndex = getRandomIndex(topicOptions.value.length);
  emits("start", { language: language.value, theme: topicOptions.value[randomIndex], gameTime: gameTime.value });
}

function addTopic({ theme, language }: { theme: string; language: LangValue }) {
  if (language === "rus") {
    topicsRus.value.push(theme);
    localStorage.setItem(alphabetRusTopics, JSON.stringify(topicsRus.value));
  } else {
    topicsEng.value.push(theme);
    localStorage.setItem(alphabetEngTopics, JSON.stringify(topicsEng.value));
  }

  openedAddTopicModal.value = false;
}

function removeOptionHandling(options: Array<any>) {
  if (language.value === "rus") {
    topicsRus.value = options;
    localStorage.setItem(alphabetRusTopics, JSON.stringify(topicsRus.value));
  } else {
    topicsEng.value = options;
    localStorage.setItem(alphabetEngTopics, JSON.stringify(topicsEng.value));
  }
}
</script>

<template>
  <div class="start-window absolute top-0">
    <div class="hint-wrapper">
      <span>?</span>
      <p>{{ rules }}</p>
    </div>
    <!--  Selects  -->
    <UiSelect
      class="max-w-[320px] bg-light"
      v-model="language"
      :options="languages"
      :label="languageLabel"
      value-by="value"
      label-by="label" />
    <UiSelect
      class="max-w-[320px] bg-light"
      v-model="selectedTopic"
      :options="topicOptions"
      :label="topicLabel"
      :deletable="true"
      @remove-option="removeOptionHandling"
    />
    <UiSelect
      class="max-w-[320px] bg-light"
      v-model="gameTime"
      :options="timeOptions"
      :label="timeLabel"
      value-by="value"
      label-by="label" />
    <!--  Button  -->
    <button @click="openedAddTopicModal = true">{{ addTopicButtonText }}</button>
    <button @click="setRandomTopic">{{ randomButtonText }}</button>
    <button @click="emits('start', { language, theme: selectedTopic, gameTime })">{{ startButtonText }}</button>
    <!--  Modal  -->
    <Transition name="modal">
      <AddThemeModal @add="addTopic" @close="openedAddTopicModal = false" :opened="openedAddTopicModal" />
    </Transition>
  </div>
</template>

<style scoped>
.start-window {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.hint-wrapper {
  position: absolute;
  top: 20px;
  right: 30px;
}

.hint-wrapper span {
  cursor: help;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  height: 26px;
  font-weight: 700;
  font-size: 20px;
  color: var(--blue);
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid;
}

.hint-wrapper p {
  padding: 0.4rem 0.5rem 0.5rem;
  position: absolute;
  top: 28px;
  right: 0;
  width: 220px;
  background-color: #fff;
  border: 3px solid var(--black);
  border-radius: 6px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.hint-wrapper span:hover + p {
  opacity: 1;
}

button {
  cursor: pointer;
  width: 320px;
  padding: 0.4rem 1.5rem;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  max-width: calc(100% - 10px);
  background-color: var(--black);
  color: var(--light);
  border: 3px solid var(--black);
  border-radius: 6px;
}
</style>

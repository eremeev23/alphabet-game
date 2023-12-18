<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AddThemeModal from "./AddThemeModal.vue";

const emits = defineEmits<{
  (e: "start", value: { language: "rus" | "eng"; theme: string; time: string }): void;
}>();

const themesRus = ref<string[]>([]);
const themesEng = ref<string[]>([]);

const startingSetup = () => {
  const alphabetRusThemesJSON = localStorage.getItem("alphabetRusThemes");
  const alphabetEngThemesJSON = localStorage.getItem("alphabetEngThemes");

  if (alphabetRusThemesJSON && Array.isArray(JSON.parse(alphabetRusThemesJSON))) {
    themesRus.value = JSON.parse(alphabetRusThemesJSON);
  } else {
    themesRus.value = ["Города", "Страны", "Вымышленные персонажи", "Фильмы", "Сериалы", "Животные", "Знаменитости"];
    localStorage.setItem("alphabetRusThemes", JSON.stringify(themesRus.value))
  }

  if (alphabetEngThemesJSON && Array.isArray(JSON.parse(alphabetEngThemesJSON))) {
    themesEng.value = JSON.parse(alphabetEngThemesJSON);
  } else {
    themesEng.value = ["Cities", "Countries", "Characters", "Movies", "Shows", "Animals", "Celebrities"];
    localStorage.setItem("alphabetEngThemes", JSON.stringify(themesEng.value))
  }
};

startingSetup();

const language = ref<"rus" | "eng">("rus");
const selectedTheme = ref<string>("Города");
const time = ref<string>("1");
const openedAddThemeModal = ref<boolean>(false);

const themesOptions = computed(() => (language.value === "rus" ? themesRus.value : themesEng.value));

watch(
  () => language.value,
  () => {
    selectedTheme.value = themesOptions.value[0];
  }
);

const languageLabel = computed(() => (language.value === "rus" ? "Язык" : "Language"));
const topicLabel = computed(() => (language.value === "rus" ? "Тема" : "Topic"));
const timeLabel = computed(() => (language.value === "rus" ? "Время игры" : "Game time"));
const randomButtonText = computed(() => (language.value === "rus" ? "Случайная тема" : "Random topic"));
const startButtonText = computed(() => (language.value === "rus" ? "Начать" : "Start"));
const addThemeButtonText = computed(() => (language.value === "rus" ? "Добавить тему" : "Add topic"));
const rules = computed(() =>
  language.value === "rus"
    ? "Правила игры: нужно назвать слова на каждую букву алфавита по выбранной теме."
    : "Rules of the game: you need to name words for each letter of the alphabet on the chosen topic."
);

const setRandomTheme = () => {
  const randomIndex = Math.floor(Math.random() * themesOptions.value.length);
  emits("start", { language: language.value, theme: themesOptions.value[randomIndex], time: time.value });
};

const addTheme = ({ theme, language }: { theme: string; language: "rus" | "eng" }) => {
  if (language === "rus") {
    themesRus.value.push(theme);
    localStorage.setItem("alphabetRusThemes", JSON.stringify(themesRus.value));
  } else {
    themesEng.value.push(theme);
    localStorage.setItem("alphabetEngThemes", JSON.stringify(themesEng.value));
  }

  openedAddThemeModal.value = false;
};
</script>

<template>
  <div class="start-window">
    <div class="hint-wrapper">
      <span>?</span>
      <p>{{ rules }}</p>
    </div>
    <div class="select-wrapper">
      <label for="language">
        {{ languageLabel }}
      </label>
      <select v-model="language" name="language" id="language">
        <option value="rus">Русский</option>
        <option value="eng">English</option>
      </select>
    </div>
    <div class="select-wrapper">
      <label for="theme">
        {{ topicLabel }}
      </label>
      <select v-model="selectedTheme" name="theme" id="theme">
        <option v-for="theme in themesOptions" :value="theme">{{ theme }}</option>
      </select>
    </div>
    <div class="select-wrapper">
      <label for="time">
        {{ timeLabel }}
      </label>
      <select v-model="time" name="time" id="time">
        <option value="1">1 min</option>
        <option value="3">3 min</option>
        <option value="5">5 min</option>
      </select>
    </div>
    <button @click="openedAddThemeModal = true">{{ addThemeButtonText }}</button>
    <button @click="setRandomTheme">{{ randomButtonText }}</button>
    <button @click="emits('start', { language, theme: selectedTheme, time })">{{ startButtonText }}</button>

    <Transition name="modal">
      <AddThemeModal @add="addTheme" @close="openedAddThemeModal = false" :opened="openedAddThemeModal" />
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

.select-wrapper {
  position: relative;
}

.select-wrapper label {
  position: absolute;
  top: 0;
  left: calc(1rem - 3px);
  transform: translateY(-50%);
  padding: 0 3px;
  font-weight: 500;
  background-color: var(--light);
  font-size: 12px;
}

select {
  padding: 0.7rem 0.5rem 0.6rem;
  font-weight: 500;
  font-size: 18px;
  background-color: var(--light);
}

select,
button {
  cursor: pointer;
  width: 320px;
  border: 3px solid var(--black);
  border-radius: 6px;
}

button {
  padding: 0.6rem 1.5rem;
  font-size: 22px;
  font-weight: 600;
  background-color: var(--black);
  color: var(--light);
}
</style>

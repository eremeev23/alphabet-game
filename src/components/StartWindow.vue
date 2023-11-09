<script setup lang="ts">
import { computed, ref, watch } from "vue";

const emits = defineEmits<{
  (e: "start", value: { language: "rus" | "eng"; theme: string }): void;
}>();

const themesRus = ["Города", "Страны", "Вымышленные персонажи", "Фильмы", "Сериалы", "Животные", "Знаменитости"];

const themesEng = ["Cities", "Countries", "Characters", "Movies", "Shows", "Animals", "Celebrities"];

const language = ref<"rus" | "eng">("rus");
const selectedTheme = ref<string>("Города");
const themesOptions = computed(() => (language.value === "rus" ? themesRus : themesEng));

watch(
  () => language.value,
  () => {
    selectedTheme.value = themesOptions.value[0];
  }
);

const languageLabel = computed(() => (language.value === "rus" ? "Язык" : "Language"));
const themeLabel = computed(() => (language.value === "rus" ? "Тема" : "Theme"));
</script>

<template>
  <div class="start-window">
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
        {{ themeLabel }}
      </label>
      <select v-model="selectedTheme" name="language" id="theme">
        <option v-for="theme in themesOptions" :value="theme">{{ theme }}</option>
      </select>
    </div>
    <button @click="emits('start', { language, theme: selectedTheme })">START</button>
  </div>
</template>

<style scoped>
.start-window {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
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
  padding: .7rem 0.5rem 0.6rem;
  font-weight: 500;
  font-size: 18px;
  background-color: var(--light);
}

select,
button {
  cursor: pointer;
  width: 320px;
  border: 3px solid #232323;
  border-radius: 6px;
}

button {
  padding: 0.6rem 1.5rem;
  font-size: 22px;
  font-weight: 600;
  background-color: #232323;
  color: var(--light);
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

defineProps<{
  opened: boolean;
}>();

const emits = defineEmits<{
  (e: "close"): void;
  (e: "add", value: { theme: string; language: "rus" | "eng" }): void;
}>();

const language = ref<"rus" | "eng">("rus");
const newTheme = ref<string>("");
const error = ref<boolean>(false);

const errorText = computed(() =>
  language.value === "rus" ? "Такая тема уже существует" : "This topic exists already"
);

const addTheme = () => {
  if (newTheme.value.length) {
    const currentListRus = localStorage.getItem("alphabetRusThemes")?.toString();
    const currentListEng = localStorage.getItem("alphabetEngThemes")?.toString();

    if (
      currentListRus?.toLowerCase().includes(newTheme.value.toLowerCase()) ||
      currentListEng?.toLowerCase().includes(newTheme.value.toLowerCase())
    ) {
      error.value = true;
    } else {
      emits("add", { theme: newTheme.value, language: language.value });
    }
  }
};

onBeforeUnmount(() => (error.value = false));
</script>

<template>
  <div v-if="opened" @click="emits('close')" class="modal-wrapper">
    <form @click.stop @submit.prevent="addTheme" class="add-theme-form">
      <button @click="emits('close')" type="button" class="close-button">
        <span></span>
        <span></span>
      </button>
      <div class="input-wrapper">
        <label for="language"> Язык </label>
        <select v-model="language" name="language" id="language">
          <option value="rus">Русский</option>
          <option value="eng">English</option>
        </select>
      </div>
      <div class="input-wrapper">
        <label for="theme-input">Тема</label>
        <input v-model="newTheme" @input="error = false" type="text" id="theme-input" placeholder="Введите название темы" />
        <p v-show="error">{{ errorText }}</p>
      </div>
      <button type="submit" class="submit-button">Добавить</button>
    </form>
  </div>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(17 17 17 / 0.2);
  backdrop-filter: blur(2px);
}

.add-theme-form {
  padding: 2rem 1.2rem;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 280px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 2px solid var(--black);
  border-radius: 6px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
}

.close-button span {
  display: block;
  height: 2px;
  width: 12px;
  background-color: var(--black);
}

.close-button span:first-child {
  transform: rotate(45deg) translateX(1px);
}

.close-button span:last-child {
  transform: rotate(-45deg) translateX(1px);
}

.input-wrapper {
  position: relative;
}

.input-wrapper + .input-wrapper {
  margin-top: 14px;
  margin-bottom: 10px;
}

.input-wrapper p {
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  color: indianred;
  font-size: 12px;
  font-weight: 500;
}

label {
  padding: 0 2px;
  position: absolute;
  top: 0;
  left: 8px;
  transform: translateY(-50%);
  font-size: 12px;
  background-color: #fff;
}

input,
select {
  padding: 10px;
  width: 100%;
  border: 2px solid var(--black);
  border-radius: 4px;
  font-size: 16px;
}

.submit-button {
  padding: 10px;
  margin-top: 20px;
  width: 100%;
  background-color: var(--black);
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
}
</style>

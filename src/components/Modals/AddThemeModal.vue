<script setup lang="ts">
// Libraries
import { computed, onBeforeUnmount, ref } from "vue";
// Constants
import { alphabetEngTopics, alphabetRusTopics } from "@/constants/keys";
import { languages } from "@/constants/languages";
// Types
import { LangValue } from "@/types/global";
// Components
import UiSelect from "@/components/UI/select/UiSelect.vue";
import UiInput from "@/components/UI/input/UiInput.vue";
import IconClose from "@/components/Icons/IconClose.vue";

defineProps<
  Readonly<{
    opened: boolean;
  }>
>();

const emits = defineEmits<{
  (e: "close"): void;
  (e: "add", value: { theme: string; language: LangValue }): void;
}>();

const language = ref<LangValue>("rus");
const newTopic = ref<string>("");
const error = ref<boolean>(false);
const emptyInputError = ref<boolean>(false);

const languageLabel = computed(() => (language.value === "rus" ? "Язык" : "Language"));
const errorText = computed(() =>
  language.value === "rus" ? "Такая тема уже существует" : "This topic exists already"
);
const emptyInputErrorText = computed(() => (language.value === "rus" ? "Введите название темы" : "Enter topic name"));

const errorToInput = computed(() => {
  if (error.value) return errorText.value;
  if (emptyInputError.value) return emptyInputErrorText.value;

  return ""
})

// Methods
function resetErrors() {
  error.value = false;
  emptyInputError.value = false
}

async function addTheme() {
  if (newTopic.value.length) {
    const currentListRus = localStorage.getItem(alphabetRusTopics)?.toString();
    const currentListEng = localStorage.getItem(alphabetEngTopics)?.toString();

    if (
      currentListRus?.toLowerCase().includes(newTopic.value.toLowerCase()) ||
      currentListEng?.toLowerCase().includes(newTopic.value.toLowerCase())
    ) {
      error.value = true;
    } else {
      emits("add", { theme: newTopic.value, language: language.value });

      setTimeout(() => {
        language.value = "rus";
        newTopic.value = "";
      }, 0);
    }
  } else {
    emptyInputError.value = true;
  }
}

onBeforeUnmount(() => (error.value = false));
</script>

<template>
  <div v-if="opened" @click="emits('close')" class="modal-wrapper">
    <form @click.stop @submit.prevent="addTheme" class="add-theme-form">
      <button @click="emits('close')" type="button" class="close-button">
        <IconClose />
      </button>
      <UiSelect
        v-model="language"
        class="max-w-[320px] input-wrapper bg-[#fff] mb-4"
        :options="languages"
        :label="languageLabel"
        value-by="value"
        label-by="label" />
      <UiInput
        v-model="newTopic"
        class="max-w-[320px] input-wrapper bg-[#fff]"
        label="Тема"
        :error-text="errorToInput"
        :error="error || emptyInputError"
        placeholder="Введите название темы"
        @input="resetErrors"
        @focus="resetErrors" />
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

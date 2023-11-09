<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  lang: "rus" | "eng";
  theme: string;
}>();

const emits = defineEmits<{
  (e: "end"): void
}>()

const reset = ref<boolean>(true);

const alphabet = computed(() =>
  props.lang === "rus" ? "абвгдежзиклмнопрстуфхцчшщэюя".split("") : "abcdefghijklmnopqrstuvwxyz".split("")
);

const startGame = () => {
  reset.value = false;
  setTimeout(() => (reset.value = true), 0);
};
</script>

<template>
  <div v-if="reset" class="wrapper">
    <div class="buttons-wrapper">
      <button @click="emits('end')">BACK</button>
      <button @click="startGame">RESET</button>
    </div>
    <h1>
      {{ theme }}
    </h1>
    <div class="alphabet-wrapper">
      <div class="box" v-for="el in alphabet" :key="el">
        <input type="checkbox" :id="el" :value="el" />
        <label :for="el">
          {{ el }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-style: italic;
  text-decoration: underline;
  text-transform: uppercase;
}

.buttons-wrapper {
  display: flex;
  gap: 10px;
}

button,
.box {
  border: 3px solid #232323;
  border-radius: 6px;
}

button {
  flex: 1;
  cursor: pointer;
  width: 120px;
  padding: 0.6rem 1.5rem;
  font-size: 16px;
  font-weight: 600;
  background-color: transparent;
}

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.alphabet-wrapper {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 1.2rem;
  max-width: calc(100vw - 20px);
}

input {
  display: none;
}

.box {
  overflow: hidden;
  width: 3rem;
  height: 3rem;
}

label {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
  width: 100%;
  height: 100%;
  color: #232323;
  font-weight: 600;
  font-size: 20px;
  line-height: 0;
}

button,
label {
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

label:hover,
button:hover {
  background-color: #232323;
  color: var(--light);
}

input:checked + label {
  text-decoration: line-through;
  color: #666 !important;
  background-color: rgb(159, 225, 145) !important;
}
</style>

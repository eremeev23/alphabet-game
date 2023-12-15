<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useTimer } from "../composables/use-timer.ts";

const props = defineProps<{
  lang: "rus" | "eng";
  theme: string;
  time: string;
}>();

const emits = defineEmits<{
  (e: "end"): void;
}>();

const { seconds, minutes, gameFinished, startTimer, pauseHandler, resetGame } = useTimer();
const reset = ref<boolean>(true);
const pause = ref<boolean>(false);
const showModal = ref<boolean>(false);

const alphabet = computed(() =>
  props.lang === "rus" ? "абвгдежзиклмнопрстуфхцчшщэюя".split("") : "abcdefghijklmnopqrstuvwxyz".split("")
);
const backButtonText = computed(() => (props.lang === "rus" ? "Назад" : "Back"));
const resetButtonText = computed(() => (props.lang === "rus" ? "Сбросить" : "Reset"));
const gameOverText = computed(() => (props.lang === "rus" ? "Время вышло" : "Time is over"));
const startNewGameButtonText = computed(() => (props.lang === "rus" ? "Начать новую игру" : "Start new game"));
const seeResultButtonText = computed(() => (props.lang === "rus" ? "Посмотреть результат" : "See the result"));

const startGame = () => {
  reset.value = false;
  setTimeout(() => (reset.value = true), 0);
};

const onPause = () => {
  pause.value = !pause.value;
  pauseHandler(pause.value);
};

const onReset = () => {
  pause.value = true;
  gameFinished.value = false
  resetGame(props.time);
  startGame();
};

watch(
  () => gameFinished.value,
  () => {
    showModal.value = !!gameFinished.value;
  }
);

onMounted(async () => {
  await nextTick(() => startTimer(props.time));
});
</script>

<template>
  <div v-if="reset" class="wrapper">
    <div class="buttons-wrapper">
      <!--  Back button  -->
      <button @click="emits('end')" :title="backButtonText">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <!--  Pause button  -->
      <button @click="onPause">
        <svg v-if="!pause" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 4H6V20H10V4Z"
            fill="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M18 4H14V20H18V4Z"
            fill="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 3L19 12L5 21V3Z"
            fill="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <!--  Reset button  -->
      <button @click="onReset" :title="resetButtonText">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M3.51 14.9999C4.15839 16.8403 5.38734 18.4201 7.01166 19.5013C8.63598 20.5825 10.5677 21.1065 12.5157 20.9944C14.4637 20.8823 16.3226 20.1401 17.8121 18.8797C19.3017 17.6193 20.3413 15.9089 20.7742 14.0063C21.2072 12.1037 21.0101 10.1119 20.2126 8.33105C19.4152 6.55019 18.0605 5.07674 16.3528 4.13271C14.6451 3.18868 12.6769 2.82521 10.7447 3.09707C8.81245 3.36892 7.02091 4.26137 5.64 5.63995L1 9.99995"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <p>{{ minutes }}:{{ seconds }}</p>
    <h1>
      {{ theme }}
    </h1>
    <div class="alphabet-wrapper">
      <div class="box" v-for="el in alphabet" :key="el">
        <input type="checkbox" :id="el" :value="el" :disabled="gameFinished" />
        <label :for="el">
          {{ el }}
        </label>
      </div>
    </div>
    <Transition name="modal">
      <div v-if="gameFinished && showModal" class="modal-wrapper">
        <div class="finish-modal">
          <p>
            {{ gameOverText }}
          </p>
          <button @click="emits('end')">
            {{ startNewGameButtonText }}
          </button>
          <button @click="showModal = false">
            {{ seeResultButtonText }}
          </button>
        </div>
      </div>
    </Transition>
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
  color: var(--black) !important;
  border: 3px solid var(--black);
  border-radius: 6px;
}

button {
  flex: 1;
  cursor: pointer;
  width: 100px;
  padding: 0.6rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  grid-template-rows: repeat(6, 1fr);
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
  color: var(--black);
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
  background-color: var(--black);
  color: var(--light) !important;
}

@media screen and (max-width: 640px) {
  label:hover,
  button:hover {
    background-color: transparent;
    color: var(--black);
  }
}

input:checked + label {
  text-decoration: line-through;
  color: #666 !important;
  background-color: rgb(159, 225, 145) !important;
}

input:disabled + label {
  pointer-events: none;
  background-color: rgba(229, 186, 186, 0.8);
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(17 17 17 / 0.3);
  backdrop-filter: blur(3px);
  transition: opacity 0.3s ease-in-out;
}

.finish-modal {
  padding: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  width: 320px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border: 3px solid var(--black);
  border-radius: 6px;
}

.finish-modal p {
  height: fit-content;
  flex: 2;
  text-transform: uppercase;
  font-weight: 500;
}

.finish-modal button {
  width: 100%;
  height: fit-content;
}

.finish-modal button + button {
  margin-top: 0.6rem;
}
</style>

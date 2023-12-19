<script setup lang="ts">
// Libraries
import { ref, computed, onMounted, nextTick, watch } from "vue";
// Constants
import { engAlphabet, rusAlphabet } from "@/constants/alphabets";
// Types
import { LangValue } from "@/types/global";
// Composables
import { useTimer } from "@/composables/use-timer";
import IconPause from "@/components/Icons/IconPause.vue";
import IconPlay from "@/components/Icons/IconPlay.vue";
import IconReset from "@/components/Icons/IconReset.vue";
import IconBack from "@/components/Icons/IconBack.vue";

interface Props {
  lang: LangValue;
  theme: string;
  time: string;
}

interface Emits {
  (e: "end"): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { seconds, minutes, gameFinished, startTimer, pauseHandler, resetGame } = useTimer();

// Labels
const alphabet = computed(() => (props.lang === "rus" ? rusAlphabet : engAlphabet));
const backButtonText = computed(() => (props.lang === "rus" ? "Назад" : "Back"));
const resetButtonText = computed(() => (props.lang === "rus" ? "Сбросить" : "Reset"));
const gameOverText = computed(() => (props.lang === "rus" ? "Время вышло" : "Time is over"));
const startNewGameButtonText = computed(() => (props.lang === "rus" ? "Начать новую игру" : "Start new game"));
const seeResultButtonText = computed(() => (props.lang === "rus" ? "Посмотреть результат" : "See the result"));
const pauseButtonText = computed(() => {
  if (props.lang === "rus") {
    return pause.value ? "Продолжить" : "Пауза";
  } else {
    return pause.value ? "Resume" : "Pause";
  }
});

// Layout
const reset = ref<boolean>(true);
const pause = ref<boolean>(false);
const showModal = ref<boolean>(false);

watch(
  () => gameFinished.value,
  () => {
    showModal.value = !!gameFinished.value;
  }
);

// Methods
function startGame() {
  reset.value = false;
  setTimeout(() => (reset.value = true), 0);
}

function onPause() {
  pause.value = !pause.value;
  pauseHandler(pause.value);
}

function onReset() {
  pause.value = true;
  gameFinished.value = false;
  resetGame(props.time);
  startGame();
}

// Cycling
onMounted(async () => {
  await nextTick(() => startTimer(props.time));
});
</script>

<template>
  <div v-if="reset" class="wrapper">
    <div class="buttons-wrapper">
      <!--  Back button  -->
      <button @click="emits('end')" :title="backButtonText">
        <IconBack />
      </button>
      <!--  Pause button  -->
      <button @click="onPause" :title="pauseButtonText">
        <IconPause v-if="!pause" />
        <IconPlay v-else />
      </button>
      <!--  Reset button  -->
      <button @click="onReset" :title="resetButtonText">
        <IconReset />
      </button>
    </div>
    <!--  Main field -->
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
    <!--  Game over modal  -->
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

@media screen and (max-width: 640px) {
  .alphabet-wrapper {
    gap: 0.8rem;
  }

  button {
    width: 90px;
  }
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
    color: var(--black) !important;
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

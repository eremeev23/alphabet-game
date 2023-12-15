import { computed, ref } from "vue";

export const useTimer = () => {
  const currentMin = ref<number>(1);
  const currentSec = ref<number>(0);
  const gameStarted = ref<boolean>(false);
  const gameFinished = ref<boolean>(false);

  let secondsInterval: number;

  const startTimer = (mins: string) => {
    currentMin.value = Number(mins);
    gameFinished.value = false;
    gameStarted.value = true;
    secondsInterval = setInterval(() => {
      if (currentSec.value === 0) {
        currentSec.value = 5;
        currentMin.value--;
      } else {
        currentSec.value--;
      }

      if (currentMin.value === 0 && currentSec.value === 0) {
        clearInterval(secondsInterval);
        setTimeout(() => {
          gameFinished.value = true;
          gameStarted.value = false;
        }, 1000)
      }
    }, 1000);
  };

  const pauseHandler = (status: boolean) => {
    if (status) {
      clearInterval(secondsInterval);
    } else {
      startTimer(currentMin.value.toString())
    }
  }

  const resetGame = (mins: string) => {
    currentMin.value = Number(mins);
    currentSec.value = 0;
    gameStarted.value = false;
    clearInterval(secondsInterval);
  }

  const seconds = computed(() => (currentSec.value > 9 ? currentSec.value : `0${currentSec.value}`));
  const minutes = computed(() => (currentMin.value > 9 ? currentMin.value : `0${currentMin.value}`));

  return { seconds, minutes, startTimer, pauseHandler, resetGame, gameStarted, gameFinished };
};

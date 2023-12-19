<script setup lang="ts" generic="T">
// Libraries
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
// Types
import { SelectProps, SelectEmits } from "./types/select.type";
// Components
import IconClose from "@/components/Icons/IconClose.vue";
import IconChevron from "@/components/Icons/IconChevron.vue";

const props = defineProps<SelectProps<T>>();
const emits = defineEmits<SelectEmits>();

// Layout
const selectId = `select_${Math.floor(Math.random() * Date.now())}`;
const selectedValue = ref<any>(props.options[0]);
const opened = ref<boolean>(false);
const listHeight = ref<string>("180px");

const selectedOptionLabel = computed(() =>
  props.labelBy && selectedValue.value ? selectedValue.value[props.labelBy] : selectedValue.value
);

watch(
  () => selectedValue.value,
  () => {
    if (props.valueBy) {
      emits("update:model-value", selectedValue.value[props.valueBy]);
    } else {
      emits("update:model-value", selectedValue.value);
    }
  }
);

watch(
  () => props.options,
  () => (selectedValue.value = props.options[0])
);

// Cycling
/* Mouseup event handler */
function closeSelectOnMouseup() {
  opened.value = false;
}

onMounted(() => {
  calculateHeight();
  document.body.addEventListener("mouseup", closeSelectOnMouseup);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("mouseup", closeSelectOnMouseup);
});

// Methods
/* Get option label */
function optionLabel(option: any): string {
  if (props.labelBy) {
    return option[props.labelBy];
  } else {
    return option;
  }
}

/* Calculation options' list height */
function calculateHeight() {
  const length = props.options.length || 0;

  if (length && length < 4) {
    listHeight.value = `${42 * length}px` || "0px";
  }
}

/* Select one options and emit value */
function selectOption(option: any) {
  selectedValue.value = option;

  if (props.valueBy) {
    emits("update:model-value", option[props.valueBy]);
  } else {
    emits("update:model-value", option);
  }

  opened.value = false;
}

/* Check if option selected */
function isOptionSelected(option: any) {
  if (props.valueBy) {
    return option[props.valueBy] === props.modelValue;
  } else {
    return option === props.modelValue;
  }
}

/* Remove one option from options list and returning this new list */
function removeOption(option: any) {
  if (props.valueBy) {
    const filteredArray = props.options.filter(opt => opt.valueBy !== option.valueBy);
    emits("remove-option", filteredArray);
  } else {
    const filteredArray = props.options.filter(opt => opt !== option);
    emits("remove-option", filteredArray);
  }
}
</script>

<template>
  <div class="relative w-full">
    <!--  Select  -->
    <label
      class="absolute top-0 left-2 -translate-y-1/2 px-0.5 bg-inherit text-xs font-semibold"
      :for="selectId.toString()">
      {{ label }}
    </label>
    <input
      class="bordered"
      :value="selectedOptionLabel"
      :id="selectId"
      readonly
      @click="opened = !opened"
      @mouseup.stop />
    <button class="absolute right-2 top-1/2 -translate-y-1/2" @click="opened = !opened" @mouseup.stop>
      <IconChevron :class="{ 'rotate-180': opened }" />
    </button>
    <!--  Options -->
    <Transition name="select">
      <ul v-if="opened" class="bordered" :style="`max-height: ${listHeight};`">
        <li
          v-for="(option, i) in options"
          :key="i"
          :class="{ selected: isOptionSelected(option) }"
          @click="selectOption(option)">
          <span>
            {{ optionLabel(option) }}
          </span>
          <button
            v-if="props.deletable"
            @click.stop="removeOption(option)"
            @mouseup.stop
            class="w-5 flex items-center justify-center">
            <IconClose />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
input {
  cursor: pointer;
  width: 100%;
}

ul {
  position: absolute;
  bottom: 3px;
  left: 0;
  transform: translateY(100%);
  width: 100%;
  background: var(--white);
  border-radius: 0.375rem;
  z-index: 9999;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: height 0.2s linear;

  &::-webkit-scrollbar {
    width: 3px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--blue);
  }

  li {
    position: relative;
    cursor: pointer;
    padding: 7px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--black);
    transition:
      background-color 0.2s linear,
      color 0.2s linear;

    &.selected::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: var(--blue);
    }

    &:hover {
      background-color: var(--black);
      color: var(--light);
    }
  }

  li + li {
    border-top: 3px solid var(--black);
  }
}

svg {
  height: 18px;
  transition: transform 0.2s ease;
}

// Transitions
.select-enter-active,
.select-leave-active {
  height: 120px;
}

.select-enter-from,
.select-leave-to {
  height: 0;
}
</style>

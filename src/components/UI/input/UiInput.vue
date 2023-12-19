<script setup lang="ts">
import { computed } from "vue";
// Types
import { InputEmits, InputProps } from "./types/input.type";

const props = withDefaults(defineProps<InputProps>(), {
  inputType: "text",
  placeholder: ""
});
const emits = defineEmits<InputEmits>();

// Layout
const inputId = `input_${Math.floor(Math.random() * Date.now())}`;
const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emits("update:model-value", value);
  }
});
</script>

<template>
  <div class="relative w-full">
    <label class="absolute top-0 left-2 -translate-y-1/2 px-0.5 bg-inherit text-xs font-semibold" :for="inputId">
      {{ label }}
    </label>
    <input
      v-model="inputValue"
      class="bordered w-full"
      :type="inputType"
      :id="inputId"
      :placeholder="placeholder"
      @focus="emits('focus')"
      @input="emits('input')" />
    <slot name="icon" />
    <p v-show="error">{{ errorText }}</p>
  </div>
</template>

<style scoped>
p {
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  color: indianred;
  font-size: 12px;
  line-height: 110%;
  font-weight: 500;
}
</style>

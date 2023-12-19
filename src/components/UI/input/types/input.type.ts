export interface InputProps
  extends Readonly<{
    modelValue: string;
    label: string;
    inputType?: "email" | "password" | "text" | "tel" | "search";
    placeholder: string;
    error?: boolean;
    errorText?: string;
  }> {}

export interface InputEmits {
  (e: "update:model-value", value: string): void;
  (e: "focus"): void;
  (e: "input"): void;
}

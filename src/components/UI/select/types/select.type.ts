export interface SelectProps<T = any> {
  /** Emitable value */
  modelValue: any;
  /** Select options */
  options: T[];
  /** Select label */
  label: string;
  /** Visible text of selected option in input */
  labelBy?: string;
  /** Emitable value of selected option */
  valueBy?: string;
  /** Are options deletable */
  deletable?: boolean
}

export interface SelectEmits {
  /** Update <i>v-model</i> */
  (e: "update:model-value", value: unknown): void;
  /** Delete one option */
  (e: "remove-option", filteredArr: Array<any>): void;
}

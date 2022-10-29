/**
 * @name InputDataType
 * @description Different types of input data which can be passed to the Input Component
 */
export type InputDataType = 'text' | 'tel' | 'password' | 'email';

export type AutoCompleteType =
  | 'tel'
  | 'name'
  | 'email'
  | 'one-time-code'
  | 'postal-code'
  | 'street-address'
  | 'on'
  | 'address-level1'
  | 'current-password';

/**
 * @name CustomValidator
 * @description Function type for taking input parameter and returning a boolean denoting if the value is valid or not
 */

export type CustomValidator = (inputValue: string) => ValidationState;

/**
 * @description Type Map for All possible output of an Input Filed Validation
 */
export type ValidationState = 'Valid' | 'InProgress' | 'Invalid';

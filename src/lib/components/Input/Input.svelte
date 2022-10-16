<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { defaultInputProperties, type InputProperties } from './properties';
  import { validateInput } from '../utils';
  import type { ValidationState } from '../types';

  const dispatch = createEventDispatcher();

  export let properties: InputProperties = defaultInputProperties;
  let inputElement: HTMLInputElement | HTMLTextAreaElement;

  $: state = getValidationState(properties) as ValidationState;

  // For making this function reactive, prop was passed as param
  function getValidationState(prop: InputProperties): ValidationState {
    const valueValidation: ValidationState = validateInput(
      prop.value,
      prop.dataType,
      prop.validationPattern,
      prop.inProgressPattern,
      prop.validators
    );
    if (
      valueValidation === 'InProgress' &&
      prop.value.length > 0 &&
      inputElement &&
      inputElement !== document.activeElement
    ) {
      return 'Invalid';
    } else {
      return valueValidation;
    }
  }

  $: showErrorMessage = state === 'Invalid';

  let inputValidationRegExr: RegExp | null =
    properties.dataType === 'tel' ? new RegExp('[0-9]{1}') : null;

  function onInput(event: Event) {
    let currentValue = inputElement.value;
    if (currentValue.length > 0 && inputValidationRegExr !== null) {
      let lastCharacter = currentValue[currentValue.length - 1];
      if (properties.dataType === 'tel') {
        if (!inputValidationRegExr.test(lastCharacter)) {
          inputElement.value = inputElement.value.slice(0, currentValue.length - 1);
          return;
        }
      }
    }

    properties.value = currentValue;
    // Adding reactivity
    properties = properties;
    dispatch('input', event);
  }

  function onFocusOut(event: FocusEvent) {
    if (state === 'InProgress' && properties.value.length > 0) {
      state = 'Invalid';
    }
    dispatch('focusout', event);
  }

  onMount(() => {
    if (properties.focus) {
      inputElement.focus();
    }
    dispatch('stateChange', { state: state });
  });
  $: {
    dispatch('stateChange', { state: state });
  }
</script>

<div class="input-container">
  {#if properties.label && properties.label !== '' && !properties.actionInput}
    <label class="label" for={properties.name}>
      {properties.label}
    </label>
  {/if}

  {#if properties.useTextArea}
    <textarea
      type={properties.dataType}
      value={properties.value}
      placeholder={properties.placeholder}
      autocomplete={properties.autoComplete}
      name={properties.name}
      on:keydown
      on:keyup
      on:keypress
      on:focus
      on:focusout={onFocusOut}
      on:input={onInput}
      class={properties.actionInput ? 'action-input' : ''}
      style="--focus-border: {properties.addFocusColor ? 1 : 0}px;"
      disabled={properties.disable}
      bind:this={inputElement}
      maxlength={properties.maxLength}
      minlength={properties.minLength}
    />
  {:else}
    <input
      type={properties.dataType}
      value={properties.value}
      placeholder={properties.placeholder}
      autocomplete={properties.autoComplete}
      name={properties.name}
      on:keydown
      on:keyup
      on:keypress
      on:focus
      on:focusout={onFocusOut}
      on:input={onInput}
      class={properties.actionInput ? 'action-input' : ''}
      style="--focus-border: {properties.addFocusColor ? 1 : 0}px"
      disabled={properties.disable}
      bind:this={inputElement}
      maxlength={properties.maxLength}
      minlength={properties.minLength}
    />
  {/if}

  {#if properties.message.onError !== '' && showErrorMessage && !properties.actionInput}
    <div class="error-message">
      {properties.message.onError}
    </div>
  {/if}
  {#if properties.message.info !== '' && !properties.actionInput}
    <div class="info-message">
      {properties.message.info}
    </div>
  {/if}
</div>

<style>
  textarea,
  input {
    height: var(--input-height, fit-content);
    color: var(--input-text-color, white);
    background-color: var(--input-background, white);
    font-size: var(--input-font-size, 16px) !important;
    font-family: var(--input-font-family);
    border-radius: var(--input-radius, 4px);
    outline: none;
    padding: var(--input-padding, 12px);
    font-weight: var(--input-font-weight, 500);
    width: var(--input-width, fit-content);
    margin: var(--input-margin, 0px 0px 12px 0px);
    -webkit-appearance: none !important; /* For Safari MWeb */
    box-shadow: var(--input-box-shadow, 0px 1px 8px #2f537733);
    border: var(--input-border, none);
    resize: none;
  }

  textarea:focus,
  input:focus {
    border: var(--focus-border) solid var(--input-focussed-background, #637c95);
  }

  .action-input {
    border-radius: var(--input-radius, 4px 0px 0px 4px);
    box-shadow: 0px 0px 0px #ffffff;
    margin-bottom: 0;
  }

  .input-container {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-weight: var(--input-label-msg-text-weight, 400);
    font-size: var(--input-label-msg-text-size, 12px);
    color: var(--input-label-msg-text-color, #ffffff);
    margin-bottom: 6px;
  }

  .error-message {
    font-weight: var(--input-error-msg-text-weight, 400);
    font-size: var(--input-error-msg-text-size, 12px);
    color: var(--input-error-msg-text-color, #fa1405);
  }

  .info-message {
    font-weight: var(--input-info-msg-text-weight, 400);
    font-size: var(--input-info-msg-text-size, 12px);
    color: var(--input-info-msg-text-color, #fa1405);
  }
</style>

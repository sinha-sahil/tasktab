<script lang="ts">
  import Loader from '../Loader/Loader.svelte';
  import { defaultButtonProperties } from './properties';
  import type { ButtonProperties } from './properties';
  export let properties: ButtonProperties = defaultButtonProperties;
</script>

<button
  style="
    --opacity: {properties.enable ? 1 : 0.7};
    --cursor: {properties.enable ? 'pointer' : 'not-allowed'};"
  on:click
  disabled={!properties.enable}
>
  {#if properties.showLoader} <Loader /> {/if}
  {#if $$slots.icon}
    <slot name="icon" />
  {/if}
  {properties.text}
</button>

<style>
  button {
    font-family: var(--button-font-family);
    font-weight: var(--button-font-weight, 500);
    font-size: var(--button-font-size, 14px);
    background-color: var(--button-color, var(--primary-button-color, #0c2340));
    color: var(--button-text-color, var(--primary-text-color, white));
    height: var(--button-height, fit-content);
    padding: var(--button-padding, 12px);
    border-radius: var(--button-border-radius, 0px);
    width: var(--button-width, fit-content);
    cursor: var(--cursor, pointer);
    opacity: var(--opacity, 1);
    border: var(--button-border, none);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--button-content-gap, 16px);
  }
</style>

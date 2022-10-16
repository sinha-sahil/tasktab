<script lang="ts">
  import Button from '$lib/components/Button/Button.svelte';
  import Input from '$lib/components/Input/Input.svelte';
  import { defaultInputProperties } from '$lib/components/Input/properties';
  import type { InputProperties } from '$lib/components/Input/properties';
  import type { ButtonProperties } from '$lib/components/Button/properties';
  import { supabase } from '$lib/services/supabase';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  type FormType = 'Login' | 'Signup' | 'Forgot' | 'ResetPassword';
  let formType: FormType = 'Login';
  $: pageHeader =
    formType === 'Login'
      ? 'Login'
      : formType === 'Signup'
      ? 'Sign Up'
      : formType === 'Forgot'
      ? 'Forgot Password'
      : 'Reset Password';
  let loginStatus: string | null = null;
  let isEmailValid = false;
  let isPasswordValid = false;

  let emailFieldProps : InputProperties = {
    ...defaultInputProperties,
    dataType: 'email',
    label: 'Email',
    message: {
      onError: 'Please enter correct email address',
      info: ''
    },
    focus: true,
    minLength: 3,
    autoComplete: 'email',
    name: 'email'
  };

  let passwordFieldProps : InputProperties = {
    ...defaultInputProperties,
    dataType: 'password',
    label: 'Password',
    message: {
      onError: 'Minimum password length is 6',
      info: ''
    },
    focus: false,
    minLength: 6,
    autoComplete: 'current-password',
    validationPattern: /[a-z0-9]{6,}/i,
    inProgressPattern: /^[a-z0-9]*[\s]*[a-z\s]*$/i,
    name: 'password'
  };

  $: loginButtonProps = {
    enable:
      formType === 'Forgot'
        ? isEmailValid
        : formType === 'ResetPassword'
        ? isPasswordValid
        : isEmailValid && isPasswordValid,
    text:
      formType === 'Login'
        ? 'Login'
        : formType === 'Signup'
        ? 'Sign Up'
        : formType === 'Forgot'
        ? 'Send Recovery Mail'
        : 'Reset password'
  } as ButtonProperties;

  type InputType = 'email' | 'password';

  function handleUserInput(field: InputType, event: CustomEvent) {
    loginStatus = null;
    const fieldState = event?.detail?.state === 'Valid';
    switch (field) {
      case 'email':
        isEmailValid = fieldState;
        break;
      case 'password':
        isPasswordValid = fieldState;
        break;
      default:
        break;
    }
  }

  async function handleSubmit() {
    loginButtonProps.showLoader = true;
    loginButtonProps.text = '';
    const credentials = {
      email: emailFieldProps.value,
      password: passwordFieldProps.value
    };

    if (formType === 'Forgot') {
      await supabase.auth.resetPasswordForEmail(emailFieldProps.value, {
        redirectTo: 'http://localhost:5173/login'
      });
      loginButtonProps.showLoader = false;
      loginButtonProps.text = 'Reset email sent!';
      loginButtonProps.enable = false;
      return;
    }

    if (formType === 'ResetPassword') {
      await supabase.auth.updateUser({
        password: passwordFieldProps.value
      });
      loginButtonProps.showLoader = false;
      loginButtonProps.text = 'Password updated successfully!';
      loginButtonProps.enable = false;
      return;
    }

    const { data, error } =
      formType === 'Login'
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

    loginButtonProps.showLoader = false;
    loginButtonProps.text = 'Next';

    if (data && data.user !== null && data.session !== null) {
      loginStatus = 'Success! Redirecting you';
      await goto('/');
    } else {
      loginStatus = error?.message ? error.message : 'Something went wrong! Retry';
    }
  }

  function toggleForm() {
    formType = formType === 'Login' ? 'Signup' : 'Login';
  }

  function forgotPassword() {
    formType = 'Forgot';
  }

  onMount(async () => {
    const hashParams: { [key: string]: string } = {};
    $page.url.hash
      .replace('#', '')
      .split('&')
      .forEach((hashItem) => {
        const hashValues: string[] = hashItem.split('=');
        hashParams[hashValues[0]] = hashValues[1];
      });
    if (typeof hashParams['access_token'] === 'string' && hashParams['type'] === 'recovery') {
      formType = 'ResetPassword';
      passwordFieldProps.label = 'New Password';
      passwordFieldProps = passwordFieldProps;
    }
  });
</script>

<svelte:head>
  <title>Tasktab: Login | Signup</title>
</svelte:head>

<div class="screen">
  <div class="card">
    <div class="header">{pageHeader}</div>
    <form class="login-form" on:submit|preventDefault={handleSubmit}>
      {#if formType !== 'ResetPassword'}
        <Input
          bind:properties={emailFieldProps}
          on:stateChange={(e) => handleUserInput('email', e)}
        />
      {/if}
      {#if formType !== 'Forgot'}
        <Input
          bind:properties={passwordFieldProps}
          on:stateChange={(e) => handleUserInput('password', e)}
        />
      {/if}
      <div style="margin-top: 12px;">
        <Button bind:properties={loginButtonProps} />
      </div>
      {#if loginStatus !== null}
        <div class="login-status">{loginStatus}</div>
      {/if}
    </form>
  </div>
  <div class="sub-action">
    {#if formType === 'Login'}
      <div>
        Don't have a account? <span on:click={toggleForm} on:keydown> Sign Up</span>
      </div>
    {:else if formType === 'ResetPassword'}
      <span on:click={toggleForm} on:keydown> Goto Login </span>
    {:else}
      <div>
        Already have a account, <span on:click={toggleForm} on:keydown> Login </span>
      </div>
    {/if}
    {#if formType === 'Login'}
      <div class="forgot-password" on:click={forgotPassword} on:keydown>Forgot Password</div>
    {/if}
  </div>
</div>

<style>
  .screen {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    color: white;
    align-items: center;
    justify-content: center;
  }

  .card {
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 400px;
    background-color: #ffffff1a;
    border-radius: 8px;
  }

  .header {
    font-size: 18px;
    font-weight: 500;
    padding: 20px;
  }

  .login-form {
    padding: 0px 16px 16px 16px;
    --input-width: 100%;
    --input-background: #00000040;
    --input-text-color: #ffffff;

    --button-width: 100%;
    --button-border-radius: 4px;

    --loader-foreground: #ffffff1a;
    --loader-foreground-end: #ffffff1a;
  }

  .sub-action {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .sub-action span {
    color: #002244;
    cursor: pointer;
  }

  .login-status {
    margin-top: 16px;
  }

  .forgot-password {
    cursor: pointer;
    color: #0018a8;
  }
</style>

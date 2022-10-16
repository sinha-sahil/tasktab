<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { supabase } from '$lib/services/supabase';
  import { onMount } from 'svelte';

  onMount(async () => {
    const supabaseSession = await supabase.auth.getSession();

    if (!supabaseSession.data.session || supabaseSession.data.session.access_token === null) {
      await goto('/login');
    }

    if (
      $page.url.pathname === '/login' &&
      supabaseSession.data.session?.user.aud === 'authenticated'
    ) {
      await goto('/');
    }
  });
</script>

<slot />

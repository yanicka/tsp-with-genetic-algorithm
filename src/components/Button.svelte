<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

  export let label;
</script>

<style type="text/scss">
</style>

<button class="font-bold py-2 px-4 rounded" on:click={() => dispatch('click')}>{ label }</button>
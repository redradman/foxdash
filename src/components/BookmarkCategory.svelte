<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let title;
  export let links = [];
  export let editMode = false;

  const dispatch = createEventDispatcher();
</script>

<div class="category">
  <div class="header">
    <h2>{title}</h2>
    {#if editMode}
      <button on:click={() => dispatch('add')}>Add</button>
    {/if}
  </div>
  
  <div class="links-grid">
    {#if links.length === 0}
      <p class="empty-message">No links yet. Add one!</p>
    {:else}
      {#each links as link (link.url)}
        <div class="link-card" in:fly={{ y: 20, duration: 300 }} out:fly={{ y: 20, duration: 300 }}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
          {#if editMode}
            <button class="remove-btn" on:click={() => dispatch('remove', link)}>×</button>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .category {
    background-color: var(--surface-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--primary-color);
    padding-bottom: 1rem;
    min-height: 2rem; /* Ensure consistent header height */
  }

  .links-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    min-height: 50px; /* Ensures container has height for empty message */
  }

  .link-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--background-color);
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    transition: transform var(--transition-speed);
  }

  .link-card:hover {
    transform: translateY(-2px);
  }

  a {
    color: var(--on-surface-color);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .remove-btn {
    background: none;
    color: var(--on-surface-color);
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0.5rem;
  }
  
  .empty-message {
    text-align: center;
    color: #888;
    padding: 1rem 0;
  }
</style> 
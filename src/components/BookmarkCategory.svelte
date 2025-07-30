<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let title;
  export let links = [];
  export let editMode = false;

  const dispatch = createEventDispatcher();

  function getFaviconUrl(url) {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch (e) {
      return ''; // Or a default icon
    }
  }
</script>

<div class="category">
  <div class="header">
    <h2>{title}</h2>
    {#if editMode}
      <button on:click={() => dispatch('add')}>Add</button>
    {/if}
  </div>
  
  <div class="links-list">
    {#if links.length === 0}
      <p class="empty-message">No links yet. Add one!</p>
    {:else}
      {#each links as link (link.url)}
        <div class="link-item" in:fly={{ y: 10, duration: 200 }} out:fly={{ y: 10, duration: 200 }}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <img src={getFaviconUrl(link.url)} alt="" class="favicon" />
            <span>{link.text}</span>
          </a>
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
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 250px;
    max-width: 300px;
    width: 100%;
  }

  @media (max-width: 768px) {
    .category {
      min-width: 200px;
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    .category {
      min-width: auto;
      max-width: 100%;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--primary-color);
    padding-bottom: 0.5rem;
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 50px; /* Ensures container has height for empty message */
  }

  .link-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color var(--transition-speed);
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
  }

  .link-item:hover {
    background-color: var(--surface-color);
  }

  a {
    color: var(--on-surface-color);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-grow: 1;
  }

  .favicon {
    width: 16px;
    height: 16px;
  }

  .remove-btn {
    background: none;
    color: var(--on-surface-color);
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0.5rem;
    opacity: 0.5;
    transition: opacity var(--transition-speed);
  }

  .remove-btn:hover {
    opacity: 1;
  }
  
  .empty-message {
    text-align: center;
    color: #888;
    padding: 1rem 0;
    font-style: italic;
  }
</style> 
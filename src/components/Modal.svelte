<script>
  import { createEventDispatcher } from 'svelte';

  let url = '';
  let text = '';
  let error = '';

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    if (!url.trim() || !text.trim()) {
      error = "Both URL and display text are required.";
      return;
    }
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch (_) {
      error = "Please enter a valid URL.";
      return;
    }

    dispatch('submit', { url: finalUrl, text });
  }
</script>

<div class="modal-backdrop" on:click={() => dispatch('close')}>
  <div class="modal-content" on:click|stopPropagation>
    <header>
      <slot name="header"></slot>
      <button class="close-btn" on:click={() => dispatch('close')}>×</button>
    </header>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="url">URL</label>
        <input id="url" type="text" bind:value={url} placeholder="example.com">
      </div>
      <div class="form-group">
        <label for="text">Display Text</label>
        <input id="text" type="text" bind:value={text} placeholder="My Awesome Link">
      </div>
      {#if error}
        <p class="error-message">{error}</p>
      {/if}
      <div class="actions">
        <button type="submit">Add Link</button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal-content {
    background-color: var(--surface-color);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    min-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: var(--on-surface-color);
    font-size: 2rem;
    cursor: pointer;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-weight: bold;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  
  .error-message {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin: 0;
  }
</style> 
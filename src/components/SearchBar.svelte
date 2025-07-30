<script>
  let query = '';
  let selectedEngine = 'google';
  const searchEngines = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q='
  };

  function handleSearch() {
    if (!query) return;
    
    // Basic URL validation
    if (query.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
      window.location.href = query;
    } else {
      window.location.href = searchEngines[selectedEngine] + encodeURIComponent(query);
    }
  }
</script>

<div class="search-container">
  <div class="search-bar">
    <select bind:value={selectedEngine}>
      {#each Object.keys(searchEngines) as engine}
        <option value={engine}>{engine.charAt(0).toUpperCase() + engine.slice(1)}</option>
      {/each}
    </select>
    <input 
      type="text" 
      bind:value={query} 
      on:keydown={(e) => e.key === 'Enter' && handleSearch()}
      placeholder="Search or enter a URL"
    />
  </div>
  <button on:click={handleSearch} title="Search">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  </button>
</div>

<style>
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  .search-bar {
    display: flex;
    flex: 1;
    background-color: var(--surface-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
  }

  select {
    border: none;
    background-color: var(--surface-color);
    color: var(--on-surface-color);
    padding: 0 1rem;
    font-weight: bold;
    cursor: pointer;
    border-right: 1px solid var(--primary-color);
    outline: none;
  }

  select:focus {
    background-color: var(--primary-color);
    color: var(--on-primary-color);
  }

  input {
    flex-grow: 1;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
    background-color: var(--surface-color);
    color: var(--on-surface-color);
    outline: none;
    transition: background-color var(--transition-speed);
  }

  input:focus {
    background-color: rgba(79, 79, 79, 0.3);
  }

  input::placeholder {
    color: rgba(224, 224, 224, 0.6);
  }

  button {
    border: 1px solid var(--primary-color);
    background-color: transparent;
    color: var(--on-surface-color);
    padding: 0.5rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    transition: background-color var(--transition-speed), color var(--transition-speed);
    flex-shrink: 0;
  }

  button:hover {
    background-color: var(--primary-color);
    color: var(--on-primary-color);
  }

  button svg {
    width: 16px;
    height: 16px;
  }
</style> 
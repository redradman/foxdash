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
    <button on:click={handleSearch}>Search</button>
  </div>
</div>

<style>
  .search-container {
    display: flex;
    justify-content: center;
  }

  .search-bar {
    display: flex;
    width: 100%;
    max-width: 600px;
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
  }

  input {
    flex-grow: 1;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
  }

  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style> 
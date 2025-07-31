<script>
  import { onMount } from 'svelte';
  
  let query = '';
  let selectedEngine = 'google';
  const searchEngines = {
    google: {
      url: 'https://www.google.com/search?q=',
      name: 'Google',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>`
    },
    bing: {
      url: 'https://www.bing.com/search?q=',
      name: 'Bing',
      icon: `<img src="https://www.google.com/s2/favicons?domain=bing.com&sz=16" width="16" height="16" alt="Bing">`
    },
    duckduckgo: {
      url: 'https://duckduckgo.com/?q=',
      name: 'DuckDuckGo',
      icon: `<img src="https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=16" width="16" height="16" alt="DuckDuckGo">`
    }
  };

  function handleSearch() {
    if (!query) return;
    
    // Basic URL validation
    if (query.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)) {
      window.location.href = query;
    } else {
      window.location.href = searchEngines[selectedEngine].url + encodeURIComponent(query);
    }
  }

  function handleEngineChange() {
    localStorage.setItem('foxdash-search-engine', selectedEngine);
  }

  onMount(() => {
    // Load saved search engine preference
    const savedEngine = localStorage.getItem('foxdash-search-engine');
    if (savedEngine && searchEngines[savedEngine]) {
      selectedEngine = savedEngine;
    }
  });
</script>

<div class="search-container">
  <div class="search-bar">
    <div class="select-wrapper">
      <div class="selected-engine">
        {@html searchEngines[selectedEngine].icon}
        <span>{searchEngines[selectedEngine].name}</span>
        <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
      <select bind:value={selectedEngine} on:change={handleEngineChange}>
        {#each Object.keys(searchEngines) as engine}
          <option value={engine}>{searchEngines[engine].name}</option>
        {/each}
      </select>
    </div>
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
    max-width: 70%;
    margin: 0 auto;
    padding: 0 2rem;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .search-container {
      max-width: 85%;
      padding: 0 1rem;
      gap: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .search-container {
      max-width: 95%;
      padding: 0 0.5rem;
      gap: 0.5rem;
    }
  }

  .search-bar {
    display: flex;
    flex: 1;
    background-color: var(--surface-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
  }

  .select-wrapper {
    position: relative;
    border-right: 1px solid var(--primary-color);
  }

  .selected-engine {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.75rem 0 1rem;
    background-color: var(--surface-color);
    color: var(--on-surface-color);
    font-weight: bold;
    pointer-events: none;
    height: 100%;
    box-sizing: border-box;
    justify-content: center;
    min-width: 100px;
  }

  .dropdown-arrow {
    width: 12px;
    height: 12px;
    opacity: 0.7;
    transition: opacity var(--transition-speed), transform var(--transition-speed);
  }

  select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
  }

  .select-wrapper:hover .selected-engine {
    background-color: var(--primary-color);
    color: var(--on-primary-color);
  }

  .select-wrapper:hover .dropdown-arrow {
    opacity: 1;
    transform: rotate(180deg);
  }

  .select-wrapper {
    cursor: pointer;
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

  @media (max-width: 768px) {
    input {
      font-size: 0.9rem;
      padding: 0.6rem;
    }
    
    .selected-engine {
      padding: 0 0.75rem;
      font-size: 0.9rem;
    }
    
    button {
      min-width: 36px;
      height: 36px;
    }
  }

  @media (max-width: 480px) {
    input {
      font-size: 0.85rem;
      padding: 0.5rem;
    }
    
    .selected-engine {
      padding: 0 0.5rem;
      font-size: 0.85rem;
    }
    
    button {
      min-width: 32px;
      height: 32px;
      padding: 0.25rem;
    }
    
    button svg {
      width: 14px;
      height: 14px;
    }
  }
</style> 
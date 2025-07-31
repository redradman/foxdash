<script>
  import { fly } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import SearchBar from './components/SearchBar.svelte';
  import Bookmarks from './components/Bookmarks.svelte';
  import DateTime from './components/DateTime.svelte';
  import Icon from './components/Icon.svelte';

  let editMode = false;
  let showMenu = false;
  let menuElement;
  let buttonElement;

  function toggleEditMode() {
    editMode = !editMode;
    showMenu = false;
  }

  function handleClickOutside(event) {
    if (showMenu && buttonElement && !buttonElement.contains(event.target) && menuElement && !menuElement.contains(event.target)) {
      showMenu = false;
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="app-layout">
  <div class="top-left">
    <DateTime />
  </div>
  <div class="top-right">
    <button class="settings-btn" on:click={() => showMenu = !showMenu} bind:this={buttonElement}>
      <Icon name="settings" size={24} />
    </button>
    {#if showMenu}
      <div class="settings-menu" transition:fly={{ y: -5, duration: 200 }} bind:this={menuElement}>
        <button on:click={toggleEditMode}>
          {editMode ? 'Done' : 'Change Bookmarks'}
        </button>
      </div>
    {/if}
  </div>
  
  <main>
    <SearchBar />
    <Bookmarks {editMode} />
  </main>
</div>


<style>
  .app-layout {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto 1fr;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-items: center;
  }

  main {
    grid-column: 1 / -1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding: 0;
    box-sizing: border-box;
  }
  
  .top-left {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    align-self: start;
    padding: 2rem;
  }
  
  .top-right {
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
    align-self: start;
    padding: 2rem;
    position: relative;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--text-color);
  }

  .settings-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--on-surface-color);
    border-radius: 8px;
    transition: all 0.2s ease;
    opacity: 0.8;
  }

  .settings-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
    transform: scale(1.05);
  }

  .settings-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background: linear-gradient(135deg, var(--surface-color) 0%, rgba(42, 42, 42, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 0.75rem;
    z-index: 10;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    min-width: 200px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .settings-menu::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: var(--surface-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
    z-index: -1;
  }

  .settings-menu button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.875rem 1.25rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    color: var(--on-surface-color);
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .settings-menu button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .settings-menu button:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .settings-menu button:hover::before {
    transform: translateX(100%);
  }

  .settings-menu button:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }
</style> 
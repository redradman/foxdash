<script>
  import { fly } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import SearchBar from './components/SearchBar.svelte';
  import Bookmarks from './components/Bookmarks.svelte';
  import DateTime from './components/DateTime.svelte';
  import Icon from './components/Icon.svelte';

  let editMode = false;
  let showMenu = false;
  let showThemeMenu = false;
  let menuElement;
  let buttonElement;
  let currentTheme = 'dark';

  const themes = {
    dark: {
      name: 'Dark',
      colors: {
        '--background-color': '#1a1a1a',
        '--surface-color': '#2a2a2a',
        '--primary-color': '#4f4f4f',
        '--on-surface-color': '#e0e0e0',
        '--on-primary-color': '#ffffff'
      }
    },
    blue: {
      name: 'Ocean Blue',
      colors: {
        '--background-color': '#0f1419',
        '--surface-color': '#1e2936',
        '--primary-color': '#2d5aa0',
        '--on-surface-color': '#e6f1ff',
        '--on-primary-color': '#ffffff'
      }
    },
    purple: {
      name: 'Purple Haze',
      colors: {
        '--background-color': '#1a0d26',
        '--surface-color': '#2d1b36',
        '--primary-color': '#6b46c1',
        '--on-surface-color': '#f3e8ff',
        '--on-primary-color': '#ffffff'
      }
    },
    green: {
      name: 'Forest Green',
      colors: {
        '--background-color': '#0d1f0d',
        '--surface-color': '#1a2e1a',
        '--primary-color': '#16a34a',
        '--on-surface-color': '#dcfce7',
        '--on-primary-color': '#ffffff'
      }
    },
    sunset: {
      name: 'Sunset',
      colors: {
        '--background-color': '#1f0f0a',
        '--surface-color': '#2d1b16',
        '--primary-color': '#ea580c',
        '--on-surface-color': '#fed7aa',
        '--on-primary-color': '#ffffff'
      }
    },
    rose: {
      name: 'Rose Gold',
      colors: {
        '--background-color': '#1f0f14',
        '--surface-color': '#2d1b22',
        '--primary-color': '#e11d48',
        '--on-surface-color': '#fce7f3',
        '--on-primary-color': '#ffffff'
      }
    }
  };

  function toggleEditMode() {
    editMode = !editMode;
    showMenu = false;
  }

  function toggleThemeMenu() {
    showThemeMenu = !showThemeMenu;
  }

  function applyTheme(themeKey) {
    const theme = themes[themeKey];
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      currentTheme = themeKey;
      localStorage.setItem('foxdash-theme', themeKey);
      showThemeMenu = false;
      showMenu = false;
    }
  }

  function handleClickOutside(event) {
    if (showMenu && buttonElement && !buttonElement.contains(event.target) && menuElement && !menuElement.contains(event.target) && !event.target.closest('.theme-menu')) {
      showMenu = false;
    }
    if (showThemeMenu && !event.target.closest('.theme-menu') && !event.target.closest('.theme-toggle')) {
      showThemeMenu = false;
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('foxdash-theme');
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme);
    }
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
        <button on:click={toggleThemeMenu} class="theme-toggle">
          <span>Appearance</span>
          <span class="theme-preview" style="background-color: {themes[currentTheme].colors['--primary-color']}"></span>
        </button>
      </div>
    {/if}
    
    {#if showThemeMenu}
      <div class="theme-menu" transition:fly={{ y: -5, duration: 200 }}>
        <div class="theme-header">Choose Theme</div>
        <div class="theme-grid">
          {#each Object.entries(themes) as [key, theme]}
            <button 
              class="theme-option {currentTheme === key ? 'active' : ''}"
              on:click={() => applyTheme(key)}
            >
              <div class="theme-colors">
                <div class="color-dot" style="background-color: {theme.colors['--background-color']}"></div>
                <div class="color-dot" style="background-color: {theme.colors['--surface-color']}"></div>
                <div class="color-dot" style="background-color: {theme.colors['--primary-color']}"></div>
              </div>
              <span class="theme-name">{theme.name}</span>
            </button>
          {/each}
        </div>
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
    color: var(--on-surface-color);
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

  .theme-toggle {
    justify-content: space-between !important;
  }

  .theme-preview {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .theme-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background: linear-gradient(135deg, var(--surface-color) 0%, rgba(42, 42, 42, 0.95) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1rem;
    z-index: 20;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    min-width: 280px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .theme-menu::before {
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

  .theme-header {
    font-size: 1rem;
    font-weight: 600;
    color: var(--on-surface-color);
    margin-bottom: 1rem;
    text-align: center;
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .theme-option {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 0.5rem !important;
    padding: 1rem 0.75rem !important;
    border: 2px solid transparent !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 12px !important;
    cursor: pointer;
    transition: all 0.2s ease !important;
    position: relative;
    text-align: center !important;
  }

  .theme-option:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
  }

  .theme-option.active {
    border-color: var(--primary-color) !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%) !important;
  }

  .theme-option.active::after {
    content: '✓';
    position: absolute;
    top: 6px;
    right: 8px;
    color: var(--primary-color);
    font-size: 0.75rem;
    font-weight: bold;
  }

  .theme-colors {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .theme-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--on-surface-color);
  }
</style> 
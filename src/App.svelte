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
  let showModeMenu = false;
  let menuElement;
  let buttonElement;
  let currentTheme = 'dark';
  let colorMode = 'dark'; // 'light', 'dark', 'system'

  const themes = {
    dark: {
      name: 'Dark',
      light: {
        '--background-color': '#f8fafc',
        '--surface-color': '#ffffff',
        '--primary-color': '#64748b',
        '--on-surface-color': '#1e293b',
        '--on-primary-color': '#ffffff'
      },
      dark: {
        '--background-color': '#1a1a1a',
        '--surface-color': '#2a2a2a',
        '--primary-color': '#4f4f4f',
        '--on-surface-color': '#e0e0e0',
        '--on-primary-color': '#ffffff'
      }
    },
    blue: {
      name: 'Ocean Blue',
      light: {
        '--background-color': '#f0f9ff',
        '--surface-color': '#ffffff',
        '--primary-color': '#2563eb',
        '--on-surface-color': '#1e40af',
        '--on-primary-color': '#ffffff'
      },
      dark: {
        '--background-color': '#0f1419',
        '--surface-color': '#1e2936',
        '--primary-color': '#2d5aa0',
        '--on-surface-color': '#e6f1ff',
        '--on-primary-color': '#ffffff'
      }
    },
    purple: {
      name: 'Purple Haze',
      light: {
        '--background-color': '#faf5ff',
        '--surface-color': '#ffffff',
        '--primary-color': '#7c3aed',
        '--on-surface-color': '#581c87',
        '--on-primary-color': '#ffffff'
      },
      dark: {
        '--background-color': '#1a0d26',
        '--surface-color': '#2d1b36',
        '--primary-color': '#6b46c1',
        '--on-surface-color': '#f3e8ff',
        '--on-primary-color': '#ffffff'
      }
    },
    green: {
      name: 'Forest Green',
      light: {
        '--background-color': '#f0fdf4',
        '--surface-color': '#ffffff',
        '--primary-color': '#16a34a',
        '--on-surface-color': '#14532d',
        '--on-primary-color': '#ffffff'
      },
      dark: {
        '--background-color': '#0d1f0d',
        '--surface-color': '#1a2e1a',
        '--primary-color': '#16a34a',
        '--on-surface-color': '#dcfce7',
        '--on-primary-color': '#ffffff'
      }
    },
    sunset: {
      name: 'Sunset',
      light: {
        '--background-color': '#fff7ed',
        '--surface-color': '#ffffff',
        '--primary-color': '#ea580c',
        '--on-surface-color': '#9a3412',
        '--on-primary-color': '#ffffff'
      },
      dark: {
        '--background-color': '#1f0f0a',
        '--surface-color': '#2d1b16',
        '--primary-color': '#ea580c',
        '--on-surface-color': '#fed7aa',
        '--on-primary-color': '#ffffff'
      }
    },
    rose: {
      name: 'Rose Gold',
      light: {
        '--background-color': '#fdf2f8',
        '--surface-color': '#ffffff',
        '--primary-color': '#e11d48',
        '--on-surface-color': '#881337',
        '--on-primary-color': '#ffffff'
      },
      dark: {
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

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getEffectiveMode() {
    if (colorMode === 'system') {
      return getSystemPreference();
    }
    return colorMode;
  }

  function applyTheme(themeKey, newColorMode = null) {
    const theme = themes[themeKey];
    if (theme) {
      if (newColorMode !== null) {
        colorMode = newColorMode;
      }
      
      const effectiveMode = getEffectiveMode();
      const colors = theme[effectiveMode];
      
      const root = document.documentElement;
      Object.entries(colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      currentTheme = themeKey;
      localStorage.setItem('foxdash-theme', themeKey);
      localStorage.setItem('foxdash-color-mode', colorMode);
      showThemeMenu = false;
      showMenu = false;
    }
  }

  function toggleModeMenu() {
    showModeMenu = !showModeMenu;
  }

  function selectColorMode(mode) {
    applyTheme(currentTheme, mode);
    showModeMenu = false;
  }

  function getModeIcon(mode) {
    switch(mode) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '🖥️';
      default: return '🌙';
    }
  }

  function getModeName(mode) {
    switch(mode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'Dark';
    }
  }

  function handleClickOutside(event) {
    if (showMenu && buttonElement && !buttonElement.contains(event.target) && menuElement && !menuElement.contains(event.target) && !event.target.closest('.theme-menu') && !event.target.closest('.mode-menu')) {
      showMenu = false;
    }
    if (showThemeMenu && !event.target.closest('.theme-menu') && !event.target.closest('.theme-toggle')) {
      showThemeMenu = false;
    }
    if (showModeMenu && !event.target.closest('.mode-menu') && !event.target.closest('.mode-toggle-btn')) {
      showModeMenu = false;
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClickOutside);
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('foxdash-theme');
    const savedColorMode = localStorage.getItem('foxdash-color-mode');
    
    if (savedColorMode) {
      colorMode = savedColorMode;
    }
    
    if (savedTheme && themes[savedTheme]) {
      applyTheme(savedTheme);
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (colorMode === 'system') {
        applyTheme(currentTheme);
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
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
    {#if editMode}
      <button class="done-btn" on:click={toggleEditMode}>
        Done
      </button>
    {/if}
    <button class="mode-toggle-btn" on:click={toggleModeMenu} title="Color mode: {getModeName(colorMode)}">
      {getModeIcon(colorMode)}
    </button>
    <button class="settings-btn" on:click={() => showMenu = !showMenu} bind:this={buttonElement}>
      <Icon name="settings" size={24} />
    </button>
    {#if showMenu}
      <div class="settings-menu" transition:fly={{ y: -5, duration: 200 }} bind:this={menuElement}>
        {#if !editMode}
          <button on:click={toggleEditMode}>
            Change Bookmarks
          </button>
        {/if}
        <button on:click={toggleThemeMenu} class="theme-toggle">
          <span>Appearance</span>
          <span class="theme-preview" style="background-color: {themes[currentTheme][getEffectiveMode()]['--primary-color']}"></span>
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
                <div class="color-dot" style="background-color: {theme[getEffectiveMode()]['--background-color']}"></div>
                <div class="color-dot" style="background-color: {theme[getEffectiveMode()]['--surface-color']}"></div>
                <div class="color-dot" style="background-color: {theme[getEffectiveMode()]['--primary-color']}"></div>
              </div>
              <span class="theme-name">{theme.name}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if showModeMenu}
      <div class="mode-menu" transition:fly={{ y: -5, duration: 200 }}>
        <div class="mode-header">Color Mode</div>
        <div class="mode-options">
          {#each ['light', 'dark', 'system'] as mode}
            <button 
              class="mode-option {colorMode === mode ? 'active' : ''}"
              on:click={() => selectColorMode(mode)}
            >
              <span class="mode-icon">{getModeIcon(mode)}</span>
              <span class="mode-name">{getModeName(mode)}</span>
              {#if mode === 'system'}
                <span class="mode-detail">({getSystemPreference()})</span>
              {/if}
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
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* .edit-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--on-surface-color);
  } */

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

  .done-btn {
    background: linear-gradient(135deg, var(--primary-color) 0%, rgba(79, 79, 79, 0.8) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--on-primary-color);
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .done-btn:hover {
    background: linear-gradient(135deg, var(--primary-color) 0%, rgba(79, 79, 79, 0.9) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .done-btn:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }

  .mode-toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
    opacity: 0.8;
    font-size: 1.2rem;
    width: 40px;
    height: 40px;
  }

  .mode-toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
    transform: scale(1.05);
  }

  .mode-toggle-btn:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .settings-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    border-radius: 16px;
    padding: 0.75rem;
    z-index: 10;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 8px 16px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .settings-menu::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 40px;
    width: 12px;
    height: 12px;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
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
    background-color: var(--primary-color);
    color: var(--on-primary-color);
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
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    border-radius: 16px;
    padding: 1rem;
    z-index: 20;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 8px 16px rgba(0, 0, 0, 0.1);
    min-width: 280px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .theme-menu::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 40px;
    width: 12px;
    height: 12px;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
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
    background: transparent !important;
    border-radius: 12px !important;
    cursor: pointer;
    transition: all 0.2s ease !important;
    position: relative;
    text-align: center !important;
  }

  .theme-option:hover {
    background: var(--primary-color) !important;
    color: var(--on-primary-color) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
  }

  .theme-option.active {
    border-color: var(--primary-color) !important;
    background: var(--primary-color) !important;
    color: var(--on-primary-color) !important;
  }

  .theme-option.active::after {
    content: '✓';
    position: absolute;
    top: 6px;
    right: 8px;
    color: var(--on-primary-color);
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

  .mode-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 60px;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    border-radius: 16px;
    padding: 0.75rem;
    z-index: 20;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 8px 16px rgba(0, 0, 0, 0.1);
    min-width: 180px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .mode-menu::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
    z-index: -1;
  }

  .mode-header {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--on-surface-color);
    margin-bottom: 0.75rem;
    text-align: center;
  }

  .mode-options {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .mode-option {
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
    width: 100% !important;
    padding: 0.75rem 1rem !important;
    border: 2px solid transparent !important;
    background: none !important;
    text-align: left !important;
    cursor: pointer;
    color: var(--on-surface-color) !important;
    border-radius: 10px !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative;
    overflow: hidden;
  }

  .mode-option::before {
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

  .mode-option:hover {
    background: var(--primary-color) !important;
    color: var(--on-primary-color) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  .mode-option:hover::before {
    transform: translateX(100%);
  }

  .mode-option.active {
    border-color: var(--primary-color) !important;
    background: var(--primary-color) !important;
    color: var(--on-primary-color) !important;
  }

  .mode-option.active::after {
    content: '✓';
    position: absolute;
    right: 12px;
    color: var(--on-primary-color);
    font-size: 0.85rem;
    font-weight: bold;
  }

  .mode-icon {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
  }

  .mode-name {
    flex: 1;
  }

  .mode-detail {
    font-size: 0.75rem;
    opacity: 0.7;
    font-style: italic;
  }
</style> 
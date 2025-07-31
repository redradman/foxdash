<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let title;
  export let links = [];
  export let editMode = false;
  export let usedIcons = new Set();

  const dispatch = createEventDispatcher();
  let editingLink = null;
  let editingText = '';
  let previewIcon = null;
  let editingTitle = false;
  let titleText = title;
  let categoryIcon = null;

  function getFaviconUrl(url) {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch (e) {
      return ''; // Or a default icon
    }
  }

  let iconCache = new Map();

  async function getSmartIcon(name, url = null, avoidIcons = new Set()) {
    const cacheKey = `${name}-${url}-${Array.from(avoidIcons).join(',')}`;
    if (iconCache.has(cacheKey)) {
      return iconCache.get(cacheKey);
    }

    let icon = await findBestIcon(name, url, avoidIcons);
    iconCache.set(cacheKey, icon);
    return icon;
  }

  async function findBestIcon(name, url, avoidIcons = new Set()) {
    const lowerName = name.toLowerCase().trim();
    
    // 1. Try to get favicon from URL domain if available (only for bookmarks, not categories)
    if (url) {
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        const brandIcon = await getBrandIcon(domain);
        if (brandIcon && !avoidIcons.has(brandIcon.data)) return brandIcon;
      } catch (e) {
        // Continue to other methods
      }
    }
    
    // 2. Try brand icon lookup based on name
    const brandIcon = await getBrandIcon(lowerName);
    if (brandIcon && !avoidIcons.has(brandIcon.data)) return brandIcon;
    
    // 3. Fallback to semantic emoji matching with uniqueness constraint
    return getSemanticIcon(lowerName, avoidIcons);
  }

  async function getBrandIcon(identifier) {
    try {
      // Use Simple Icons API for brand recognition
      const brandNames = [
        identifier,
        identifier.replace(/[\s-\.]/g, ''),
        identifier.split(/[\s-\.]/)[0]
      ];

      for (const brandName of brandNames) {
        try {
          const response = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/${brandName}.json`, {
            method: 'GET',
            timeout: 2000
          });
          
          if (response.ok) {
            const iconData = await response.json();
            // Return as data URL SVG for consistent sizing
            const svg = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23${iconData.hex}"><path d="${iconData.path}"/></svg>`)}`;
            return { type: 'svg', data: svg, title: iconData.title };
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // Fallback silently
    }
    return null;
  }

  function getSemanticIcon(name, avoidIcons = new Set()) {
    // Compact semantic matching for common categories with alternatives
    const semanticMap = {
      // Work & Productivity (multiple alternatives for uniqueness)
      work: ['💼', '🏢', '👔', '💻', '📊', '📋'],
      office: ['🏢', '💼', '📊', '👔', '🗂️', '📁'],
      business: ['💼', '🏢', '📈', '💰', '🤝', '👔'],
      job: ['💼', '👔', '🏢', '💻', '📋', '⚡'],
      
      // Personal & Lifestyle
      personal: ['👤', '🏠', '❤️', '🌟', '💫', '🎯'],
      home: ['🏠', '🏡', '🔑', '🛋️', '🌟', '💙'],
      life: ['🌟', '💫', '❤️', '🎯', '🌈', '✨'],
      family: ['👨‍👩‍👧‍👦', '❤️', '🏠', '💕', '👶', '🤗'],
      
      // Hobbies & Entertainment
      hobby: ['🎯', '🎨', '🎮', '📚', '🎵', '🧩'],
      entertainment: ['🎬', '🎮', '🎭', '🎪', '🎨', '🎵'],
      fun: ['🎉', '🎊', '🎈', '🎯', '🎪', '🎭'],
      gaming: ['🎮', '🕹️', '👾', '🎯', '🏆', '⚡'],
      
      // Media & Arts
      music: ['🎵', '🎶', '🎧', '🎤', '🎼', '🎹'],
      video: ['📹', '🎬', '📺', '🎥', '🎞️', '📽️'],
      art: ['🎨', '🖌️', '🖼️', '✏️', '🎭', '🌈'],
      photo: ['📷', '📸', '🖼️', '🎨', '📹', '🌅'],
      
      // Learning & Development
      education: ['🎓', '📚', '📖', '✏️', '📝', '🧠'],
      learn: ['📚', '🎓', '🧠', '💡', '📖', '✏️'],
      study: ['📚', '📖', '✏️', '🎓', '💡', '📝'],
      
      // Health & Fitness
      health: ['❤️', '💪', '🏥', '🩺', '💊', '🍎'],
      fitness: ['💪', '🏋️', '🏃', '🚴', '⚡', '🎯'],
      
      // Shopping & Finance
      shopping: ['🛒', '🛍️', '💳', '🏪', '💰', '🎁'],
      money: ['💰', '💵', '💳', '📈', '🏦', '💎'],
      finance: ['💰', '📈', '💳', '🏦', '💵', '📊'],
      
      // Travel & Adventure
      travel: ['✈️', '🗺️', '🧳', '🌍', '🚗', '🏕️'],
      adventure: ['🗺️', '🧭', '⛰️', '🏕️', '🚗', '✈️'],
      
      // Food & Cooking
      food: ['🍽️', '👨‍🍳', '🍳', '🥘', '🍕', '🍔'],
      cooking: ['👨‍🍳', '🍳', '🥘', '🔥', '🍽️', '👩‍🍳'],
      
      // Default categories
      project: ['📊', '📋', '🎯', '⚡', '🚀', '💡'],
      tool: ['🔧', '⚙️', '🛠️', '🔩', '⚡', '💡'],
      utility: ['⚙️', '🔧', '🛠️', '💡', '⚡', '🔩']
    };

    // Find best match with uniqueness
    for (const [keyword, emojis] of Object.entries(semanticMap)) {
      if (name.includes(keyword) || keyword.includes(name)) {
        // Find first emoji that's not already used
        for (const emoji of emojis) {
          if (!avoidIcons.has(emoji)) {
            return { type: 'emoji', data: emoji };
          }
        }
      }
    }
    
    // Fallback icons pool if no matches found
    const fallbackIcons = ['🔗', '📁', '⭐', '🎯', '💫', '✨', '🌟', '🔖', '📎', '🎪'];
    for (const icon of fallbackIcons) {
      if (!avoidIcons.has(icon)) {
        return { type: 'emoji', data: icon };
      }
    }
    
    // Ultimate fallback with random emoji if all else fails
    const ultimateFallbacks = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔶'];
    const randomIndex = Math.floor(Math.random() * ultimateFallbacks.length);
    return { type: 'emoji', data: ultimateFallbacks[randomIndex] };
  }

  function startEditing(link) {
    editingLink = link;
    editingText = link.text;
    updatePreviewIcon();
  }

  async function updatePreviewIcon() {
    if (editingText.trim()) {
      previewIcon = await getSmartIcon(editingText.trim(), editingLink?.url, new Set());
    } else {
      previewIcon = { type: 'emoji', data: '🔗' };
    }
  }

  // Debounced preview update
  let previewTimeout;
  function handleTextInput() {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(updatePreviewIcon, 300);
  }

  async function saveEdit() {
    if (editingLink && editingText.trim()) {
      const smartIcon = await getSmartIcon(editingText.trim(), editingLink.url, new Set());
      const updatedLink = {
        ...editingLink,
        text: editingText.trim(),
        smartIcon: smartIcon
      };
      dispatch('updateLink', { oldLink: editingLink, newLink: updatedLink });
    }
    cancelEdit();
  }

  function cancelEdit() {
    editingLink = null;
    editingText = '';
    previewIcon = null;
    clearTimeout(previewTimeout);
  }

  function renderIcon(iconData) {
    if (!iconData) return '';
    
    if (iconData.type === 'emoji') {
      return iconData.data;
    } else if (iconData.type === 'svg') {
      return `<img src="${iconData.data}" alt="${iconData.title || ''}" class="brand-icon" />`;
    }
    return '🔗';
  }

  // Category title editing functions
  function startEditingTitle() {
    editingTitle = true;
    titleText = title;
  }

  async function saveTitleEdit() {
    if (titleText.trim()) {
      const smartIcon = await getSmartIcon(titleText.trim(), null, usedIcons);
      dispatch('updateTitle', { oldTitle: title, newTitle: titleText.trim(), icon: smartIcon });
      categoryIcon = smartIcon;
    }
    editingTitle = false;
  }

  function cancelTitleEdit() {
    editingTitle = false;
    titleText = title;
  }

  function handleTitleKeydown(event) {
    if (event.key === 'Enter') {
      saveTitleEdit();
    } else if (event.key === 'Escape') {
      cancelTitleEdit();
    }
  }

  // Initialize category icon on mount
  import { onMount } from 'svelte';
  onMount(async () => {
    categoryIcon = await getSmartIcon(title, null, usedIcons);
    dispatch('iconUpdate', { category: title, icon: categoryIcon });
  });

  // Enhanced bookmark icon with fallback to smart icons
  async function getBookmarkIcon(link) {
    // First try favicon
    const faviconUrl = getFaviconUrl(link.url);
    if (faviconUrl) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ type: 'favicon', data: faviconUrl });
        img.onerror = async () => {
          // Fallback to smart icon if favicon fails
          const smartIcon = await getSmartIcon(link.text, link.url, new Set());
          resolve(smartIcon);
        };
        img.src = faviconUrl;
      });
    } else {
      // No favicon URL, use smart icon
      return await getSmartIcon(link.text, link.url, new Set());
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }
</script>

<div class="category">
  <div class="header">
    {#if editingTitle}
      <div class="title-edit">
        <div class="icon-preview">
          {#if categoryIcon}
            {@html renderIcon(categoryIcon)}
          {:else}
            <span class="smart-icon">📁</span>
          {/if}
        </div>
        <input 
          type="text" 
          bind:value={titleText} 
          on:keydown={handleTitleKeydown}
          on:blur={saveTitleEdit}
          class="title-input"
        />
        <button class="save-btn" on:click={saveTitleEdit}>✓</button>
        <button class="cancel-btn" on:click={cancelTitleEdit}>×</button>
      </div>
    {:else}
      <div class="title-display">
        {#if categoryIcon}
          <div class="category-icon">
            {@html renderIcon(categoryIcon)}
          </div>
        {/if}
        <h2>{title}</h2>
        {#if editMode}
          <button class="edit-title-btn" on:click={startEditingTitle} title="Edit category name">✏️</button>
        {/if}
      </div>
    {/if}
    {#if editMode && !editingTitle}
      <button on:click={() => dispatch('add')}>Add</button>
    {/if}
  </div>
  
  <div class="links-list">
    {#if links.length === 0}
      <p class="empty-message">No links yet. Add one!</p>
    {:else}
      {#each links as link (link.url)}
        <div class="link-item" in:fly={{ y: 10, duration: 200 }} out:fly={{ y: 10, duration: 200 }}>
          {#if editingLink === link}
            <div class="edit-mode">
              <div class="icon-preview">
                {#if previewIcon}
                  {@html renderIcon(previewIcon)}
                {:else}
                  <span class="smart-icon">🔗</span>
                {/if}
              </div>
              <input 
                type="text" 
                bind:value={editingText} 
                on:input={handleTextInput}
                on:keydown={handleKeydown}
                on:blur={saveEdit}
                class="edit-input"
              />
              <button class="save-btn" on:click={saveEdit}>✓</button>
              <button class="cancel-btn" on:click={cancelEdit}>×</button>
            </div>
          {:else}
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {#if link.smartIcon}
                <div class="icon-container">
                  {@html renderIcon(link.smartIcon)}
                </div>
              {:else}
                {#await getBookmarkIcon(link)}
                  <img src={getFaviconUrl(link.url)} alt="" class="favicon" />
                {:then iconData}
                  <div class="icon-container">
                    {#if iconData.type === 'favicon'}
                      <img src={iconData.data} alt="" class="favicon" />
                    {:else}
                      {@html renderIcon(iconData)}
                    {/if}
                  </div>
                {:catch}
                  <div class="icon-container">
                    <span class="smart-icon">🔗</span>
                  </div>
                {/await}
              {/if}
              <span>{link.text}</span>
            </a>
            {#if editMode}
              <button class="edit-btn" on:click={() => startEditing(link)} title="Edit name">✏️</button>
              <button class="remove-btn" on:click={() => dispatch('remove', link)}>×</button>
            {/if}
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

  .title-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-grow: 1;
  }

  .title-edit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-grow: 1;
  }

  .category-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .title-input {
    flex-grow: 1;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    color: var(--on-surface-color);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .title-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 79, 79, 0.2);
  }

  .edit-title-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    opacity: 0.7;
    transition: opacity var(--transition-speed);
    font-size: 0.8rem;
    color: var(--on-surface-color);
  }

  .edit-title-btn:hover {
    opacity: 1;
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

  .smart-icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-container,
  .icon-preview {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .brand-icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .edit-mode {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-grow: 1;
    padding: 0.25rem;
  }

  .edit-input {
    flex-grow: 1;
    background: var(--surface-color);
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    color: var(--on-surface-color);
    font-size: 0.9rem;
  }

  .edit-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 79, 79, 0.2);
  }

  .edit-btn,
  .save-btn,
  .cancel-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    opacity: 0.7;
    transition: opacity var(--transition-speed);
    font-size: 0.9rem;
  }

  .edit-btn {
    color: var(--on-surface-color);
  }

  .save-btn {
    color: #4ade80;
  }

  .cancel-btn {
    color: #f87171;
  }

  .edit-btn:hover,
  .save-btn:hover,
  .cancel-btn:hover {
    opacity: 1;
  }
</style> 
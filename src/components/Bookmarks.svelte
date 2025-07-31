<script>
  import { bookmarks } from '../stores.js';
  import BookmarkCategory from './BookmarkCategory.svelte';
  import Modal from './Modal.svelte';
  import { slide } from 'svelte/transition';

  export let editMode = false;
  let showModal = false;
  let categoryToAdd = '';

  // Initialize with default categories but allow dynamic updates
  let categories = ["Work", "Personal", "Hobby"];
  
  // Track used category icons to ensure uniqueness
  let usedCategoryIcons = new Map();

  function handleAddRequest(category) {
    categoryToAdd = category;
    showModal = true;
  }

  function handleAddLink(event) {
    const { url, text } = event.detail;
    bookmarks.addLink(categoryToAdd, { url, text });
    showModal = false;
  }

  function handleTitleUpdate(event) {
    const { oldTitle, newTitle, icon } = event.detail;
    // Update the category name in our local array
    const index = categories.findIndex(cat => cat === oldTitle);
    if (index !== -1) {
      categories[index] = newTitle;
      categories = [...categories]; // Trigger reactivity
    }
    
    // Update icon tracking
    if (usedCategoryIcons.has(oldTitle)) {
      usedCategoryIcons.delete(oldTitle);
    }
    usedCategoryIcons.set(newTitle, icon);
    
    // Update bookmarks store to rename the category
    bookmarks.updateCategory(oldTitle, newTitle, icon);
  }

  function getUsedIcons(excludeCategory = null) {
    const usedIcons = new Set();
    usedCategoryIcons.forEach((icon, category) => {
      if (category !== excludeCategory && icon && icon.data) {
        usedIcons.add(icon.data);
      }
    });
    return usedIcons;
  }

  function handleIconUpdate(event) {
    const { category, icon } = event.detail;
    usedCategoryIcons.set(category, icon);
  }

</script>

<div class="bookmarks-container">
  {#each categories as category}
    <BookmarkCategory 
      title={category} 
      links={$bookmarks[category]}
      {editMode}
      on:add={() => handleAddRequest(category)}
      on:remove={(e) => bookmarks.removeLink(category, e.detail)}
      on:updateLink={(e) => bookmarks.updateLink(category, e.detail.oldLink, e.detail.newLink)}
      on:updateTitle={handleTitleUpdate}
      on:iconUpdate={handleIconUpdate}
      usedIcons={getUsedIcons(category)}
    />
  {/each}
</div>

{#if showModal}
<div transition:slide>
  <Modal on:close={() => showModal = false} on:submit={handleAddLink}>
    <h2 slot="header">Add new link to {categoryToAdd}</h2>
  </Modal>
</div>
{/if}

<style>
  .bookmarks-container {
    display: flex;
    justify-content: center;
    gap: 4rem;
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  @media (max-width: 1200px) {
    .bookmarks-container {
      gap: 2rem;
      padding: 0 1rem;
    }
  }

  @media (max-width: 768px) {
    .bookmarks-container {
      flex-direction: column;
      gap: 2rem;
      align-items: center;
      padding: 0 1rem;
    }
  }

  @media (max-width: 480px) {
    .bookmarks-container {
      gap: 1.5rem;
      padding: 0 0.5rem;
    }
  }
</style> 
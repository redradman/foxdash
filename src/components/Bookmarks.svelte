<script>
  import { bookmarks } from '../stores.js';
  import BookmarkCategory from './BookmarkCategory.svelte';
  import Modal from './Modal.svelte';
  import { slide } from 'svelte/transition';

  export let editMode = false;
  let showModal = false;
  let categoryToAdd = '';

  const categories = ["Work", "Personal", "Hobby"];

  function handleAddRequest(category) {
    categoryToAdd = category;
    showModal = true;
  }

  function handleAddLink(event) {
    const { url, text } = event.detail;
    bookmarks.addLink(categoryToAdd, { url, text });
    showModal = false;
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
  }
</style> 
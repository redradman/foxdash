<script>
  import SearchBar from './components/SearchBar.svelte';
  import Bookmarks from './components/Bookmarks.svelte';

  let editMode = false;
</script>

<div class="edit-toggle">
  <button on:click={() => editMode = !editMode}>
    {editMode ? 'Done' : 'Edit'}
  </button>
</div>

<main>
  <SearchBar />
  <Bookmarks {editMode} />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 100%;
  }

  .edit-toggle {
    position: absolute;
    top: 0rem;
    right: 0rem;
  }
</style> 
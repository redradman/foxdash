<script>
  import SearchBar from './components/SearchBar.svelte';
  import Bookmarks from './components/Bookmarks.svelte';
  import DateTime from './components/DateTime.svelte';

  let editMode = false;
</script>

<div class="app-layout">
  <div class="top-left">
    <DateTime />
  </div>
  <div class="top-right">
    <button on:click={() => editMode = !editMode}>
      {editMode ? 'Done' : 'Edit'}
    </button>
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
  }
</style> 
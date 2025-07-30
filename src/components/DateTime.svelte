<script>
  import { onMount, onDestroy } from 'svelte';

  let currentTime = new Date();
  let intervalId;

  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  onMount(() => {
    intervalId = setInterval(() => {
      currentTime = new Date();
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="datetime-container">
  <div class="time">{currentTime.toLocaleTimeString('en-us', timeOptions)}</div>
  <div class="date">{currentTime.toLocaleDateString('en-us', dateOptions)}</div>
</div>

<style>
  .datetime-container {
    text-align: left;
    color: var(--on-surface-color);
  }
  .time {
    font-size: 2.5rem;
    font-weight: 500;
    margin: 0;
    line-height: 1;
  }
  .date {
    font-size: 1rem;
    margin: 0;
    opacity: 0.7;
  }
</style> 
import { writable } from 'svelte/store';

function createBookmarksStore() {
  const { subscribe, set, update } = writable({
    Work: [],
    Personal: [],
    Hobby: []
  });

  // Load from storage on startup
  if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
    browser.storage.local.get('bookmarks').then(result => {
      if (result.bookmarks) {
        set(result.bookmarks);
      }
    });
  }

  return {
    subscribe,
    addLink: (category, link) => update(bookmarks => {
      const newBookmarks = {
        ...bookmarks,
        [category]: [...bookmarks[category], link]
      };
      if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
        browser.storage.local.set({ bookmarks: newBookmarks });
      }
      return newBookmarks;
    }),
    removeLink: (category, link) => update(bookmarks => {
      const newBookmarks = {
        ...bookmarks,
        [category]: bookmarks[category].filter(l => l !== link)
      };
      if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
        browser.storage.local.set({ bookmarks: newBookmarks });
      }
      return newBookmarks;
    }),
  };
}

export const bookmarks = createBookmarksStore(); 
import { writable } from 'svelte/store';

function createBookmarksStore() {
  const defaultBookmarks = {
    Work: [
      { url: 'https://github.com', text: 'GitHub' },
      { url: 'https://stackoverflow.com', text: 'Stack Overflow' },
      { url: 'https://developer.mozilla.org', text: 'MDN Web Docs' },
      { url: 'https://gmail.com', text: 'Gmail' }
    ],
    Personal: [
      { url: 'https://youtube.com', text: 'YouTube' },
      { url: 'https://reddit.com', text: 'Reddit' },
      { url: 'https://twitter.com', text: 'Twitter' },
      { url: 'https://news.ycombinator.com', text: 'Hacker News' }
    ],
    Hobby: [
      { url: 'https://wikipedia.org', text: 'Wikipedia' },
      { url: 'https://goodreads.com', text: 'Goodreads' },
      { url: 'https://steamcommunity.com', text: 'Steam' },
      { url: 'https://twitch.tv', text: 'Twitch' }
    ]
  };

  const { subscribe, set, update } = writable(defaultBookmarks);

  // Load from storage on startup, merge with defaults
  if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
    browser.storage.local.get('bookmarks').then(result => {
      if (result.bookmarks) {
        // Merge stored bookmarks with defaults (stored bookmarks take precedence)
        const mergedBookmarks = {
          Work: result.bookmarks.Work || defaultBookmarks.Work,
          Personal: result.bookmarks.Personal || defaultBookmarks.Personal,
          Hobby: result.bookmarks.Hobby || defaultBookmarks.Hobby
        };
        set(mergedBookmarks);
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
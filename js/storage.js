/* ============================================================
 *  Storage layer for 엄마표 영어 원서 가이드
 *  Centralizes localStorage access for:
 *    - reading progress (per-book, per-chapter)
 *    - bookmarked vocabulary
 *    - settings: theme (auto/light/dark), hide Korean translation
 * ============================================================ */
(function () {
  'use strict';

  const KEY = {
    progress:  'ebm:progress',
    bookmarks: 'ebm:bookmarks',
    hideKo:    'ebm:hide-ko',
    theme:     'ebm:theme'
  };

  function read(key) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? null : JSON.parse(v);
    } catch (e) { return null; }
  }

  function write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      window.dispatchEvent(new CustomEvent('ebm:store-change', { detail: { key } }));
    } catch (e) {}
  }

  const Store = {
    /* ---------- Progress ---------- */
    getProgressSet(slug) {
      const all = read(KEY.progress) || {};
      return new Set(all[slug] || []);
    },
    getProgressCount(slug) {
      return this.getProgressSet(slug).size;
    },
    isComplete(slug, num) {
      return this.getProgressSet(slug).has(num);
    },
    setComplete(slug, num, done) {
      const all = read(KEY.progress) || {};
      const set = new Set(all[slug] || []);
      if (done) set.add(num); else set.delete(num);
      all[slug] = [...set].sort((a, b) => a - b);
      write(KEY.progress, all);
    },
    toggleComplete(slug, num) {
      const isDone = this.isComplete(slug, num);
      this.setComplete(slug, num, !isDone);
      return !isDone;
    },

    /* ---------- Bookmarks (vocab) ---------- */
    getBookmarks() {
      return read(KEY.bookmarks) || [];
    },
    isBookmarked(book, word) {
      return this.getBookmarks().some(b => b.book === book && b.word === word);
    },
    toggleBookmark(item) {
      const list = this.getBookmarks();
      const idx = list.findIndex(b => b.book === item.book && b.word === item.word);
      if (idx >= 0) {
        list.splice(idx, 1);
        write(KEY.bookmarks, list);
        return false;
      } else {
        list.push(Object.assign({ added: Date.now() }, item));
        write(KEY.bookmarks, list);
        return true;
      }
    },
    removeBookmark(book, word) {
      const list = this.getBookmarks().filter(b => !(b.book === book && b.word === word));
      write(KEY.bookmarks, list);
    },

    /* ---------- Settings ---------- */
    getHideKo()      { return read(KEY.hideKo) === true; },
    setHideKo(v)     { write(KEY.hideKo, !!v); },
    toggleHideKo()   { const v = !this.getHideKo(); this.setHideKo(v); return v; },

    getTheme()       { return read(KEY.theme) || 'auto'; }, // 'auto' | 'light' | 'dark'
    setTheme(t)      { write(KEY.theme, t); applyTheme(); },

    /* ---------- Reset (for testing/clear) ---------- */
    reset() {
      Object.values(KEY).forEach(k => localStorage.removeItem(k));
      window.dispatchEvent(new CustomEvent('ebm:store-change', { detail: { key: '*' } }));
    }
  };

  /* ---------- Theme handling (FOUC prevention helper) ---------- */
  function resolveTheme() {
    const t = Store.getTheme();
    if (t === 'light' || t === 'dark') return t;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', resolveTheme());
  }

  // Apply theme as early as possible (this script is loaded in <head> end of body)
  applyTheme();

  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    } catch (e) {
      // Older Safari support
      try { window.matchMedia('(prefers-color-scheme: dark)').addListener(applyTheme); } catch (e2) {}
    }
  }

  window.EBMStore = Store;
  window.EBMApplyTheme = applyTheme;
  window.EBMResolveTheme = resolveTheme;
})();

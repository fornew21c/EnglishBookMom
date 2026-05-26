(function () {
  'use strict';

  const app   = document.getElementById('app');
  const BOOKS = window.BOOKS || [];
  const DATA  = window.BOOK_DATA || {};
  const Store = window.EBMStore;

  /* ============================================================
   *  Utilities
   * ============================================================ */
  function escape(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findBook(slug) {
    return BOOKS.find(b => b.slug === slug);
  }

  function getChapter(slug, num) {
    const d = DATA[slug];
    if (!d || !d.chapters) return null;
    return d.chapters.find(c => c.number === num) || null;
  }

  function totalChapters(slug) {
    const d = DATA[slug];
    return (d && d.chapters) ? d.chapters.length : 0;
  }

  function setTitle(t) {
    document.title = t ? `${t} | 엄마표 영어 원서 가이드` : '엄마표 영어 원서 가이드';
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function progressPct(slug) {
    const t = totalChapters(slug);
    if (!t) return 0;
    return Math.round((Store.getProgressCount(slug) / t) * 100);
  }

  /* ============================================================
   *  Text-to-Speech (English pronunciation on tap)
   * ============================================================ */
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  let enVoice = null;

  function pickEnglishVoice() {
    if (!speechSupported) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;
    enVoice =
      voices.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Google US English|Microsoft Aria|Microsoft Jenny|Karen|Natural/i.test(v.name)) ||
      voices.find(v => /en[-_]US/i.test(v.lang)) ||
      voices.find(v => /en[-_]GB/i.test(v.lang)) ||
      voices.find(v => /^en/i.test(v.lang)) ||
      null;
  }
  if (speechSupported) {
    pickEnglishVoice();
    window.speechSynthesis.onvoiceschanged = pickEnglishVoice;
  }

  function speak(text, el) {
    if (!text) return;
    if (!speechSupported) {
      alert('이 브라우저는 발음 듣기 기능을 지원하지 않아요.\n크롬, 사파리, 엣지 등 최신 브라우저에서 사용해 주세요.');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.pitch = 1.0;
    if (enVoice) u.voice = enVoice;
    if (el) {
      el.classList.add('speak-playing');
      const clear = () => el.classList.remove('speak-playing');
      u.onend = clear;
      u.onerror = clear;
    }
    window.speechSynthesis.speak(u);
  }

  /* ============================================================
   *  Global click handler: speak, bookmark, progress toggle,
   *  hide-ko toggle, theme toggle, quiz card flip
   * ============================================================ */
  document.addEventListener('click', function (e) {
    // 1. Theme toggle (header)
    const themeBtn = e.target.closest && e.target.closest('#theme-toggle');
    if (themeBtn) {
      cycleTheme();
      return;
    }

    // 2. Bookmark star
    const star = e.target.closest && e.target.closest('.bm-star');
    if (star) {
      e.preventDefault();
      e.stopPropagation();
      const data = star.dataset;
      Store.toggleBookmark({
        book:       data.book,
        chapter:    parseInt(data.chapter, 10),
        word:       data.word,
        pos:        data.pos || '',
        mean:       data.mean,
        example:    data.example || '',
        exampleKo:  data.exampleKo || ''
      });
      return;
    }

    // 3. Progress toggle (chapter page or book detail)
    const prog = e.target.closest && e.target.closest('[data-progress-toggle]');
    if (prog) {
      e.preventDefault();
      e.stopPropagation();
      const slug = prog.dataset.book;
      const num  = parseInt(prog.dataset.chapter, 10);
      Store.toggleComplete(slug, num);
      return;
    }

    // 4. Hide Korean toggle (chapter page)
    const hideBtn = e.target.closest && e.target.closest('#hide-ko-toggle');
    if (hideBtn) {
      e.preventDefault();
      Store.toggleHideKo();
      return;
    }

    // 5. Speak elements
    const target = e.target.closest && e.target.closest('.speak');
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      const text = target.dataset.speak || target.textContent.trim();
      speak(text, target);
      return;
    }

    // 6. Quiz card flip
    const card = e.target.closest && e.target.closest('.quiz-card');
    if (card && !e.target.closest('.quiz-action') && !e.target.closest('.speak')) {
      card.classList.toggle('flipped');
      return;
    }
  });

  /* ============================================================
   *  Theme cycling
   * ============================================================ */
  function cycleTheme() {
    const cur = Store.getTheme();
    let next;
    if (cur === 'auto')  next = 'light';
    else if (cur === 'light') next = 'dark';
    else next = 'auto';
    Store.setTheme(next);
    updateThemeToggleLabel();
  }

  function updateThemeToggleLabel() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const t = Store.getTheme();
    btn.setAttribute('data-theme-pref', t);
    btn.title = t === 'auto' ? '자동 (시스템 기본)' : t === 'light' ? '라이트 모드' : '다크 모드';
  }

  /* ============================================================
   *  Render helpers
   * ============================================================ */
  function renderCover(book, sizeClass) {
    const color = escape(book.color || 'color-1');
    const emoji = escape(book.emoji || '📖');
    const cls = sizeClass ? ` ${sizeClass}` : '';
    const img = book.coverUrl
      ? `<img class="book-cover-img" src="${escape(book.coverUrl)}" alt="${escape(book.title)} 표지" loading="lazy" onload="this.classList.add('loaded')" onerror="this.parentNode.removeChild(this)">`
      : '';
    return `
      <div class="book-cover ${color}${cls}">
        <span class="book-cover-emoji">${emoji}</span>
        ${img}
      </div>
    `;
  }

  function renderProgressBar(slug) {
    const total = totalChapters(slug);
    if (!total) return '';
    const done = Store.getProgressCount(slug);
    const pct = Math.round((done / total) * 100);
    return `
      <div class="progress-wrap" aria-label="${done}/${total} 챕터 완독">
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="progress-meta">
          <span><strong>${done}</strong> / ${total} 챕터 완독</span>
          <span class="progress-pct">${pct}%</span>
        </div>
      </div>
    `;
  }

  function bookmarkStar(book, chapter, vocab) {
    const isOn = Store.isBookmarked(book, vocab.word);
    return `
      <button type="button" class="bm-star ${isOn ? 'is-on' : ''}"
              data-book="${escape(book)}"
              data-chapter="${chapter}"
              data-word="${escape(vocab.word)}"
              data-pos="${escape(vocab.pos || '')}"
              data-mean="${escape(vocab.mean)}"
              data-example="${escape(vocab.example || '')}"
              data-example-ko="${escape(vocab.exampleKo || '')}"
              title="${isOn ? '단어장에서 빼기' : '내 단어장에 담기'}"
              aria-label="${isOn ? '단어장에서 빼기' : '내 단어장에 담기'}">
        <span aria-hidden="true">${isOn ? '★' : '☆'}</span>
      </button>
    `;
  }

  function applyHideKoBodyClass() {
    document.body.classList.toggle('hide-ko', Store.getHideKo());
  }

  /* ============================================================
   *  Views
   * ============================================================ */
  function viewHome() {
    setTitle('인기 영어 원서 챕터북 가이드');

    const cards = BOOKS.map(book => {
      const total = totalChapters(book.slug);
      const done  = Store.getProgressCount(book.slug);
      const pct   = total ? Math.round((done / total) * 100) : 0;
      return `
        <a class="book-card" href="#/book/${escape(book.slug)}">
          ${renderCover(book)}
          ${book.verification === 'draft' ? `<span class="verification-badge draft" title="단어 목록이 아직 실제 책 본문과 교차 검증되지 않았어요. 참고용으로 사용해 주세요.">📝 검수 중</span>` : ''}
          <div class="book-meta">
            <span class="tag ar">AR ${escape(book.ar)}</span>
            <span class="tag chapters">${total}챕터</span>
            ${done > 0 ? `<span class="tag done">${done} 완독</span>` : ''}
          </div>
          <p class="book-series">${escape(book.seriesKo || '')}</p>
          <h3 class="book-title">${escape(book.title)}</h3>
          <p class="book-desc">${escape(book.descKo)}</p>
          ${total ? `<div class="book-progress" title="${done}/${total} 챕터"><span style="width:${pct}%"></span></div>` : ''}
        </a>
      `;
    }).join('');

    const bookmarksCount = Store.getBookmarks().length;
    const totalDone = BOOKS.reduce((s, b) => s + Store.getProgressCount(b.slug), 0);
    const totalChaps = BOOKS.reduce((s, b) => s + totalChapters(b.slug), 0);

    app.innerHTML = `
      <section class="hero">
        <p class="hero-eyebrow">엄마와 아이를 위한 원서 가이드</p>
        <div class="hero-content">
          <h1>영어가 서툴러도,<br />아이와 함께 <em>원서를 읽어요.</em></h1>
          <p>
            인기 챕터북을 챕터별로 단어와 질문으로 정리했어요.
            엄마는 한국어로 묻고, 아이는 한국어로 답하며 이해도를 자연스럽게 확인해 보세요.
            영어 단어와 문장은 탭하면 발음을 들을 수 있어요.
          </p>
        </div>
        ${(totalDone > 0 || bookmarksCount > 0) ? `
          <div class="hero-stats">
            ${totalDone > 0 ? `<div class="stat"><div class="stat-num">${totalDone}<span class="stat-sub">/ ${totalChaps}</span></div><div class="stat-label">완독한 챕터</div></div>` : ''}
            ${bookmarksCount > 0 ? `<div class="stat"><a href="#/bookmarks" style="text-decoration:none;color:inherit;"><div class="stat-num">${bookmarksCount}</div><div class="stat-label">내 단어장</div></a></div>` : ''}
          </div>
        ` : ''}
      </section>

      <h2 class="section-title">Selected Reading <span class="section-title-ko">전체 도서</span></h2>
      <p class="section-sub">읽고 싶은 책을 골라보세요. 챕터별 학습 자료가 준비되어 있어요.</p>

      <div class="book-grid">${cards}</div>
    `;
  }

  function viewGuide() {
    setTitle('사용 안내');
    app.innerHTML = `
      <div class="breadcrumb">
        <a href="#/">홈</a>
        <span class="sep">›</span>
        <span>사용 안내</span>
      </div>
      <div class="guide">
        <h1>🌱 사용 안내</h1>
        <p>영어가 서툰 엄마도 자신감 있게 아이와 원서를 읽을 수 있도록 준비한 자료예요. 아래 순서대로 활용해 보세요.</p>

        <h2>1. 챕터를 함께 읽어요</h2>
        <p>아이와 한 챕터를 함께 또는 따로 읽습니다. 5~10분이면 충분해요. 매일 한 챕터씩 꾸준히가 핵심입니다.</p>

        <h2>2. 단어 정리를 살펴보세요</h2>
        <p>각 챕터마다 핵심 단어 8~10개를 뜻과 예문으로 정리했어요. <b>★ 별표</b>를 누르면 <a href="#/bookmarks">내 단어장</a>에 저장되어 나중에 복습할 수 있어요.</p>

        <h2>3. 한국어 질문으로 이해도를 확인해요</h2>
        <p>엄마가 한국어로 질문하고 아이가 한국어로 답하는 형태예요. 정답도 한국어로 함께 제공돼요. 영어로 묻고 답하기 부담스러운 가정에 딱 맞아요.</p>

        <div class="tips">
          <h3>💡 엄마를 위한 팁</h3>
          <ul>
            <li>아이가 답을 못해도 괜찮아요. 함께 책을 다시 펼쳐 답을 찾아보세요.</li>
            <li>“왜 그랬을까?”, “너라면 어떻게 했을 것 같아?” 같은 확장 질문을 더해보세요.</li>
            <li>모든 단어를 외울 필요는 없어요. 반복해서 등장하는 단어 위주로 친해지면 됩니다.</li>
          </ul>
        </div>

        <h2>4. 영어 질문은 한 단계 더</h2>
        <p>한국어 질문이 익숙해지면 영어 질문도 도전해 보세요. 자가 점검할 때는 <b>한국어 가리기</b> 버튼을 누르면 번역이 가려져요.</p>

        <h2>5. 🔊 영어 발음은 탭하면 들려요</h2>
        <p>발음에 자신이 없어도 괜찮아요. <b>영어 단어나 문장을 탭(클릭)하면 자동으로 발음이 재생</b>됩니다. 브라우저에 내장된 영어 음성을 사용하므로 별도 설치는 필요 없어요.</p>

        <h2>6. 🎴 단어 퀴즈로 복습해요</h2>
        <p>챕터 페이지의 <b>단어 퀴즈 시작</b> 버튼이나 <a href="#/bookmarks">내 단어장</a>에서 플래시카드 모드로 단어를 복습할 수 있어요. 영어 ↔ 한국어 카드 뒤집기로 자가 점검!</p>

        <h2>7. ✓ 진도 체크 & 다크 모드</h2>
        <p>챕터 페이지 상단의 <b>✓ 읽음</b> 버튼을 누르면 진도가 저장돼요. 오른쪽 위의 ☀️/🌙 버튼으로 라이트/다크 모드를 전환할 수 있어요. 잠자리 전 독서에 좋아요.</p>

        <h2>8. 📱 앱처럼 설치하기 (PWA)</h2>
        <p>크롬·사파리에서 이 사이트를 <b>홈 화면에 추가</b>하면 앱처럼 사용할 수 있어요. 한 번 열어 본 챕터는 오프라인에서도 동작합니다.</p>

        <h2>9. 인쇄해서 활용하세요</h2>
        <p>각 챕터 페이지에서 <b>인쇄 버튼</b>을 눌러 워크북처럼 사용할 수 있어요. 가족 독서 시간을 만들어 보세요.</p>

        <h2>10. 📝 “검수 중” 배지에 대해</h2>
        <p>책 표지에 <b>📝 검수 중</b> 배지가 붙은 권은, 챕터별 단어와 줄거리를 <b>공개된 교육자 가이드와 줄거리 자료를 바탕으로 정리한 임시 데이터</b>예요. 실제 책 본문과 한 챕터씩 교차 검증하면 배지가 사라지고 정식 자료로 전환됩니다. 검수 중인 책도 학습용으로 충분히 활용할 수 있지만, 일부 단어가 책에 실제로 나오지 않거나 챕터 순서가 다를 수 있다는 점 참고해 주세요.</p>
      </div>
    `;
  }

  function viewBook(slug) {
    const book = findBook(slug);
    const data = DATA[slug];

    if (!book) return viewNotFound('해당 책을 찾을 수 없어요.');

    setTitle(book.title);

    const chapters = (data && data.chapters) || [];
    const list = chapters.map(c => {
      const done = Store.isComplete(slug, c.number);
      return `
        <a class="chapter-card ${done ? 'is-done' : ''}" href="#/book/${escape(slug)}/chapter/${c.number}">
          <span class="chapter-num">${done ? '✓' : c.number}</span>
          <div class="chapter-text">
            <p class="chapter-title-en">Chapter ${c.number}. ${escape(c.title)}</p>
            <p class="chapter-summary">${escape(c.summaryKo || '')}</p>
          </div>
          <span class="chapter-arrow">›</span>
        </a>
      `;
    }).join('');

    app.innerHTML = `
      <div class="breadcrumb">
        <a href="#/">홈</a>
        <span class="sep">›</span>
        <span>${escape(book.title)}</span>
      </div>

      <section class="book-hero">
        ${renderCover(book, 'book-hero-cover')}
        <div class="book-info">
          <p class="book-series">${escape(book.seriesKo || '')}</p>
          <h1>${escape(book.title)}</h1>
          <p class="book-title-ko">${escape(book.titleKo || '')}</p>
          <div class="book-meta">
            <span class="tag ar">AR ${escape(book.ar)}</span>
            <span class="tag chapters">${chapters.length}챕터</span>
            ${book.verification === 'draft' ? `<span class="tag draft">📝 검수 중</span>` : ''}
          </div>
          <p class="book-about">${escape(book.aboutKo || book.descKo || '')}</p>
          ${book.verification === 'draft' ? `
            <div class="draft-notice">
              <strong>📝 이 책은 아직 검수 중이에요.</strong>
              <p>챕터별 단어와 줄거리는 ${book.sourcesKo ? escape(book.sourcesKo.join(', ')) : '공개된 자료'}를 바탕으로 정리한 임시 데이터입니다. 실제 책 본문과 교차 검증이 끝나면 이 표시가 사라집니다.</p>
            </div>
          ` : ''}
          ${renderProgressBar(slug)}
        </div>
      </section>

      <h2 class="section-title">Chapters <span class="section-title-ko">챕터 목록</span></h2>
      <p class="section-sub">챕터를 골라 단어와 질문을 확인하세요. 체크 표시(<span style="color:var(--accent);font-weight:700;">✓</span>)된 챕터는 이미 완독한 챕터예요.</p>

      <div class="chapter-list">${list || '<p>준비 중인 책입니다.</p>'}</div>
    `;
  }

  function viewChapter(slug, num) {
    const book = findBook(slug);
    const data = DATA[slug];
    const chapter = getChapter(slug, num);

    if (!book || !chapter) return viewNotFound('해당 챕터를 찾을 수 없어요.');

    setTitle(`${book.title} - Ch.${num} ${chapter.title}`);
    applyHideKoBodyClass();

    const total = (data.chapters || []).length;
    const prev = num > 1 ? data.chapters.find(c => c.number === num - 1) : null;
    const next = num < total ? data.chapters.find(c => c.number === num + 1) : null;

    const isDone = Store.isComplete(slug, num);
    const hideKo = Store.getHideKo();

    const vocabRows = (chapter.vocabulary || []).map(v => `
      <tr>
        <td class="vocab-cell-word">
          <span class="vocab-word speak" data-speak="${escape(v.word)}" title="탭하면 발음을 들을 수 있어요">${escape(v.word)}</span>${v.pos ? `<span class="vocab-pos">${escape(v.pos)}</span>` : ''}
        </td>
        <td class="vocab-mean">${escape(v.mean)}</td>
        <td class="vocab-example">${v.example ? `<span class="speak" data-speak="${escape(v.example)}" title="탭하면 예문 발음을 들을 수 있어요">"${escape(v.example)}"</span>` : ''}${v.exampleKo ? `<span class="vocab-example-ko">${escape(v.exampleKo)}</span>` : ''}</td>
        <td class="vocab-cell-bm">${bookmarkStar(slug, num, v)}</td>
      </tr>
    `).join('');

    const enQs = (chapter.questionsEn || []).map((q, i) => `
      <li>
        <details class="question-item">
          <summary>
            <span class="q-num">${i + 1}</span>
            <span class="q-text"><span class="speak" data-speak="${escape(q.q)}" title="탭하면 발음을 들을 수 있어요">${escape(q.q)}</span>${q.qKo ? `<span class="q-text-sub">↳ ${escape(q.qKo)}</span>` : ''}</span>
          </summary>
          <div class="answer-box">
            <p class="answer-label">ANSWER</p>
            <p class="answer-text"><span class="speak" data-speak="${escape(q.a)}" title="탭하면 발음을 들을 수 있어요">${escape(q.a)}</span>${q.aKo ? `<span class="answer-text-sub">${escape(q.aKo)}</span>` : ''}</p>
          </div>
        </details>
      </li>
    `).join('');

    const koQs = (chapter.questionsKo || []).map((q, i) => `
      <li>
        <details class="question-item">
          <summary>
            <span class="q-num">${i + 1}</span>
            <span class="q-text">${escape(q.q)}</span>
          </summary>
          <div class="answer-box">
            <p class="answer-label">예시 답안</p>
            <p class="answer-text">${escape(q.a)}</p>
          </div>
        </details>
      </li>
    `).join('');

    app.innerHTML = `
      <div class="breadcrumb">
        <a href="#/">홈</a>
        <span class="sep">›</span>
        <a href="#/book/${escape(slug)}">${escape(book.title)}</a>
        <span class="sep">›</span>
        <span>Chapter ${num}</span>
      </div>

      <section class="chapter-header">
        <p class="chapter-eyebrow">CHAPTER ${num} / ${total}</p>
        <h1 class="chapter-title"><span class="speak" data-speak="${escape(chapter.title)}" title="탭하면 발음을 들을 수 있어요">${escape(chapter.title)}</span></h1>
        ${chapter.titleKo ? `<p class="chapter-subtitle">${escape(chapter.titleKo)}</p>` : ''}
        ${chapter.summaryKo ? `
          <div class="summary-box">
            <p class="summary-box-label">📝 한 줄 줄거리</p>
            <p class="summary-box-text">${escape(chapter.summaryKo)}</p>
          </div>` : ''}

        <div class="actions">
          <button class="btn ${isDone ? 'is-done' : ''}" data-progress-toggle data-book="${escape(slug)}" data-chapter="${num}">
            ${isDone ? '✓ 읽음' : '읽음으로 표시'}
          </button>
          <a class="btn btn-soft" href="#/book/${escape(slug)}/chapter/${num}/quiz">🎴 단어 퀴즈 시작</a>
          <button class="btn btn-soft" id="hide-ko-toggle">
            ${hideKo ? '🇰🇷 한국어 표시' : '🇰🇷 한국어 가리기'}
          </button>
          <button class="btn btn-soft" onclick="window.print()">🖨️ 인쇄</button>
          <a class="btn btn-soft" href="#/book/${escape(slug)}">← 목차로</a>
        </div>
      </section>

      <section class="section-block">
        <h2>📚 단어 정리</h2>
        <p class="lead">이 챕터에 등장하는 핵심 단어들이에요. <strong>🔊 영어 단어나 예문을 탭하면 발음을 들을 수 있어요.</strong> <strong>★ 별표</strong>를 누르면 내 단어장에 담깁니다.</p>
        <table class="vocab-table">
          <thead>
            <tr>
              <th style="width: 24%">단어</th>
              <th style="width: 24%">뜻</th>
              <th>예문</th>
              <th style="width: 56px"></th>
            </tr>
          </thead>
          <tbody>${vocabRows}</tbody>
        </table>
      </section>

      <section class="section-block question-block ko">
        <h2>🇰🇷 한국어 질문 5개 <span class="lang-tag">KO</span></h2>
        <p class="lead">엄마가 한국어로 물어보고, 아이가 한국어로 답해 보세요.</p>
        <ol class="questions">${koQs}</ol>
      </section>

      <section class="section-block question-block en">
        <h2>🇺🇸 영어 질문 5개 <span class="lang-tag">EN</span></h2>
        <p class="lead">영어 질문에 도전해 보세요. <strong>🔊 영어 문장을 탭하면 발음이 나와요.</strong> 자가 점검 시 <strong>한국어 가리기</strong> 버튼을 활용하세요.</p>
        <ol class="questions">${enQs}</ol>
      </section>

      <nav class="chapter-nav">
        ${prev
          ? `<a href="#/book/${escape(slug)}/chapter/${prev.number}">
               <span class="nav-label">← 이전 챕터</span>
               <span class="nav-title">Ch.${prev.number}. ${escape(prev.title)}</span>
             </a>`
          : '<span class="disabled"></span>'}
        ${next
          ? `<a class="next" href="#/book/${escape(slug)}/chapter/${next.number}">
               <span class="nav-label">다음 챕터 →</span>
               <span class="nav-title">Ch.${next.number}. ${escape(next.title)}</span>
             </a>`
          : '<span class="disabled"></span>'}
      </nav>
    `;
  }

  /* ============================================================
   *  Quiz view — flashcards
   * ============================================================ */
  function viewQuiz(slug, num) {
    const book = findBook(slug);
    const chapter = getChapter(slug, num);
    if (!book || !chapter) return viewNotFound('해당 챕터를 찾을 수 없어요.');

    setTitle(`퀴즈 - ${book.title} Ch.${num}`);

    const cards = (chapter.vocabulary || []).slice();
    if (cards.length === 0) {
      app.innerHTML = '<p>이 챕터에는 퀴즈할 단어가 없어요.</p>';
      return;
    }

    renderQuiz(cards, {
      title: `${book.title} · Chapter ${num}`,
      backHref: `#/book/${escape(slug)}/chapter/${num}`,
      backLabel: '← 챕터로 돌아가기',
      book: slug
    });
  }

  function viewBookmarksQuiz() {
    const all = Store.getBookmarks();
    if (all.length === 0) {
      app.innerHTML = `
        <div class="breadcrumb"><a href="#/">홈</a><span class="sep">›</span><a href="#/bookmarks">내 단어장</a><span class="sep">›</span><span>퀴즈</span></div>
        <div class="guide"><h1>퀴즈할 단어가 없어요</h1><p><a href="#/">전체 도서</a>에서 단어 옆 ★ 별표를 눌러 단어장에 담아 보세요.</p></div>
      `;
      return;
    }
    setTitle('내 단어장 퀴즈');
    renderQuiz(all, {
      title: '내 단어장 전체',
      backHref: '#/bookmarks',
      backLabel: '← 단어장으로 돌아가기',
      book: ''
    });
  }

  // Persistent quiz state across re-renders is unnecessary — quiz is a self-contained interactive page
  const quizState = {
    items: [],      // shuffled vocab
    idx: 0,
    correct: 0,
    incorrect: 0,
    flipped: false,
    started: false
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderQuiz(items, opts) {
    quizState.items = shuffle(items);
    quizState.idx = 0;
    quizState.correct = 0;
    quizState.incorrect = 0;
    quizState.flipped = false;
    quizState.opts = opts;
    paintQuiz();
  }

  function paintQuiz() {
    const o = quizState.opts;
    const total = quizState.items.length;
    const at = quizState.idx;

    if (at >= total) {
      // Result
      const pct = total ? Math.round((quizState.correct / total) * 100) : 0;
      app.innerHTML = `
        <div class="breadcrumb">
          <a href="#/">홈</a><span class="sep">›</span>
          <a href="${o.backHref}">${escape(o.title)}</a><span class="sep">›</span>
          <span>퀴즈 결과</span>
        </div>
        <div class="quiz-result">
          <p class="chapter-eyebrow">QUIZ COMPLETE</p>
          <h1 class="chapter-title">${pct}<small>%</small></h1>
          <p class="quiz-result-line">${total}개 중 <strong>${quizState.correct}개</strong>를 안다고 표시했어요.</p>
          <div class="actions">
            <button class="btn" id="quiz-restart">🔁 다시 풀기</button>
            <a class="btn btn-soft" href="${o.backHref}">${escape(o.backLabel)}</a>
          </div>
        </div>
      `;
      const re = document.getElementById('quiz-restart');
      if (re) re.addEventListener('click', () => { renderQuiz(quizState.items, o); });
      return;
    }

    const card = quizState.items[at];
    const flippedCls = quizState.flipped ? ' flipped' : '';

    app.innerHTML = `
      <div class="breadcrumb">
        <a href="#/">홈</a><span class="sep">›</span>
        <a href="${o.backHref}">${escape(o.title)}</a><span class="sep">›</span>
        <span>단어 퀴즈</span>
      </div>

      <section class="quiz-wrap">
        <div class="quiz-head">
          <p class="chapter-eyebrow">FLASHCARDS</p>
          <h1 class="quiz-title">${escape(o.title)}</h1>
          <p class="quiz-progress">${at + 1} / ${total}</p>
          <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${total ? Math.round((at / total) * 100) : 0}%"></div></div>
        </div>

        <div class="quiz-card${flippedCls}" role="button" aria-label="카드 뒤집기" tabindex="0">
          <div class="quiz-card-inner">
            <div class="quiz-card-face quiz-face-front">
              <p class="quiz-hint">English · 탭하면 뒤집어 뜻을 봐요</p>
              <p class="quiz-word">
                <span class="speak" data-speak="${escape(card.word)}">${escape(card.word)}</span>
                ${card.pos ? `<span class="vocab-pos">${escape(card.pos)}</span>` : ''}
              </p>
              ${card.example ? `<p class="quiz-example"><span class="speak" data-speak="${escape(card.example)}">"${escape(card.example)}"</span></p>` : ''}
            </div>
            <div class="quiz-card-face quiz-face-back">
              <p class="quiz-hint">뜻 · 다시 탭하면 영어로</p>
              <p class="quiz-mean">${escape(card.mean)}</p>
              ${card.exampleKo ? `<p class="quiz-example-ko">${escape(card.exampleKo)}</p>` : ''}
            </div>
          </div>
        </div>

        <div class="quiz-actions">
          <button class="btn btn-soft quiz-action" id="quiz-unknown">😕 다시 볼래요</button>
          <button class="btn quiz-action" id="quiz-known">😊 알아요</button>
        </div>

        <div class="quiz-foot">
          <a href="${o.backHref}" class="quiz-back">${escape(o.backLabel)}</a>
        </div>
      </section>
    `;

    // Wire quiz buttons
    document.getElementById('quiz-known').addEventListener('click', () => quizNext(true));
    document.getElementById('quiz-unknown').addEventListener('click', () => quizNext(false));
  }

  function quizNext(known) {
    if (known) quizState.correct++; else quizState.incorrect++;
    quizState.idx++;
    quizState.flipped = false;
    paintQuiz();
  }

  /* ============================================================
   *  Bookmarks view
   * ============================================================ */
  function viewBookmarks() {
    setTitle('내 단어장');
    const list = Store.getBookmarks().slice().sort((a, b) => (b.added || 0) - (a.added || 0));

    if (list.length === 0) {
      app.innerHTML = `
        <div class="breadcrumb"><a href="#/">홈</a><span class="sep">›</span><span>내 단어장</span></div>
        <div class="guide">
          <h1>📒 내 단어장</h1>
          <p>아직 담은 단어가 없어요. <a href="#/">전체 도서</a>에서 단어 옆의 <b>★</b> 별표를 눌러 단어를 모아 보세요.</p>
          <p>모은 단어는 플래시카드 퀴즈로 한 번에 복습할 수 있어요.</p>
        </div>
      `;
      return;
    }

    // Group by book
    const grouped = {};
    list.forEach(b => {
      if (!grouped[b.book]) grouped[b.book] = [];
      grouped[b.book].push(b);
    });

    const sections = Object.keys(grouped).map(slug => {
      const book = findBook(slug);
      const bookTitle = book ? `${book.title} · ${book.titleKo || ''}` : slug;
      const rows = grouped[slug].map(v => `
        <tr>
          <td class="vocab-cell-word">
            <span class="vocab-word speak" data-speak="${escape(v.word)}">${escape(v.word)}</span>
            ${v.pos ? `<span class="vocab-pos">${escape(v.pos)}</span>` : ''}
          </td>
          <td class="vocab-mean">${escape(v.mean)}</td>
          <td class="vocab-example">
            ${v.example ? `<span class="speak" data-speak="${escape(v.example)}">"${escape(v.example)}"</span>` : ''}
            ${v.exampleKo ? `<span class="vocab-example-ko">${escape(v.exampleKo)}</span>` : ''}
            <span class="bm-source"><a href="#/book/${escape(slug)}/chapter/${v.chapter}">Ch.${v.chapter}</a></span>
          </td>
          <td class="vocab-cell-bm">${bookmarkStar(slug, v.chapter, v)}</td>
        </tr>
      `).join('');
      return `
        <section class="section-block">
          <h2>📖 ${escape(bookTitle)}</h2>
          <p class="lead">${grouped[slug].length}개 단어</p>
          <table class="vocab-table">
            <thead>
              <tr>
                <th style="width: 24%">단어</th>
                <th style="width: 24%">뜻</th>
                <th>예문 · 출처</th>
                <th style="width: 56px"></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      `;
    }).join('');

    app.innerHTML = `
      <div class="breadcrumb"><a href="#/">홈</a><span class="sep">›</span><span>내 단어장</span></div>

      <section class="chapter-header">
        <p class="chapter-eyebrow">MY VOCABULARY</p>
        <h1 class="chapter-title">내 단어장</h1>
        <p class="chapter-subtitle">담아둔 단어 <strong>${list.length}</strong>개. 플래시카드 퀴즈로 한꺼번에 복습해 보세요.</p>
        <div class="actions">
          <a class="btn" href="#/bookmarks/quiz">🎴 전체 단어 퀴즈 시작</a>
          <a class="btn btn-soft" href="#/">← 도서 목록</a>
        </div>
      </section>

      ${sections}
    `;
  }

  function viewNotFound(message) {
    setTitle('페이지를 찾을 수 없어요');
    app.innerHTML = `
      <div class="breadcrumb"><a href="#/">홈</a></div>
      <div class="guide">
        <h1>🥲 ${escape(message || '페이지를 찾을 수 없어요.')}</h1>
        <p>주소를 다시 확인해 주세요. <a href="#/">전체 도서 목록으로 돌아가기</a></p>
      </div>
    `;
  }

  /* ============================================================
   *  Router
   * ============================================================ */
  function router(opts) {
    const scroll = !opts || opts.scroll !== false;
    const hash = window.location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);

    if (parts.length === 0) {
      viewHome();
    } else if (parts[0] === 'guide') {
      viewGuide();
    } else if (parts[0] === 'bookmarks' && parts[1] === 'quiz') {
      viewBookmarksQuiz();
    } else if (parts[0] === 'bookmarks') {
      viewBookmarks();
    } else if (parts[0] === 'book' && parts[1] && parts[2] === 'chapter' && parts[3] && parts[4] === 'quiz') {
      viewQuiz(parts[1], parseInt(parts[3], 10));
    } else if (parts[0] === 'book' && parts[1] && parts[2] === 'chapter' && parts[3]) {
      viewChapter(parts[1], parseInt(parts[3], 10));
    } else if (parts[0] === 'book' && parts[1]) {
      viewBook(parts[1]);
    } else {
      viewNotFound();
    }

    // Always apply hide-ko class after render in case body lost it
    applyHideKoBodyClass();
    updateThemeToggleLabel();

    if (scroll) scrollTop();
  }

  // Initial load
  window.addEventListener('hashchange', () => router({ scroll: true }));
  window.addEventListener('DOMContentLoaded', () => router({ scroll: true }));
  if (document.readyState !== 'loading') router({ scroll: true });

  // Re-render on store changes (except theme — applied via root attribute)
  window.addEventListener('ebm:store-change', function (e) {
    const key = e.detail && e.detail.key;
    if (key === 'ebm:theme') {
      updateThemeToggleLabel();
      return;
    }
    router({ scroll: false });
  });
})();

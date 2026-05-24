(function () {
  'use strict';

  const app = document.getElementById('app');
  const BOOKS = window.BOOKS || [];
  const BOOK_DATA = window.BOOK_DATA || {};

  /* -------------------------------------------------- *
   *  Utilities
   * -------------------------------------------------- */
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
    const data = BOOK_DATA[slug];
    if (!data || !data.chapters) return null;
    return data.chapters.find(c => c.number === num) || null;
  }

  function setTitle(t) {
    document.title = t ? `${t} | 엄마표 영어 원서 가이드` : '엄마표 영어 원서 가이드';
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* -------------------------------------------------- *
   *  Text-to-Speech (English pronunciation on tap)
   * -------------------------------------------------- */
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

  document.addEventListener('click', function (e) {
    const target = e.target.closest && e.target.closest('.speak');
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    const text = target.dataset.speak || target.textContent.trim();
    speak(text, target);
  });

  /* -------------------------------------------------- *
   *  Views
   * -------------------------------------------------- */
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

  function viewHome() {
    setTitle('AR 3점대 인기 원서 챕터북 가이드');

    const cards = BOOKS.map(book => {
      const data = BOOK_DATA[book.slug];
      const chapters = data && data.chapters ? data.chapters.length : 0;
      return `
        <a class="book-card" href="#/book/${escape(book.slug)}">
          ${renderCover(book)}
          <div class="book-meta">
            <span class="tag ar">AR ${escape(book.ar)}</span>
            <span class="tag chapters">${chapters}챕터</span>
            ${book.series ? `<span class="tag">${escape(book.series)}</span>` : ''}
          </div>
          <p class="book-series">${escape(book.seriesKo || '')}</p>
          <h3 class="book-title">${escape(book.title)}</h3>
          <p class="book-desc">${escape(book.descKo)}</p>
        </a>
      `;
    }).join('');

    app.innerHTML = `
      <section class="hero">
        <div class="hero-content">
          <h1>영어가 서툰 엄마도<br />아이와 함께 원서를 읽을 수 있어요</h1>
          <p>
            AR 3점대 인기 챕터북을 챕터별로 단어와 질문으로 정리했어요.
            엄마는 한국어로 묻고, 아이는 한국어로 답하면서 이해도를 확인해 보세요.
          </p>
        </div>
        <span class="hero-emoji">📚</span>
      </section>

      <h2 class="section-title">📖 도서 목록</h2>
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
        <p>각 챕터마다 핵심 단어 8~10개를 뜻과 예문으로 정리했어요. 모르는 단어가 많다면 단어부터 보고 다시 읽어도 좋아요.</p>

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
        <p>한국어 질문이 익숙해지면 영어 질문도 도전해 보세요. 정답이 함께 있어서 엄마가 발음만 읽어 주어도 충분해요.</p>

        <h2>5. 🔊 영어 발음은 탭하면 들려요</h2>
        <p>발음에 자신이 없어도 괜찮아요. 챕터 페이지에서 <b>영어 단어나 문장을 탭(클릭)하면 자동으로 발음이 재생</b>됩니다. 브라우저에 내장된 영어 음성을 사용하므로 별도 설치는 필요 없어요.</p>
        <div class="tips">
          <h3>🔊 발음 듣기 팁</h3>
          <ul>
            <li>단어 칸의 영단어, 예문, 영어 질문/정답 모두 탭하면 발음돼요.</li>
            <li>아이폰 사파리, 안드로이드 크롬, 데스크톱 크롬·엣지·사파리 모두 지원됩니다.</li>
            <li>핸드폰은 무음 모드면 소리가 안 날 수 있어요. 볼륨을 확인해 주세요.</li>
          </ul>
        </div>

        <h2>6. 인쇄해서 활용하세요</h2>
        <p>각 챕터 페이지에서 <b>인쇄 버튼</b>을 눌러 워크북처럼 사용할 수 있어요. 가족 독서 시간을 만들어 보세요.</p>
      </div>
    `;
  }

  function viewBook(slug) {
    const book = findBook(slug);
    const data = BOOK_DATA[slug];

    if (!book) {
      return viewNotFound('해당 책을 찾을 수 없어요.');
    }

    setTitle(book.title);

    const chapters = (data && data.chapters) || [];
    const list = chapters.map(c => `
      <a class="chapter-card" href="#/book/${escape(slug)}/chapter/${c.number}">
        <span class="chapter-num">${c.number}</span>
        <div class="chapter-text">
          <p class="chapter-title-en">Chapter ${c.number}. ${escape(c.title)}</p>
          <p class="chapter-summary">${escape(c.summaryKo || '')}</p>
        </div>
        <span class="chapter-arrow">›</span>
      </a>
    `).join('');

    app.innerHTML = `
      <div class="breadcrumb">
        <a href="#/">홈</a>
        <span class="sep">›</span>
        <span>${escape(book.title)}</span>
      </div>

      <section class="book-hero">
        ${renderCover(book, 'book-hero-cover')}
        <div class="book-info">
          <div class="book-meta">
            <span class="tag ar">AR ${escape(book.ar)}</span>
            <span class="tag chapters">${chapters.length}챕터</span>
            ${book.series ? `<span class="tag">${escape(book.series)}</span>` : ''}
          </div>
          <p class="book-series">${escape(book.seriesKo || '')}</p>
          <h1>${escape(book.title)}</h1>
          <p class="book-title-ko">${escape(book.titleKo || '')}</p>
          <p class="book-about">${escape(book.aboutKo || book.descKo || '')}</p>
        </div>
      </section>

      <h2 class="section-title">📑 챕터 목록</h2>
      <p class="section-sub">챕터를 골라 단어와 질문을 확인하세요.</p>

      <div class="chapter-list">${list || '<p>준비 중인 책입니다.</p>'}</div>
    `;
  }

  function viewChapter(slug, num) {
    const book = findBook(slug);
    const data = BOOK_DATA[slug];
    const chapter = getChapter(slug, num);

    if (!book || !chapter) {
      return viewNotFound('해당 챕터를 찾을 수 없어요.');
    }

    setTitle(`${book.title} - Ch.${num} ${chapter.title}`);

    const totalCh = (data.chapters || []).length;
    const prevCh = num > 1 ? data.chapters.find(c => c.number === num - 1) : null;
    const nextCh = num < totalCh ? data.chapters.find(c => c.number === num + 1) : null;

    const vocabRows = (chapter.vocabulary || []).map(v => `
      <tr>
        <td>
          <span class="vocab-word speak" data-speak="${escape(v.word)}" title="탭하면 발음을 들을 수 있어요">${escape(v.word)}</span>${v.pos ? `<span class="vocab-pos">${escape(v.pos)}</span>` : ''}
        </td>
        <td class="vocab-mean">${escape(v.mean)}</td>
        <td class="vocab-example">${v.example ? `<span class="speak" data-speak="${escape(v.example)}" title="탭하면 예문 발음을 들을 수 있어요">"${escape(v.example)}"</span>` : ''}${v.exampleKo ? `<span class="vocab-example-ko">${escape(v.exampleKo)}</span>` : ''}</td>
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
        <p class="chapter-eyebrow">CHAPTER ${num} / ${totalCh}</p>
        <h1 class="chapter-title"><span class="speak" data-speak="${escape(chapter.title)}" title="탭하면 발음을 들을 수 있어요">${escape(chapter.title)}</span></h1>
        ${chapter.titleKo ? `<p class="chapter-subtitle">${escape(chapter.titleKo)}</p>` : ''}
        ${chapter.summaryKo ? `
          <div class="summary-box">
            <p class="summary-box-label">📝 한 줄 줄거리</p>
            <p class="summary-box-text">${escape(chapter.summaryKo)}</p>
          </div>` : ''}

        <div class="actions">
          <button class="btn" onclick="window.print()">🖨️ 인쇄 / PDF 저장</button>
          <a class="btn btn-soft" href="#/book/${escape(slug)}">목차로 돌아가기</a>
        </div>
      </section>

      <section class="section-block">
        <h2>📚 단어 정리</h2>
        <p class="lead">이 챕터에 등장하는 핵심 단어들이에요. <strong>🔊 영어 단어나 예문을 탭하면 발음을 들을 수 있어요.</strong></p>
        <table class="vocab-table">
          <thead>
            <tr>
              <th style="width: 25%">단어</th>
              <th style="width: 30%">뜻</th>
              <th>예문</th>
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
        <p class="lead">영어 질문에 도전해 보세요. 한국어 번역과 정답이 함께 있어요. <strong>🔊 영어 문장을 탭하면 발음이 나와요.</strong></p>
        <ol class="questions">${enQs}</ol>
      </section>

      <nav class="chapter-nav">
        ${prevCh
          ? `<a href="#/book/${escape(slug)}/chapter/${prevCh.number}">
               <span class="nav-label">← 이전 챕터</span>
               <span class="nav-title">Ch.${prevCh.number}. ${escape(prevCh.title)}</span>
             </a>`
          : '<span class="disabled"></span>'}
        ${nextCh
          ? `<a class="next" href="#/book/${escape(slug)}/chapter/${nextCh.number}">
               <span class="nav-label">다음 챕터 →</span>
               <span class="nav-title">Ch.${nextCh.number}. ${escape(nextCh.title)}</span>
             </a>`
          : '<span class="disabled"></span>'}
      </nav>
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

  /* -------------------------------------------------- *
   *  Router
   * -------------------------------------------------- */
  function router() {
    const hash = window.location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);

    if (parts.length === 0) {
      viewHome();
    } else if (parts[0] === 'guide') {
      viewGuide();
    } else if (parts[0] === 'book' && parts[1] && parts[2] === 'chapter' && parts[3]) {
      viewChapter(parts[1], parseInt(parts[3], 10));
    } else if (parts[0] === 'book' && parts[1]) {
      viewBook(parts[1]);
    } else {
      viewNotFound();
    }

    scrollTop();
  }

  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);
  // In case data scripts loaded after this
  if (document.readyState !== 'loading') router();
})();

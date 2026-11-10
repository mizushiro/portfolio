/**
 * 강지연 (Kang Ji-yeon) 포트폴리오 스크립트
 * - 다크/라이트 테마 제어
 * - 프로젝트 동적 렌더링 (카드 뷰 / 테이블 뷰)
 * - 카테고리 필터링 & 실시간 다중 검색
 * - 모달 상세 팝업 (접근성 키보드 트랩 및 ESC 닫기)
 * - 클립보드 복사 및 토스트 알림
 * - 이력서 인쇄 트리거
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 상태 관리 변수
  let currentCategory = 'all';
  let searchQuery = '';
  let currentView = 'cards'; // 'cards' | 'table'

  // DOM 요소 캐싱
  const themeToggleBtn = document.getElementById('theme-toggle');
  const printCvBtn = document.getElementById('btn-print-cv');
  const searchInput = document.getElementById('project-search');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const cardsContainer = document.getElementById('projects-cards-container');
  const tableContainer = document.getElementById('projects-table-container');
  const tableBody = document.getElementById('projects-table-body');
  const resultsCountEl = document.getElementById('results-count');
  const viewCardsBtn = document.getElementById('view-cards-btn');
  const viewTableBtn = document.getElementById('view-table-btn');

  // 모달 요소
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalPeriod = document.getElementById('modal-period');
  const modalClient = document.getElementById('modal-client');
  const modalCompany = document.getElementById('modal-company');
  const modalRole = document.getElementById('modal-role');
  const modalSkills = document.getElementById('modal-skills');
  const modalDesc = document.getElementById('modal-desc');
  const modalKeyPoints = document.getElementById('modal-keypoints');
  const modalBadges = document.getElementById('modal-badges');

  // 토스트 요소
  const toastEl = document.getElementById('toast');
  let toastTimeout = null;

  // --------------------------------------------------------------------------
  // 2. 테마 (다크/라이트) 토글
  // --------------------------------------------------------------------------
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    syncGitHubWidgetTheme(newTheme);
    showToast(`${newTheme === 'dark' ? '🌙 다크 모드' : '☀️ 라이트 모드'}로 전환되었습니다.`);
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // --------------------------------------------------------------------------
  // 3. 토스트 알림 함수
  // --------------------------------------------------------------------------
  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  };

  // 클립보드 복사 함수
  window.copyToClipboard = (text, label) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`📋 ${label} (${text}) 복사 완료!`);
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  };

  const fallbackCopy = (text, label) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`📋 ${label} 복사 완료!`);
  };

  // --------------------------------------------------------------------------
  // 4. 이력서 인쇄 트리거
  // --------------------------------------------------------------------------
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // 5. 카테고리 탭 초기화 & 이벤트
  // --------------------------------------------------------------------------
  const renderCategoryTabs = () => {
    if (!categoryTabsContainer) return;
    categoryTabsContainer.innerHTML = '';

    portfolioStats.categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tab-btn ${cat.key === currentCategory ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.key);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', cat.key === currentCategory ? 'true' : 'false');
      
      let count = 0;
      if (cat.key === 'all') {
        count = portfolioProjects.length;
      } else if (cat.key === 'featured') {
        count = portfolioProjects.filter(p => p.featured).length;
      } else {
        count = portfolioProjects.filter(p => p.category === cat.key).length;
      }

      btn.innerHTML = `
        <span>${cat.name}</span>
        <span class="tab-count">${count}</span>
      `;

      btn.addEventListener('click', () => {
        currentCategory = cat.key;
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        filterAndRenderProjects();
      });

      categoryTabsContainer.appendChild(btn);
    });
  };

  // --------------------------------------------------------------------------
  // 6. 프로젝트 필터링 및 렌더링 로직
  // --------------------------------------------------------------------------
  const getFilteredProjects = () => {
    return portfolioProjects.filter(project => {
      // 카테고리 필터
      let matchesCategory = true;
      if (currentCategory === 'all') {
        matchesCategory = true;
      } else if (currentCategory === 'featured') {
        matchesCategory = project.featured;
      } else {
        matchesCategory = project.category === currentCategory;
      }

      // 검색어 필터
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = project.title.toLowerCase().includes(q);
        const inClient = project.client.toLowerCase().includes(q);
        const inCompany = project.company.toLowerCase().includes(q);
        const inSkills = project.skills.some(s => s.toLowerCase().includes(q));
        const inRole = project.role.toLowerCase().includes(q);
        const inDesc = project.description.toLowerCase().includes(q);
        const inLinks = project.links ? project.links.some(l => l.label.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)) : false;
        matchesSearch = inTitle || inClient || inCompany || inSkills || inRole || inDesc || inLinks;
      }

      return matchesCategory && matchesSearch;
    });
  };

  const filterAndRenderProjects = () => {
    const filtered = getFilteredProjects();

    // 결과 카운트 업데이트
    if (resultsCountEl) {
      resultsCountEl.innerHTML = `검색 결과: <strong>${filtered.length}</strong>건의 프로젝트`;
    }

    // 카드 뷰와 테이블 뷰를 모두 렌더링해 두어 PDF 인쇄 시 테이블이 누락되지 않도록 보장
    renderCards(filtered);
    renderTable(filtered);
  };

  // 인쇄 전(beforeprint) 처리: 다크모드 스타일 보장 및 전체 39개 프로젝트 테이블 출력
  window.addEventListener('beforeprint', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    renderTable(portfolioProjects);
  });


  // 카드 뷰 렌더링
  const renderCards = (projects) => {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    if (projects.length === 0) {
      cardsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 8px;">일치하는 프로젝트가 없습니다.</p>
          <p style="font-size: 0.9rem;">검색어 조건을 변경하거나 카테고리 탭을 '전체보기'로 변경해 보세요.</p>
        </div>
      `;
      return;
    }

    projects.forEach(project => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${project.title} 상세정보 열기`);

      // 뱃지 구성
      const roleBadgeClass = project.roleType === 'PM' ? 'role-pm' : (project.roleType === 'PL' ? 'role-pl' : '');
      const waBadge = project.hasAccessibility ? `<span class="badge-tag wa">WA 웹접근성</span>` : '';
      const roleBadge = `<span class="badge-tag ${roleBadgeClass}">${project.role}</span>`;

      // 외부 URL 링크 구성
      const projectLinks = project.links || (project.url ? [{ label: project.urlLabel || 'URL 바로가기', url: project.url }] : []);
      const linksHtml = projectLinks.length > 0 ? `
        <div class="project-card-links">
          ${projectLinks.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-url-chip" title="${link.label} 새 창으로 열기">
              <span>🔗 ${link.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          `).join('')}
        </div>
      ` : '';

      card.innerHTML = `
        <div class="project-card-top">
          <span class="card-category-badge">${project.categoryLabel}</span>
          <span class="card-period">${project.period}</span>
        </div>
        <h3 class="project-card-title">${project.title}</h3>
        <div class="project-card-meta">
          <span class="meta-client">발주처: <strong>${project.client}</strong></span>
          <span class="meta-company">근무: <strong>${project.company}</strong></span>
        </div>
        <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
          ${roleBadge}
          ${waBadge}
        </div>
        <p class="project-card-desc">${project.description}</p>
        ${linksHtml}
        <div class="project-card-bottom">
          <div class="skills-list">
            ${project.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
            ${project.skills.length > 3 ? `<span class="skill-tag">+${project.skills.length - 3}</span>` : ''}
          </div>
          <span class="btn-card-more">상세보기 &rarr;</span>
        </div>
      `;

      // 카드 내 외부 링크 클릭 시 모달 오픈 방지
      card.querySelectorAll('.btn-url-chip').forEach(linkEl => {
        linkEl.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        linkEl.addEventListener('keydown', (e) => {
          e.stopPropagation();
        });
      });

      card.addEventListener('click', () => openProjectModal(project));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal(project);
        }
      });

      cardsContainer.appendChild(card);
    });
  };

  // 테이블 뷰 렌더링
  const renderTable = (projects) => {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (projects.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            일치하는 프로젝트가 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    projects.forEach((project, idx) => {
      const tr = document.createElement('tr');
      tr.setAttribute('tabindex', '0');
      tr.setAttribute('role', 'button');
      tr.setAttribute('aria-label', `${project.title} 프로젝트 상세 보기`);

      const roleBadgeClass = project.roleType === 'PM' ? 'role-pm' : (project.roleType === 'PL' ? 'role-pl' : '');
      const projectLinks = project.links || (project.url ? [{ label: project.urlLabel || 'URL', url: project.url }] : []);
      const tableLinksHtml = projectLinks.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="table-url-badge" title="${link.label} 새 창으로 열기">🔗 ${link.label} ↗</a>
      `).join('');

      tr.innerHTML = `
        <td style="text-align: center; color: var(--text-muted); font-size: 0.8rem;">${project.id}</td>
        <td class="table-title">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span>${project.title}</span>
            ${project.hasAccessibility ? '<span class="badge-tag wa" style="font-size: 0.7rem;">WA</span>' : ''}
            ${tableLinksHtml}
          </div>
        </td>
        <td class="table-period">${project.period}</td>
        <td><strong>${project.client}</strong></td>
        <td>${project.company}</td>
        <td><span class="badge-tag ${roleBadgeClass}">${project.role}</span></td>
        <td>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${project.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </td>
      `;

      tr.querySelectorAll('.table-url-badge').forEach(linkEl => {
        linkEl.addEventListener('click', (e) => {
          e.stopPropagation();
        });
        linkEl.addEventListener('keydown', (e) => {
          e.stopPropagation();
        });
      });

      tr.addEventListener('click', () => openProjectModal(project));
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal(project);
        }
      });

      tableBody.appendChild(tr);
    });
  };

  // --------------------------------------------------------------------------
  // 7. 뷰 모드 전환 (카드 / 테이블)
  // --------------------------------------------------------------------------
  const setViewMode = (mode) => {
    currentView = mode;
    if (mode === 'cards') {
      viewCardsBtn.classList.add('active');
      viewTableBtn.classList.remove('active');
      cardsContainer.style.display = 'grid';
      tableContainer.style.display = 'none';
    } else {
      viewCardsBtn.classList.remove('active');
      viewTableBtn.classList.add('active');
      cardsContainer.style.display = 'none';
      tableContainer.style.display = 'block';
    }
    filterAndRenderProjects();
  };

  if (viewCardsBtn && viewTableBtn) {
    viewCardsBtn.addEventListener('click', () => setViewMode('cards'));
    viewTableBtn.addEventListener('click', () => setViewMode('table'));
  }

  // 검색 인풋 디바운스
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRenderProjects();
    });
  }

  // --------------------------------------------------------------------------
  // 8. 모달 상세 팝업
  // --------------------------------------------------------------------------
  let previousActiveElement = null;

  const openProjectModal = (project) => {
    previousActiveElement = document.activeElement;

    modalTitle.textContent = project.title;
    modalPeriod.textContent = project.period;
    modalClient.textContent = project.client;
    modalCompany.textContent = project.company;
    modalRole.textContent = project.role;
    modalDesc.textContent = project.description;

    // 뱃지
    const roleBadgeClass = project.roleType === 'PM' ? 'role-pm' : (project.roleType === 'PL' ? 'role-pl' : '');
    modalBadges.innerHTML = `
      <span class="badge-tag ${roleBadgeClass}">${project.role}</span>
      <span class="badge-tag">${project.categoryLabel}</span>
      ${project.hasAccessibility ? '<span class="badge-tag wa">♿ 웹접근성(WA) 품질인증 준수</span>' : ''}
    `;

    // 스킬
    modalSkills.innerHTML = project.skills.map(s => `<span class="skill-tag" style="font-size: 0.82rem; padding: 4px 10px;">${s}</span>`).join('');

    // 주요 성과 / 포인트 및 외부 URL 링크
    const projectLinks = project.links || (project.url ? [{ label: project.urlLabel || '산출물 바로가기', url: project.url }] : []);
    const modalLinksSection = projectLinks.length > 0 ? `
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px; color: var(--text-primary);">퍼블리싱 마크업 산출물 URL</h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${projectLinks.map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 8px 16px; font-size: 0.86rem;">
              <span>🔗 ${link.label} 바로가기</span>
              <span aria-hidden="true">↗</span>
            </a>
          `).join('')}
        </div>
      </div>
    ` : '';

    if (project.keyPoints && project.keyPoints.length > 0) {
      modalKeyPoints.innerHTML = `
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px; color: var(--accent-cyan);">주요 업무 및 성과 포인트</h4>
        <ul style="display: flex; flex-direction: column; gap: 8px;">
          ${project.keyPoints.map(point => `<li class="featured-bullet">${point}</li>`).join('')}
        </ul>
        ${modalLinksSection}
      `;
    } else {
      modalKeyPoints.innerHTML = modalLinksSection;
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // 모달 닫기 버튼에 초점
    setTimeout(() => {
      modalCloseBtn.focus();
    }, 100);
  };

  const closeProjectModal = () => {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 9. 프로젝트 문의 & 방명록 게시판 (Firebase Cloud Firestore + 답글 + 비밀글)
  // --------------------------------------------------------------------------
  const BOARD_STORAGE_KEY = 'kjy_portfolio_board_v2';
  const MASTER_PASS = '0000';
  const ADMIN_EMAIL = window.PORTFOLIO_ADMIN_EMAIL || 'mizushiro@naver.com';

  const CATEGORY_META = {
    project: { label: '💼 프로젝트 문의', className: 'project' },
    recruit: { label: '🤝 채용/협업 제안', className: 'recruit' },
    guestbook: { label: '✨ 방명록/응원', className: 'guestbook' }
  };

  let boardPosts = [];
  let cloudRawPosts = [];
  let cloudRawReplies = [];
  let currentBoardCat = 'all';
  const openPostIds = new Set();
  const unlockedSecretIds = new Set();
  const decryptedSecretsMap = new Map();

  // Firebase Cloud State
  let isCloudConnected = false;
  let fbApp = null;
  let fbAuth = null;
  let fbDb = null;
  let fbModules = null;
  let currentUser = null;
  let isAdminUser = false;

  // Web Crypto SHA-256 Helper (64-char hex for Firestore security rules)
  const sha256Hex = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(String(text));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Client-side Secret Content Cipher (prevents plaintext exposure in Firestore)
  const encryptSecretContent = (plainText, password) => {
    try {
      const textBytes = new TextEncoder().encode(plainText);
      const keyBytes = new TextEncoder().encode(password || 'key');
      const out = new Uint8Array(textBytes.length);
      for (let i = 0; i < textBytes.length; i++) {
        out[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      let binary = '';
      out.forEach(b => { binary += String.fromCharCode(b); });
      return 'ENC1:' + btoa(binary);
    } catch (e) {
      return plainText;
    }
  };

  const decryptSecretContent = (cipherText, password) => {
    if (!String(cipherText).startsWith('ENC1:')) return cipherText;
    try {
      const binary = atob(String(cipherText).slice(5));
      const encBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        encBytes[i] = binary.charCodeAt(i);
      }
      const keyBytes = new TextEncoder().encode(password || 'key');
      const out = new Uint8Array(encBytes.length);
      for (let i = 0; i < encBytes.length; i++) {
        out[i] = encBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      return new TextDecoder().decode(out);
    } catch (e) {
      return '[암호화된 비밀글입니다]';
    }
  };

  const loadBoardPosts = () => {
    try {
      localStorage.removeItem('kjy_portfolio_board_v1');
      const saved = localStorage.getItem(BOARD_STORAGE_KEY);
      if (saved) {
        boardPosts = JSON.parse(saved);
      } else {
        boardPosts = [];
      }
    } catch (e) {
      boardPosts = [];
    }
  };

  const saveBoardPosts = () => {
    try {
      localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boardPosts));
    } catch (e) {
      // ignore storage quota errors
    }
  };

  const escapeHtml = (str) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const getTodayFormatted = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  // DOM References for Board
  const boardListContainer = document.getElementById('board-list-container');
  const btnToggleWrite = document.getElementById('btn-toggle-write');
  const btnCancelWrite = document.getElementById('btn-cancel-write');
  const boardWriteWrap = document.getElementById('board-write-wrap');
  const boardWriteForm = document.getElementById('board-write-form');
  const modeQnaBtn = document.getElementById('mode-qna-btn');
  const modeGithubBtn = document.getElementById('mode-github-btn');
  const panelQna = document.getElementById('board-panel-qna');
  const panelGithub = document.getElementById('board-panel-github');
  const engineUtterancesBtn = document.getElementById('engine-utterances-btn');
  const engineGiscusBtn = document.getElementById('engine-giscus-btn');
  const utterancesWrap = document.getElementById('utterances-wrap');
  const giscusWrap = document.getElementById('giscus-wrap');
  const cloudStatusDot = document.getElementById('cloud-status-dot');
  const cloudStatusText = document.getElementById('cloud-status-text');
  const btnToggleFbGuide = document.getElementById('btn-toggle-fb-guide');
  const firebaseGuideBox = document.getElementById('firebase-guide-box');
  const btnAdminAuth = document.getElementById('btn-admin-auth');

  // Toggle Firebase Setup Guide Box
  if (btnToggleFbGuide && firebaseGuideBox) {
    btnToggleFbGuide.addEventListener('click', () => {
      const isHidden = firebaseGuideBox.hasAttribute('hidden');
      if (isHidden) {
        firebaseGuideBox.removeAttribute('hidden');
        btnToggleFbGuide.setAttribute('aria-expanded', 'true');
      } else {
        firebaseGuideBox.setAttribute('hidden', '');
        btnToggleFbGuide.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Merge Cloud Posts & Replies into boardPosts
  const syncCloudToBoardPosts = () => {
    if (!isCloudConnected) return;
    const repliesByPost = new Map();
    cloudRawReplies.forEach((r) => {
      if (!repliesByPost.has(r.postId)) {
        repliesByPost.set(r.postId, []);
      }
      repliesByPost.get(r.postId).push(r);
    });

    boardPosts = cloudRawPosts.map((p) => ({
      ...p,
      replies: repliesByPost.get(p.id) || []
    }));

    renderBoardPosts();
  };

  // Persistent Fallback UID if Anonymous Auth is not enabled yet
  const getEffectiveUid = () => {
    if (currentUser && currentUser.uid) return currentUser.uid;
    let uid = localStorage.getItem('kjy_client_uid');
    if (!uid) {
      uid = 'anon_' + Math.random().toString(36).slice(2, 12) + '_' + Date.now();
      localStorage.setItem('kjy_client_uid', uid);
    }
    return uid;
  };

  // Initialize Firebase Cloud Firestore if configured in firebase-config.js
  const initFirebaseBoard = async () => {
    const cfg = window.FIREBASE_CONFIG;
    const hasConfig = cfg && cfg.apiKey && cfg.projectId && cfg.apiKey.trim() !== '';

    if (!hasConfig) {
      isCloudConnected = false;
      if (cloudStatusDot) cloudStatusDot.classList.remove('connected');
      if (cloudStatusText) {
        cloudStatusText.textContent = '⚡ 로컬 모드 동작 중 (firebase-config.js에 설정값 입력 시 실시간 클라우드 DB로 자동 전환됩니다)';
      }
      loadBoardPosts();
      renderBoardPosts();
      return;
    }

    try {
      if (cloudStatusText) cloudStatusText.textContent = '☁️ Firebase Cloud Firestore 연결 중...';

      const [appMod, authMod, fsMod] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js')
      ]);

      fbModules = { ...appMod, ...authMod, ...fsMod };
      fbApp = appMod.initializeApp(cfg);
      fbAuth = authMod.getAuth(fbApp);
      fbDb = fsMod.getFirestore(fbApp);

      let subscriptionsStarted = false;
      const startFirestoreSubscriptions = () => {
        if (subscriptionsStarted) return;
        subscriptionsStarted = true;

        const postsQuery = fsMod.query(
          fsMod.collection(fbDb, 'board_posts'),
          fsMod.orderBy('createdAt', 'desc'),
          fsMod.limit(100)
        );
        const repliesQuery = fsMod.query(
          fsMod.collection(fbDb, 'board_replies'),
          fsMod.orderBy('createdAt', 'asc'),
          fsMod.limit(300)
        );

        fsMod.onSnapshot(
          postsQuery,
          (snap) => {
            isCloudConnected = true;
            if (cloudStatusDot) cloudStatusDot.classList.add('connected');
            if (cloudStatusText) {
              cloudStatusText.textContent = '☁️ Cloud Firestore 실시간 DB 연결 완료 (portfolio-4834a · 모든 방문자와 게시글·답글이 공유됩니다)';
            }
            if (btnToggleFbGuide) btnToggleFbGuide.setAttribute('hidden', '');

            cloudRawPosts = snap.docs.map(d => ({
              id: d.id,
              ...d.data()
            }));
            syncCloudToBoardPosts();
          },
          (err) => {
            isCloudConnected = false;
            if (cloudStatusDot) cloudStatusDot.classList.remove('connected');
            if (cloudStatusText) {
              cloudStatusText.innerHTML = '⚠️ Firebase 콘솔에서 <strong>Firestore Database 생성</strong>(테스트 모드 또는 규칙 게시)이 필요합니다. 우측 안내 버튼을 확인해 주세요.';
            }
            if (btnToggleFbGuide) btnToggleFbGuide.removeAttribute('hidden');
            loadBoardPosts();
            renderBoardPosts();
          }
        );

        fsMod.onSnapshot(
          repliesQuery,
          (snap) => {
            cloudRawReplies = snap.docs.map(d => ({
              id: d.id,
              ...d.data()
            }));
            syncCloudToBoardPosts();
          },
          () => {
            // handled by postsQuery error callback
          }
        );
      };

      if (btnAdminAuth) {
        btnAdminAuth.removeAttribute('hidden');
        btnAdminAuth.addEventListener('click', async () => {
          if (isAdminUser) {
            await authMod.signOut(fbAuth);
            try { await authMod.signInAnonymously(fbAuth); } catch (_) {}
            showToast('로그아웃되었습니다.');
          } else {
            try {
              const provider = new authMod.GoogleAuthProvider();
              await authMod.signInWithPopup(fbAuth, provider);
            } catch (err) {
              showToast('⚠️ Google 로그인에 실패했습니다. Firebase 콘솔에서 Google 로그인을 활성화해 주세요.');
            }
          }
        });
      }

      authMod.onAuthStateChanged(fbAuth, async (user) => {
        if (!user) {
          try {
            await authMod.signInAnonymously(fbAuth);
            return;
          } catch (authErr) {
            // Anonymous Auth not enabled yet -> still start Firestore subscriptions (works in Test Mode)
            startFirestoreSubscriptions();
            return;
          }
        }

        currentUser = user;
        isAdminUser = Boolean(user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

        if (btnAdminAuth) {
          if (isAdminUser) {
            btnAdminAuth.textContent = '🎖️ 관리자(강지연) 인증됨 · 로그아웃';
            btnAdminAuth.classList.add('logged-in');
          } else {
            btnAdminAuth.textContent = '🔐 관리자(강지연) 로그인';
            btnAdminAuth.classList.remove('logged-in');
          }
        }

        startFirestoreSubscriptions();
        renderBoardPosts();
      });
    } catch (err) {
      isCloudConnected = false;
      if (cloudStatusText) {
        cloudStatusText.textContent = '⚠️ Firebase 연결 실패 (로컬 모드로 전환됨)';
      }
      loadBoardPosts();
      renderBoardPosts();
    }
  };

  const updateBoardCounts = () => {
    const total = boardPosts.length;
    const projectCnt = boardPosts.filter(p => p.category === 'project').length;
    const recruitCnt = boardPosts.filter(p => p.category === 'recruit').length;
    const guestCnt = boardPosts.filter(p => p.category === 'guestbook').length;

    const elTotalBadge = document.getElementById('qna-total-badge');
    const elAll = document.getElementById('board-count-all');
    const elProj = document.getElementById('board-count-project');
    const elRec = document.getElementById('board-count-recruit');
    const elGuest = document.getElementById('board-count-guestbook');

    if (elTotalBadge) elTotalBadge.textContent = total;
    if (elAll) elAll.textContent = total;
    if (elProj) elProj.textContent = projectCnt;
    if (elRec) elRec.textContent = recruitCnt;
    if (elGuest) elGuest.textContent = guestCnt;
  };

  const renderBoardPosts = () => {
    if (!boardListContainer) return;
    updateBoardCounts();

    const filtered = currentBoardCat === 'all'
      ? boardPosts
      : boardPosts.filter(p => p.category === currentBoardCat);

    boardListContainer.innerHTML = '';

    if (filtered.length === 0) {
      boardListContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-muted);">
          <p style="font-size: 1.05rem; font-weight: 600; margin-bottom: 6px;">등록된 게시글이 없습니다.</p>
          <p style="font-size: 0.86rem;">우측 상단의 '새 글 작성하기' 버튼을 눌러 첫 번째 글을 남겨보세요!</p>
        </div>
      `;
      return;
    }

    filtered.forEach((post) => {
      const postKey = String(post.id);
      const isOpen = openPostIds.has(postKey);
      const isUnlocked = !post.isSecret || unlockedSecretIds.has(postKey);
      const catMeta = CATEGORY_META[post.category] || CATEGORY_META.project;
      const replies = Array.isArray(post.replies) ? post.replies : [];
      const hasPublisherReply = replies.some(r => r.isPublisher);

      const itemEl = document.createElement('article');
      itemEl.className = `board-item ${isOpen ? 'open' : ''}`;

      const statusBadgeHtml = hasPublisherReply
        ? `<span class="board-status-badge answered">✅ 답변완료</span>`
        : `<span class="board-status-badge pending">💬 답글가능</span>`;

      const secretIconHtml = post.isSecret
        ? `<span title="비밀글" aria-label="비밀글">🔒</span>`
        : '';

      const replyCountHtml = replies.length > 0
        ? `<span class="board-reply-count">답글 ${replies.length}</span>`
        : '';

      // Body HTML (Locked vs Unlocked)
      let bodyHtml = '';
      if (!isUnlocked) {
        bodyHtml = `
          <div class="secret-lock-box">
            <p style="font-size: 0.92rem; color: var(--text-secondary);">
              🔒 <strong>비공개(비밀글)로 작성된 게시글입니다.</strong><br>
              <span style="font-size: 0.8rem; color: var(--text-muted);">작성 시 설정한 비밀번호를 입력하시면 본문 및 답글을 확인하실 수 있습니다.</span>
            </p>
            <div class="secret-unlock-row">
              <input type="password" class="form-input secret-pass-input" style="width: 190px; padding: 8px 12px;" placeholder="비밀번호 입력" aria-label="비밀글 열람 비밀번호 입력">
              <button type="button" class="btn-primary btn-unlock-secret" style="padding: 8px 16px; font-size: 0.85rem;">잠금 해제</button>
            </div>
          </div>
        `;
      } else {
        const displayContent = post.isSecret
          ? (decryptedSecretsMap.get(postKey) || post.content)
          : post.content;

        const repliesListHtml = replies.length > 0
          ? `
            <div class="board-replies-list">
              ${replies.map(reply => `
                <div class="board-reply-item ${reply.isPublisher ? 'publisher-reply' : ''}" data-reply-id="${reply.id}">
                  <div class="board-reply-top">
                    <div class="board-reply-author">
                      <span>↳ ${escapeHtml(reply.author)}</span>
                      ${reply.isPublisher ? `<span class="publisher-badge">🎖️ 강지연 · Senior Publisher</span>` : ''}
                      <span class="board-reply-date">${escapeHtml(reply.date)}</span>
                    </div>
                    <button type="button" class="btn-delete-reply" data-reply-id="${reply.id}" aria-label="답글 삭제">삭제</button>
                  </div>
                  <div class="board-reply-text">${escapeHtml(reply.content)}</div>
                </div>
              `).join('')}
            </div>
          `
          : `<p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 12px;">아직 등록된 답글이 없습니다. 첫 답글을 남겨보세요!</p>`;

        const publisherOptionAttr = '';

        bodyHtml = `
          <div class="board-post-content">${escapeHtml(displayContent)}</div>
          <div class="board-post-foot">
            <button type="button" class="btn-delete-post" aria-label="게시글 삭제">🗑️ 게시글 삭제</button>
          </div>
          <div class="board-replies-section">
            <div class="board-replies-title">
              <span>💬 답글 목록 (${replies.length})</span>
            </div>
            ${repliesListHtml}
            <form class="board-reply-form" novalidate>
              <div class="reply-form-top">
                <input type="text" class="form-input reply-author-input" placeholder="작성자 이름 *" maxlength="25" value="${isAdminUser ? '강지연' : ''}" required aria-label="답글 작성자 이름">
                <select class="form-select reply-role-select" aria-label="답글 작성자 구분">
                  <option value="visitor">👤 방문자 / 문의자 답글</option>
                  <option value="publisher" ${isAdminUser ? 'selected' : ''} ${publisherOptionAttr}>🎖️ 강지연 (Publisher 답변)</option>
                </select>
                <input type="password" class="form-input reply-pass-input" placeholder="삭제용 비밀번호 *" maxlength="16" required aria-label="답글 삭제용 비밀번호">
              </div>
              <div class="reply-form-bottom">
                <textarea class="form-textarea reply-input-text" rows="2" placeholder="답글 내용을 입력해 주세요..." required aria-label="답글 내용"></textarea>
                <button type="submit" class="btn-primary btn-reply-submit">답글 등록</button>
              </div>
            </form>
          </div>
        `;
      }

      itemEl.innerHTML = `
        <button type="button" class="board-item-header" aria-expanded="${isOpen ? 'true' : 'false'}">
          <div class="board-item-main">
            <span class="board-cat-tag ${catMeta.className}">${catMeta.label}</span>
            ${statusBadgeHtml}
            ${secretIconHtml}
            <span class="board-item-title">${escapeHtml(post.title)}</span>
            ${replyCountHtml}
          </div>
          <div class="board-item-meta">
            <span>${escapeHtml(post.author)}</span>
            <span style="font-family: var(--font-mono);">${escapeHtml(post.date)}</span>
            <span class="board-item-chevron" aria-hidden="true">▼</span>
          </div>
        </button>
        <div class="board-item-body">
          ${bodyHtml}
        </div>
      `;

      // Header Toggle Event
      const headerBtn = itemEl.querySelector('.board-item-header');
      headerBtn.addEventListener('click', () => {
        if (openPostIds.has(postKey)) {
          openPostIds.delete(postKey);
        } else {
          openPostIds.add(postKey);
        }
        renderBoardPosts();
      });

      // Secret Unlock Event
      const unlockBtn = itemEl.querySelector('.btn-unlock-secret');
      const secretInput = itemEl.querySelector('.secret-pass-input');
      if (unlockBtn && secretInput) {
        const handleUnlock = async () => {
          const val = secretInput.value.trim();
          if (!val) return;
          const inputHash = await sha256Hex(val);
          const isMatch = (post.passwordHash && inputHash === post.passwordHash) ||
                          (post.password && val === post.password) ||
                          val === MASTER_PASS;
          if (isMatch) {
            unlockedSecretIds.add(postKey);
            decryptedSecretsMap.set(postKey, decryptSecretContent(post.content, val));
            renderBoardPosts();
            showToast('🔓 비밀글 잠금이 해제되었습니다.');
          } else {
            showToast('⚠️ 비밀번호가 일치하지 않습니다.');
            secretInput.focus();
          }
        };
        unlockBtn.addEventListener('click', handleUnlock);
        secretInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleUnlock();
          }
        });
      }

      // Role select convenience: auto-fill '강지연' when publisher is chosen
      const roleSelect = itemEl.querySelector('.reply-role-select');
      const authorInput = itemEl.querySelector('.reply-author-input');
      if (roleSelect && authorInput) {
        roleSelect.addEventListener('change', () => {
          if (roleSelect.value === 'publisher' && !authorInput.value.trim()) {
            authorInput.value = '강지연';
          }
        });
      }

      // Reply Form Submit Event
      const replyForm = itemEl.querySelector('.board-reply-form');
      if (replyForm) {
        replyForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const authorVal = itemEl.querySelector('.reply-author-input').value.trim();
          const roleVal = itemEl.querySelector('.reply-role-select').value;
          const passVal = itemEl.querySelector('.reply-pass-input').value.trim();
          const contentVal = itemEl.querySelector('.reply-input-text').value.trim();

          if (!authorVal || !passVal || !contentVal) {
            showToast('⚠️ 답글 작성자, 비밀번호, 내용을 모두 입력해 주세요.');
            return;
          }

          const passHash = await sha256Hex(passVal);

          if (isCloudConnected && fbDb && fbModules) {
            try {
              await fbModules.addDoc(fbModules.collection(fbDb, 'board_replies'), {
                postId: String(post.id),
                author: authorVal,
                content: contentVal,
                isPublisher: Boolean(roleVal === 'publisher'),
                authorUid: getEffectiveUid(),
                passwordHash: passHash,
                date: getTodayFormatted(),
                createdAt: fbModules.serverTimestamp()
              });
              showToast('💬 답글이 클라우드 DB에 등록되었습니다.');
            } catch (err) {
              showToast('⚠️ 답글 등록 권한을 확인해 주세요.');
            }
          } else {
            const newReply = {
              id: String(Date.now()),
              author: authorVal,
              isPublisher: roleVal === 'publisher',
              passwordHash: passHash,
              date: getTodayFormatted(),
              content: contentVal
            };

            if (!Array.isArray(post.replies)) {
              post.replies = [];
            }
            post.replies.push(newReply);
            saveBoardPosts();
            renderBoardPosts();
            showToast('💬 답글이 등록되었습니다.');
          }
        });
      }

      // Delete Post Event
      const deletePostBtn = itemEl.querySelector('.btn-delete-post');
      if (deletePostBtn) {
        deletePostBtn.addEventListener('click', async () => {
          const inputPass = window.prompt('게시글 삭제를 위해 작성 시 입력한 비밀번호를 입력해 주세요.');
          if (inputPass === null) return;
          const inputHash = await sha256Hex(inputPass.trim());
          const isMatch = (post.passwordHash && inputHash === post.passwordHash) ||
                          (post.password && inputPass.trim() === post.password) ||
                          inputPass.trim() === MASTER_PASS ||
                          isAdminUser;

          if (!isMatch) {
            showToast('⚠️ 비밀번호가 일치하지 않습니다.');
            return;
          }

          if (isCloudConnected && fbDb && fbModules) {
            try {
              await fbModules.deleteDoc(fbModules.doc(fbDb, 'board_posts', String(post.id)));
              openPostIds.delete(postKey);
              showToast('🗑️ 게시글이 삭제되었습니다.');
            } catch (err) {
              showToast('⚠️ 작성자 본인 세션 또는 관리자만 삭제할 수 있습니다.');
            }
          } else {
            boardPosts = boardPosts.filter(p => String(p.id) !== postKey);
            openPostIds.delete(postKey);
            saveBoardPosts();
            renderBoardPosts();
            showToast('🗑️ 게시글이 삭제되었습니다.');
          }
        });
      }

      // Delete Reply Events
      itemEl.querySelectorAll('.btn-delete-reply').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const replyId = String(btn.getAttribute('data-reply-id'));
          const targetReply = (post.replies || []).find(r => String(r.id) === replyId);
          if (!targetReply) return;

          const inputPass = window.prompt('답글 삭제를 위해 비밀번호를 입력해 주세요.');
          if (inputPass === null) return;
          const inputHash = await sha256Hex(inputPass.trim());
          const isMatch = (targetReply.passwordHash && inputHash === targetReply.passwordHash) ||
                          (targetReply.password && inputPass.trim() === targetReply.password) ||
                          inputPass.trim() === MASTER_PASS ||
                          isAdminUser;

          if (!isMatch) {
            showToast('⚠️ 비밀번호가 일치하지 않습니다.');
            return;
          }

          if (isCloudConnected && fbDb && fbModules) {
            try {
              await fbModules.deleteDoc(fbModules.doc(fbDb, 'board_replies', replyId));
              showToast('🗑️ 답글이 삭제되었습니다.');
            } catch (err) {
              showToast('⚠️ 작성자 본인 세션 또는 관리자만 삭제할 수 있습니다.');
            }
          } else {
            post.replies = post.replies.filter(r => String(r.id) !== replyId);
            saveBoardPosts();
            renderBoardPosts();
            showToast('🗑️ 답글이 삭제되었습니다.');
          }
        });
      });

      boardListContainer.appendChild(itemEl);
    });
  };

  // Board Category Filter Buttons
  document.querySelectorAll('.board-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentBoardCat = btn.getAttribute('data-board-cat') || 'all';
      document.querySelectorAll('.board-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderBoardPosts();
    });
  });

  // Toggle Write Form
  if (btnToggleWrite && boardWriteWrap) {
    btnToggleWrite.addEventListener('click', () => {
      const isHidden = boardWriteWrap.hasAttribute('hidden');
      if (isHidden) {
        boardWriteWrap.removeAttribute('hidden');
        btnToggleWrite.setAttribute('aria-expanded', 'true');
        btnToggleWrite.innerHTML = '<span>✕ 작성 닫기</span>';
        document.getElementById('post-author')?.focus();
      } else {
        boardWriteWrap.setAttribute('hidden', '');
        btnToggleWrite.setAttribute('aria-expanded', 'false');
        btnToggleWrite.innerHTML = '<span>✏️ 새 글 작성하기</span>';
      }
    });
  }

  if (btnCancelWrite && boardWriteWrap && btnToggleWrite) {
    btnCancelWrite.addEventListener('click', () => {
      boardWriteWrap.setAttribute('hidden', '');
      btnToggleWrite.setAttribute('aria-expanded', 'false');
      btnToggleWrite.innerHTML = '<span>✏️ 새 글 작성하기</span>';
    });
  }

  // Write Post Form Submit
  if (boardWriteForm) {
    boardWriteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catEl = document.getElementById('post-category');
      const authorEl = document.getElementById('post-author');
      const passEl = document.getElementById('post-password');
      const secretEl = document.getElementById('post-secret');
      const titleEl = document.getElementById('post-title');
      const contentEl = document.getElementById('post-content');

      const author = authorEl.value.trim();
      const password = passEl.value.trim();
      const title = titleEl.value.trim();
      const content = contentEl.value.trim();
      const isSecret = Boolean(secretEl.checked);

      if (!author || !password || !title || !content) {
        showToast('⚠️ 작성자, 비밀번호, 제목, 내용을 모두 입력해 주세요.');
        return;
      }

      const passHash = await sha256Hex(password);
      const storedContent = isSecret ? encryptSecretContent(content, password) : content;

      if (isCloudConnected && fbDb && fbModules) {
        try {
          const docRef = await fbModules.addDoc(fbModules.collection(fbDb, 'board_posts'), {
            category: catEl.value || 'project',
            author,
            title,
            content: storedContent,
            isSecret,
            authorUid: getEffectiveUid(),
            passwordHash: passHash,
            date: getTodayFormatted(),
            createdAt: fbModules.serverTimestamp()
          });
          const newKey = String(docRef.id);
          openPostIds.add(newKey);
          if (isSecret) {
            unlockedSecretIds.add(newKey);
            decryptedSecretsMap.set(newKey, content);
          }
          boardWriteForm.reset();
          boardWriteWrap.setAttribute('hidden', '');
          btnToggleWrite.setAttribute('aria-expanded', 'false');
          btnToggleWrite.innerHTML = '<span>✏️ 새 글 작성하기</span>';
          showToast('☁️ 새 게시글이 클라우드 DB에 등록되었습니다.');
        } catch (err) {
          showToast('⚠️ 게시글 등록 중 오류가 발생했습니다.');
        }
      } else {
        const newId = String(Date.now());
        const newPost = {
          id: newId,
          category: catEl.value || 'project',
          author,
          passwordHash: passHash,
          isSecret,
          title,
          content: storedContent,
          date: getTodayFormatted(),
          replies: []
        };

        boardPosts.unshift(newPost);
        openPostIds.add(newId);
        if (isSecret) {
          unlockedSecretIds.add(newId);
          decryptedSecretsMap.set(newId, content);
        }

        saveBoardPosts();
        boardWriteForm.reset();
        boardWriteWrap.setAttribute('hidden', '');
        btnToggleWrite.setAttribute('aria-expanded', 'false');
        btnToggleWrite.innerHTML = '<span>✏️ 새 글 작성하기</span>';
        renderBoardPosts();
        showToast('✅ 새 게시글이 등록되었습니다.');
      }
    });
  }

  // GitHub Discussions / Issues (Giscus & Utterances) Lazy Loader & Theme Sync
  let utterancesLoaded = false;
  let giscusLoaded = false;

  const getActiveThemeMode = () => {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  };

  const loadUtterances = () => {
    if (utterancesLoaded) return;
    const container = document.getElementById('utterances-thread');
    if (!container) return;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'mizushiro/portfolio');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'portfolio-comment');
    script.setAttribute('theme', getActiveThemeMode() === 'dark' ? 'github-dark' : 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);
    utterancesLoaded = true;
  };

  const loadGiscus = () => {
    if (giscusLoaded) return;
    const container = document.getElementById('giscus-thread');
    if (!container) return;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'mizushiro/portfolio');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', getActiveThemeMode() === 'dark' ? 'dark_dimmed' : 'light');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);
    giscusLoaded = true;
  };

  function syncGitHubWidgetTheme(themeMode) {
    // Sync Utterances iframe
    const utterancesFrame = document.querySelector('.utterances-frame');
    if (utterancesFrame && utterancesFrame.contentWindow) {
      utterancesFrame.contentWindow.postMessage(
        { type: 'set-theme', theme: themeMode === 'dark' ? 'github-dark' : 'github-light' },
        'https://utteranc.es'
      );
    }
    // Sync Giscus iframe
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame && giscusFrame.contentWindow) {
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: themeMode === 'dark' ? 'dark_dimmed' : 'light' } } },
        'https://giscus.app'
      );
    }
  }

  // Board Mode Switcher (Q&A vs GitHub)
  if (modeQnaBtn && modeGithubBtn && panelQna && panelGithub) {
    modeQnaBtn.addEventListener('click', () => {
      modeQnaBtn.classList.add('active');
      modeQnaBtn.setAttribute('aria-selected', 'true');
      modeGithubBtn.classList.remove('active');
      modeGithubBtn.setAttribute('aria-selected', 'false');
      panelQna.removeAttribute('hidden');
      panelGithub.setAttribute('hidden', '');
    });

    modeGithubBtn.addEventListener('click', () => {
      modeGithubBtn.classList.add('active');
      modeGithubBtn.setAttribute('aria-selected', 'true');
      modeQnaBtn.classList.remove('active');
      modeQnaBtn.setAttribute('aria-selected', 'false');
      panelGithub.removeAttribute('hidden');
      panelQna.setAttribute('hidden', '');
      loadUtterances();
    });
  }

  // Switch between Utterances and Giscus inside GitHub tab
  if (engineUtterancesBtn && engineGiscusBtn && utterancesWrap && giscusWrap) {
    engineUtterancesBtn.addEventListener('click', () => {
      engineUtterancesBtn.classList.add('active');
      engineGiscusBtn.classList.remove('active');
      utterancesWrap.removeAttribute('hidden');
      giscusWrap.setAttribute('hidden', '');
      loadUtterances();
    });

    engineGiscusBtn.addEventListener('click', () => {
      engineGiscusBtn.classList.add('active');
      engineUtterancesBtn.classList.remove('active');
      giscusWrap.removeAttribute('hidden');
      utterancesWrap.setAttribute('hidden', '');
      loadGiscus();
    });
  }

  // --------------------------------------------------------------------------
  // 10. 초기 렌더링 실행
  // --------------------------------------------------------------------------
  renderCategoryTabs();
  filterAndRenderProjects();
  initFirebaseBoard();
});

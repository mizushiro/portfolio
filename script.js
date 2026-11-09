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
  // 9. 프로젝트 문의 & 방명록 게시판 (Q&A Board + 답글 + 비밀글 + GitHub 연동)
  // --------------------------------------------------------------------------
  const BOARD_STORAGE_KEY = 'kjy_portfolio_board_v1';
  const MASTER_PASS = '0000';

  const CATEGORY_META = {
    project: { label: '💼 프로젝트 문의', className: 'project' },
    recruit: { label: '🤝 채용/협업 제안', className: 'recruit' },
    guestbook: { label: '✨ 방명록/응원', className: 'guestbook' }
  };

  const defaultPosts = [
    {
      id: 103,
      category: 'project',
      author: '김민수 PM (공공SI 사업부)',
      password: '1234',
      isSecret: false,
      title: '하반기 공공기관 포털 고도화 및 웹접근성(WA) PL 투입 일정 문의드립니다.',
      content: '안녕하세요 강지연 차장님. 기상청 날씨누리 및 날씨알리미 앱 고도화 산출물 마크업을 인상 깊게 보았습니다.\n오는 11월부터 약 5개월간 서울 상주로 진행되는 대국민 공공 포털 웹접근성(KWCAG 2.2) 리뉴얼 프로젝트에 퍼블리싱 PL로 참여 가능하신지 문의드립니다.',
      date: '2026.10.28',
      replies: [
        {
          id: 201,
          author: '강지연',
          isPublisher: true,
          password: '0000',
          date: '2026.10.28',
          content: '안녕하세요 김민수 PM님! 포트폴리오를 살펴봐 주셔서 감사합니다.\n2026년 11월 투입 일정 가능하며, 공공기관 KWCAG 2.2 인증 심사 및 반응형 UI 표준 가이드 수립까지 책임지고 리드 가능합니다. 이메일(mizushiro@naver.com)로 세부 일정을 보내주시면 빠르게 회신드리겠습니다!'
        }
      ]
    },
    {
      id: 102,
      category: 'recruit',
      author: '박지훈 팀장 (핀테크 플랫폼)',
      password: '1234',
      isSecret: true,
      title: '차세대 금융 디자인 시스템(Storybook/React) 구축 관련 비공개 제안드립니다.',
      content: '안녕하세요. 스마일게이트 STOVE 디자인 시스템 및 전북은행 브라보 코리아 이력을 보고 연락드립니다.\n당사 차세대 금융 디자인 시스템 구축 TF의 시니어 UI 개발/퍼블리싱 리드 포지션을 제안드리고자 합니다.',
      date: '2026.10.19',
      replies: [
        {
          id: 202,
          author: '강지연',
          isPublisher: true,
          password: '0000',
          date: '2026.10.19',
          content: '박지훈 팀장님, 소중한 제안 감사합니다! 디자인 토큰 체계 및 금융 웹접근성 컴포넌트 설계 경험이 풍부하여 큰 도움이 될 수 있을 것 같습니다. 메일로 연락드리겠습니다.'
        }
      ]
    },
    {
      id: 101,
      category: 'guestbook',
      author: '이서연 프론트엔드 개발자',
      password: '1234',
      isSecret: false,
      title: '함께 프로젝트 진행했던 프론트엔드 개발자입니다! 포트폴리오가 정말 멋지네요 👍',
      content: '차장님! 지난 프로젝트에서 컴포넌트 마크업과 접근성 아키텍처를 너무 깔끔하게 잡아주셔서 개발 연동이 정말 수월했습니다. 새로 정리하신 라이브 데모 URL들도 한눈에 보기 좋네요. 늘 응원합니다!',
      date: '2026.10.12',
      replies: [
        {
          id: 203,
          author: '강지연',
          isPublisher: true,
          password: '0000',
          date: '2026.10.12',
          content: '서연님 반갑습니다! 함께 호흡을 맞춰 작업했던 기억이 새록새록 나네요. 따뜻한 응원 메시지 정말 고맙고 다음 프로젝트에서도 또 좋은 인연으로 만나길 바랍니다 😊'
        }
      ]
    }
  ];

  let boardPosts = [];
  let currentBoardCat = 'all';
  const openPostIds = new Set([103]); // 첫 번째 게시글 기본 펼침
  const unlockedSecretIds = new Set();

  const loadBoardPosts = () => {
    try {
      const saved = localStorage.getItem(BOARD_STORAGE_KEY);
      if (saved) {
        boardPosts = JSON.parse(saved);
      } else {
        boardPosts = defaultPosts;
        localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boardPosts));
      }
    } catch (e) {
      boardPosts = [...defaultPosts];
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
      const isOpen = openPostIds.has(post.id);
      const isUnlocked = !post.isSecret || unlockedSecretIds.has(post.id);
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
              <span style="font-size: 0.8rem; color: var(--text-muted);">작성 시 설정한 비밀번호를 입력하시면 본문 및 답글을 확인하실 수 있습니다. (데모 확인용: <code>1234</code> 또는 <code>0000</code>)</span>
            </p>
            <div class="secret-unlock-row">
              <input type="password" class="form-input secret-pass-input" style="width: 190px; padding: 8px 12px;" placeholder="비밀번호 입력" aria-label="비밀글 열람 비밀번호 입력">
              <button type="button" class="btn-primary btn-unlock-secret" style="padding: 8px 16px; font-size: 0.85rem;">잠금 해제</button>
            </div>
          </div>
        `;
      } else {
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

        bodyHtml = `
          <div class="board-post-content">${escapeHtml(post.content)}</div>
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
                <input type="text" class="form-input reply-author-input" placeholder="작성자 이름 *" maxlength="25" required aria-label="답글 작성자 이름">
                <select class="form-select reply-role-select" aria-label="답글 작성자 구분">
                  <option value="visitor">👤 방문자 / 문의자 답글</option>
                  <option value="publisher">🎖️ 강지연 (Publisher 답변)</option>
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
        if (openPostIds.has(post.id)) {
          openPostIds.delete(post.id);
        } else {
          openPostIds.add(post.id);
        }
        renderBoardPosts();
      });

      // Secret Unlock Event
      const unlockBtn = itemEl.querySelector('.btn-unlock-secret');
      const secretInput = itemEl.querySelector('.secret-pass-input');
      if (unlockBtn && secretInput) {
        const handleUnlock = () => {
          const val = secretInput.value.trim();
          if (val === post.password || val === MASTER_PASS) {
            unlockedSecretIds.add(post.id);
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
        replyForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const authorVal = itemEl.querySelector('.reply-author-input').value.trim();
          const roleVal = itemEl.querySelector('.reply-role-select').value;
          const passVal = itemEl.querySelector('.reply-pass-input').value.trim();
          const contentVal = itemEl.querySelector('.reply-input-text').value.trim();

          if (!authorVal || !passVal || !contentVal) {
            showToast('⚠️ 답글 작성자, 비밀번호, 내용을 모두 입력해 주세요.');
            return;
          }

          const newReply = {
            id: Date.now(),
            author: authorVal,
            isPublisher: roleVal === 'publisher',
            password: passVal,
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
        });
      }

      // Delete Post Event
      const deletePostBtn = itemEl.querySelector('.btn-delete-post');
      if (deletePostBtn) {
        deletePostBtn.addEventListener('click', () => {
          const inputPass = window.prompt('게시글 삭제를 위해 작성 시 입력한 비밀번호를 입력해 주세요.');
          if (inputPass === null) return;
          if (inputPass.trim() === post.password || inputPass.trim() === MASTER_PASS) {
            boardPosts = boardPosts.filter(p => p.id !== post.id);
            openPostIds.delete(post.id);
            saveBoardPosts();
            renderBoardPosts();
            showToast('🗑️ 게시글이 삭제되었습니다.');
          } else {
            showToast('⚠️ 비밀번호가 일치하지 않습니다.');
          }
        });
      }

      // Delete Reply Events
      itemEl.querySelectorAll('.btn-delete-reply').forEach((btn) => {
        btn.addEventListener('click', () => {
          const replyId = Number(btn.getAttribute('data-reply-id'));
          const targetReply = (post.replies || []).find(r => r.id === replyId);
          if (!targetReply) return;

          const inputPass = window.prompt('답글 삭제를 위해 비밀번호를 입력해 주세요.');
          if (inputPass === null) return;
          if (inputPass.trim() === targetReply.password || inputPass.trim() === MASTER_PASS) {
            post.replies = post.replies.filter(r => r.id !== replyId);
            saveBoardPosts();
            renderBoardPosts();
            showToast('🗑️ 답글이 삭제되었습니다.');
          } else {
            showToast('⚠️ 비밀번호가 일치하지 않습니다.');
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
    boardWriteForm.addEventListener('submit', (e) => {
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

      if (!author || !password || !title || !content) {
        showToast('⚠️ 작성자, 비밀번호, 제목, 내용을 모두 입력해 주세요.');
        return;
      }

      const newPost = {
        id: Date.now(),
        category: catEl.value || 'project',
        author,
        password,
        isSecret: Boolean(secretEl.checked),
        title,
        content,
        date: getTodayFormatted(),
        replies: []
      };

      boardPosts.unshift(newPost);
      openPostIds.add(newPost.id);
      if (newPost.isSecret) {
        unlockedSecretIds.add(newPost.id);
      }

      saveBoardPosts();
      boardWriteForm.reset();
      boardWriteWrap.setAttribute('hidden', '');
      btnToggleWrite.setAttribute('aria-expanded', 'false');
      btnToggleWrite.innerHTML = '<span>✏️ 새 글 작성하기</span>';
      renderBoardPosts();
      showToast('✅ 새 게시글이 등록되었습니다.');
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
  loadBoardPosts();
  renderBoardPosts();
});

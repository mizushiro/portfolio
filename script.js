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
  // 9. 초기 렌더링 실행
  // --------------------------------------------------------------------------
  renderCategoryTabs();
  filterAndRenderProjects();
});

/**
 * Navigation Script (header.html + jQuery load 대응 버전)
 * - 1depth/2depth 활성화
 * - body data-current-menu / data-current-submenu 기준
 */

/* 최고관리자 header.js */

(function () {
  'use strict';

  // 1depth > 2depth 구조 정의
  const menuStructure = {
    member: {
      title: '회원관리',
      subMenus: [
        { id: 'school-staff',   title: '단위학교 담당자',  url: 'member-teacher-list.html' },
        { id: 'business-staff', title: '사업담당 장학사',  url: 'member-supervisor-list.html' },
        { id: 'support-staff',  title: '지원청 장학사',    url: 'member-program-supervisor-list.html' },
        { id: 'auditor',        title: '감사 관리',       url: 'member-auditor-list.html' }
      ]
    },
    program: {
      title: '공모사업신청관리',
      subMenus: [
        { id: 'program-selected',  title: '선택사업',        url: 'program-admin-list.html' },
        { id: 'program-selected2', title: '선택외사업',       url: '#' },
        { id: 'program-improve',   title: '개항병사업',       url: '#' },
        { id: 'program-auto',      title: '자율사업',        url: '#' },
        { id: 'program-special',   title: '특교/추경신규사업', url: '#' }
      ]
    },
    application: {
      title: '사업신청관리',
      subMenus: [
        { id: 'application-all',      title: '전체신청관리',   url: 'application-admin-all-list.html' },
        { id: 'application-selected', title: '선택사업',      url: 'application-admin-selected-list.html' },
        { id: 'application-selected2',title: '선택외사업',     url: '#' },
        { id: 'application-improve',  title: '개항병사업',     url: '#' },
        { id: 'application-auto',     title: '자율사업',      url: '#' },
        { id: 'application-special',  title: '특교/추경신규',  url: '#' }
      ]
    },
    report: {
      title: '결과보고관리',
      subMenus: [] // 2depth 없음
    },
    operation: {
      title: '운영관리',
      subMenus: [
        { id: 'operation-program', title: '공모사업 설정관리',   url: 'operation-program-settings.html' },
        { id: 'operation-log',     title: '관리자 로그인 기록',  url: 'operation-login-log.html' },
        { id: 'operation-popup',   title: '팝업 관리',         url: 'operation-popup-list.html' }
      ]
    },
    statistics: {
      title: '통계관리',
      subMenus: [
        { id: 'stats-region', title: '지역별 통계', url: 'stats-region.html' },
        { id: 'stats-school', title: '학교별 통계', url: 'stats-school.html' }
      ]
    },
    board: {
      title: '게시판관리',
      subMenus: [
        { id: 'board-notice',  title: '공지사항',  url: 'board-admin-notice-list.html' },
        { id: 'board-archive', title: '자료실',   url: 'board-admin-archive-list.html' },
        { id: 'board-qna',     title: '질의응답',  url: 'board-admin-qna-list.html' }
      ]
    }
  };

  
  let currentMainMenu = null;
  let currentSubMenu  = null;

  // ==============================
  // 2. DOM 준비 후, header가 로드될 때까지 기다리기
  // ==============================
  document.addEventListener('DOMContentLoaded', function () {
    waitForHeader(initNavigation);
  });

  function waitForHeader(callback) {
    const check = function () {
      const headerEl = document.getElementById('header');
      if (!headerEl) {
        setTimeout(check, 50);
        return;
      }

      const hasMain = headerEl.querySelector('.nav-item');
      const hasSub  = headerEl.querySelector('#subNav');

      if (hasMain && hasSub) {
        callback();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  }

  // ==============================
  // 3. 현재 페이지 기준 main / sub 자동 결정
  //    - 1순위: body data-*
  //    - 2순위: menuStructure.subMenus 의 url
  //    - 3순위: header 의 1depth href
  //    - 그래도 없으면 program 기본
  // ==============================
  function detectCurrentMenu() {
    const body = document.body;
    let main   = body.getAttribute('data-current-menu');
    let sub    = body.getAttribute('data-current-submenu');

    // ---- 3-1) body 값 검증 ----
    if (main && !menuStructure[main]) {
      main = null;
      sub  = null;
    }

    if (main && sub) {
      const hasSub = (menuStructure[main].subMenus || []).some(
        (s) => s.id === sub
      );
      if (!hasSub) {
        sub = null;
      }
    }

    const path = window.location.pathname.split('/').pop().split('?')[0];

    // ---- 3-2) body 값이 없거나 잘못됐으면 2depth url로 매칭 ----
    if (!main) {
      outer: for (const [mainId, menu] of Object.entries(menuStructure)) {
        const list = menu.subMenus || [];
        for (const sm of list) {
          if (!sm.url) continue;
          const fileName = sm.url.split('/').pop();
          if (fileName === path) {
            main = mainId;
            sub  = sm.id;
            break outer;
          }
        }
      }
    }

    // ---- 3-3) 그래도 main을 못 찾으면 1depth href로 매칭 ----
    if (!main) {
      const headerEl = document.getElementById('header');
      if (headerEl) {
        const mainNavItems = headerEl.querySelectorAll('#mainNav .nav-item[href]');
        mainNavItems.forEach(function (item) {
          if (main) return;

          const href = item.getAttribute('href') || '';
          if (!href || href === '#' || href === 'javascript:void(0)') return;

          const fileName = href.split('/').pop().split('?')[0];
          if (fileName === path) {
            const menuId = item.getAttribute('data-menu');
            if (menuId && menuStructure[menuId]) {
              main = menuId;
              // sub는 없음 (2depth 없는 메뉴거나, body로 명시 안 한 경우)
              sub = null;
            }
          }
        });
      }
    }

    // ---- 3-4) 여전히 main 없음 → program 기본 ----
    if (!main) {
      main = 'program';
    }

    // ---- 3-5) sub 없음 → 해당 main의 첫 번째 sub (있을 때만) ----
    if (!sub) {
      const first = (menuStructure[main].subMenus || [])[0];
      sub = first ? first.id : null;
    }

    // ✅ 자동으로 body data-*도 채워주기 (선애가 원하던 부분)
    if (!body.getAttribute('data-current-menu')) {
      body.setAttribute('data-current-menu', main);
    }
    if (sub && !body.getAttribute('data-current-submenu')) {
      body.setAttribute('data-current-submenu', sub);
    }

    return { main, sub };
  }

  // ==============================
  // 4. 네비게이션 초기화
  // ==============================
  function initNavigation() {
    const detected = detectCurrentMenu();
    currentMainMenu = detected.main;
    currentSubMenu  = detected.sub;

    setActiveMainMenu(currentMainMenu);
    renderSubMenu(currentMainMenu);
    bindMainNavEvents();
  }

  // 4-1) 1depth 메뉴 클릭 (페이지 이동은 a href 그대로)
  function bindMainNavEvents() {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    const mainNav = headerEl.querySelector('#mainNav');
    if (!mainNav) return;

    const items = mainNav.querySelectorAll('.nav-item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        const menuId = this.getAttribute('data-menu');
        if (!menuId) return;

        setActiveMainMenu(menuId);
        renderSubMenu(menuId);
      });
    });
  }

  // ==============================
  // 5. 1depth active 처리
  // ==============================
  function setActiveMainMenu(menuId) {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    const mainNav = headerEl.querySelector('#mainNav');
    if (!mainNav) return;

    const items = mainNav.querySelectorAll('.nav-item');
    items.forEach(function (item) {
      const id = item.getAttribute('data-menu');
      item.classList.toggle('active', id === menuId);
    });

    currentMainMenu = menuId;
  }

  // ==============================
  // 6. 2depth 렌더링 + active 처리
  // ==============================
  function renderSubMenu(mainMenuId) {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    const subWrap = headerEl.querySelector('.sub-nav-wrap');
    const subNav  = headerEl.querySelector('#subNav');
    if (!subNav) return;

    const menuData = menuStructure[mainMenuId];
    const list     = (menuData && menuData.subMenus) ? menuData.subMenus : [];

    // 2depth 없음 → 숨김
    if (!list.length) {
      subNav.innerHTML = '';
      if (subWrap) {
        subWrap.style.display = 'none';
      }
      return;
    }

    // 2depth 있음 → 표시
    if (subWrap) {
      subWrap.style.display = '';
    }

    // 현재 sub가 이 main 안에 없으면 첫 번째로 교체
    if (!list.some((sm) => sm.id === currentSubMenu)) {
      currentSubMenu = list[0].id;
    }

    let html = '';
    list.forEach(function (sm) {
      const isActive = sm.id === currentSubMenu;
      const href     = sm.url || '#';

      html +=
        '<a href="' + href + '" class="sub-nav-item' +
        (isActive ? ' active' : '') +
        '" data-submenu="' + sm.id + '">' +
        sm.title +
        '</a>';
    });

    subNav.innerHTML = html;

    const subItems = subNav.querySelectorAll('.sub-nav-item');
    subItems.forEach(function (item) {
      item.addEventListener('click', function () {
        const id = this.getAttribute('data-submenu');
        setActiveSubMenu(id);
      });
    });
  }

  function setActiveSubMenu(subMenuId) {
    const headerEl = document.getElementById('header');
    if (!headerEl) return;

    const subNav = headerEl.querySelector('#subNav');
    if (!subNav) return;

    const items = subNav.querySelectorAll('.sub-nav-item');
    items.forEach(function (item) {
      const id = item.getAttribute('data-submenu');
      item.classList.toggle('active', id === subMenuId);
    });

    currentSubMenu = subMenuId;
  }

  // ==============================
  // 7. 디버깅용
  // ==============================
  window.Navigation = {
    getCurrentMenuState: function () {
      return {
        mainMenu: currentMainMenu,
        subMenu : currentSubMenu,
      };
    },
  };
})();
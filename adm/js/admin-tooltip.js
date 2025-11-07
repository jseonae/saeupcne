(function () {
  'use strict';

  const HOST_SELECTOR = '.project-name';
  const TEXT_SELECTOR = 'strong';

  // 실제로 말줄임이 발생했는지 확인
  function isEllipsed(el) {
    return el && el.scrollWidth > el.clientWidth + 1;
  }

  // 대상 하나씩 처리
  function applyOne(host) {
    const strong = host.querySelector(TEXT_SELECTOR);
    if (!strong || !host.offsetParent) return;

    const fullText = (strong.textContent || '').trim();

    if (isEllipsed(strong)) {
      // strong에 ellipsis 추가
      strong.classList.add('ellipsis');
      // 부모에 KRDS 툴팁 설정
      host.classList.add('krds-tooltip', 'tooltip-vertical');
      host.setAttribute('data-tooltip', fullText);
    } else {
      // strong에서 ellipsis 제거
      strong.classList.remove('ellipsis');
      // 부모에서 툴팁 관련 제거
      host.classList.remove('krds-tooltip', 'tooltip-vertical');
      host.removeAttribute('data-tooltip');
    }
  }

  // 전체 갱신
  function refreshAll() {
    requestAnimationFrame(() => {
      document.querySelectorAll(HOST_SELECTOR).forEach(applyOne);
    });
  }

  // 초기 실행
  document.addEventListener('DOMContentLoaded', refreshAll);

  // 웹폰트 로드 후 다시 확인
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshAll);
  }

  // 리사이즈 시 다시 검사(디바운스)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshAll, 150);
  });

  // strong 크기 변화 자동 감지
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const host = entry.target.closest(HOST_SELECTOR);
        if (host) applyOne(host);
      });
    });
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll(`${HOST_SELECTOR} ${TEXT_SELECTOR}`).forEach(el => ro.observe(el));
    });
  }

  // 동적 DOM 추가 시 자동 반영
  if (window.MutationObserver) {
    const mo = new MutationObserver(refreshAll);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // 외부에서도 수동 호출 가능
  window.KRDSCommon = window.KRDSCommon || {};
  window.KRDSCommon.refreshEllipsisTooltips = refreshAll;
})();
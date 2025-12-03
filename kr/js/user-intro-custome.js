/* ------------------------------------------------------------------------
 * 소개 페이지 상단 탭
 * - sticky + 섹션별 활성 탭 + 섹션별 배경 테마
 * --------------------------------------------------------------------- */
$(function () {
  const $win = $(window);
  const $nav = $('.intro-pageIn-nav');
  if (!$nav.length) return;

  const $navItems = $nav.find('.intro-pageIn-nav-list li');
  const $links    = $nav.find('.intro-pageIn-btn[href^="#"]');

  // nav ↔ section 매핑
  const sections = [];
  $links.each(function () {
    const $link = $(this);
    const href  = $link.attr('href');
    if (!href || href === '#') return;

    const $section = $(href);
    if (!$section.length) return;

    sections.push({
      $li:      $link.closest('li'),
      $link,
      $section
    });
  });

  if (!sections.length) return;

  /* ------------------------------------------------------------
   * 1) sticky 동작
   * --------------------------------------------------------- */

  // nav가 화면 상단에 닿을 기준 위치
  let navTop = $nav.offset().top;

  // sticky 시작 시점을 미세 조정하고 싶을 때 쓰는 값
  // (음수면 조금 늦게, 양수면 조금 일찍 붙음)
  const NAV_ACTIVE_OFFSET = -100; // px, 맘에 안 들면 숫자만 바꿔줘

  function recalcNavTop() {
    navTop = $nav.offset().top;
  }

  /* ------------------------------------------------------------
   * 2) 섹션 활성 & 테마 변경
   * --------------------------------------------------------- */

  // 화면 어느 지점을 기준으로 “지금 보는 섹션”을 잡을지
  // 0.75 = 화면의 75% 아래 지점. 너무 이르면 0.8~0.9로 올려봐도 돼.
  const ACTIVE_LINE_RATIO = 0.2;

  function updateOnScroll() {
    const scrollTop = $win.scrollTop();
    const vh        = window.innerHeight || $win.height();

    // 2-1) sticky 토글
    if (scrollTop + NAV_ACTIVE_OFFSET >= navTop) {
      $nav.addClass('active');
    } else {
      $nav.removeClass('active');
    }

    // 2-2) 현재 섹션 찾기
    const triggerLine = scrollTop + vh * ACTIVE_LINE_RATIO;

    let currentIndex = 0;
    sections.forEach(function (item, idx) {
      const top    = item.$section.offset().top;
      const bottom = top + item.$section.outerHeight();

      if (triggerLine >= top && triggerLine < bottom) {
        currentIndex = idx;
      }
    });

    // 2-3) 탭 is-active 갱신
    $navItems.removeClass('is-active');
    sections[currentIndex].$li.addClass('is-active');

    // 2-4) nav 배경 테마 변경
    // 섹션에 data-nav-theme="feature|program|bands|steps" 이런 식으로 넣어두었다고 가정
    const theme = sections[currentIndex].$section.data('navTheme') ||
                  sections[currentIndex].$section.data('nav-theme');

    // 이미 쓰고 있는 테마 클래스들 한 번에 제거
    $nav.removeClass(
      'nav-theme-feature nav-theme-program nav-theme-bands nav-theme-steps'
    );

    if (theme) {
      $nav.addClass('nav-theme-' + theme);
    }
  }

  /* ------------------------------------------------------------
   * 3) 탭 클릭 시 부드러운 스크롤
   * --------------------------------------------------------- */
  function onNavClick(e) {
    const href = $(this).attr('href');
    if (!href || href.charAt(0) !== '#') return;

    const $target = $(href);
    if (!$target.length) return;

    e.preventDefault();

    const navHeight = $nav.outerHeight() || 0;
    const targetTop = $target.offset().top - navHeight - 0;

    $('html, body').animate({ scrollTop: targetTop }, 400);
  }

  /* ------------------------------------------------------------
   * 초기화 & 이벤트 바인딩
   * --------------------------------------------------------- */
  recalcNavTop();
  updateOnScroll();

  $win.on('scroll', updateOnScroll);
  $win.on('resize', function () {
    recalcNavTop();
    updateOnScroll();
  });

  $nav.on('click', '.intro-pageIn-btn[href^="#"]', onNavClick);
});
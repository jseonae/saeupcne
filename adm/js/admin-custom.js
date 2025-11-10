/* ==========================================================================
   admin-common.js
   - 정적 페이지 공통 스크립트 (jQuery 기반)
   - 기능:
     1) header / footer / pagination 템플릿 자동 로드
     2) 체크박스 전체선택 & 개별선택 연동
     3) 숫자 입력 시 천 단위 콤마 자동 적용
   ========================================================================== */
(function ($, window, document) {
  'use strict';

  /* ------------------------------------------------------------------------
   * 상수/셀렉터
   * --------------------------------------------------------------------- */
  const SEL = {
    header: '#header',
    footer: '#footer',
    pagination: '#pagination',
    checkAll: '#checkAll',
    checkGroup: '.checkGroup',
    numberInput: '.number-input',
  };

  /* ------------------------------------------------------------------------
   * 1) 헤더/푸터/페이지네이션 로드
   *    - 각 id(#header, #footer, #pagination)가 존재하면 자동 삽입
   *    - 상대 경로 사용: HTML 파일이 /adm/html/에 있고 템플릿이 /adm/tmpl/에 있음
   * --------------------------------------------------------------------- */
  function initPartials() {
    $(SEL.header).load('../tmpl/header.html');
    $(SEL.footer).load('../tmpl/footer.html');
    $(SEL.pagination).load('../tmpl/pagination.html');
  }

  /* ------------------------------------------------------------------------
   * 2) 체크박스 전체선택 / 개별선택 동기화
   *    - #checkAll 클릭 시 .checkGroup 모두 선택/해제
   *    - 개별 체크박스 변경 시 전체선택 상태 갱신
   * --------------------------------------------------------------------- */
  function initCheckboxes() {
    // 전체선택 토글
    $(document).on('change', SEL.checkAll, function () {
      $(SEL.checkGroup).prop('checked', this.checked);
    });

    // 개별 체크 시 전체선택 상태 갱신
    $(document).on('change', SEL.checkGroup, function () {
      const total = $(SEL.checkGroup).length;
      const checked = $(SEL.checkGroup + ':checked').length;
      $(SEL.checkAll).prop('checked', total === checked);
    });
  }

  /* ------------------------------------------------------------------------
   * 3) 천 단위 자동 콤마 입력
   *    - .number-input 클래스가 있는 input에 적용
   *    - 숫자 외 입력 제거 후 3자리마다 콤마 삽입
   * --------------------------------------------------------------------- */
  function initNumberInputFormat() {
    document.addEventListener('keyup', function (e) {
      if (!e.target.classList || !e.target.classList.contains('number-input')) return;

      // 숫자만 남기고 천 단위 콤마 적용
      const raw = e.target.value.replace(/[^\d]/g, '');
      e.target.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
  }

  /* ------------------------------------------------------------------------
   * 초기화
   * --------------------------------------------------------------------- */
  $(function () {
    initPartials();
    initCheckboxes();
    initNumberInputFormat();
  });

})(jQuery, window, document);

$(function () {
  // 회원가입 승인 토글
  $('.member-edit input[type="checkbox"]').on('change', function () {
    const $label = $(this).closest('.member-edit').find('.toggle-label');
    if ($(this).is(':checked')) {
      $label.text('승인');
    } else {
      $label.text('미승인');
    }
  });
});
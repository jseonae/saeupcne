/* ==========================================================================
   admin-modal.js
   - KRDS 모달 + 모달 HTML 인클루드 전용 스크립트
   ========================================================================== */
(function ($, window, document) {
  'use strict';

  // ---- 설정: 모달 템플릿 경로 / 컨테이너 ---------------------------------
  // 프로젝트 구조에 맞게 한 번만 수정하면 됨
  const MODAL_FILE = '../tmpl/modal.html'; 
  const MODAL_CONTAINER = '#modalLoad';

  // KRDS 모달 객체 가져오기 (window.krds_modal 이든, 전역 krds_modal 이든)
  function getKrdsModal() {
    if (typeof window !== 'undefined' && window.krds_modal) {
      return window.krds_modal;
    }
    if (typeof krds_modal !== 'undefined') {
      return krds_modal;
    }
    return null;
  }

  /**
   * 특정 ID의 모달이 DOM에 있는지 확인하고,
   * 없으면 MODAL_FILE에서 해당 ID만 잘라서 MODAL_CONTAINER에 로드.
   */
  function ensureModalLoaded(modalId, callback) {
    const $existing = $('#' + modalId);

    // 이미 존재하면 바로 콜백
    if ($existing.length) {
      callback && callback($existing);
      return;
    }

    // 없으면 modal.html 에서 해당 ID만 partial 로드
    $(MODAL_CONTAINER).load(MODAL_FILE + ' #' + modalId, function () {
      const $modal = $('#' + modalId);

      if (!$modal.length) {
        console.warn('모달 ID를 modal.html에서 찾을 수 없습니다:', modalId);
      }

      callback && callback($modal);
    });
  }

  /**
   * .open-modal 클릭 시 모달 열기
   * - data-target="modal-id" 를 기준으로 동작
   */
  $(document).on('click', '.open-modal', function (e) {
    e.preventDefault();

    const modalId = $(this).data('target'); // 예: "modal-report-after"
    if (!modalId) return;

    const api = getKrdsModal();
    if (!api || typeof api.openModal !== 'function') {
      console.warn('krds_modal.openModal 을 찾을 수 없습니다.');
      return;
    }

    // 모달 HTML이 준비되어 있는지 확인 후 openModal 호출
    ensureModalLoaded(modalId, function ($modal) {
      if (!$modal || !$modal.length) return;
      api.openModal(modalId);
    });
  });

  /**
   * .close-modal 클릭 시 모달 닫기
   */
  $(document).on('click', '.close-modal', function (e) {
    e.preventDefault();

    const $modal = $(this).closest('.krds-modal');
    const modalId = $modal.attr('id');
    if (!modalId) return;

    const api = getKrdsModal();
    if (!api || typeof api.closeModal !== 'function') {
      console.warn('krds_modal.closeModal 을 찾을 수 없습니다.');
      return;
    }

    api.closeModal(modalId);
  });

})(jQuery, window, document);
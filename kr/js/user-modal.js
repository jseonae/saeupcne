/* ==========================================================================
   - KRDS 모달 + 다중 모달 HTML 인클루드 + 팝업 슬라이더 통합 스크립트
   ========================================================================== */
(function ($, window, document) {
  'use strict';

  // ---- 설정: 여러 모달 템플릿 파일 경로 ---------------------------------
  const MODAL_FILES = [
    '../tmpl/modal.html',
    '../tmpl/modal-popup.html'
  ];

  const MODAL_CONTAINER = '#modalLoad';

  // ---- KRDS 모달 객체 가져오기 --------------------------------------------
  function getKrdsModal() {
    if (typeof window !== 'undefined' && window.krds_modal) {
      return window.krds_modal;
    }
    if (typeof krds_modal !== 'undefined') {
      return krds_modal;
    }
    return null;
  }

  // ---- 특정 파일에서 ID 로드 ------------------------------------------
  function loadModalFromFile(file, modalId, callback) {
    $(MODAL_CONTAINER).load(file + ' #' + modalId, function () {
      const $modal = $('#' + modalId);

      if ($modal.length) {
        callback($modal, true);
      } else {
        callback(null, false);
      }
    });
  }

  /**
   * 여러 파일(MODAL_FILES)에서 순차적으로 해당 ID 검색 후 로드
   */
  function ensureModalLoaded(modalId, callback) {
    const $existing = $('#' + modalId);

    // 이미 DOM에 있으면 바로 콜백 실행
    if ($existing.length) {
      callback && callback($existing);
      return;
    }

    // 순차적으로 파일 검색
    let index = 0;

    function tryNext() {
      if (index >= MODAL_FILES.length) {
        console.warn(`모달 ID "${modalId}" 를 어떤 모달 파일에서도 찾을 수 없음`);
        callback && callback(null);
        return;
      }

      const file = MODAL_FILES[index];
      index++;

      loadModalFromFile(file, modalId, function ($modal, found) {
        if (found) {
          callback && callback($modal);
        } else {
          tryNext();
        }
      });
    }

    tryNext();
  }

  /* ===========================================================
     📌 팝업 슬라이더 초기화 (3개씩 보이고 1개씩 이동)
     =========================================================== */
  function initPopupSlider($modal) {

  const $slider = $modal.find('.popup-slides');
  const $slides = $modal.find('.popup-slide');

  if (!$slider.length || !$slides.length) return;

  const viewCount = 3;
  let currentIndex = 0;

  const slideCount = $slides.length;
  const maxIndex = slideCount - viewCount;

  function update() {
    // padding, border, margin 포함 실제 width(px)
    const slideWidth = $slides.outerWidth(true);

    // 하나씩 정확하게 이동
    const moveX = -(currentIndex * slideWidth);
    $slider.css('transform', `translateX(${moveX}px)`);
  }

  // next
  $modal.find('#nextSlide').off('click').on('click', function() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      update();
    }
  });

  // prev
  $modal.find('#prevSlide').off('click').on('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      update();
    }
  });

  // 초기 위치 설정
  update();
}



  /* ===========================================================
     .open-modal (모달 열기)
     =========================================================== */
  $(document).on('click', '.open-modal', function (e) {
    e.preventDefault();

    const modalId = $(this).data('target');
    if (!modalId) return;

    const api = getKrdsModal();
    if (!api || typeof api.openModal !== 'function') {
      console.warn('krds_modal.openModal 을 찾을 수 없습니다.');
      return;
    }

    ensureModalLoaded(modalId, function ($modal) {
      if (!$modal || !$modal.length) return;

      // 모달이 popup이면 슬라이더 초기화
      if ($modal.hasClass('popup-dialog') || $modal.find('.popup-slides').length) {
        initPopupSlider($modal);
      }

      api.openModal(modalId);
    });
  });


  /* ===========================================================
     .close-modal (모달 닫기)
     =========================================================== */
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


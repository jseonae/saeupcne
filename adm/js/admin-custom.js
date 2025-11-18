/* ==========================================================================
- 정적 페이지 공통 스크립트
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

  }) //끝

  (jQuery, window, document);

/* ------------------------------------------------------------------------
* 토글 커스텀
* --------------------------------------------------------------------- */
$(function () {
  const toggleTextMap = {
    'member-edit': { on: '승인',   off: '미승인' },
    'post-edit':   { on: '공개',   off: '비공개' }
    //계속 추가 가능
  };

  $('.long-switch input[type="checkbox"]').on('change', function () {

    const $wrapper = $(this).closest(Object.keys(toggleTextMap).map(cls => '.' + cls).join(', '));
    const $label = $wrapper.find('.toggle-label');
    const isChecked = $(this).is(':checked');

    const type = Object.keys(toggleTextMap).find(key => $wrapper.hasClass(key));
    if (!type) return;

    const texts = toggleTextMap[type];

    $label
      .text(isChecked ? texts.on : texts.off)
      .toggleClass('is-on', isChecked);
  });
});

/* ------------------------------------------------------------------------
* 셀렉트 디자인
* --------------------------------------------------------------------- */
$(function () {
  const $regionSelect = $('.sch-form-wrap .input-group .krds-form-select');

    function updateSelectState($select) {
    const isFirstSelected = $select.prop('selectedIndex') === 0;
    $select.toggleClass('completed', !isFirstSelected);
  }

  // 최초 진입 시 한 번 체크
  $regionSelect.each(function () {
    updateSelectState($(this));
  });

  // 선택이 바뀔 때마다 상태 갱신
  $regionSelect.on('change', function () {
    updateSelectState($(this));
  });
});

/* ------------------------------------------------------------------------
* 팝업 등록 :: 파일 업로드 커스텀
* --------------------------------------------------------------------- */
$(function () {
  $('.krds-file-upload.custom-upload').each(function () {
  const $wrap = $(this);
  const $fileArea = $wrap.find('.file-upload');
  const $input = $wrap.find('input[type="file"]');
  const $label = $wrap.find('label[for="fileu-upload"]');
  const $btn = $wrap.find('.file-upload-btn');
  const $fileImgBox = $wrap.find('.file-img');
  let $img = $fileImgBox.find('img');

  // 삭제 버튼 → JS에서 생성
  let $deleteBtn = $('<button type="button" class="krds-btn medium text preview-delete-btn">삭제 <i class="svg-icon ico-delete-fill"></i></button>');
  $deleteBtn.hide(); // 초기 숨김
  $fileImgBox.hide(); // 초기 숨김
  $fileImgBox.after($deleteBtn);
  function setState(hasImage) {
    if (hasImage) {
      $wrap.addClass('has-image');
      $input.prop('disabled', true);
      $btn.prop('disabled', true);
      $fileImgBox.show();
      $deleteBtn.show();

    } else {
      $wrap.removeClass('has-image');
      $input.prop('disabled', false).val('');
      $btn.prop('disabled', false);
      $fileImgBox.hide();
      $deleteBtn.hide();

      if ($img.length) {
        $img.attr('src', '');
      }
    }
  }

  function loadImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      if (!$img.length) {
        $img = $('<img>', { alt: '이미지 미리보기' }).appendTo($fileImgBox);
      }
      $img.attr('src', e.target.result);
      setState(true);
    };
    reader.readAsDataURL(file);
  }

    // 초기 상태 체크 (수정 페이지 이미지 있는 경우)
  const initialSrc = $img.attr('src');
    setState(!!initialSrc);

    // 파일 선택 업로드
    $input.on('change', function () {
      const file = this.files[0];
      if (!file) return;
      loadImage(file);
    });

    // 드래그앤드롭 업로드
    $fileArea.on('dragover', function (e) {
      e.preventDefault();
      if ($wrap.hasClass('has-image')) return;
      $(this).addClass('dragover');
    });

    $fileArea.on('dragleave dragend', function () {
      $(this).removeClass('dragover');
    });

    $fileArea.on('drop', function (e) {
      e.preventDefault();
      $(this).removeClass('dragover');
      if ($wrap.hasClass('has-image')) return;

      const dt = e.originalEvent.dataTransfer;
      if (!dt || !dt.files.length) return;

      loadImage(dt.files[0]);
    });

    // 삭제버튼 클릭
    $deleteBtn.on('click', function () {
      setState(false);
      $fileImgBox.empty();
      $img = $();
    });
  });
});


/* ------------------------------------------------------------------------
* 팝업 등록 :: 링크 입력창
* --------------------------------------------------------------------- */
$(function () {
  const $radios  = $('input[name="link-type-rdo"]');
  const $linkBox = $('.link-box');
  const $input   = $('.link-input');

  function updateLinkBox() {
    if ($('#link-none').is(':checked')) {
      $linkBox.hide();
    } else {
      $linkBox.show();
    }
  }

  // 초기 상태 설정 (수정화면 포함)
  updateLinkBox();

  // 라디오 변경 시
  $radios.on('change', function () {
    // 없음으로 바뀔 때는 인풋 값 초기화
    if (this.id === 'link-none' && this.checked) {
      $input.val('');
    }
    updateLinkBox();
  });
});



/* ------------------------------------------------------------------------
* 제이쿼리 datetimepicker
* --------------------------------------------------------------------- */
$(function(){
  $.datetimepicker.setLocale('kr');
  $('.datetimepicker').datetimepicker({
    timepicker:false,
    format:'Y-m-d',
  });

  // 시작일, 종료일 적용 버전
  let startDate = $('.start-date').datetimepicker();
  let endDate = $('.end-date').datetimepicker();
  startDate.datetimepicker({
      format: 'Y-m-d H:i',
      scrollMonth: false,
      scrollInput: false,
      onShow: function (ct, $i) {
          this.setOptions({
              maxDate: endDate.val() ? endDate.val() : false
          })
      },
      onClose: function (ct, $i) {
          if (!endDate.val()) {
              endDate.val($i.val());
          }
      }
  });

  endDate.datetimepicker({
      format: 'Y-m-d H:i',
      scrollMonth: false,
      scrollInput: false,
      onShow: function (ct) {
          this.setOptions({
              minDate: startDate.val() ? startDate.val() : false
          })
      },
      onClose: function (ct, $i) {
          if (!startDate.val()) {
              startDate.val($i.val());
          }
      }
  });
})

/* ------------------------------------------------------------------------
 * 소속(학교) 자동완성 검색
 * - 입력 시 결과박스 열기/닫기
 * - 바깥 클릭 시 닫기
 * - '선택' 버튼 클릭 시 소속/지역 인풋 값 채우기
 * - 결과박스가 열릴 때 data-field="org-name"에 open 클래스 추가
 * --------------------------------------------------------------------- */
$(function () {

  /* -------------------------------
   * 1) 입력 / 포커스 시 결과 박스 표시
   * ------------------------------- */
  $(document).on('input focus', '.form-conts input.krds-input', function () {
    const $input     = $(this);
    const $formConts = $input.closest('.form-conts');
    const $box       = $formConts.find('.search-result-box');

    if (!$box.length) return;

    const val = $input.val().trim();

    if (val.length > 0) {
      // 결과 박스 열기
      $box.css('display', 'block');

      // ★ data-field="org-name" open 클래스 추가
      $('[data-field="org-name"]').addClass('open');
    } else {
      // 닫기
      $box.css('display', 'none');

      // ★ open 클래스 제거
      $('[data-field="org-name"]').removeClass('open');
    }
  });

  /* -------------------------------
   * 2) form-conts 밖 클릭 시 모두 닫기
   * ------------------------------- */
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.form-conts').length) {
      $('.search-result-box').css('display', 'none');
      $('[data-field="org-name"]').removeClass('open');
    }
  });

  /* -------------------------------
   * 3) 리스트에서 '선택' 클릭 시
   * ------------------------------- */
  $(document).on('click', '.search-result-box .select-btn', function () {
    const $btn       = $(this);
    const $li        = $btn.closest('li');
    const $formConts = $btn.closest('.form-conts');

    // 선택된 항목 정보
    const orgName   = $li.find('.name .value').text().trim();
    const orgRegion = $li.find('.team .value').text().trim();

    // 3-1) 소속 input 채우기
    const $orgInput = $formConts.find('input.krds-input').first();
    if ($orgInput.length) $orgInput.val(orgName);

    // 3-2) 지역 input 채우기
    const $currentBox  = $formConts.closest('.form-box');
    const $regionInput = $currentBox.next('.form-box').find('input.krds-input').first();
    if ($regionInput.length) $regionInput.val(orgRegion);

    // 3-3) 결과 박스 닫기
    $formConts.find('.search-result-box').css('display', 'none');

    // 3-4) open 클래스 제거
    $('[data-field="org-name"]').removeClass('open');
  });

});

/* ------------------------------------------------------------------------
 * 비밀번호 보기 토글
 * --------------------------------------------------------------------- */
$(function () {
  $(document).on('click', '.btn-ico-wrap .krds-btn', function () {
    const $btn   = $(this);
    const $wrap  = $btn.closest('.btn-ico-wrap');
    const $input = $wrap.find('input.krds-input');
    const $icon  = $btn.find('.svg-icon');
    const $sr    = $btn.find('.sr-only');

    if (!$input.length) return;

    const isPassword = $input.attr('type') === 'password';

    if (isPassword) {
      // 비밀번호 → 텍스트로 변경
      $input.attr('type', 'text');
      $icon
        .removeClass('ico-pw-visible')
        .addClass('ico-pw-visible-on');
      if ($sr.length) {
        $sr.text('숨기기');
      }
    } else {
      // 텍스트 → 비밀번호로 변경
      $input.attr('type', 'password');
      $icon
        .removeClass('ico-pw-visible-on')
        .addClass('ico-pw-visible');
      if ($sr.length) {
        $sr.text('보기');
      }
    }
  });
});

/* ------------------------------------------------------------------------
 * 비밀번호 / 비밀번호 확인 - 일치 여부 체크
 *  - data-field="password"
 *  - data-field="password-confirm"
 *  - data-role="pw-alert"
 *  - 초기 value 값이 있는 상태에서도 불일치 시 바로 에러 show
 * --------------------------------------------------------------------- */
$(function () {

  const $pw       = $('[data-field="password"]');           // 비밀번호
  const $pwCheck  = $('[data-field="password-confirm"]');   // 비밀번호 확인
  const $alertBox = $('[data-role="pw-alert"]');            // 에러 메시지 영역(랩퍼)

  function checkPasswordMatch() {
    const pw  = $pw.val()?.trim() ?? '';
    const pw2 = $pwCheck.val()?.trim() ?? '';

    // 둘 다 값이 있을 때만 검사
    if (pw && pw2) {
      if (pw !== pw2) {
        $alertBox.show();   // 불일치 → 에러 표시
      } else {
        $alertBox.hide();   // 일치 → 에러 숨김
      }
    } else {
      // 둘 중 하나라도 비어있으면 에러 숨김
      $alertBox.hide();
    }
  }

  // 입력 변경 시 실시간 체크
  $pw.on('input', checkPasswordMatch);
  $pwCheck.on('input', checkPasswordMatch);

  // ⭐ 페이지 최초 로딩 시 기존 value 기반으로 즉시 체크
  checkPasswordMatch();

});


/* ------------------------------------------------------------------------
 * 제한없음
 * --------------------------------------------------------------------- */
$(function () {

  function updateApprovalGroup($group) {
    const $checkbox = $group.find('.approval-check');
    const $number   = $group.find('.approval-number');

    if ($checkbox.is(':checked')) {
      $number
        .prop('disabled', true)
        .addClass('disabled')
        .val(9999);
    } else {
      $number
        .prop('disabled', false)
        .removeClass('disabled')
        .val(0);
    }
  }

  // 초기 상태 반영
  $('.approval-group').each(function () {
    updateApprovalGroup($(this));
  });

  // 체크박스 이벤트
  $(document).on('change', '.approval-check', function () {
    const $group = $(this).closest('.approval-group');
    updateApprovalGroup($group);
  });

});


/* ------------------------------------------------------------------------
 * 운영 프로그램 설정 페이지
 * - 사업별 승인개수 제어
 * - 전 사업 토글 연동
 * - 변경 감지 → .active / action-section 표시
 * --------------------------------------------------------------------- */
$(function () {
  const $page = $('main.page-edit');
  if (!$page.length) return; // 다른 페이지엔 영향 X

  /* ----------------------------------------
   * 액션 영역 (우측) — 운영페이지 전용 클래스
   * ------------------------------------- */
  const $actionSection = $page.find('.op-action');
  const $actionMsg     = $page.find('.op-action-msg');
  const $actionBtn     = $page.find('[data-role="save-settings"]');

  // 초기 숨김 / 비활성
  $actionMsg.hide();
  $actionBtn.prop('disabled', true);

  /* ----------------------------------------
   * 1) 사업별 승인개수 그룹 제어
   * ------------------------------------- */
  function updateApprovalGroup($group) {
    const $checkbox = $group.find('.approval-check');
    const $number   = $group.find('.approval-number');

    if (!$checkbox.length || !$number.length) return;

    if ($checkbox.is(':checked')) {
      // 제한없음 상태
      $number
        .prop('disabled', true)
        .addClass('disabled')
        .val(9999);
    } else {
      // 제한 있음
      $number
        .prop('disabled', false)
        .removeClass('disabled')
        .val(10);
    }
  }

  // 초기 상태 적용
  $page.find('.approval-group').each(function () {
    updateApprovalGroup($(this));
  });

  /* ----------------------------------------
   * 2) 변경 감지 초기값 저장
   * ------------------------------------- */
  const $fields = $page.find('input, select, textarea')
    .not('[type="hidden"]')
    .not('[data-ignore-change="true"]');

  $fields.each(function () {
    const $f = $(this);
    if ($f.is(':checkbox,:radio')) {
      $f.data('initial-checked', $f.prop('checked'));
    } else {
      $f.data('initial-value', $f.val());
    }
  });

  function isFieldDirty($f) {
    if ($f.is(':checkbox,:radio')) {
      return $f.prop('checked') !== $f.data('initial-checked');
    }
    return $f.val() !== $f.data('initial-value');
  }

  function updateActionSection() {
    let anyDirty = false;

    $fields.each(function () {
      if (isFieldDirty($(this))) {
        anyDirty = true;
        return false;
      }
    });

    if (anyDirty) {
      $actionSection.addClass('is-dirty');
      $actionMsg.show();
      $actionBtn.prop('disabled', false);
    } else {
      $actionSection.removeClass('is-dirty');
      $actionMsg.hide();
      $actionBtn.prop('disabled', true);
    }
  }

  function markDirty($field) {
    if (!$field.length) return;
    $field.toggleClass('active', isFieldDirty($field));
    updateActionSection();
  }

  /* ----------------------------------------
   * 3) 개별 승인 체크박스 이벤트
   * ------------------------------------- */
  $page.on('change', '.approval-check', function () {
    const $group  = $(this).closest('.approval-group');
    const $number = $group.find('.approval-number');

    updateApprovalGroup($group);

    markDirty($(this));
    markDirty($number);
  });

  /* ----------------------------------------
   * 4) 전 사업 토글 → 전체 제어
   * ------------------------------------- */
  const $globalToggle = $page.find('[data-role="approval-toggle-all"] input[type="checkbox"]');

  $globalToggle.on('change', function () {
    const checked = $(this).is(':checked');

    // 전체 .approval-check 동기화
    $page.find('.approval-check').each(function () {
      $(this).prop('checked', checked).trigger('change');
    });

    markDirty($(this));
  });

  /* ----------------------------------------
   * 5) 일반 필드 변경 감지
   * ------------------------------------- */
  $fields.on('change input', function () {
    markDirty($(this));
  });

  updateActionSection();
});


/* ------------------------------------------------------------------------
 * 답변 등록/수정/삭제 동작 — 삭제는 공용 모달로 확인
 * --------------------------------------------------------------------- */
$(function () {

  // 🔹 현재 어떤 answer-area를 삭제하려고 하는지 임시로 기억하는 전역 변수
  let answerDeleteTarget = null;

  $('.answer-area').each(function () {
    const $wrap       = $(this);
    const $empty      = $wrap.find('.answer-empty');
    const $form       = $wrap.find('.answer-form');
    const $text       = $wrap.find('.answer-text');
    const $dateLabel  = $wrap.find('.answer-date-label');
    const $dateInput  = $wrap.find('.answer-date');
    const $counter    = $wrap.find('.count-current');

    // 버튼들은 answer-area 바로 아래의 page-btn-wrap 안에 있음
    const $footer     = $wrap.nextAll('.page-btn-wrap').first();
    const $btnCancel  = $footer.find('.btn-answer-cancel');
    const $btnSubmit  = $footer.find('.btn-answer-submit');
    const $btnDelete  = $footer.find('.btn-answer-delete');
    const $btnEdit    = $footer.find('.btn-answer-edit');
    const $btnStart   = $wrap.find('.btn-answer-start'); // 처음 “답변등록” 버튼

    const STATE_EMPTY = 'empty';
    const STATE_EDIT  = 'edit';
    const STATE_VIEW  = 'view';

    /* ----------------------------- 상태 전환 ----------------------------- */
    function setState(state) {
      $wrap.attr('data-answer-state', state);

      if (state === STATE_EMPTY) {
        $empty.show();
        $form.hide();

        $btnStart.show();
        $btnCancel.hide();
        $btnSubmit.hide();
        $btnDelete.hide();
        $btnEdit.hide();

        $text.prop('disabled', false).removeClass('answer-txt').val('');
        $dateLabel.show();
        $dateInput.prop('disabled', false).removeClass('data-txt').val('');

        updateCount();
        $wrap.data('has-answer', false);
      }

      if (state === STATE_EDIT) {
        $empty.hide();
        $form.show();

        $btnStart.hide();
        $btnCancel.show();
        $btnSubmit.show().text($wrap.data('has-answer') ? '수정등록' : '답변등록');
        $btnDelete.toggle($wrap.data('has-answer') === true);
        $btnEdit.hide();

        $text.prop('disabled', false).removeClass('answer-txt');
        $dateLabel.show();
        $dateInput.prop('disabled', false).removeClass('data-txt');

        // 🔹 새 답변을 처음 작성할 때만 현재 시간 자동 입력
        if ($wrap.data('has-answer') !== true && !$.trim($dateInput.val())) {
          $dateInput.val(getNow());
        }
      }

      if (state === STATE_VIEW) {
        $empty.hide();
        $form.show();

        $btnStart.hide();
        $btnCancel.hide();
        $btnSubmit.hide();
        $btnDelete.show();
        $btnEdit.show();

        $text.prop('disabled', true).addClass('answer-txt');
        $dateLabel.hide();
        $dateInput.prop('disabled', true).addClass('data-txt');

        $wrap.data('has-answer', true);
      }
    }

    /* ----------------------------- 글자수 ----------------------------- */
    function updateCount() {
      $counter.text($text.val().length);
    }
    $text.on('input', updateCount);

    /* ----------------------------- 현재 시간 문자열 ----------------------------- */
    function getNow() {
      const n = new Date();
      return (
        `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(
          n.getDate()
        ).padStart(2, '0')} ` +
        `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(
          2,
          '0'
        )}`
      );
    }

    /* ----------------------------- 초기 상태 ----------------------------- */
    const hasInitial = $.trim($text.val()) !== '';
    $wrap.data('has-answer', hasInitial);

    if (hasInitial) {
      if (!$.trim($dateInput.val())) $dateInput.val(getNow());
      setState(STATE_VIEW);
    } else {
      setState(STATE_EMPTY);
    }

    /* ----------------------------- 이벤트 바인딩 ----------------------------- */

    // 1) 처음 “답변등록”
    $btnStart.on('click', () => setState(STATE_EDIT));

    // 2) 취소
    $btnCancel.on('click', () => {
      setState($wrap.data('has-answer') ? STATE_VIEW : STATE_EMPTY);
    });

    // 3) 등록 / 수정등록
    $btnSubmit.on('click', () => {
      if (!$.trim($text.val())) {
        alert('답변 내용을 입력해주세요.');
        $text.focus();
        return;
      }
      if (!$.trim($dateInput.val())) $dateInput.val(getNow());
      setState(STATE_VIEW);
    });

    // 4) “답변수정” → 편집 모드로
    $btnEdit.on('click', () => setState(STATE_EDIT));

    // 5) “답변삭제” 클릭
    //    - 여기서는 모달만 띄우고, 어떤 답변을 삭제하려는지만 기억해 둔다.
    $btnDelete.on('click', function () {
      answerDeleteTarget = $wrap; // 이 answer-area가 삭제 대상
      // 모달 열기는 기존 KRDS .open-modal 스크립트가 처리 (우리는 건드리지 않음)
    });

    // 6) 실제 삭제(모달에서 확인 눌렀을 때)를 위한 커스텀 이벤트
    $wrap.on('answer:deleteConfirmed', function () {
      setState(STATE_EMPTY);
    });
  });

  /* ----------------------------------------------------------------------
   * 공용 삭제 확인 모달의 "삭제" 버튼
   *  - 어떤 answer-area에서 삭제 요청했는지 전역 변수로 꺼내 처리
   * ------------------------------------------------------------------- */
  $(document).on('click', '.modal-confirm-delete', function () {
    if (answerDeleteTarget && answerDeleteTarget.length) {
      answerDeleteTarget.trigger('answer:deleteConfirmed');
    }
    answerDeleteTarget = null; // 사용 후 초기화

    // 모달 닫기 (KRDS 모달 스크립트 사용)
    const $modal = $(this).closest('.krds-modal');
    if (window.krds_modal && typeof krds_modal.closeModal === 'function') {
      krds_modal.closeModal($modal.attr('id'));
    } else {
      // 혹시 몰라서 fallback
      $modal.removeClass('in shown');
    }
  });
});
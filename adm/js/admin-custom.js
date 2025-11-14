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
      format:'Y-m-d H:i'
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
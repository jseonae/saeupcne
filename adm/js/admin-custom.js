
  // 문서가 준비되면 header와 footer를 불러오기
  $(function() {
    $("#header").load("/adm/tmpl/header.html");
    $("#footer").load("/adm/tmpl/footer.html");
    $("#pagination").load("/adm/tmpl/pagination.html");
  });


  $(function () {
  // 전체선택 체크박스 클릭 시
  $("#checkAll").on("change", function () {
    $(".checkGroup").prop("checked", $(this).prop("checked"));
  });

  // 개별 체크박스가 변경되면 전체선택 상태 갱신
  $(".checkGroup").on("change", function () {
    const all = $(".checkGroup").length;
    const checked = $(".checkGroup:checked").length;
    $("#checkAll").prop("checked", all === checked);
  });
});

$(function () {
  // prism toolbar title 추가
  if (typeof Prism !== "undefined") {
    Prism.hooks.add("complete", function (env) {
      const toolbar = env.element.closest(".code-toolbar");
      if (!toolbar) return;

      const preTag = toolbar.querySelector("pre");
      if (!preTag) return;

      // data-title 읽기
      const dataTitle = preTag.getAttribute("data-title");
      const existingTitle = toolbar.querySelector(".toolbar-title");

      // 중복 방지 (이미 있으면 다시 안 추가)
      if (!existingTitle) {
        const titleTag = document.createElement("h5");
        titleTag.classList.add("toolbar-title");
        titleTag.textContent = dataTitle ? dataTitle : "코드 예시";
        toolbar.prepend(titleTag);
      }
    });
  }
});

//input text 천 단위 자동 콤마
document.addEventListener('keyup', function(e) {
  if (e.target.classList.contains('number-input')) {
    let value = e.target.value.replace(/[^\d]/g, '');
    e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

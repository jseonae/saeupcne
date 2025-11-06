
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
  // 문서가 준비되면 header와 footer를 불러오기
  $(function() {
    $("#header").load("../tmpl/header.html");
    $("#header_sch_adm").load("../tmpl/header_sch_adm.html");
    $("#header_president").load("../tmpl/header_president.html");
    $("#footer").load("../tmpl/footer.html");
    $("#pagination").load("../tmpl/pagination.html");
  });

 
   /*------------ 체크박스 ------------*/
    $(document).ready(function () {

    // 🔹 전체 선택 클릭
    $('#checkAll').on('change', function () {
        const isChecked = $(this).is(':checked');
        $('.checkGroup').prop('checked', isChecked);
    });

    // 🔹 개별 체크박스 클릭 시 전체 선택 상태 업데이트
    $('.checkGroup').on('change', function () {
        const total = $('.checkGroup').length;
        const checked = $('.checkGroup:checked').length;

        $('#checkAll').prop('checked', total === checked);
    });

});


/*------------ 탭 ------------*/
$(document).ready(function () {

    $('.krds-tab-area .tab li').on('click', function () {
        const tabId = $(this).attr('id');            // 예: tab_login_01
        const panelId = $(this).attr('aria-controls'); // 예: panel_login_01

        // 1) 모든 탭에서 active 제거 + aria-selected false
        $(this).siblings('li').removeClass('active').attr('aria-selected', 'false');

        // 2) 현재 클릭된 탭 active + aria-selected true
        $(this).addClass('active').attr('aria-selected', 'true');

        // 3) 모든 패널 숨김
        $('.tab-conts').removeClass('active');

        // 4) 연결된 패널만 활성화
        $('#' + panelId).addClass('active');
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const toggleArea = document.getElementById("toggleArea");
    const icon = toggleBtn.querySelector(".svg-icon");

    toggleBtn.addEventListener("click", () => {
        const expanded = toggleBtn.getAttribute("aria-expanded") === "true";

        // aria 상태 변경
        toggleBtn.setAttribute("aria-expanded", !expanded);

        // 접힘/펼침 클래스 토글
        toggleArea.classList.toggle("collapsed");
        myInfoCard.classList.toggle("collapsed"); // ← 추가

        // 아이콘 방향 변경 (up ↔ down)
        icon.classList.toggle("down", expanded);
        icon.classList.toggle("up", !expanded);
    });
});
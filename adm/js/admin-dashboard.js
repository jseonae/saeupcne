$(function () {
  const tableConfigs = [
    {
      target: '#application-list',
      file: '../html/application-admin-all-list.html',
      selector: 'table[data-table="application-list"]'
    },
    {
      target: '#report-list',
      file: '../html/report-admin-list.html',
      selector: 'table[data-table="report-list"]'
    }
  ];

  tableConfigs.forEach(cfg => {
    const $target = $(cfg.target);
    if (!$target.length) return;

    $target.load(`${cfg.file} ${cfg.selector}`, function (res, status) {
      if (status !== 'success') {
        console.warn('테이블 로드 실패:', cfg.file, status);
        return;
      }

      const $table = $target.find('table');
      const $rows = $table.find('tbody tr');

      // 🔹 1) tbody에서 6줄 이후를 제거
      $rows.slice(5).remove();

      $table.find('colgroup').each(function () {
        $(this).find('col:first').remove();
      });

      $table.find('thead tr').each(function () {
        $(this).find('th:first').remove();
      });

      $table.find('tbody tr').each(function () {
        $(this).find('td:first').remove();
      });

    });
  });
});
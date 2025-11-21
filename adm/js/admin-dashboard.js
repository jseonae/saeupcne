/* ------------------------------
 * chart.js + HTML Legend + 클릭 토글
 * ------------------------------ */
$(function () {

  /* ------------------------------
   * 색상 세트
   * ------------------------------ */
  const COLORS = {
    program: ['#8979ff', '#ff928a', '#3cc3df', '#ffae4c', '#537ff1'],
    approve: '#3FA654',
    reject:  '#8A949E'
  };

  /* ------------------------------
   * HTML Legend 생성 + 클릭 토글
   * ------------------------------ */

  // 1) labels 기반 (도넛 등: 각 label = 한 조각)
  function createLegendFromLabels(chart, targetId) {
    const $box = $('#' + targetId);
    if (!$box.length) return;

    const labels = chart.data.labels;
    const colors = chart.data.datasets[0].backgroundColor;

    let html = '';
    labels.forEach((label, i) => {
      const color = Array.isArray(colors) ? colors[i] : colors;
      html += `
        <li class="legend-item" data-index="${i}">
          <i class="legend-dot" style="background:${color}"></i>
          <span>${label}</span>
        </li>
      `;
    });

    $box.html(html);

    // 클릭 시 해당 조각 show/hide
    $box.off('click').on('click', '.legend-item', function () {
      const index = $(this).data('index');

      // Chart.js v3+ : getDataVisibility / toggleDataVisibility 사용
      const currentlyVisible = chart.getDataVisibility(index);
      chart.toggleDataVisibility(index); // visible ↔ hidden
      chart.update();

      $(this).toggleClass('is-hidden', currentlyVisible); // 숨길 때 is-hidden 추가
    });
  }

  // 2) dataset 기반 (막대 그래프: 각 legend = 한 dataset)
  function createLegendFromDatasets(chart, targetId) {
    const $box = $('#' + targetId);
    if (!$box.length) return;

    let html = '';
    chart.data.datasets.forEach((ds, i) => {
      const bg = ds.backgroundColor;
      const color = Array.isArray(bg) ? bg[0] : bg;

      html += `
        <li class="legend-item" data-dataset="${i}">
          <i class="legend-dot" style="background:${color}"></i>
          <span>${ds.label}</span>
        </li>
      `;
    });

    $box.html(html);

    // 클릭 시 해당 dataset show/hide
    $box.off('click').on('click', '.legend-item', function () {
      const datasetIndex = $(this).data('dataset');

      const visible = chart.isDatasetVisible(datasetIndex);
      chart.setDatasetVisibility(datasetIndex, !visible);
      chart.update();

      $(this).toggleClass('is-hidden', visible);
    });
  }


  /* ------------------------------
   * 1) 사업별 현황 (도넛)
   * ------------------------------ */
  const ctxProgram = document.getElementById('chart-program');

  if (ctxProgram) {
    const chartProgram = new Chart(ctxProgram, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      data: {
        labels: ['선택사업', '선택 외 사업', '개방형 사업', '특교·추경신규 사업', '자율사업'],
        datasets: [{
          data: [52, 20, 10, 8, 5],        // 샘플 비율
          backgroundColor: COLORS.program,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '48%', // 도넛 두께
        plugins: {
          legend: { display: false }, // 기본 legend 끔
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value) => `${value}%`
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const label = ctx.label || '';
                const value = ctx.parsed;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });

    // 🔥 HTML legend 생성 + 토글
    createLegendFromLabels(chartProgram, 'legend-program');
  }


  /* ------------------------------
   * 2) 연도별 현황 (막대)
   * ------------------------------ */
  const ctxYear = document.getElementById('chart-year');

  if (ctxYear) {
    const chartYear = new Chart(ctxYear, {
      type: 'bar',
      data: {
        labels: ['2022', '2023', '2024', '2025'],
        datasets: [
          {
            label: '선택사업',
            data: [5, 4, 5, 6],
            backgroundColor: COLORS.program[0]
          },
          {
            label: '선택 외 사업',
            data: [4, 5, 4, 5],
            backgroundColor: COLORS.program[1]
          },
          {
            label: '개방형 사업',
            data: [3, 3, 4, 4],
            backgroundColor: COLORS.program[2]
          },
          {
            label: '특교·추경신규 사업',
            data: [2, 2, 3, 4],
            backgroundColor: COLORS.program[3]
          },
          {
            label: '자율사업',
            data: [1, 2, 2, 2],
            backgroundColor: COLORS.program[4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 12 },
              color: '#464c53'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#e6e8ea'
            },
            ticks: {
              stepSize: 2,
              font: { size: 11 },
              color: '#8a949e'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });

    // 🔥 HTML legend 생성 + 토글
    createLegendFromDatasets(chartYear, 'legend-year');
  }


  /* ------------------------------
   * 3) 진행 현황 (막대)
   * ------------------------------ */
  const ctxProgress = document.getElementById('chart-progress');

  if (ctxProgress) {
    const chartProgress = new Chart(ctxProgress, {
      type: 'bar',
      data: {
        labels: ['선택사업', '선택 외 사업', '개방형 사업', '특교·추경신규 사업', '자율사업'],
        datasets: [
          {
            label: '승인',
            data: [38, 14, 16, 29, 18],
            backgroundColor: COLORS.approve,
          },
          {
            label: '미승인',
            data: [4, 5, 20, 10, 10],
            backgroundColor: COLORS.reject,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
            grid: { display: false },
            ticks: {
              font: { size: 12 },
              color: '#464c53'
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: '#e6e8ea' },
            ticks: {
              stepSize: 10,
              font: { size: 11 },
              color: '#8a949e'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });

    // 🔥 HTML legend 생성 + 토글
    createLegendFromDatasets(chartProgress, 'legend-progress');
  }
});




/* ------------------------------
* table include
* ------------------------------ */

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
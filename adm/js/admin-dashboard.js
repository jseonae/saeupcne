// Dashboard Admin Scripts

(function() {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', function() {
    initLogoutButton();
    initStatusSelects();
    updateCurrentDate();
  });

  /**
   * Initialize Logout Button
   */
  function initLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        if (confirm('로그아웃 하시겠습니까?')) {
          // Logout logic here
          window.location.href = '/login.html';
        }
      });
    }
  }

  /**
   * Initialize Status Selects
   */
  function initStatusSelects() {
    const statusSelects = document.querySelectorAll('.status-select');
    
    statusSelects.forEach(select => {
      select.addEventListener('change', function() {
        console.log('Status changed to:', this.value);
        // Update status logic here
      });
    });
  }

  /**
   * Update Current Date
   */
  function updateCurrentDate() {
    const dateText = document.querySelector('.date-text');
    
    if (dateText) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const date = String(today.getDate()).padStart(2, '0');
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = days[today.getDay()];
      
      // Uncomment to use real date
      // dateText.textContent = `${year}.${month}.${date}.${dayName}`;
    }
  }

})();

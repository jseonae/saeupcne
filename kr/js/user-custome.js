// Header JavaScript - 순수 Vanilla JS

document.addEventListener('DOMContentLoaded', function() {
    console.log('Header initialized');

    // GNB Menu Items
    const gnbItems = document.querySelectorAll('.gnb-item');
    const depthColumns = document.querySelectorAll('.depth-column');
    
    // GNB 메뉴 호버 시 해당 컬럼 하이라이트
    gnbItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            // 모든 컬럼의 active 클래스 제거
            depthColumns.forEach(col => {
                const title = col.querySelector('.depth-title');
                if (!title.classList.contains('active')) {
                    title.style.borderColor = '#cdd1d5';
                    title.style.color = '#464c53';
                }
            });
            
            // 현재 호버된 메뉴에 해당하는 컬럼 하이라이트
            if (depthColumns[index]) {
                const title = depthColumns[index].querySelector('.depth-title');
                if (!title.classList.contains('active')) {
                    title.style.borderColor = '#256ef4';
                    title.style.color = '#0b50d0';
                }
            }
        });

        item.addEventListener('mouseleave', function() {
            // 호버 제거 시 원래 상태로 복귀
            depthColumns.forEach(col => {
                const title = col.querySelector('.depth-title');
                if (!title.classList.contains('active')) {
                    title.style.borderColor = '#cdd1d5';
                    title.style.color = '#464c53';
                }
            });
        });

        // GNB 클릭 이벤트
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 depth title의 active 제거
            document.querySelectorAll('.depth-title').forEach(title => {
                title.classList.remove('active');
            });
            
            // 클릭된 메뉴에 해당하는 depth title에 active 추가
            if (depthColumns[index]) {
                const title = depthColumns[index].querySelector('.depth-title');
                title.classList.add('active');
            }
            
            console.log('GNB 클릭:', item.textContent);
        });
    });

    // Depth Title 클릭 이벤트
    const depthTitles = document.querySelectorAll('.depth-title');
    depthTitles.forEach(title => {
        title.addEventListener('click', function() {
            // 모든 title의 active 제거
            depthTitles.forEach(t => t.classList.remove('active'));
            
            // 클릭된 title에 active 추가
            this.classList.add('active');
            
            console.log('Depth Title 클릭:', this.textContent);
        });
    });

    // Depth Item 클릭 이벤트
    const depthItems = document.querySelectorAll('.depth-item');
    depthItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 같은 컬럼 내의 모든 아이템에서 active 제거
            const column = this.closest('.depth-column');
            column.querySelectorAll('.depth-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // 클릭된 아이템에 active 추가
            this.classList.add('active');
            
            console.log('Depth Item 클릭:', this.textContent);
        });
    });

    // Utility 메뉴 클릭 이벤트
    const utilityItems = document.querySelectorAll('.utility-item');
    utilityItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case '마이페이지':
                    console.log('마이페이지로 이동');
                    // window.location.href = '/mypage';
                    break;
                case '정보수정':
                    console.log('정보수정 페이지로 이동');
                    // window.location.href = '/edit-info';
                    break;
                case '로그아웃':
                    if (confirm('로그아웃 하시겠습니까?')) {
                        console.log('로그아웃 처리');
                        // window.location.href = '/logout';
                    }
                    break;
            }
        });
    });

    // Logo 클릭 이벤트
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', function() {
        console.log('홈으로 이동');
        // window.location.href = '/';
    });
    logo.style.cursor = 'pointer';

    // 키보드 네비게이션 지원
    document.addEventListener('keydown', function(e) {
        const focusedElement = document.activeElement;
        
        // Tab 키로 네비게이션
        if (e.key === 'Enter' || e.key === ' ') {
            if (focusedElement.classList.contains('gnb-item') ||
                focusedElement.classList.contains('depth-title') ||
                focusedElement.classList.contains('depth-item') ||
                focusedElement.classList.contains('utility-item')) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });

    // 스크롤 시 헤더 그림자 효과
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (currentScroll > 10) {
            header.style.boxShadow = '0px 2px 8px 0px rgba(0, 0, 0, 0.1), 0px 8px 20px 0px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0px 0px 2px 0px rgba(0, 0, 0, 0.08), 0px 8px 16px 0px rgba(0, 0, 0, 0.12)';
        }
        
        lastScroll = currentScroll;
    });

    // 반응형: 모바일 메뉴 토글 (필요시)
    function handleResize() {
        const width = window.innerWidth;
        
        if (width < 768) {
            console.log('모바일 뷰');
            // 모바일 메뉴 처리
        } else if (width < 1024) {
            console.log('태블릿 뷰');
        } else {
            console.log('데스크톱 뷰');
        }
    }

    // 초기 실행
    handleResize();

    // 윈도우 리사이즈 이벤트
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });

    // 현재 페이지 URL에 따른 active 상태 설정
    function setActiveMenuByURL() {
        const currentPath = window.location.pathname;
        
        // URL에 따라 적절한 메뉴 아이템을 active로 설정
        // 예: '/business-application' -> '사업신청' 메뉴 활성화
        
        // 이 부분은 실제 프로젝트의 URL 구조에 맞게 수정 필요
        console.log('현재 경로:', currentPath);
    }

    setActiveMenuByURL();

    // Depth 메뉴 애니메이션
    const depthMenu = document.querySelector('.depth-menu');
    
    // 페이지 로드 시 depth 메뉴 페이드 인
    setTimeout(() => {
        depthMenu.style.opacity = '1';
    }, 100);

    // GNB 아이템 호버 시 하위 메뉴 표시 효과
    gnbItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            if (depthColumns[index]) {
                depthColumns[index].style.transform = 'translateY(-2px)';
                depthColumns[index].style.transition = 'transform 0.2s ease';
            }
        });

        item.addEventListener('mouseleave', function() {
            if (depthColumns[index]) {
                depthColumns[index].style.transform = 'translateY(0)';
            }
        });
    });

    // Utility 함수: 특정 메뉴로 이동
    window.navigateToMenu = function(menuName, subMenuName = null) {
        // GNB 메뉴 찾기
        const gnbItem = Array.from(gnbItems).find(item => 
            item.textContent.trim() === menuName
        );
        
        if (gnbItem) {
            gnbItem.click();
            
            // 서브메뉴가 지정된 경우
            if (subMenuName) {
                setTimeout(() => {
                    const depthItem = Array.from(depthItems).find(item => 
                        item.textContent.trim() === subMenuName
                    );
                    if (depthItem) {
                        depthItem.click();
                    }
                }, 100);
            }
        }
    };

    // Utility 함수: 현재 활성화된 메뉴 정보 가져오기
    window.getActiveMenu = function() {
        const activeTitle = document.querySelector('.depth-title.active');
        const activeItem = document.querySelector('.depth-item.active');
        
        return {
            mainMenu: activeTitle ? activeTitle.textContent.trim() : null,
            subMenu: activeItem ? activeItem.textContent.trim() : null
        };
    };

    // 디버깅용: 콘솔에 현재 활성 메뉴 출력
    console.log('초기 활성 메뉴:', window.getActiveMenu());
});

// 외부에서 사용 가능한 헤더 API
window.HeaderAPI = {
    // 특정 메뉴로 이동
    navigateTo: function(mainMenu, subMenu) {
        window.navigateToMenu(mainMenu, subMenu);
    },
    
    // 현재 활성 메뉴 정보
    getActive: function() {
        return window.getActiveMenu();
    },
    
    // 로그아웃
    logout: function() {
        if (confirm('로그아웃 하시겠습니까?')) {
            console.log('로그아웃 처리');
            // 실제 로그아웃 로직 구현
        }
    }
};
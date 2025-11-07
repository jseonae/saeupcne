# 라이브 서버 실행 가이드

## 문제 해결 완료 ✅

404 오류 문제를 해결했습니다. 다음 항목들이 수정되었습니다:

### 수정 사항
1. **JavaScript 템플릿 로드 경로 수정** (`/adm/js/admin-custom.js`)
   - 절대 경로(`/adm/tmpl/header.html`) → 상대 경로(`../tmpl/header.html`)

2. **Favicon 경로 수정** (HTML 파일)
   - 상대 경로(`./favicon.ico`) → 절대 경로(`/favicon.ico`)

3. **VS Code Live Server 설정 파일 생성** (`.vscode/settings.json`)
   - `saeupcne` 디렉토리를 루트로 설정

4. **빈 favicon.ico 파일 생성**
   - 404 오류 방지

## 올바른 실행 방법

### 방법 1: VS Code에서 실행 (권장)

1. VS Code에서 **`saeupcne` 폴더**를 엽니다.
   ```
   File → Open Folder → saeupcne_uiux_publishing_v1/saeupcne 선택
   ```

2. HTML 파일을 열고 우클릭 → **"Open with Live Server"** 선택

3. 브라우저에서 자동으로 열립니다:
   ```
   http://localhost:5500/adm/html/application-admin-all-list.html
   ```

### 방법 2: 터미널에서 실행

```bash
cd /mnt/d/work/projects/nsaeup/saeupcne_uiux_publishing_v1/saeupcne
python3 -m http.server 5500
```

그리고 브라우저에서:
```
http://localhost:5500/adm/html/application-admin-all-list.html
```

## 디렉토리 구조

```
saeupcne/                          ← 이 폴더를 루트로 열어야 함!
├── .vscode/
│   └── settings.json             (Live Server 설정)
├── adm/
│   ├── html/                     (관리자 HTML 파일)
│   ├── js/
│   │   └── admin-custom.js       (템플릿 로드 스크립트)
│   ├── css/
│   └── tmpl/                     (헤더/푸터 템플릿)
│       ├── header.html
│       ├── footer.html
│       └── pagination.html
├── kr/
│   ├── html/                     (사용자 HTML 파일)
│   └── tmpl/
├── style/
│   └── resources/
│       ├── css/
│       │   └── krds-custom.css   (SVG 아이콘 CSS)
│       └── img/                  (SVG 아이콘 파일들)
├── krds/                         (KRDS 디자인 시스템)
└── favicon.ico                   (파비콘)
```

## 주의사항

❌ **잘못된 방법**: `saeupcne_uiux_publishing_v1` 폴더를 루트로 열면 안 됩니다!
```
File → Open Folder → saeupcne_uiux_publishing_v1 (X)
```

✅ **올바른 방법**: `saeupcne` 폴더를 루트로 열어야 합니다!
```
File → Open Folder → saeupcne_uiux_publishing_v1/saeupcne (O)
```

## 참조 경로 설명

### CSS 절대 경로 (krds-custom.css)
```css
/* SVG 아이콘 - 루트(/)부터 시작 */
.svg-icon.ico-docu {
    -webkit-mask-image: url(/style/resources/img/ico_document.svg);
}
```

### JavaScript 상대 경로 (admin-custom.js)
```javascript
/* 템플릿 로드 - HTML 파일 기준 상대 경로 */
function initPartials() {
    $('#header').load('../tmpl/header.html');    // /adm/html/ → /adm/tmpl/
    $('#footer').load('../tmpl/footer.html');
    $('#pagination').load('../tmpl/pagination.html');
}
```

## 문제 해결

만약 여전히 404 오류가 발생한다면:

1. **브라우저 캐시 삭제**: Ctrl+Shift+Del → 캐시 삭제
2. **Live Server 재시작**: VS Code에서 Live Server 중지 후 재시작
3. **폴더 위치 확인**: `saeupcne` 폴더가 루트인지 확인
4. **개발자 도구 확인**: F12 → Network 탭에서 실제 요청 경로 확인

## 개발 서버 설정 (.vscode/settings.json)

```json
{
  "liveServer.settings.root": "/",
  "liveServer.settings.port": 5500,
  "liveServer.settings.mount": [
    ["/", "./"]
  ]
}
```

이 설정은 `saeupcne` 폴더를 웹 서버의 루트(`/`)로 마운트합니다.

---

**최종 업데이트**: 2025-11-07
**작성자**: Claude Code AI

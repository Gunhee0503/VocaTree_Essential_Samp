# 보카트리 Essential · VOCA TREE (PWA)

> 어근으로 영어 단어를 익히는 학습 웹앱 · Progressive Web App 버전

영어 단어를 1:1 한글 대응으로 외우는 대신, 한국어의 "안습"(안 + 습)처럼 **어근 이미지의 조합으로 이해**하는 방식의 학습 앱입니다. **PWA로 설치하면 홈 화면 아이콘으로 추가되고 오프라인에서도 완전히 작동**합니다.

## PWA 기능

- 📱 **홈 화면 설치**: 모바일·데스크톱 모두 설치 가능 (네이티브 앱처럼 사용)
- 🌐 **오프라인 작동**: 첫 방문 후엔 인터넷 없이도 모든 학습 가능
- 🎨 **앱 아이콘 + 스플래시**: 금색 V 로고 (어원 트리 모티프)
- 🚀 **빠른 로딩**: 서비스 워커가 자원을 캐시

## 주요 학습 기능

- **인트로 온보딩 (3장 슬라이드)**: 안습 비유로 어근 학습의 원리를 설명
- **강 선택 화면**: 어근별 강의를 카드로 진열, 진행도 표시
- **강 표지**: 학습 전 호흡을 가다듬는 표지 페이지
- **어원 트리**: 한 어근에서 의미별로 6가지 갈래로 뻗어나가는 시각화
- **의미 분류 퀴즈**: 개념 다지기 단계, 단어를 의미 그룹으로 분류
- **실전 문제 3 Part**
  - PART 01 어휘 추리력 — 어원 힌트로 뜻을 4지선다 추론
  - PART 02 단어 브릿지 — 품사·뜻과 어원 힌트로 단어를 직접 입력
  - PART 03 예문 빈칸 — 영어 예문 속 빈칸에 알맞은 단어 채우기
- **완료 표시**: 80% 이상 정답률 달성 시 초록 배지 표시
- **세션 간 진행 상황 저장**: localStorage 활용

## 디렉터리 구조

```
.
├── index.html              # 메인 앱 (PWA 진입점)
├── manifest.json           # PWA 매니페스트 (앱 이름·아이콘·색상)
├── sw.js                   # 서비스 워커 (오프라인 캐싱)
├── icons/                  # 앱 아이콘
│   ├── icon.svg            # 원본 벡터
│   ├── icon-192.png        # 안드로이드/일반
│   ├── icon-384.png
│   ├── icon-512.png        # 스플래시 화면용
│   ├── icon-maskable-192.png   # 안드로이드 적응형 아이콘
│   ├── icon-maskable-512.png
│   ├── apple-touch-icon.png    # iOS 홈 화면
│   └── favicon-32.png      # 브라우저 탭
├── README.md
└── .gitignore
```

## 로컬에서 실행

PWA는 보안 정책상 **HTTPS 또는 localhost**에서만 서비스 워커가 작동합니다. 파일을 직접 더블클릭(`file://`)하면 서비스 워커가 동작하지 않으니 로컬 서버를 사용하세요.

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## GitHub 업로드 & Pages 배포

### 1) 새 리포지토리 만들기

GitHub에서 새 리포지토리를 생성합니다 (예: `vocatree-essential-pwa`).

### 2) 파일 업로드

```bash
git init
git add .
git commit -m "Initial PWA: 보카트리 Essential"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

### 3) GitHub Pages 활성화

1. 리포지토리 **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/(root)` → **Save**
4. 1~2분 후 `https://<username>.github.io/<repo>/` 에서 접근

GitHub Pages는 HTTPS를 자동 제공하므로 PWA가 정상 작동합니다.

## 앱 설치 방법 (사용자 안내)

배포 URL 접속 후:

- **Android (Chrome)**: 주소창 옆 ⋮ → "홈 화면에 추가" 또는 자동 팝업
- **iOS (Safari)**: 공유 버튼 → "홈 화면에 추가"
- **데스크톱 (Chrome/Edge)**: 주소창 우측 설치 아이콘 클릭

설치 후엔 홈 화면 아이콘으로 실행, 주소창 없는 전체화면 앱처럼 사용 가능합니다.

## 새 버전 배포 시 주의사항

서비스 워커는 캐시를 매우 적극적으로 사용합니다. 사용자가 새 버전을 받으려면:

1. `sw.js` 상단의 `CACHE_VERSION`을 변경 (예: `'vte-v1'` → `'vte-v2'`)
2. 배포 후 사용자는 페이지를 한 번 더 새로고침해야 새 버전 활성화

## 강(Lesson) 추가하기

새 강을 추가하려면 `index.html` 안의 다음 영역을 수정합니다.

### 1) 데이터 정의

기존 `LESSON1_DATA`, `LESSON1_CLSDATA`, `LESSON1_BRIDGE`, `LESSON1_BRIDGE2`와 같은 형식으로 새 강 데이터를 정의합니다.

```javascript
const LESSON2_DATA = { /* word_tree, root_story 등 */ };
const LESSON2_CLSDATA = { /* 단어별 의미·예문·어원 */ };
const LESSON2_BRIDGE2 = [ /* Part 02 문제 10개 */ ];
const LESSON2_BRIDGE = [ /* Part 03 문제 14개 */ ];
```

### 2) 메타 정보 활성화

```javascript
const LESSON2_META = {
  no: 2,
  root: 'tain-',
  meaning: 'hold, keep',
  ko: '잡고 있다, 담고 있다',
  status: 'ready'   // 'coming' → 'ready'로 변경
};
```

### 3) LESSONS 레지스트리에 연결

```javascript
const LESSONS = {
  1: { meta: LESSON1_META, data: LESSON1_DATA, classify: LESSON1_CLSDATA,
       bridge2: LESSON1_BRIDGE2, bridge: LESSON1_BRIDGE },
  2: { meta: LESSON2_META, data: LESSON2_DATA, classify: LESSON2_CLSDATA,
       bridge2: LESSON2_BRIDGE2, bridge: LESSON2_BRIDGE },
};
```

엔진 코드는 모두 `LESSONS[currentLessonNo]`를 참조하므로 수정할 필요가 없습니다. 데이터만 추가하면 강 선택 화면·표지·트리·실전문제가 자동 반영됩니다.

## 학습자 데이터

다음 키들이 사용자 브라우저의 localStorage에 저장됩니다:

| 키 | 용도 | 범위 |
| --- | --- | --- |
| `vte_intro_seen` | 인트로 3장 본 기록 | 전역 |
| `vte_current_lesson` | 마지막으로 진입한 강 번호 | 전역 |
| `vte_cover_seen_lesson{N}` | 강별 표지 본 기록 | 강마다 |
| `vte_part_done_lesson{N}` | 강별 Part 80%+ 완료 기록 | 강마다 |

## 라이선스

(필요에 따라 추가)

## 기여

이슈와 PR은 환영합니다.

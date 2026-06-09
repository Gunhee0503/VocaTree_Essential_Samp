/* 보카트리 Essential — Service Worker
   캐시 전략:
   - 앱 셸(index.html, manifest, 아이콘)은 install 시점에 미리 캐시 (precache)
   - 그 외(Google Fonts 등 외부 자원)는 cache-first + 네트워크 폴백
   - 새 버전 배포 시 CACHE_VERSION만 올리면 기존 캐시가 정리됨
*/

const CACHE_VERSION = 'vte-v40';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

// 설치 시: 앱 셸 일괄 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// 활성화 시: 옛 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// 요청 처리: cache-first, 네트워크 폴백, 응답은 새로 캐시
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // GET만 처리
  if (req.method !== 'GET') return;
  // POST/PUT 등은 무시
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // 응답 복제 후 캐시에 저장 (불투명 응답·에러는 캐시 안 함)
          if (!res || res.status !== 200 || res.type === 'error') return res;
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => {
          // 네트워크 실패 시 index.html로 폴백 (탐색 요청 한정)
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});

/* ===================================================================
   CY Wedding — interactions
   loader · navbar · reveal-on-scroll · live countdown
   =================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     多語言 i18n（繁中 / 英 / 日 / 韓）
     =================================================================== */
  var I18N = {
    zh: {
      "title.page": "ChunYu & YanTing — 黃俊郁 & 范雁婷 婚禮邀請",
      "nav.story": "Our Love",
      "nav.invite": "Timeline",
      "nav.dresscode": "Dress Code",
      "nav.travel": "Getting There",
      "nav.menu": "選單",
      "bgm.play": "播放背景音樂",
      "bgm.pause": "暫停背景音樂",
      "totop.aria": "回到頂端",
      "story.quote": "長跑十三年的愛情故事，<br />即將揭開新的序幕⋯",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "誠摯地邀請您一起來見證我們的婚禮",
      "invite.date": "2026 / 9 / 12（六）",
      "schedule.welcome": "迎賓入席",
      "schedule.banquet": "婚宴開席",
      "count.d": "天", "count.h": "時", "count.m": "分", "count.s": "秒",
      "count.done": "WE ARE MARRIED — 我們結婚囉",
      "cal.add": "加入 Google 行事曆",
      "dc.title": "Dress Code",
      "dc.subtitle": "服裝建議",
      "dc.note": "為了讓婚禮畫面更加和諧，敬請避免全白穿搭，感謝您的體貼！",
      "travel.title": "Getting there",
      "travel.subtitle": "婚禮地點 / 行車資訊",
      "travel.venue": "皇家薇庭婚宴會館 — 法蘭新廳",
      "travel.transit": "大眾運輸",
      "travel.transit.1": "北部南下：搭 9023、1662 至尊爵飯店，轉計程車約 8 分鐘",
      "travel.transit.2": "搭 9005A 至中國江山站，步行約 10 分鐘",
      "travel.transit.3": "桃園高鐵站搭 302、707 公車，中正莊敬路口站下車，轉計程車約 5 分鐘",
      "travel.driving": "自行開車",
      "travel.driving.1": "國道一號：南崁交流道往桃園方向 → 靠右經國路 → 莊敬路二段右轉",
      "travel.driving.2": "國道二號：南桃園交流道往桃園方向 → 靠右大興西路三段 → 寶慶路左轉 → 莊敬路二段左轉",
      "travel.address": "地址",
      "travel.copy": "複製",
      "travel.copy.done": "已複製",
      "travel.copy.aria": "複製地址",
      "travel.map.open": "在 Google 地圖開啟導航 →",
      "closing.line": "Your presence is truly the best<br />gift we could ask for.",
      "closing.zh": "期待在最美好的一天，與您相見",
      "qr.note": "歡迎掃描下方 QR Code，加入婚禮小幫手<br />了解更多婚禮相關資訊",
      "share.note": "分享這份喜帖給朋友",
      "share.line": "分享到 LINE",
      "share.copy": "複製網址",
      "share.copy.done": "已複製"
    },
    en: {
      "title.page": "ChunYu & YanTing Wedding — September 12, 2026",
      "nav.story": "Our Love",
      "nav.invite": "Timeline",
      "nav.dresscode": "Dress Code",
      "nav.travel": "Getting There",
      "nav.menu": "Menu",
      "bgm.play": "Play background music",
      "bgm.pause": "Pause background music",
      "totop.aria": "Back to top",
      "story.quote": "A thirteen-year love story<br />about to begin its next chapter…",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "We cordially invite you to witness our wedding",
      "invite.date": "2026 / 9 / 12 (Sat)",
      "schedule.welcome": "Welcome Reception",
      "schedule.banquet": "Banquet Begins",
      "count.d": "Days", "count.h": "Hrs", "count.m": "Min", "count.s": "Sec",
      "count.done": "WE ARE MARRIED!",
      "cal.add": "Add to Google Calendar",
      "dc.title": "Dress Code",
      "dc.subtitle": "Attire Suggestions",
      "dc.note": "To keep the wedding scene harmonious, please avoid all-white attire. Thank you for your kind consideration!",
      "travel.title": "Getting there",
      "travel.subtitle": "Venue & Directions",
      "travel.venue": "Royal Wedding Hall — La France Salon",
      "travel.transit": "Public Transit",
      "travel.transit.1": "From the north: Take bus 9023 or 1662 to Junjie Hotel, then ~8 min by taxi.",
      "travel.transit.2": "Bus 9005A to China Jiangshan Station, ~10 min walk.",
      "travel.transit.3": "From Taoyuan HSR: Bus 302 or 707 to Zhongzheng/Zhuangjing intersection, ~5 min by taxi.",
      "travel.driving": "By Car",
      "travel.driving.1": "Highway 1: Nankan IC toward Taoyuan → Jingguo Rd. → Right onto Zhuangjing Rd. Sec. 2.",
      "travel.driving.2": "Highway 2: South Taoyuan IC toward Taoyuan → Daxing W. Rd. Sec. 3 → Left on Baoqing Rd. → Left on Zhuangjing Rd. Sec. 2.",
      "travel.address": "Address",
      "travel.copy": "Copy",
      "travel.copy.done": "Copied",
      "travel.copy.aria": "Copy address",
      "travel.map.open": "Open in Google Maps →",
      "closing.line": "Your presence is truly the best<br />gift we could ask for.",
      "closing.zh": "Looking forward to seeing you on this most beautiful day",
      "qr.note": "Scan the QR code below to add our Wedding Assistant<br />for more event details",
      "share.note": "Share this invitation with friends",
      "share.line": "Share on LINE",
      "share.copy": "Copy link",
      "share.copy.done": "Copied"
    },
    ja: {
      "title.page": "ChunYu & YanTing 結婚式 — 2026年9月12日",
      "nav.story": "Our Love",
      "nav.invite": "式次第",
      "nav.dresscode": "Dress Code",
      "nav.travel": "アクセス",
      "nav.menu": "メニュー",
      "bgm.play": "BGMを再生",
      "bgm.pause": "BGMを一時停止",
      "totop.aria": "トップへ戻る",
      "story.quote": "13年続いた愛の物語、<br />新たな章が始まります…",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "私たちの結婚式にぜひお越しください",
      "invite.date": "2026 / 9 / 12（土）",
      "schedule.welcome": "ご来賓ご着席",
      "schedule.banquet": "披露宴開始",
      "count.d": "日", "count.h": "時", "count.m": "分", "count.s": "秒",
      "count.done": "結婚しました！",
      "cal.add": "Google カレンダーに追加",
      "dc.title": "Dress Code",
      "dc.subtitle": "ドレスコード",
      "dc.note": "会場の雰囲気を整えるため、全身白の装いはお控えくださいませ。ご協力ありがとうございます。",
      "travel.title": "Getting there",
      "travel.subtitle": "会場・アクセス情報",
      "travel.venue": "ロイヤルウェディング会館 — フランス新ホール",
      "travel.transit": "公共交通機関",
      "travel.transit.1": "北部から：9023番・1662番バスで尊爵ホテルへ、タクシー約8分。",
      "travel.transit.2": "9005A番バスで中国江山駅へ、徒歩約10分。",
      "travel.transit.3": "桃園新幹線駅から302・707番バスで中正荘敬路口下車、タクシー約5分。",
      "travel.driving": "お車でお越しの方",
      "travel.driving.1": "国道1号：南崁ICで桃園方面 → 経国路 → 荘敬路二段を右折。",
      "travel.driving.2": "国道2号：南桃園ICで桃園方面 → 大興西路三段 → 寶慶路を左折 → 荘敬路二段を左折。",
      "travel.address": "住所",
      "travel.copy": "コピー",
      "travel.copy.done": "コピーしました",
      "travel.copy.aria": "住所をコピー",
      "travel.map.open": "Google マップで開く →",
      "closing.line": "皆さまのご臨席が<br />何よりの贈り物です。",
      "closing.zh": "最高の一日に皆さまにお会いできることを楽しみにしています",
      "qr.note": "下のQRコードからウェディングアシスタントを追加し、<br />詳細をご確認ください。",
      "share.note": "ご友人にこの招待状をシェア",
      "share.line": "LINE でシェア",
      "share.copy": "URL をコピー",
      "share.copy.done": "コピーしました"
    },
    ko: {
      "title.page": "ChunYu & YanTing 결혼식 — 2026년 9월 12일",
      "nav.story": "Our Love",
      "nav.invite": "식순",
      "nav.dresscode": "Dress Code",
      "nav.travel": "오시는 길",
      "nav.menu": "메뉴",
      "bgm.play": "배경 음악 재생",
      "bgm.pause": "배경 음악 일시정지",
      "totop.aria": "맨 위로",
      "story.quote": "13년의 사랑 이야기,<br />새로운 장을 열어갑니다…",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "저희의 결혼식에 진심으로 초대합니다",
      "invite.date": "2026 / 9 / 12 (토)",
      "schedule.welcome": "하객 입장",
      "schedule.banquet": "피로연 시작",
      "count.d": "일", "count.h": "시", "count.m": "분", "count.s": "초",
      "count.done": "우리 결혼했습니다!",
      "cal.add": "Google 캘린더에 추가",
      "dc.title": "Dress Code",
      "dc.subtitle": "드레스 코드",
      "dc.note": "결혼식 분위기의 조화를 위해 전체 흰색 의상은 피해 주시기 바랍니다. 감사합니다!",
      "travel.title": "Getting there",
      "travel.subtitle": "식장 위치 / 교통 안내",
      "travel.venue": "로열 웨딩홀 — 라 프랑스 살롱",
      "travel.transit": "대중교통",
      "travel.transit.1": "북부 → 남부: 9023, 1662번 버스로 준제 호텔까지, 택시 약 8분.",
      "travel.transit.2": "9005A번 버스로 중국강산역까지, 도보 약 10분.",
      "travel.transit.3": "타오위안 고속철도역에서 302, 707번 버스로 중정장징로 교차로 하차, 택시 약 5분.",
      "travel.driving": "자가용",
      "travel.driving.1": "국도 1호: 난칸 IC에서 타오위안 방향 → 경국로 → 장징로 2단 우회전.",
      "travel.driving.2": "국도 2호: 남타오위안 IC에서 타오위안 방향 → 대흥서로 3단 → 보경로 좌회전 → 장징로 2단 좌회전.",
      "travel.address": "주소",
      "travel.copy": "복사",
      "travel.copy.done": "복사됨",
      "travel.copy.aria": "주소 복사",
      "travel.map.open": "Google 지도에서 열기 →",
      "closing.line": "여러분의 참석이<br />저희에게 가장 큰 선물입니다.",
      "closing.zh": "가장 아름다운 날에 만나뵙기를 기대합니다",
      "qr.note": "아래 QR 코드를 스캔하여 웨딩 도우미를 추가하시면<br />결혼식 상세 정보를 확인하실 수 있습니다.",
      "share.note": "친구에게 청첩장 공유하기",
      "share.line": "LINE으로 공유",
      "share.copy": "링크 복사",
      "share.copy.done": "복사됨"
    }
  };

  var LANG_HTML = { zh: "zh-Hant", en: "en", ja: "ja", ko: "ko" };
  var LANG_OG   = { zh: "zh_TW",   en: "en_US", ja: "ja_JP", ko: "ko_KR" };
  var LANG_KEY  = "cy.lang";

  function detectInitialLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && I18N[saved]) return saved;
    var n = (navigator.language || "zh").toLowerCase();
    if (n.indexOf("ja") === 0) return "ja";
    if (n.indexOf("ko") === 0) return "ko";
    if (n.indexOf("en") === 0) return "en";
    return "zh";
  }
  var currentLang = detectInitialLang();

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.zh && I18N.zh[key]) || key;
  }

  function applyI18n() {
    // 純文字
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    // 含 HTML（<br> 等）
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = v;
    });
    // aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-aria"));
      if (v != null) el.setAttribute("aria-label", v);
    });
    // 標題與 lang / og:locale
    document.title = t("title.page");
    document.documentElement.lang = LANG_HTML[currentLang] || "zh-Hant";
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute("content", LANG_OG[currentLang] || "zh_TW");

    // 同步語言切換器 aria-pressed
    document.querySelectorAll(".lang-switch button[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === currentLang ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyI18n();
  }

  // 語言切換器初始化
  document.querySelectorAll(".lang-switch button[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  // 提供給其他模組使用
  window.__cy_i18n = { t: t, getLang: function () { return currentLang; } };

  // 首次套用
  applyI18n();

  /* ---------- 重新整理一律回到最頂，不記憶捲動位置 ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  window.addEventListener("load", function () { window.scrollTo(0, 0); });

  /* ---------- 進場載入：最少 3 秒，最多 5 秒 ---------- */
  var LOADER_START = Date.now();
  var LOADER_MIN = 3000;
  var LOADER_MAX = 5000;
  function hideLoader() {
    var loader = document.getElementById("loader");
    if (!loader || loader.classList.contains("hide")) return;
    var wait = Math.max(0, LOADER_MIN - (Date.now() - LOADER_START));
    setTimeout(function () {
      loader.classList.add("hide");
      var bgmBtn = document.getElementById("bgm-toggle");
      if (bgmBtn) setTimeout(function () { bgmBtn.classList.add("ready"); }, 400);
    }, wait);
  }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, LOADER_MAX); // 安全上限

  /* ---------- 地址複製 ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var text = btn.getAttribute("data-copy");
      var label = btn.querySelector(".addr-copy-label");
      var done = function () {
        btn.classList.add("copied");
        if (label) label.textContent = t("travel.copy.done");
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = t("travel.copy");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      } else {
        // 後備方案
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- 背景音樂：每次開啟隨機選一首，首次互動自動播放 ---------- */
  (function () {
    var audio = document.getElementById("bgm");
    var btn   = document.getElementById("bgm-toggle");
    if (!audio || !btn) return;

    // 目錄中的歌單（順序不重要，會隨機挑）
    var TRACKS = [
      "Music/Troye Sivan - Angel Baby (SPOTISAVER).mp3",
      "Music/Taylor Swift - Enchanted (SPOTISAVER).mp3",
      "Music/Lauv - Love U Like That (SPOTISAVER).mp3"
    ];
    audio.src = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    audio.volume = 0.35;

    var userPaused = false;

    function setPlayingUI(on) {
      btn.classList.toggle("playing", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? t("bgm.pause") : t("bgm.play"));
    }

    function tryPlay() {
      try { audio.currentTime = 0; } catch (e) {} // 永遠從頭播放
      var p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(function () { setPlayingUI(true); })
         .catch(function () { /* 瀏覽器尚未授權，等下次互動 */ });
      } else {
        setPlayingUI(true);
      }
    }

    // 首次互動觸發（滾動 / 觸控 / 點擊任意位置）
    function onFirstInteract() {
      if (!userPaused && audio.paused) tryPlay();
      window.removeEventListener("scroll", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
      window.removeEventListener("click", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    }
    window.addEventListener("scroll",     onFirstInteract, { passive: true, once: false });
    window.addEventListener("touchstart", onFirstInteract, { passive: true });
    window.addEventListener("click",      onFirstInteract);
    window.addEventListener("keydown",    onFirstInteract);

    // 按鈕手動切換
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (audio.paused) {
        userPaused = false;
        tryPlay();
      } else {
        userPaused = true;
        audio.pause();
        setPlayingUI(false);
      }
    });
  })();

  /* ---------- 回頂端浮動鈕 ---------- */
  var toTop = document.getElementById("to-top");
  if (toTop) {
    toTop.setAttribute("aria-label", t("totop.aria"));
    var toggleToTop = function () {
      toTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", toggleToTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 分享：產生帶時戳版本參數的網址（避開 LINE 縮圖快取） ---------- */
  function buildShareUrl() {
    var base = window.location.origin + window.location.pathname;
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var v = d.getFullYear() +
            pad(d.getMonth() + 1) +
            pad(d.getDate()) +
            pad(d.getHours()) +
            pad(d.getMinutes()) +
            pad(d.getSeconds());
    return base + "?v=" + v;
  }

  /* ---------- LINE 分享按鈕：點擊瞬間用最新時戳 ---------- */
  (function () {
    var lineBtn = document.getElementById("share-line");
    if (!lineBtn) return;
    lineBtn.addEventListener("click", function () {
      var shareUrl = "https://social-plugins.line.me/lineit/share?url=" +
                     encodeURIComponent(buildShareUrl());
      lineBtn.setAttribute("href", shareUrl);
    });
  })();

  /* ---------- 分享：複製網址 ---------- */
  (function () {
    var btn = document.getElementById("share-copy");
    if (!btn) return;
    var label = btn.querySelector("span");
    btn.addEventListener("click", function () {
      var url = buildShareUrl();
      var done = function () {
        btn.classList.add("copied");
        if (label) label.textContent = t("share.copy.done");
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = t("share.copy");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  })();

  /* ---------- Navbar：捲動變暗 + 漢堡 ---------- */
  var nav = document.getElementById("site-nav");
  var burger = nav && nav.querySelector(".nav-burger");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
  }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 點選連結後關閉
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 進場動畫（reveal） ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var delay = parseInt(el.dataset.delay || "0", 10);
          setTimeout(function () { el.classList.add("in"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    // 同一群組的 reveal 依序淡入
    reveals.forEach(function (el) {
      var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.dataset.delay = Math.min(sibs, 6) * 90;
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 倒數計時 ---------- */
  // 婚禮:2026/09/12 12:30(台灣時間 UTC+8)
  var target = new Date("2026-09-12T12:30:00+08:00").getTime();
  var wrap = document.getElementById("countWrap");
  var done = document.getElementById("countDone");
  var cells = {};
  document.querySelectorAll(".count-row b").forEach(function (el) {
    cells[el.getAttribute("data-k")] = el;
  });

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      if (wrap) wrap.style.display = "none";
      if (done) done.hidden = false;
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    if (cells.d) cells.d.textContent = Math.floor(s / 86400);
    if (cells.h) cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
    if (cells.m) cells.m.textContent = pad(Math.floor((s % 3600) / 60));
    if (cells.s) cells.s.textContent = pad(s % 60);
  }
  tick();
  var timer = setInterval(tick, 1000);
})();

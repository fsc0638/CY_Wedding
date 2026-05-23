/* ===================================================================
   CY Wedding — interactions
   loader · navbar · reveal-on-scroll · live countdown
   =================================================================== */
(function () {
  "use strict";

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
        if (label) label.textContent = "已複製";
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = "複製";
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
      btn.setAttribute("aria-label", on ? "暫停背景音樂" : "播放背景音樂");
    }

    function tryPlay() {
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

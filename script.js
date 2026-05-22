/* ===================================================================
   CY Wedding — interactions
   loader · nav · reveal-on-scroll · countdown · carousel
   =================================================================== */
(function () {
  "use strict";

  /* ---------- 進場載入 ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) {
      setTimeout(function () { loader.classList.add("hide"); }, 600);
    }
  });

  /* ---------- 導覽列縮放 ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 60) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 進場動畫 (reveal) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 倒數計時 ---------- */
  // 婚禮:2026/09/12 12:30 (台灣時間 UTC+8)
  var target = new Date("2026-09-12T12:30:00+08:00").getTime();
  var grid = document.getElementById("countGrid");
  var done = document.getElementById("countDone");
  var cells = {};
  document.querySelectorAll(".count-num").forEach(function (el) {
    cells[el.getAttribute("data-k")] = el;
  });

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      if (grid) grid.hidden = true;
      if (done) done.hidden = false;
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (cells.d) cells.d.textContent = d;
    if (cells.h) cells.h.textContent = pad(h);
    if (cells.m) cells.m.textContent = pad(m);
    if (cells.s) cells.s.textContent = pad(sec);
  }
  tick();
  var timer = setInterval(tick, 1000);

  /* ---------- 影像輪播 ---------- */
  var track = document.getElementById("track");
  if (track) {
    var slides = track.children.length;
    var index = 0;
    var dotsWrap = document.getElementById("dots");
    var autoTimer = null;

    for (var i = 0; i < slides; i++) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "第 " + (i + 1) + " 張");
      (function (n) { b.addEventListener("click", function () { go(n); }); })(i);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.children;

    function render() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle("active", j === index);
      }
    }
    function go(n) {
      index = (n + slides) % slides;
      render();
      restartAuto();
    }
    function restartAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { go(index + 1); }, 5000);
    }

    document.getElementById("prev").addEventListener("click", function () { go(index - 1); });
    document.getElementById("next").addEventListener("click", function () { go(index + 1); });

    // 觸控滑動
    var startX = 0;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    render();
    restartAuto();
  }
})();

/* ===================================================================
   CY Wedding — interactions
   loader · reveal-on-scroll · live countdown
   =================================================================== */
(function () {
  "use strict";

  /* ---------- 進場載入 ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) setTimeout(function () { loader.classList.add("hide"); }, 650);
  });

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

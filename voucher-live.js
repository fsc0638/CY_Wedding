// 賓客券即時狀態（撕券後顯示專屬 QR + 監聽 Firestore，已核銷就浮現「已領取」印章）
// 僅在帶 ?g=<姓名> 且該姓名雜湊存在於 Firestore vouchers 集合（= 女方賓客）時才有作用。
import { db } from "./firebase.js";
import {
  doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

(function () {
  "use strict";

  var card = document.querySelector(".voucher-card");
  var qrBox = document.getElementById("voucherQr");
  var stamp = document.getElementById("voucherStamp");
  var noEl = document.getElementById("voucherNo");   // 券面「NO.」後方的兌換編號
  if (!card) return;

  // 與 build_guests.py / script.js 完全一致的正規化
  function normName(s) {
    return (s || "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
  }
  function toHex(buf) {
    var b = new Uint8Array(buf), s = "";
    for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return s;
  }

  var raw;
  try { raw = new URLSearchParams(window.location.search).get("g"); }
  catch (e) { raw = null; }
  var norm = normName(raw);
  if (!norm) return;

  var qrUrl = null;

  // 測試公版：?g=測試人員 → 兌換碼全填 9、畫示意 QR，不連 Firestore（無真實券）
  if (norm === normName("測試人員")) {
    if (noEl) noEl.textContent = "99999999";
    renderQr(new URL("verify.html", window.location.href).href + "?h=" + "9".repeat(64));
    return;
  }

  if (!(window.crypto && window.crypto.subtle)) return;

  function drawQr(box, url, size) {
    box.innerHTML = "";
    if (window.QRCode) {
      try {
        new window.QRCode(box, {
          text: url, width: size, height: size,
          colorDark: "#000000", colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.L  // 最低糾錯 → 模組最少、外觀最簡潔
        });
        return true;
      } catch (e) { /* 失敗 → 退回文字連結 */ }
    }
    var a = document.createElement("a");
    a.href = url; a.textContent = url; a.className = "vq-fallback";
    a.target = "_blank"; a.rel = "noopener";
    box.appendChild(a);
    return false;
  }

  // 點一下小 QR → 全螢幕放大，方便工作人員掃描
  function openZoom() {
    if (!qrUrl) return;
    var ov = document.getElementById("vqZoom");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "vqZoom";
      ov.className = "vq-zoom";
      var inner = document.createElement("div");
      inner.className = "vq-zoom-inner";
      var box = document.createElement("div");
      box.className = "vq-zoom-qr";
      box.id = "vqZoomQr";
      var cap = document.createElement("p");
      cap.className = "vq-zoom-cap";
      cap.textContent = "出示此 QR 給工作人員掃描 · 點任意處關閉";
      inner.appendChild(box);
      inner.appendChild(cap);
      ov.appendChild(inner);
      document.body.appendChild(ov);
      ov.addEventListener("click", function () { ov.classList.remove("show"); });
    }
    drawQr(document.getElementById("vqZoomQr"), qrUrl, 320);
    ov.classList.add("show");
  }

  function renderQr(url) {
    if (!qrBox) return;
    qrUrl = url;
    drawQr(qrBox, url, 240);
    qrBox.style.cursor = "zoom-in";
    qrBox.setAttribute("role", "button");
    qrBox.setAttribute("tabindex", "0");
    qrBox.setAttribute("aria-label", "放大 QR 碼");
    qrBox.addEventListener("click", openZoom);
    qrBox.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openZoom(); }
    });
  }

  function setStamped(on) {
    if (stamp) stamp.hidden = !on;
    card.classList.toggle("is-redeemed", !!on);
  }

  fetch("data/guests.json?v=" + Date.now(), { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (g) {
      var enc = new TextEncoder();
      return window.crypto.subtle
        .digest("SHA-256", enc.encode((g.salt || "") + norm))
        .then(function (buf) {
          var hex = toHex(buf);
          if ((g.brideHashes || []).indexOf(hex) < 0) return; // 非女方賓客 → 不做事
          var verifyUrl = new URL("verify.html", window.location.href).href + "?h=" + hex;
          renderQr(verifyUrl);

          // 即時監聽自己那張券：已核銷 → 蓋章；取消 → 撤章
          onSnapshot(doc(db, "vouchers", hex), function (snap) {
            var d = snap.exists() ? snap.data() : null;
            setStamped(!!(d && d.redeemed));
            if (noEl && d && d.code) noEl.textContent = String(d.code);  // 填入券面編號
          }, function () { /* 連線失敗：靜默，券仍可正常顯示 */ });
        });
    })
    .catch(function () { /* 失敗 → 不顯示 QR / 印章，不影響其餘功能 */ });
})();

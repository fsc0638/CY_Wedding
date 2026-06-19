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
  if (!(window.crypto && window.crypto.subtle)) return;

  function renderQr(url) {
    if (!qrBox) return;
    qrBox.innerHTML = "";
    if (window.QRCode) {
      try {
        new window.QRCode(qrBox, {
          text: url, width: 240, height: 240,
          colorDark: "#000000", colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.L  // 最低糾錯 → 模組最少、外觀最簡潔
        });
        return;
      } catch (e) { /* 失敗 → 退回文字連結 */ }
    }
    var a = document.createElement("a");
    a.href = url; a.textContent = url; a.className = "vq-fallback";
    a.target = "_blank"; a.rel = "noopener";
    qrBox.appendChild(a);
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
          }, function () { /* 連線失敗：靜默，券仍可正常顯示 */ });
        });
    })
    .catch(function () { /* 失敗 → 不顯示 QR / 印章，不影響其餘功能 */ });
})();

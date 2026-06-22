// 匿名留言：祝福牆的 Firestore 讀寫橋接
// 提供給非模組的 script.js 使用（透過 window.__cyWishesLive）：
//   fetchWishes() → Promise<[{text}]>  讀取最新匿名留言（合併進泡泡池）
//   post(text)    → Promise            送出一則匿名留言
import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

var COL = "wishes";

window.__cyWishesLive = {
  fetchWishes: function () {
    return getDocs(query(collection(db, COL), orderBy("createdAt", "desc"), limit(200)))
      .then(function (snap) {
        var out = [];
        snap.forEach(function (docSnap) {
          var data = docSnap.data();
          var text = data && data.text;
          if (text && String(text).trim()) out.push({ text: String(text), anon: true });
        });
        return out;
      })
      .catch(function () { return []; });   // 失敗（含規則未開放）→ 不影響表單留言顯示
  },

  post: function (text) {
    return addDoc(collection(db, COL), {
      text: String(text).slice(0, 150),
      createdAt: serverTimestamp()
    });
  }
};

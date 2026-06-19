// Firebase 共用初始化（賓客券頁 voucher-live.js 與工作人員 verify.html 共用）
// 以 ESM 從 gstatic CDN 載入 SDK；config 為公開安全的 web config（見 firebase-config.js）。
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

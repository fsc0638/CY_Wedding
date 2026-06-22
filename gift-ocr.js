// gift-ocr.js — 禮金 OCR（Firebase AI Logic + Gemini）Phase 2
//
// 隔離載入策略：本檔自建一個「具名」v12 Firebase app（"cy-ai"），只用於呼叫 Gemini，
// 與站上其他功能（核銷/即時蓋章/留言，皆走 firebase.js 的 v10 預設 app）完全互不干擾。
// verify.html 只有在工作人員點「拍照／選圖辨識」鈕時才『動態 import』本檔 →
// 現有頁面載入與既有功能 0 影響。
//
// 後端用 GoogleAIBackend()＝Gemini Developer API＝免費 Spark 方案（不需 Blaze 付費）。
import { initializeApp, getApps, getApp }
  from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend, Schema }
  from "https://www.gstatic.com/firebasejs/12.15.0/firebase-ai.js";
import { firebaseConfig } from "./firebase-config.js";

// （建議，但需先設定）App Check：防止他人盜用你公開的 firebaseConfig 濫打 Gemini 配額。
// 啟用方式見 DEVLOG「Phase 2」：到主控台 App Check 註冊 reCAPTCHA v3、取得「網站金鑰」後，
// 取消下面三段註解並填入金鑰即可（程式其餘不用改）。
// import { initializeAppCheck, ReCaptchaV3Provider }
//   from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app-check.js";

const AI_APP_NAME = "cy-ai";
const app = getApps().some((a) => a.name === AI_APP_NAME)
  ? getApp(AI_APP_NAME)
  : initializeApp(firebaseConfig, AI_APP_NAME);

// initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("YOUR_RECAPTCHA_V3_SITE_KEY"),
//   isTokenAutoRefreshEnabled: true,
// });

const ai = getAI(app, { backend: new GoogleAIBackend() });

// 強制結構化輸出：一個物件陣列，每筆 = 一位賓客的禮金
const ocrSchema = Schema.array({
  items: Schema.object({
    properties: {
      name:             Schema.string(),
      amount:           Schema.number(),
      raw:              Schema.string(),
      confidenceName:   Schema.enumString({ enum: ["high", "low"] }),
      confidenceAmount: Schema.enumString({ enum: ["high", "low"] }),
    },
  }),
});

const model = getGenerativeModel(ai, {
  // ⚠ gemini-2.5-flash 為目前確認可用的免費視覺模型。若主控台 Build → AI Logic → Models
  //   出現更新的免費 free-tier 視覺模型字串，可改這裡（架構不用動）。
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: ocrSchema,
  },
});

// 格式無關通用 prompt（無禮金簿樣張版）。日後拿到實際版面，只要微調此字串即可提升準確度。
const PROMPT = [
  "你是台灣婚禮「禮金簿」辨識助理。影像可能是表格、條列或任意手寫，請逐筆（逐人）擷取。",
  "每一筆輸出一個物件，欄位如下：",
  "- name：登錄人姓名，照影像原樣擷取。",
  "- amount：金額，務必換算成「整數數字」。大寫（壹仟陸佰）、國字（一千六百）、阿拉伯數字（1,600）一律轉成 1600。只會有新台幣金額，沒有外幣或支票。",
  "- raw：該列在影像中的原始文字，逐字照抄（供人工核對）。",
  "- confidenceName / confidenceAmount：你對該欄位辨識的把握度，只能填 \"high\" 或 \"low\"。",
  "判讀規則：",
  "- 姓名看不清或不確定 → confidenceName 設 \"low\"（name 仍填你最可能的猜測；真的無從判讀才留空字串）。",
  "- 金額看不清或不確定 → confidenceAmount 設 \"low\"；完全無法判讀時 amount 填 0。",
  "- 有塗改/劃掉的列仍要擷取，並把對應 confidence 設 \"low\"。",
  "- 不要擷取表頭、欄位標題、總計列，或任何不是「某人禮金」的文字。",
  "- 只回傳 schema 規定的 JSON 陣列，不要輸出任何其他文字、說明或標記。",
].join("\n");

// ---- 影像處理 ----
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// 手機照片常達數 MB，base64 還會膨脹 ~33% → 先縮到長邊 1600px、JPEG 0.85，省流量又更快。
function downscale(file, maxDim = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      // 已經夠小就直接用原檔
      if (scale === 1 && file.size < 1.5 * 1024 * 1024) { URL.revokeObjectURL(url); resolve(file); return; }
      const cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
      const canvas = document.createElement("canvas");
      canvas.width = cw; canvas.height = ch;
      canvas.getContext("2d").drawImage(img, 0, 0, cw, ch);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob 失敗")), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("圖片載入失敗")); };
    img.src = url;
  });
}

async function fileToPart(file) {
  let blob = file;
  try { blob = await downscale(file); } catch (e) { blob = file; }   // 縮圖失敗就送原檔
  const base64 = await blobToBase64(blob);
  return { inlineData: { data: base64, mimeType: blob.type || "image/jpeg" } };
}

// 把底層錯誤翻成工作人員看得懂的中文
function friendly(err) {
  const s = String((err && (err.message || err.code)) || err);
  if (/not.?enabled|PERMISSION|403|SERVICE_DISABLED|has not been used|AI ?Logic|aiLogic|FAILED_PRECONDITION/i.test(s))
    return "尚未啟用 Firebase AI Logic：請到主控台 Build → AI Logic → 選「Gemini Developer API」啟用後再試。";
  if (/quota|RESOURCE_EXHAUSTED|429/i.test(s)) return "已達 Gemini 免費額度上限，請稍後再試。";
  if (/app.?check|APP_CHECK|unauthorized|401/i.test(s)) return "App Check 驗證未通過（請確認 reCAPTCHA 設定或本機除錯權杖）。";
  if (/network|fetch|Failed to fetch|timeout/i.test(s)) return "網路連線失敗，請檢查網路後再試。";
  return s;
}

/**
 * 對單張圖片做 OCR，回傳已正規化的禮金列陣列：
 *   [{ name, amount(int), raw, confidenceName:'high'|'low', confidenceAmount:'high'|'low' }]
 */
export async function ocrImage(file) {
  let part;
  try { part = await fileToPart(file); }
  catch (e) { throw new Error("圖片處理失敗：" + ((e && e.message) || e)); }

  let result;
  try { result = await model.generateContent([PROMPT, part]); }
  catch (e) { throw new Error(friendly(e)); }

  let text = "";
  try { text = result.response.text(); } catch (e) { text = ""; }

  let rows;
  try { rows = JSON.parse(text); }
  catch (e) { throw new Error("辨識結果格式異常（模型未回傳有效 JSON），請重拍清楚一點再試。"); }
  if (!Array.isArray(rows)) rows = [];

  return rows.map((r) => ({
    name: (r && r.name != null) ? String(r.name).trim() : "",
    amount: (r && r.amount != null && !isNaN(Number(r.amount))) ? Math.max(0, Math.round(Number(r.amount))) : 0,
    raw: (r && r.raw != null) ? String(r.raw).trim() : "",
    confidenceName: (r && r.confidenceName === "high") ? "high" : "low",
    confidenceAmount: (r && r.confidenceAmount === "high") ? "high" : "low",
  }));
}

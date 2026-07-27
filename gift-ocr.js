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

// 要換模型只改這一行即可（架構完全不用動；換完記得 bump verify.html 動態 import 的 ?v=）。
// 免費額度（不需開 Blaze）可用：
//   gemini-3.6-flash        ← 目前採用：最新世代、frontier 效能，手寫辨識較吃視覺能力
//   gemini-2.5-pro          2.5 系列最強，可作為比較對象
//   gemini-2.5-flash        前一版採用，性價比取向
//   gemini-3.5-flash-lite / gemini-2.5-flash-lite   最快最省（準確度可能較低）
// ⚠️ 需付費(Blaze)：gemini-3.1-pro-preview　｜　已停用：gemini-2.0-*（2026-06-01 起 404）
const MODEL_ID = "gemini-3.6-flash";

const model = getGenerativeModel(ai, {
  model: MODEL_ID,
  generationConfig: {
    temperature: 0,                 // 降到 0：抽取任務求穩定、減少憑空編造
    responseMimeType: "application/json",
    responseSchema: ocrSchema,
  },
});

// 格式無關通用 prompt（無禮金簿樣張版）。重點在「信心校準 + 反編造」：
// 手寫辨識本就無法 100% 正確，但要逼模型對不確定的欄位誠實標 low，讓前端校對表紅框攔得到。
const PROMPT = [
  "你是台灣婚禮「禮金簿」辨識助理。影像通常是紅底直書（由右至左）的格子簿。請逐筆（逐人）擷取，每一筆輸出一個物件。",
  "",
  "【最高原則】寧可標「不確定」，也絕不猜測或編造。只要看不清、需要推測、字跡潦草、或筆畫有歧義，就把該欄位 confidence 設 \"low\"。唯有『非常確定、毫無歧義』時才可設 \"high\"。",
  "",
  "【欄位】",
  "- name：登錄人姓名，只照『實際看得到的字』擷取，不可自行補齊。",
  "- amount：金額換算成整數。大寫（壹仟陸佰）、國字（一千六百）、阿拉伯（1,600）一律換成 1600。只會有新台幣，沒有外幣或支票。",
  "- raw：該列你『實際在影像中看到的字』逐字照抄；看不到的字不可補，只看到半個字就只寫半個字。",
  "- confidenceName / confidenceAmount：只能是 \"high\" 或 \"low\"。",
  "",
  "【務必設 low 的情況】",
  "- 姓名筆畫沒寫完、像正在書寫中、被手/紅包/物件遮住、或你得『推測補齊』才能湊成完整姓名 → confidenceName=\"low\"，name 只填看得到的部分（不要補成完整姓名）。",
  "- 該列沒寫金額、金額欄空白、或看不到金額 → amount=0、confidenceAmount=\"low\"。【絕對禁止】依其他列或常見金額去推測、補上或編造金額。",
  "- 整列看起來『還沒寫完』（有名沒金額、或姓名只寫了一兩筆）→ 兩個 confidence 都設 \"low\"。",
  "- 大寫數字筆畫不確定 → confidenceAmount=\"low\"。特別注意易混淆：伍(5)↔陸(6)、參(3)、肆(4)、柒(7)、捌(8)、玖(9)、貳(2)、壹(1)、仟(1000)↔什。",
  "- 姓名有易混淆字且不確定 → confidenceName=\"low\"。例：世↔哲、士↔土、文↔玟、斐↔裴。",
  "",
  "【不要做】",
  "- 不要編造不存在的列、姓名或金額；寧可少抓，不要亂抓。",
  "- 不要擷取表頭欄位字（如「嘉賓」「賀禮」）、欄位標題、總計列，或任何不是『某人禮金』的內容。",
  "",
  "只回傳 schema 規定的 JSON 陣列，不要任何其他文字。",
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
  // 換過模型後最可能踩到的錯：該模型在此專案不可用 → 明確指出模型名，方便改回上一個
  if (/NOT_FOUND|404|is not found|not supported|unsupported/i.test(s))
    return "此專案目前無法使用模型「" + MODEL_ID + "」。請改用 gemini-2.5-flash 或 gemini-2.5-pro"
         + "（改 gift-ocr.js 的 MODEL_ID），或到主控台 Build → AI Logic → Models 確認可用清單。";
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

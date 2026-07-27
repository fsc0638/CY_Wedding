# CY Wedding — 開發記錄

## 專案概要
- 線上喜帖網站，新人 黃俊郁 (ChunYu Huang) & 范雁婷 (YanTing Fan)
- 婚禮：2026/09/12（六）12:30 開席
- 場地：桃園皇家薇庭 法蘭新廳，330 桃園市桃園區莊敬路二段 369 號
- 靜態網站：`index.html` / `styles.css` / `script.js`，照片置於 `Picture/`
- 設計方向：復刻 Canva 線上喜帖風格並優化（米白 / 暖黑 / 駝色交替分區）

---

## 2026-05-22 更新記錄

### 第一輪：全站大更新
- 新增固定頂部導覽列：CY logo + Our Love / Process / Dress Code / Getting There，
  捲動後半透明深色背景，手機版漢堡選單
- Hero 文字整體往上移，避免擋住人物
- Story 區重整：移除原雙欄照片、新增手繪乾杯 SVG、中文引言移至區塊底部
- Invite：底部照片改為 IMG_0566；倒數字體改 Roboto Mono；行事曆標題改 GFS Didot
- Dress Code：在標題與色卡之間插入 DSC09448 照片
- 新增第五頁相片牆
- LINE QR Code 以 `mix-blend-mode: multiply` 去背
- See you Soon 頁尾移除中文名字與日期

### 第二輪：字體與版面細修
- 中文字體統一改為 `Roboto Mono` + `Noto Sans TC` 等寬字體堆疊
- Navbar 改用婚禮 logo 圖：原圖白底，以 PIL 處理成透明背景白色標誌
  （`Picture/wedding-logo-mark.png`），CSS 用 `filter: brightness(0) invert(1)` 上色
- Hero 名字字體：Autography 不在 Google Fonts → 先改 Sacramento → 最終改用
  Adobe Typekit（kit `waq7ckh`）的 `canvas-script` 手寫體（僅套用於名字）
- Story 主照片改為 DSC07362；`( AND EACH OTHER )` 移到照片下方；乾杯 SVG 移到最下方
- 迎賓入席 / 婚宴開席 圖示重繪為 Canva 風格（碰杯香檳杯 / 餐盤刀叉）
- 相片牆改為直式排列，照片改為 DSC09206 / DSC08383 / DSC09432
- 所有內容照片改為依原始比例顯示，不再裁切

### 目前字體配置
| 用途 | 字體 |
|------|------|
| 新人名字（script） | canvas-script（Adobe Typekit kit `waq7ckh`） |
| 英文標題 | Cormorant Garamond |
| 英數字 / 標籤 / 倒數 | Roboto Mono |
| 行事曆標題 | GFS Didot |
| 中文 | Roboto Mono + Noto Sans TC（等寬堆疊） |

### Git
- 遠端：`fsc0638/CY_Wedding`，`master` 已 push
- 已建立並使用 `fsc` 分支進行後續開發

---

## 待辦 / 備註
- 若日後取得 Autography 真字型檔，可改用 `@font-face` 載入真正的 Autography
- Hero 與 See you Soon 為滿版背景圖，仍維持 `background-size: cover` 裁切
  （不裁切會出現留白邊破壞滿版效果）
- IMG_0566 為 iPhone 直式照片
- 本機預覽：`python3 -m http.server`

---

## 賓客體驗優化清單 (Wedding UX TODO)
從賓客視角規劃的功能優化，依優先級排列：

### 🥇 高 CP 值
- [ ] **一鍵叫車整合** — 55688 deep link / Uber deep link / Google·Apple Maps 導航
- [ ] **RSVP 出席回覆系統** — 出席與否、攜伴、葷素 / 海鮮過敏等飲食偏好（Google Form 或 Formspree）
- [ ] **加入行事曆**（Google 已有）— 補上 Apple Calendar (.ics)、Outlook
- [ ] **電子紅包選項** — LINE Pay / 街口 / Apple Pay QR + 銀行帳號一鍵複製

### 🥈 中 CP 值
- [ ] **當日天氣預報**（提前 3 天 API 自動帶入）
- [ ] **儀式直播連結**（給無法到場的親友）
- [ ] **賓客即時照片牆** — 掃 QR 上傳照片到雲端相簿
- [ ] **Dress Code 視覺化** — Pinterest 範例、不要穿什麼說明
- [ ] **親友交通整合** — HSR / TRA 班次直連、附近住宿推薦 + 訂房連結
- [ ] **包車共乘登記**（Google Form）
- [ ] **婚禮流程詳細時間軸**（讓賓客知道何時可離席）

### 🥉 加分項
- [x] **多語言切換** — 繁中 / 英 / 日 / 韓
- [ ] **故事相簿 / 影音** — 求婚影片、交往時間軸、Spotify 婚禮歌單
- [x] **賓客留言牆** — 泡泡浮動式祝福牆（資料來自 Google 表單匯出 Excel）
- [x] **LINE 分享按鈕 + 縮圖優化**

### 🚫 不採用
- 帳號登入（賓客嫌煩，跳出率高）
- 抽獎遊戲（婚禮現場互動更好）
- 鬧鐘提醒（已被行事曆取代）

---

## 2026-05-23 多語言與 LINE 分享
- 新增 i18n 系統：支援繁中 / 英 / 日 / 韓四語切換
- Nav 加入語言選擇器（🌐 圖示 + 縮寫）
- 使用者語言偏好儲存於 localStorage
- LINE 分享按鈕（Social Plugin 連結）
- OG meta 翻譯版本，依語言切換 og:locale

## 2026-06-18 賓客祝福泡泡牆（Words of Love）
- 新增 `#wishes` 頁籤（nav 連結 + 暖黑區塊），標題 WORDS OF LOVE / 賓客的祝福
- 資料來源：Google 表單匯出的 Excel（放在 `data/`，**含個資不進 repo**）
  - `data/build_wishes.py`：抓 `data/` 內最新 `.xlsx`，取「與我們的關係」「想對我們說的話」
    兩欄，去識別化（不含姓名 / 電話 / 地址）後輸出 `data/wishes.json`
  - 依關係分類：`俊郁朋友 → groom`（男方）、`雁婷朋友 → bride`（女方）
  - 自動濾除表單預設文字「您的回答」與空白留言
  - 檔案被 Excel/OneDrive 鎖住時，以 Windows 共享讀取（ctypes CreateFileW）繞過
- 前端（script.js）：fetch `data/wishes.json?v=時戳`（`cache:no-store`），
  泡泡隨機洗牌 + 各自隨機慢速浮動參數；**[重新整理]** 按鈕重新讀取並刷新
  - 進入視窗才首次載入（IntersectionObserver）
  - 2026-06-18：避免留言過多，改為**每次隨機抽取 10–15 則**（總數不足則全顯示），每次重新整理重抽
- 樣式（styles.css）：男方藍灰 `#6f93a8`、女方玫瑰 `#c98a98` 半透明泡泡，
  `prefers-reduced-motion` 關閉浮動動畫
- i18n：nav.wishes / wishes.* 四語齊備
- **隱私**：`.gitignore` 加入 `data/*.xlsx`，公開 repo 僅含去識別化 `wishes.json`
- 更新流程：有新回覆 → 重新匯出 Excel 放進 `data/` → `python data/build_wishes.py` → 提交 `wishes.json`

## 2026-06-18 喜餅兌換券（女方專屬頁籤）+ 個人化網址
- 需求：分享連結時於網址加 `?g=<賓客姓名>` 綴詞；網站依姓名判斷男女方，
  只有女方親友看得到「喜餅兌換券」頁籤（男方不顯示）
- 判斷方式（**靜態站、純前端**，已與使用者確認可接受此強度）：
  - `data/build_guests.py`：從 Excel 取「賓客姓名 + 與我們的關係」，姓名正規化
    （NFKC → 去空白 → 小寫）後做 `sha256(salt + name)`，輸出 `data/guests.json`
    （只含 `salt` + 女方姓名雜湊集合，**無明文姓名**，可安全進公開 repo）
  - 同時輸出 `data/voucher_links.txt`（含明文姓名與專屬連結，**已 gitignore**）
  - 前端（script.js）讀 `?g=`，以**相同正規化 + 雜湊**比對 `brideHashes`，命中才
    `hidden=false` 解鎖 nav 連結與 `#voucher` 區塊，並以網址原值顯示「此券專屬於 ◯◯◯」
  - 用 Web Crypto `crypto.subtle`（GitHub Pages / localhost 皆為 secure context）
  - 預設隱藏：`#nav-voucher[hidden], #voucher[hidden]{display:none!important}`；
    沒帶姓名 / 男方 / 比對失敗 → 一律維持隱藏（安全預設）
- UI：直接顯示新人提供的票券設計圖 `Picture/pastry-voucher.png`
  （原檔名為中文 `喜絣兌換券.png`，已改成 ASCII 檔名避免 GitHub Pages 網址編碼問題），
  下方加「此券專屬於 ◯◯◯」與簡短領取說明
- i18n：nav.voucher / voucher.* 四語齊備
- Excel 讀取邏輯抽成共用 `data/_xlsx_util.py`（build_wishes / build_guests 共用）
- ⚠️ 限制：純前端閘門，懂技術的男方賓客仍可翻原始碼看到兌換券內容（非真正權限控管）
- 更新流程：新回覆 → 重新匯出 Excel → `python data/build_guests.py` → 提交 `guests.json`

## 2026-06-18 每位賓客專屬兌換碼成品圖
- 需求：依 Excel 新增的「喜餅兌換碼」欄位（col 12），把每位女方賓客的 8 碼
  （`26091201`~`26091210`）套到票券圖右側 NO. 後方，一人一張
- `data/make_vouchers.py`：以 `Picture/pastry-voucher.png`（NO. 後留空底圖）為基底，
  量測座標（NO. 句點上緣 y≈821、水平中心 x≈1683、深綠 #414B3B），用 Pillow 將號碼
  直書（逆時針 90°、與 NO. 同向）疊上，輸出到 `vouchers/`，檔名「喜餅兌換券_姓名_碼.png」
- 字體：原指定「可畫潮牌楷體」為 Canva 專有字體、無法匯出 → 改用**華文楷體**
  `STKAITI.TTF`（已與使用者確認）
- 共 10 張（女方賓客；男方無兌換碼故不產生）
- 🔒 成品圖含姓名與兌換碼 → `.gitignore` 加入 `vouchers/`，供私下發送、不進公開 repo
- 重新產生：`python data/make_vouchers.py`（換字體：`python data/make_vouchers.py <字體路徑>`）
- ⚠️ **注意事項（未來開發必讀）**：目前「喜餅兌換碼」與女方賓客名單**都還是測試階段資料，
  尚未最終確認**。現有 10 張成品圖、`guests.json` 雜湊都是測試資料產生的。正式對外發送前，
  務必先確認「人員名單與兌換碼是否已定案」，定案後重跑 `build_guests.py` 與 `make_vouchers.py`。

## 2026-06-18 電子喜帖連結欄位填入值
- 依「是否需要寄送喜帖」欄判斷：值為「響應環保，電子喜帖即可」或「2個都要🕶」者需要電子喜帖
  → 填入個人化連結 `?g=<姓名>`（與網站 `?g=` 解鎖機制、`voucher_links.txt` 同格式；男方帶了
  也無妨，兌換券不會顯示）；「想收藏紙本喜帖」與空白則留白
- 30 位中 26 位需填、4 位留白
- `data/fill_invite_links.py` 產生：`einvite_links_column.txt`（依 Excel 列順序、可整欄貼回）、
  `einvite_links_reference.csv`（核對用）；兩者含明文姓名 → 已 gitignore，不進 repo
- 未直接覆寫原始 Excel（檔案被鎖、且為使用者排版好的主檔）→ 改提供整欄可貼回的值

## 2026-06-18 喜餅兌換券撕票動畫 + 誤撕復原
- 票券圖沿虛線（量測 x≈1222 → 61.6% 寬）以 `clip-path` 切成「主券(左)+票根(右)」兩層（同一張圖）
- 輕觸票根 → 票根自頂端外翻、往下落、淡出（transform-origin 頂端 seam + rotate + translate + opacity）；
  主券保留虛線撕邊；shadow 用 `filter: drop-shadow` 跟著撕後形狀
- **[復原] 按鈕**：撕除後出現；撕除狀態記 `localStorage`（key 帶 `?g=` 姓名），重新整理仍保持，
  由 storage 還原時加 `is-initial` 不播動畫
- **誤撕復原需核銷驗證碼**：點 [復原] → 自訂 `<dialog>` 彈窗（非瀏覽器預設 alert/prompt），
  顯示「請與主辦單位聯繫索取核銷驗證碼」訊息 + 密碼輸入；輸入正確碼才 `setTorn(false)` 解鎖，
  錯誤顯示提示、取消/背景/ESC 關閉。i18n `voucher.unlock.*` 四語
  - ⚠️ **核銷驗證碼目前暫定 `0638`**（寫在 `script.js` 的 `UNLOCK_CODE`）。依設計**活動開始前三天會變更**，
    屆時需更新 `UNLOCK_CODE` 並通知賓客。彈窗內也附此變更提醒（`voucher.unlock.note`）
  - 2026-06-18 追加：應使用者要求，彈窗標題下方以**粗體置中**顯示【核銷驗證碼：0638】（`.vm-code`，
    由 `UNLOCK_CODE` 經 `syncCodeHint()` 單一來源帶入、開窗時依語言更新）。即開窗者皆可見碼、可自行解鎖
    （測試階段便利；正式階段視需要再決定是否隱藏）
  - 注意：純前端閘門，0638 寫在 client 原始碼 → 懂技術者可檢視，屬軟性防呆而非真正權限控管
- 觸發採「輕觸」而非「下滑」：避免捲動時誤撕（與「誤撕復原」初衷一致）
- i18n：`voucher.tear` / `voucher.restore` / `voucher.unlock.*` 四語

## 2026-06-18 iPhone(iOS Safari) 三項修正
- 回報：①祝福泡泡不浮動 ②兌換券撕除無動畫、瞬間消失 ③復原彈窗未置中/未持續顯示
- ①②根因：先前 `prefers-reduced-motion: reduce` 把泡泡浮動與撕票過渡「關掉」——iPhone 開
  「減少動態效果」即觸發。修正：移除這兩個 reduce-motion 停用規則（裝飾動畫刻意保留播放）
- 泡泡浮動另避開 iOS 對 keyframe 內 `var()/calc()` transform 的問題 → 改三組**固定數值** keyframe
  （`wishFloat` / `wishFloat2` / `wishFloat3`，JS 以 `f2`/`f3` class 輪流套用 + 隨機時長/相位）
- 健壯性：泡泡基底改 `opacity:1` + `wishIn forwards`（移除 stagger）→ 即使瀏覽器停用動畫也可見，
  不會卡在 `opacity:0` 隱形（移除原本依賴入場動畫才顯示的寫法）
- 撕票票根加 `will-change: transform, opacity` 促 iOS 提升合成層，平順過渡含 `clip-path` 的元素
- ③彈窗置中：`.voucher-modal { position:fixed; inset:0; margin:auto; width:min(92vw,420px);
  height:fit-content }`（iOS 穩定置中）；並加「開窗 350ms 內忽略背景點擊」避免 iOS 觸控把開窗的
  tap 帶到背景 → 秒關
- 限制：預覽環境(自動化 Chromium)停用 CSS 動畫，無法在預覽看到浮動/撕票實際動態；邏輯與可見性已驗證，
  動態需於真機(iPhone Safari)確認
- ⚠️ **評估結論（電話+簡訊OTP 驗證身分）：不做**。理由：①靜態站無後端，OTP 需外接 Firebase/Twilio
  等付費服務 ②比對「表單電話」會逼電話個資上前端或後端 ③撕除狀態存 localStorage，清快取/換裝置即繞過，
  OTP 擋不到重複領。真正核銷交給現場「兌換碼 + 名單劃記」即可，不需後端。

## 2026-06-19 掃碼核銷 + 即時蓋章（Firebase）— 進行中 / 交接
目標：賓客撕券後顯示專屬 QR → 工作人員 iPhone 掃 → verify 頁顯示賓客資訊 + 已領取/取消 →
寫 Firestore → 賓客那張券**即時浮現紅色「已領取」電子印章**（仿公文印章風）。

**架構**
- Firestore 集合 `vouchers`，doc id = **姓名雜湊**（`sha256(salt + 正規化姓名)`，與網站 `?g=` 解鎖、
  `guests.json` 同一套；salt 取自 `guests.json`），欄位 `{ name, side:'bride', code, redeemed, redeemedAt }`，只放 10 位女方
- QR 內容 = `verify.html?h=<雜湊>`；賓客券頁用 `onSnapshot` 監聽自己那筆 → `redeemed:true` 就蓋章
- 工作人員以 Firebase Auth（email/密碼）登入**一次**即記住；安全規則限定只有登入者能改 `redeemed/redeemedAt`

**Firebase 專案（已建）**：`cy-wedding-aad98`｜Firestore `asia-east1` 正式版｜Auth email/密碼啟用｜
工作人員帳號（見 Firebase 主控台 Authentication，此處不記錄）｜web config 已存於 `firebase-config.js`

**已完成（本 repo）**
- `firebase-config.js`（公開安全的 web config）
- `firestore.rules`（安全規則：賓客可讀、僅登入者可改 redeemed/redeemedAt、前端不可增刪）
- `data/import_firestore.py`（用服務帳戶金鑰把 10 位女方匯入 Firestore；既有文件保留領取狀態）
- `.gitignore` 已擋 `serviceAccountKey.json`（管理員機密）

**前端已完成（2026-06-19 本次）**
- `firebase.js`：ESM 共用初始化（gstatic CDN SDK 10.12.5 + `firebase-config.js`），匯出 `db` / `auth`，
  供賓客券頁與 verify 頁共用
- 賓客券即時狀態 `voucher-live.js`（`<script type="module">` 載入）：
  - 由 `?g=` 算姓名雜湊（與 `guests.json` 同一套 salt / 正規化），命中 `brideHashes` 才動作
  - **撕券後**才顯示專屬 QR（`#voucher.is-torn` 控制；`script.js setTorn()` 一併 toggle `is-torn`），
    QR 內容 = `verify.html?h=<雜湊>`（用 `new URL(...,location.href)` → GitHub Pages 子路徑 / localhost 皆正確）
  - QR 產生器走 CDN `davidshimjs/qrcodejs`（pin commit）；載入失敗自動退回顯示文字連結（`.vq-fallback`）
  - `onSnapshot` 監聽自己那筆 `vouchers/<雜湊>`：`redeemed:true` → 浮現紅色「已領取」印章（`.voucher-stamp`，
    仿公文紅印、`vsStamp` 蓋章動畫）；取消核銷 → 撤章
- `verify.html`（工作人員核銷頁，內部用、`noindex`）：
  - Firebase Auth email/密碼登入（預設 local persistence，登入一次即記住）；`onAuthStateChanged` 切換登入/面板
  - 讀 `?h=<雜湊>`（驗 64 hex）→ `onSnapshot` 即時顯示姓名 / 兌換碼(NO.) / 已領取狀態 / 核銷時間
  - 〔確認核銷〕`updateDoc redeemed:true, redeemedAt:serverTimestamp()`；〔取消核銷〕`redeemed:false, redeemedAt:null`
    （只動這兩欄，符合 `firestore.rules`）；登出鈕
- i18n：新增 `voucher.qr.note` / `voucher.stamp` 四語（verify.html 為內部頁，僅中文）
- ✅ 本機預覽驗證：verify 登入頁正常、Firebase SDK/模組無 console error；index 強制 reveal+撕券後 QR 以
  qrcodejs 成功 render（canvas）、「已領取」印章正確疊在主券上。**真 Firebase 端到端需待下方使用者任務完成**

**後端設定進度**
- ✅〔金鑰〕`data/serviceAccountKey.json` 已就位（`cy-wedding-aad98`，gitignored）
- ✅〔套件〕`firebase-admin 7.4.0` + `openpyxl 3.1.5` 已裝
- ✅〔匯入〕`python3 data/import_firestore.py` 已跑（2026-06-19）：10 位女方寫進 Firestore `vouchers`，
   全部 `side=bride`、`redeemed=False`；姓名雜湊 10/10 與 `guests.json` 一致、兌換碼 26091201~10 對齊
   （⚠️ 兌換碼目前仍為**測試值**，定案後更新主檔重跑即覆蓋，`redeemed` 狀態會保留）
- ⏳〔使用者·主控台·尚缺〕Firestore→規則 貼上 `firestore.rules` 內容並**發布**
   —— 匯入用 Admin SDK 會跳過規則，但**前端 client（賓客 onSnapshot 讀、工作人員 updateDoc 寫）需規則發布後才能運作**
- ⏳〔端到端測試〕①帶某位女方 `?g=` 開站 → 撕券 → 出現 QR；②另一裝置/手機掃 QR 開 verify → 用
   工作人員帳號登入 → 按「確認核銷」→ ③回賓客那張券應**即時浮現「已領取」印章**；再測「取消核銷」撤章
- ⏳〔收尾〕跑通後 commit → 合併 master → push
- ⚠️ 跨機器：原始 Excel、`serviceAccountKey.json` 等個資/機密**不在 git**，換機器要另外帶；`guests.json` 在 git。
- ⚠️ QR 走外部 CDN（qrcodejs）：現場若無網路，QR 與 Firebase 皆不可用 → 仍以「兌換碼 + 名單劃記」為後備。

## 2026-06-19 匿名留言（祝福牆免表單留言）+「重新整理」改「重新抽取」
- 功能2：祝福牆「重新整理」鈕 → 改名 **「重新抽取」**（4 語 i18n；語意貼合每次隨機抽 10–15）
- 功能1：祝福牆新增 **「匿名留言」** 鈕（無 emoji）→ 自訂 `<dialog>` 彈窗（textarea 150 字上限 + 即時字數）
  → 送出寫入 Firestore **`wishes`** 集合
  - 審核機制（與使用者確認）：**即時上牆 + 後台刪除**；送出後立即把自己那則排到最前面（保證看到）
  - 泡泡池 = `wishes.json`（表單匯入）+ Firestore `wishes`（取最新 200）合併 → 隨機抽 10–15；重新抽取重抓
  - 防護：150 字上限、空白擋、10 秒冷卻（localStorage `cy.wish.last`）、送出時禁用鈕；任一資料來源失敗不影響另一個
- 新檔 **`wishes-live.js`**（module，匯出 `window.__cyWishesLive`: `fetchWishes()` / `post(text)`）；index 以
  `<script type="module">` 載入；非模組的 `script.js` 透過該全域與之協作（renderBubbles 抽出 `makeBubble` 共用）
- **`firestore.rules` 新增 `wishes`**：公開讀、`create` 限欄位(text/createdAt)+長度(1–150)+`createdAt==request.time`、
  不可改、登入工作人員可刪
- ✅ 本機驗證：鈕/彈窗/字數/驗證/優雅降級皆正常；規則未發布時 `fetchWishes` 回 `[]`、泡泡牆照常顯示 json；
  送出在規則未發布時優雅失敗（toast「送出失敗」）；無 console error
- ✅ 規則已發布：使用者已在主控台發布含 `wishes` 區塊的規則 → 匿名留言**端到端可用**（本機實測：
  乾淨留言成功寫入、`fetchWishes` 讀回；同時兌換券核銷的 client 端也因此解鎖）
- ✅ **Phase 3 敏感字詞過濾（前端）**：`script.js` 內 BANNED 黑名單（中英髒話，NFKC+去空白+小寫比對），
  送出含不當字詞 → toast「留言含不當字詞」擋下（本機實測「王八蛋」被擋、乾淨留言通過）。
  限制：純前端可繞過、抓不到誹謗/謾罵 → 最終把關靠下方後台刪除
- ✅ **Phase 2 後台留言管理**：`verify.html` 新增「匿名留言管理」卡（工作人員登入後）：
  `onSnapshot` 即時列出所有 `wishes`（時間序、可搜尋、計數）+ 每則「刪除」鈕（`deleteDoc`，規則限登入者）。
  本機實測頁面載入正常、區塊存在、無 console error；**登入後的刪除需以工作人員帳號實測**
- ⚠️ 待清理：Firestore `wishes` 目前有 2 筆測試留言（`"123"`、`"祝你們永遠幸福快樂"`）→ 上線前/後用
  verify.html 後台刪除（順便驗證 Phase 2），或於 Firestore 主控台手動刪

## 2026-06-19 verify.html「掃描下一位」頁內相機掃碼
- 痛點：核銷一位後要離開頁面、回手機相機 App 掃下一個 QR
- 在核銷卡與名單卡中間加「掃描下一位」鈕 → 頁內 `getUserMedia`（後鏡頭, playsinline）+ `jsQR` 解碼
  （jsdelivr CDN）；iOS Safari 無原生網頁掃碼 API 故用此法
- 解到 QR → `extractHash()` 取 `?h=` 的 64-hex → `loadVoucher(h)`：不重整頁、unsub 舊的 onSnapshot、
  `history.replaceState` 更新網址、重新監聽該券；掃完可連續再掃（相機權限只問一次）
- 降級：getUserMedia 不支援/被拒 → 提示改用手機相機 App，原核銷流程不受影響
- ⚠️ 需 HTTPS（線上可用）；相機實測需於真機 iPhone Safari
- 本機驗證：jsQR 載入、掃描器元件齊全、無 console error（相機/掃描本身無法在預覽測）

## 2026-06-22 禮金統計 — Phase 1（手動入帳 + 即時報表 + CSV 匯出）

### 背景
- 禮金簿由現場人員手寫，登簿者不在旁邊→工作流程是批次（登一段後拍照/拿到後台）
- 金額格式：繁體大寫（壹仟陸佰）、簡體中文（一千六百）、阿拉伯數字，無外幣/支票
- Phase 2 將接 Firebase AI Logic + Gemini 視覺辨識，低信心策略 C：
  姓名低信心 → 留空必填；金額低信心 → 顯示猜測值但標紅

### 本次完成（Phase 1）
- **`firestore.rules`** 新增 `gifts` 集合規則：**讀寫皆需登入工作人員**（財務敏感，永不公開）
  ⚠️ 規則需手動到 Firebase 主控台貼上並**發布**
- **`verify.html`** 新增「禮金統計」卡（工作人員登入後顯示）：
  - KPI 列：禮金總額 NT$ ___ ｜ 筆數 ｜ 平均金額（即時更新）
  - 手動輸入：[＋ 新增項目] → 姓名 / 金額 彈出列 → 可加多列 → [確認入帳 N 筆] 批次寫入 Firestore
  - 已入帳明細：`onSnapshot` 即時顯示，每筆可刪除（誤刪重輸）
  - [匯出 CSV]：含 BOM、由舊到新、末尾附合計，可直接 Excel 開啟（中文不亂碼）
  - 登入/登出時正確顯示/隱藏，`giftsUnsub` 取消監聽
- **資料結構** `gifts/{id}`：`{ name, amount:Number, note, source:'manual', confidence:null, createdAt, by }`
  （Phase 2 OCR 入帳時 source='ocr'，confidence='high'/'low'）

### 尚待使用者
1. Firebase 主控台 → Firestore → 規則 → 貼上新的 `firestore.rules` 內容 → 發布
2. 登入後台測試：新增幾筆手動金額 → KPI 更新 → 匯出 CSV 確認
3. Phase 2（Gemini OCR）待禮金簿確認後開發；有禮金簿空白版面可拍一張給我調 prompt

## 2026-06-22 禮金統計 — Phase 2（Gemini OCR 拍照辨識 + 校對表）

### 採用 Firebase AI Logic（前端安全呼叫 Gemini，免費 Spark 方案）
- 經研究代理併行查證官方文件確認：AI Logic Web SDK 在 **firebase 12.15.0** 才有（`firebase-ai.js`）；
  後端用 `GoogleAIBackend()`＝Gemini Developer API＝**免費額度、不需 Blaze**；模型 `gemini-2.5-flash`
- 強制結構化輸出：`Schema.array(Schema.object({name,amount,raw,confidenceName,confidenceAmount}))` + `responseMimeType:"application/json"`

### ★隔離載入策略（守住「現有功能不能壞」）
- 研究建議全站 10→12 升級，但那會動到運作中的核銷/即時蓋章/留言。為零風險：
  - 新檔 **`gift-ocr.js`** 自建一個**具名** v12 app（`"cy-ai"`），**只**用於 Gemini；
    站上其他功能仍走 `firebase.js` 的 v10 預設 app，**一行未改**
  - verify.html **只有點「拍照／選圖辨識」鈕時才『動態 import』** gift-ocr.js → 頁面載入與既有功能 0 影響
  - ✅ 本機實測：同頁同時載入 v10 + v12 兩版 Firebase，**零警告、零衝突**

### verify.html「禮金統計」卡新增
- `[📷 拍照／選圖辨識]`（`<input type="file" accept="image/*" multiple>`，可一次多張、批次辨識）
- 辨識結果進「校對表」（沿用手動入帳同一條 addDoc 路徑）：
  - **策略 C**：姓名低信心 → 留空必填（placeholder 顯示「疑似：◯◯」）；金額低信心 → 帶猜測值但**紅框**
  - **同名偵測**：與已入帳或本批其他列同名 → **橘框** + 「疑似重複」提示
  - 每列顯示 `原文：…`（Gemini 逐字照抄）供核對
  - [確認入帳 N 筆]：只寫入有效列、**只移除已入帳列**（低信心未填完者保留繼續編輯）
- Firestore `gifts` 欄位沿用 Phase 1：OCR 入帳 `source:"ocr"`、`confidence` 記原始金額把握度（稽核用）
- 影像處理：手機照片先 canvas 縮到長邊 1600px / JPEG 0.85（省流量、避開 20MB 上限、加速）

### gift-ocr.js prompt（無禮金簿樣張版）
- 格式無關通用：表格/條列/任意手寫皆逐筆抓；金額大寫(壹仟陸佰)/國字(一千六百)/阿拉伯(1,600) → 整數
- 無外幣/支票；塗改列仍抓並標 low；不抓表頭/總計列；只回 JSON 陣列
- ⚠️ 首次辨識準確度會比有樣張校調過的低，但有「校對表人工核對」當安全網；拿到禮金簿拍一張版面即可微調 prompt 提升準確度（免改架構）

### ⏳ 尚待使用者（主控台一次性設定，否則辨識會報「尚未啟用 AI Logic」）
1. Firebase 主控台 → Build → **AI Logic** → Get started → 選 **Gemini Developer API**（不要選 Vertex）→ 啟用（免費、不需開 Blaze）
2. 確認專案維持 **Spark（免費）方案**，勿升 Blaze
3. （建議）Build → **App Check** → 註冊本網站、reCAPTCHA v3、取得「網站金鑰」→ 取消 `gift-ocr.js` 內 App Check 三段註解並填金鑰（防他人盜用 config 濫打配額；本機測試需加 debug token）。私密 noindex 後台，先不啟用亦可運作
4. 拿一張真實/示意禮金簿照片做 **smoke-test**（首用務必）：點辨識 → 校對 → 入帳

### 風險備註（研究交叉驗證後保留）
- **模型字串**：用 `gemini-2.5-flash`（確認可用）。研究發現 live docs 另出現 `gemini-3.5-flash`（超出訓練截止、未能 100% 確認真偽）→ 若主控台 Models 確有此免費視覺模型，可改 `gift-ocr.js` 的 model 字串提升準確度
- `gemini-2.0-flash` 系列已於 2026-06-01 停用，勿用
- `result.response.text()` → JSON.parse 為文件標準寫法，已包 try/catch；首次真打一張照片確認端到端
- ✅ 本機驗證：模組載入、Schema 建構、cy-ai app 初始化、校對表渲染/低信心紅框/同名橘框/入帳鈕驗證全部正常；**真實 Gemini 呼叫待主控台啟用後由使用者 smoke-test**

## 2026-07-27 頁尾版權標示（四語，低調一行）
- 需求延續上一則：既然無法轉私人，改在畫面上加版權警語。
  **定位說明**：這是法律／嚇阻層面，**不是技術防護**——靜態站無法阻止檢視原始碼；與 `_config.yml` 的技術修正互補。
- 賓客頁 `index.html` 頁尾（`.seeyou-inner`，「See you Soon!」下方）新增一行：
  `© 2026 ChunYu & YanTing · 版權所有 / 本網站內容與照片僅供親友瀏覽，請勿轉載`
  - i18n key `copyright.line`（`data-i18n-html`，含 `<br>`），**中／英／日／韓四語齊備**
  - `.seeyou-copy`：0.6rem、行高 1.9、字距 0.12em、`rgba(246,245,236,0.42)`——與 `.seeyou-admin` 同調性，不搶主視覺
  - 放在 `.seeyou-inner` 內（正常流排版），不用絕對定位 → 不會與左下角後台連結／回頂端鈕碰撞
- 後台 `verify.html` **依使用者決定不加**未授權存取告示（維持「CY Wedding · 內部核銷用」）
- 資產版本 bump：`styles.css` / `script.js` → `?v=20260727`
- ✅ 驗證（手機 375px）：四語切換皆正確、`&` 正常渲染、`<br>` 有效；置中、與後台連結／回頂端鈕**不重疊**、無水平溢出、無 console error
  - 註：預覽環境 IntersectionObserver 未觸發 `.reveal→.in`（既有 `.seeyou-text` 同樣現象，非本次問題）；截圖工具因 Browser pane 未顯示而不可用，改以量測驗證

## 2026-07-27 安全：Pages 不再公開開發文件／資料腳本；清除文件內工作人員帳號
- 起因：使用者詢問「網址不變下把 repo 轉私人」。查證結論：
  **GitHub Free 方案的私人 repo 無法使用 Pages** → 一轉私人，`fsc0638.github.io/CY_Wedding/` 全數 404、
  已發出的賓客連結立刻失效。需 **GitHub Pro（付費）** 才能「私人 repo + 網址不變」。
  另需釐清：**repo 私人 ≠ 網站私人**；即使升 Pro，Pages 站點仍公開（賓客本來就要能開）。
- 實測發現的真曝光：Pages 會把 repo 內**所有檔案**當靜態檔服務，故下列網址原本任何人可直接下載：
  `/DEVLOG.md`（含核銷驗證碼、**工作人員 Gmail 帳號**、Firebase 專案 ID、後台位置）、
  `/DEPLOY_FINAL.md`、`/data/*.py`。**轉私人也修不掉這條**（走的是網站網址，不是 github.com）。
- 處置：
  1. 新增 `_config.yml`（Jekyll `exclude`）→ Pages 不再輸出 DEVLOG.md / DEPLOY_FINAL.md / firestore.rules / `data/*.py`；
     檔案仍留在 repo 供跨機器交接。⚠️ **刻意保留 `data/guests.json`、`data/wishes.json` 的輸出**（網站執行時 fetch，排除會壞站）。
  2. 清除 DEVLOG.md 內 2 處**工作人員 Gmail 帳號**（改為「見 Firebase 主控台 Authentication」）。
- 前置確認：repo 無 `.nojekyll`（Jekyll 本就在跑）、HTML/JS 無 `{{`/`{%` 樣板語法 → 加 `_config.yml` 安全。
- ⚠️ 仍存在的限制（Free 方案、repo 維持公開）：
  - 這些檔案在 **github.com 上仍看得到**（含 git 歷史內的舊 email）。要連 github.com 也隱藏 → 需 Pro + 轉私人。
  - `script.js` 的 `UNLOCK_CODE = "0638"` 本就會被看到（靜態站設計上的軟性防呆），非本次新增曝光。
- ✅ 驗證：email 已無殘留、`_config.yml` YAML 有效（13 項、未誤排除必需 JSON）；上線後實測各網址狀態碼。

## 2026-07-02 一鍵名單重整上線工具 `data/deploy_roster.py`
- 需求：名單已上線後仍會零星手動加人；維持 xlsx 檔名不變，一個指令重整整份並正確上線。
- 新檔 `data/deploy_roster.py`（orchestrator，subprocess 呼叫現有 5 支腳本，一行不改它們）：
  流程 build_guests → build_wishes → make_vouchers（字體依平台自動選）→ fill_invite_links → import_firestore --prune → git commit/合 master/push → 抓 live guests.json 驗證。
- 設計（手動填碼 + 一鍵到底，經使用者確認）：
  - **冪等**：沒改就重跑→無異動收工；**碼穩定**（build_guests 沿用 salt）；**保留已核銷**（import merge + --prune 只刪未核銷殘留）。
  - **差異基準** `.roster_snapshot.json`（gitignore、含姓名）：比對出 ➕新增/➖移除/✎編號類型變動，精準判斷 `firestore_needed`。
  - **半套防呆**：有金鑰＝完整上線機；**無金鑰＝只預覽、零寫入**（避免前端有新雜湊、Firestore 沒券）。
  - 驗證/警示：女方沒填編號、既有編號被改（會讓已寄券失效）、同名、重複碼、格式異常。
  - git 只 stage guests.json/wishes.json；`--dry-run`/`--yes`/`--no-deploy` 旗標。
- `.gitignore` 加入 `data/.roster_snapshot.json`。
- ✅ 本機驗證（Windows，用 `py`；`python`/`python3` 為 Store 別名 stub 會壞）：dry-run 報告正確（53人・女方券23=中21+中西2・未發券2/警示王聖鈞·石哲華）、首次基準、**無金鑰防呆拒絕且零寫入**、種入相同快照→firestore_needed=否→4 支 build 子程序皆跑→冪等無異動不 push。Firestore 匯入/git push/線上驗證需金鑰在 Mac 跑（元件皆既有已驗證）。
- 用法寫進 `DEPLOY_FINAL.md` 最上方；Windows 用 `py`、Mac 用 `python3`（腳本內部走 sys.executable，子程序可攜）。

## 2026-06-30 最終名單定案 — 重建資料（女方 23、新增「中式+西式」）⚠️ 待 Mac 重匯 Firestore
最終出席調查 xlsx（0630，53 筆回覆）匯入，取代測試資料。**此 commit 只進 fsc，尚未合 master**。

### 新檔重點
- 53 筆：男方 28、女方 25；留言 47 則
- **欄位改名**（新檔 vs 舊腳本）：「喜餅兌換碼」→「喜餅兌換券編號」(col 11)、「喜餅樣式」→「喜餅類型」(col 12) → 已更新所有 find_col 關鍵字
- 女方 25 位中 **2 位未填兌換券編號** → 決定「不發券」：`build_guests.py` 改為「女方＋有編號」才進 brideHashes（那 2 位券頁不顯示，避免半殘券面）
- **新喜餅類型「中式+西式」(2 位)** → 決定「兩盒都領」：`import_firestore.py` 新增 `map_gift()`（含中又含西→`both`）；`verify.html` 新增 both 呈現

### 改動
- `data/build_guests.py`：加 code 欄查找；brideHashes 限「女方+有碼」；links 標「女方(有券)/女方(未發券)」
- `data/make_vouchers.py`、`data/import_firestore.py`：find_col 改抓「喜餅兌換券編號/喜餅類型」
- `data/import_firestore.py`：`map_gift()` → chinese/western/**both**（giftType 存 both）
- `verify.html`：GIFT_LABEL/GIFT_BADGE/giftTypeOf；名單欄位用 `gift`（chinese/western/both）；核銷面板大徽章、名單徽章、CSV、統計、總覽 KPI、新增「中+西」篩選鈕＋ `.badge-both`（紫）
  - guest 端（index/script/voucher-live）**不需改**：喜餅類型只給工作人員看（避免發錯盒），賓客券面不顯示類型

### 產出（本機已跑）
- `data/guests.json`：新 salt `b4ef1bf8616d930e`、**23** 女方雜湊（公開、進 repo）
- `data/wishes.json`：**47** 則（公開、進 repo）
- `vouchers/`：**23** 張券圖（編號 26091211–26091234，gitignored，私下發送）；已清掉舊 10 張測試券
- ⚠️ 個資保護：xlsx / vouchers/ / voucher_links.txt 皆 gitignore，未進 repo（已 git check-ignore 確認）

### 追加（同日）：通用連結 + salt 沿用 + 英文名驗證
- 需求1：男方無兌換券機制 → `?g=` 對男方/女方未發券者無作用 → `build_guests.py` 的 `voucher_links.txt` 改為：
  頂部 1 條**通用電子喜帖連結**（男方 28 + 女方未發券 2 = 30 位共用、不分人）+ **23 條女方專屬連結**（個別發送）
- robust：`build_guests.py` 改為**沿用既有 guests.json 的 salt**（重跑不再亂換 salt 害已匯入的 Firestore 對不上）→ 本次重跑 guests.json 未變動
- 需求2（英文名「被雜湊避開」）：**查無此問題**。Kevin/Renee 經正規化(NFKC+去空白+小寫)後雜湊**確實在 brideHashes**、Python 與前端 JS 正規化一致、大小寫皆通；瀏覽器實測 `?g=Kevin` 兌換券正常解鎖、名稱顯示「Kevin」。英文 `?g=Kevin` 看似未編碼只因 ASCII 不需 percent-encoding（中文 `%E9…` 也只是傳輸編碼）。若線上測不行＝最終資料尚未上線（master 仍舊版）

### ⚠️ 上線前必做（安全順序，勿先合 master）
salt 重新產生 → 所有雜湊改變 → 現有 Firestore 舊測試券會對不上。本機**無 serviceAccountKey.json**，無法匯入。
1. **Mac**：`git pull`（fsc）→ `python data/import_firestore.py --prune`（用新 guests.json 的 salt 重建 23 筆、清掉舊測試殘留）
2. **端到端驗證**：取一位女方賓客 `?g=<姓名>` → 撕券 → 出現碼/QR → 另機掃 → verify 登入核銷 → 賓客券浮現「已領取」；測一位「中式+西式」者後台應顯示紫色「中式+西式」徽章
3. 通過後再 **合併 fsc → master 上線**
- ✅ 本機驗證：build 腳本輸出正確（23/47/23）、verify.html「中+西」鈕＋徽章＋無 console error；真實「both」名單渲染待 Mac 端 Firestore 有資料後確認

## 2026-06-22 婚禮管理後台幕前功能分頁化（Tabs）
- 動機：資料量長到 1–200 筆時單頁會拉很長；改成分頁讓每頁短、好操作
- verify.html 登入後改為：總覽 KPI 常駐 + **sticky 分頁列**（核銷／名單／留言／禮金）
  - `setTab(name)`：toggle `.tab.active` + 控制各卡 hidden；核銷分頁 = 掃描鈕 + 面板(帶券)/提示(無券)
  - 分頁帶**數量徽章**（名單/留言/禮金筆數，由 render 函式經 `setTabCount()` 即時更新）
  - 掃 QR / `loadVoucher()` → `setTab("redeem")` 自動跳核銷分頁顯示面板；onAuthStateChanged 登入套用 activeTab
  - 移除舊 `.btn-scan + .card{margin-top:0}`（單頁版等距用，分頁後無意義且讓名單卡間距不一致）
- 不改任何既有邏輯：核銷/取消/即時蓋章、名單篩選/搜尋/CSV、留言刪除、禮金 OCR/手動/入帳/刪除/匯出、頁內掃描
  全部沿用（卡片只是「隱藏」非「移除」，監聽只綁一次，render 照常在快照觸發）
- ✅ 驗證：本機實測四分頁切換/各自單卡/active 狀態、redeem 帶券→面板 vs 無券→提示、sticky+綠底+徽章樣式、無 console error
- ✅ 對抗式回歸審查（2 reviewers + synth）：**0 真實回歸、判定可上線**；唯一附帶發現＝登出未清搜尋字串（既有瑕疵、非本次造成、不阻擋）
- ⏳ 可選後續：登出時一併清空 rosterSearch/wishesSearch/篩選（既有小 quirk）

## 2026-06-22 電子喜帖測試公版（?g=測試人員）
- 需求：給測試人員的電子喜帖公版——有顯示名稱則為「測試人員」、要有兌換券、兌換碼全填 9
- 做法：把 `?g=測試人員` 設為**測試公版專用短路**，自我完備，不動 `guests.json`、不建 Firestore 券、不污染真實資料：
  - `script.js`：`norm === normName("測試人員")` → 直接 `reveal()`（免進女方名單），名稱顯示「測試人員」
  - `voucher-live.js`：同條件 → `#voucherNo = "99999999"`、畫示意 QR（verify.html?h=64個9）、`return` 不連 Firestore
  - 測試連結＝ **`...?g=測試人員`**，格式與真實個人化連結一致；撕券/復原(0638) 等前端流程照常可測
- index.html 資產 bump：`script.js?v=20260622`、`voucher-live.js?v=20260622`
- ✅ 本機驗證：①`?g=測試人員` → 券區/nav 顯示、名稱「測試人員」、碼 99999999、QR 已產生（canvas）；
  ②非測試名稱（如「隨機路人甲」）→ 仍維持隱藏（真實閘門未受影響）；③無 console error
- 線上測試連結：`https://fsc0638.github.io/CY_Wedding/?g=測試人員`

## 2026-06-22 後台共用 UI：消除所有瀏覽器預設 confirm/alert
- 需求：管理後台中凡「等待狀態」或「二次確認」的操作，一律後台風格、不要瀏覽器預設彈窗
- verify.html 新增共用 UI kit（後台白卡風格，與 OCR 小視窗一致）：
  - `uiConfirm({title,message,okText,cancelText,danger})` → Promise<bool>；danger=true 用紅色 `.btn-danger`；
    點背景或 Esc = 取消；訊息 `white-space:pre-wrap` 支援換行
  - `uiAlert(message,title)` → 單鈕提示（取代 alert）
  - `uiBusyShow(text)/uiBusyHide()` → 等待中小視窗（沿用 `.ocr-overlay` 旋轉樣式）
- 取代全部 9 處原生彈窗（grep 確認 0 殘留）：
  - 二次確認：匿名留言刪除、禮金刪除、取消核銷 → `uiConfirm`（刪除類 danger 紅鈕）
  - 提示：留言/禮金刪除失敗、兩處匯出無資料、兩處相機掃描提示 → `uiAlert`
  - 等待狀態：刪除進行中顯示 `uiBusyShow("刪除中⋯")`（原本只 disable 鈕、無明確等待回饋）
- ✅ 本機驗證：確認框結構/樣式/z-index(2200)/danger 紅鈕/取消·背景·確認皆關閉；
  經真實刪除 handler 端到端驗證 closure uiConfirm promise 正常 resolve；無 console error

### Phase 2 調校 #2：異常金額警示（第二道防線，與 Gemini 信心無關）
- 動機：就算模型誤判金額又謊報 high，仍要有獨立防線提醒核對（補 Phase 1 規劃中的「異常金額警示」）
- verify.html 校對表每列加 `updateAmtFlag()`：金額 → `amountWarn()` 判斷 →
  非整百（`amt%100!==0`）/ 偏低（<600）/ 偏高（>60000）顯示橘色 `.g-flag-amt`「請確認」提示
- 對手動列與 OCR 列皆生效、隨輸入即時更新（修正後自動清除）；台灣真實禮金（整百、≥600）幾乎不會誤報
- ✅ 本機驗證：3600/2000 無警示；550 非整百、500 偏低、99999 非整百皆警示；500→1200 警示清除；無 console error
- ⚠️ 純前端軟提示、不擋入帳；若實測覺得吵可調門檻或移除

### Phase 2 調校 #1：信心校準 + 反編造（依首次 smoke-test 回饋）
- 使用者用網路示意禮金簿實測，發現 4 個問題，本質是**模型過度自信 + 憑空編造**：
  - 姓名沒寫完卻自行補成完整姓名，且謊報 high（無紅框）
  - 沒寫金額卻生出 2000（拿常見金額硬湊），且謊報 high（無紅框）
  - 易混淆字誤判：蔡世昌→蔡哲昌（世↔哲）、徐斐 500→600（伍↔陸），且未標不確定
- 認知：手寫「伍/陸、世/哲」辨識本就無法 100% 正確（視覺極限）→ 目標改為**逼模型誠實標 low**，
  讓既有「校對表紅框」安全網攔得到；校對表程式正確、不動，只改 `gift-ocr.js` 的 prompt + config
- 改動（`gift-ocr.js`）：
  - prompt 重寫為「信心校準 + 反編造」：最高原則『寧可標不確定也不編造』；只有非常確定才可 high；
    沒寫完的姓名只填看得到的部分並標 low；沒金額一律 amount=0+low 且【絕對禁止】編造；
    附易混淆字清單（伍↔陸、世↔哲、士↔土、斐↔裴…）；raw 只照抄看得到的字、半個字就只寫半個
  - `generationConfig` 加 `temperature: 0`（抽取任務求穩、減少瞎掰）
  - 模型註解補上：誤判頻繁可改 `gemini-2.5-pro`（視覺較強）
- verify.html 動態 import 加 `?v=20260622b`，避免吃到舊的 gift-ocr.js 快取
- ✅ 本機驗證模組仍正常載入；**實際辨識效果待使用者用同一張圖重測**（預期：①②大幅改善；③④至少標紅可攔）

### 修正：剛入帳那筆要重整才看到（serverTimestamp + orderBy 即時排除）
- 症狀：在「按下入帳的同一台裝置」上，剛入帳的那筆 KPI/明細沒即時更新，要重整頁面才出現
- 根因：禮金監聽用 `query(orderBy("createdAt","desc"))`，而 `createdAt` 是 `serverTimestamp()`。
  本地樂觀寫入時該欄仍是 pending（null），會被 `orderBy` 從查詢結果**暫時排除**，待伺服器回填才回到結果集
  （留言牆無此症狀＝送出後有手動樂觀插入最前；名單看板無此症狀＝本就不 orderBy、改前端排序）
- 修法：禮金監聽改成 `onSnapshot(collection(db,"gifts"))`（不查詢端 orderBy）+ `data({serverTimestamps:"estimate"})`
  （pending 寫入先帶本地估計時間）+ 前端 `tsMillis()` 依時間 desc 排序 → 入帳即時反映、無須重整
- ⚠️ 工作人員需重新整理 verify.html **一次**以載入修正後的程式，之後即時更新生效

---

## 2026-06-19 後台進化為「婚禮管理後台」+ 掃描鈕置中 + 管理連結移至頁尾左下
- ①「掃描下一位」鈕上下間距相等：改 `margin:1.5rem 0` + `.btn-scan + .card{margin-top:0}`（中和 .roster 的 1.1rem）→ 實測上下各 24px
- ②verify.html 進化：標題改「婚禮管理後台」；登入後加「總覽」KPI 卡（喜餅已領 X/10、中式·西式、匿名留言數），
  由現有 renderRoster/renderWishes 即時更新；維持單頁捲動，核銷/名單/留言/掃描邏輯不動（僅加顯示與 KPI）
- ③頁尾「婚禮管理後台」連結移出 seeyou-inner、改 `position:absolute` 置於頁尾**左下角**（left 93px、bottom 30px），
  避開左下角「回到最上面」浮動鈕（其右緣 68px，不重疊）；等寬字、低調
- index.html 資產版本 bump 至 `?v=20260620`（styles.css 有變）
- 本機驗證：標題/總覽/KPI 元素、掃描鈕等距、頁尾連結位置與不重疊、無 console error（皆以量測確認；截圖工具卡住未取圖）

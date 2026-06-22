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
工作人員帳號 `kicl1143057@gmail.com`｜web config 已存於 `firebase-config.js`

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
   `kicl1143057@gmail.com` 登入 → 按「確認核銷」→ ③回賓客那張券應**即時浮現「已領取」印章**；再測「取消核銷」撤章
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

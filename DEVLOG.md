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
- [ ] **賓客留言牆**（Notion / Firebase）
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

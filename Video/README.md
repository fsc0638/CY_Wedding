# Video — 文定儀式影片

文定當天（08:00–08:40）在 75 吋電視播放的「新聞快報」風格影片。
版面借用台灣新聞台的下半部框架（左下地區／天氣欄 + 大標題帶 + 跑馬燈），
配色換成本站的婚禮色票，右上角換成 CY 婚禮 logo，主畫面用 `Video/photos/` 的巴黎婚紗照。

## 成品

    Video/out/CY_Wedding_文定快報_1080p_40分.mp4
    1920×1080 · 30fps · H.264 High@4.1 · 無聲 · 40 分鐘 · 約 720 MB

畫面內容是 20 分鐘一輪、重複 2 輪；**但時鐘吃絕對時間，所以是連續的 08:00:00 → 08:40:00**，
不必開循環播放，直接播完就是整場。無聲是刻意的——現場通常自己有音樂，電視靜音直接播即可。

## 三層節奏

| 層 | 換的頻率 | 說明 |
|---|---|---|
| 大標 | 每 38.71 秒（1200 ÷ 31 則） | 換標時整行從標題帶下方滑入 |
| 照片 | 每 12.90 秒（大標 ÷ `screens_per_headline: 3`） | 換得比大標快；**每則大標的第一張必定與換標同格** |
| 天氣 | 每 38.71 秒 | 與大標同步輪播全台 22 縣市 |
| 時鐘 | 每秒 | 吃絕對時間，兩輪不重來 |

一輪刻意設 20 分鐘而不是 10 分鐘：照片秒數 = 大標秒數 ÷ 張數，
一輪只有 10 分鐘的話大標每則僅 19 秒，照片就被壓到 6.5 秒；拉長成 20 分 × 2 輪，
總長仍是 40 分鐘、時鐘照樣連續，但大標與照片都有足夠的停留時間。

一個「畫面」是**一張橫幅照滿版**或**兩張直幅照並排**（並排剛好填滿 16:9，直幅照才不必硬裁）。
照片池會自動洗牌配對，同一對直幅照不會每輪都黏在一起；大約每 5 個畫面插一張橫幅滿版。

## 左下天氣欄

標籤固定寫「桃園區」（婚宴所在地），下方的天氣區塊**隨大標同步輪播全台 22 縣市**，
顯示的是 **9/12 當天的真實預報**：天氣 icon 依 WMO 代碼對應、下方是當日最低—最高溫（小數捨去）。

    python3 Video/fetch_weather.py              # 抓預報 → Video/weather.json
    python3 Video/fetch_weather.py 2026-09-12   # 指定日期

資料來源 Open-Meteo（免 API key，非氣象署官方）。**臨近當天建議重跑一次**——現在存的是 9/10 抓的預報，
兩天後的實際天氣會有變動；重抓後再產片即可。

天氣 icon（`sun` / `sun_cloud` / `cloud` / `fog` / `drizzle` / `rain` / `shower` / `thunder`）
全部由程式畫，免素材、任何解析度都銳利。

## 主角取景

大景照片（柱廊、大門、街景）的主角又小又偏下，直接置中裁切會被標題帶吃掉，
所以裁切位置不是置中、而是依主角位置決定：

1. `Video/detect_subjects.swift` 用 **macOS 內建 Vision** 抓每張照片的人臉框與人體框
   （人臉在大景裡太小抓不到，人體框補得上；用系統框架就不必為產片裝 opencv 之類的重依賴）
2. 主角框放得進「標題帶以上的可見區」→ 整個人塞進可見區，略偏上留頭部呼吸空間
3. 放不下（緊身全身照）→ 改以**頭部**對齊，寧可裙襬被標題帶蓋到也不遮臉

偵測結果快取在 `Video/.focus_raw.json`，照片沒變就不會重跑；新增照片只會偵測新的那幾張。

## 產片

    python3 Video/make_news_video.py                     # 產完整影片（約 11 分鐘，用 CPU-2 個行程平行合成）
    python3 Video/make_news_video.py --seconds 60        # 只產前 60 秒（試看節奏，約 16 秒）
    python3 Video/make_news_video.py --at 65.5           # 只出第 65.5 秒的預覽 PNG（校版面）
    python3 Video/make_news_video.py --crf 25            # 壓小一點（約 560 MB）
    python3 Video/make_news_video.py --scale 2           # 產 4K（框架文字更銳利，照片受原檔解析度限制）
    python3 Video/make_news_video.py --bgm Music/xxx.mp3 # 併入背景音樂（自動淡入淡出）

依賴：Pillow、ffmpeg、swift（macOS 內建，僅首次偵測主角時用到）。
`weather.json` 要先用 `fetch_weather.py` 產生，產片時不會即時連網——這樣才能重跑出一致結果。

## 改內容

文字全部集中在 `config.json`，改完重跑即可，不必動 `make_news_video.py`：

| 欄位 | 用途 |
|---|---|
| `headlines[]` | 大標，一則一行。**刪幾則就自動重新分配秒數**（每則 = `cycle_minutes`×60 ÷ 則數） |
| `timing` | `cycle_minutes` 一輪幾分、`cycles` 重複幾輪、`screens_per_headline` 每則配幾張畫面、`xfade_seconds` 溶接長度 |
| `photo_dir` | 照片資料夾（預設 `Video/photos`）；丟新照片進去就會自動納入並偵測主角 |
| `left_block` | `label` 左下欄標籤、`lead_city` 天氣輪播從哪個縣市開始 |
| `wedding_date` | `fetch_weather.py` 預設要抓的預報日期 |
| `ticker_label` / `ticker_items[]` | 跑馬燈標籤與輪播句子 |
| `tags[]` | 照片區左下的小來源標，依大標順序輪用 |
| `channel_tag` / `clock_start` | 右上 logo 牌右半區的字樣（旁邊的紅點會閃）、畫面時鐘的起始時刻 |

要改總長度就動 `timing`：`cycle_minutes × cycles` 就是成品分鐘數，時鐘會跟著連續走。

## 播放注意

- 檔案拷到 USB 隨身碟插電視即可播。**不需要開循環播放**（時鐘已對齊整場 40 分鐘）。
- 版面座標都是佔畫布寬高的比例，所以 `--scale` 換解析度不會跑版。
- `Video/photos/`、`Video/out/`、`Video/.focus_raw.json` 都不進 git（見 `.gitignore`）：
  照片原檔近百 MB、成品數百 MB，且隨時可重產。

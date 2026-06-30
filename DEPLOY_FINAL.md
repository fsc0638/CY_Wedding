# 最終名單上線步驟（Mac 端執行）

> 目的：把「最終出席名單（0630）」正式上線。
> 現況：所有程式與資料已在 **fsc** 分支；**master 仍是舊測試版（線上運作中）**。
> 原則：salt 換了 → 必須先在 Mac 重匯 Firestore、驗證通過，**才合併 master 上線**。
> 為什麼一定在 Mac：匯入需要 `data/serviceAccountKey.json`（含管理員權限、gitignore、只在 Mac）。

---

## 0. 前置確認（缺一不可）

```bash
cd <你的 CY_Wedding 專案資料夾>          # 例：cd ~/OneDrive/.../CY_Wedding

# (a) 服務帳戶金鑰存在（gitignore、只在 Mac）
ls -l data/serviceAccountKey.json

# (b) data/ 內有「最終 xlsx（0630）」— 靠 OneDrive 同步，不在 git
ls -t data/*.xlsx | head -1
#   → 應列出含「(Responses)0630」那份。若不是，請等 OneDrive 同步完，或把最終 xlsx 放進 data/

# (c) Python 套件
python3 -c "import firebase_admin, openpyxl" 2>/dev/null && echo "deps OK" || pip3 install firebase-admin openpyxl
```

> ⚠️ 若 (a) 缺：到 Firebase 主控台→專案設定→服務帳戶→產生新私密金鑰，改名 `serviceAccountKey.json` 放 `data/`。
> ⚠️ 若 (b) 列出的不是 0630：`import` 會讀到舊檔，務必確認。

---

## 1. 取得最新 fsc

```bash
git checkout fsc
git pull origin fsc
git log --oneline -3        # 應看到「男方/未發券者改用通用連結」「最終名單定案重建」等
```

---

## 2. 重匯 Firestore（核心步驟）

```bash
python3 data/import_firestore.py --prune
```

**預期輸出**：
- `來源：…(Responses)0630.xlsx`（確認讀到最終檔）
- 逐筆 `姓名（編號・gift）→ 雜湊…`，共 **23 位女方**
- `完成：已匯入/更新 23 位女方賓客`
- `--prune`：刪除舊測試殘留（舊 10 筆、salt 不同的）；若有「⚠ 保留（已核銷）」是你之前測試時核銷過的舊券，**無害**，可日後到主控台手動刪。

> 不需要在 Mac 重跑 `build_guests.py`：`guests.json`（含正確 salt 與 23 雜湊）已在 git 內；import 直接讀它的 salt。

---

## 3. 本機端到端驗證（合 master 前先在 Mac 確認）

開一個本機伺服器：
```bash
python3 -m http.server 8000
```

### 測試 A — 賓客端（證明 Firestore 重匯成功）
瀏覽器開：`http://localhost:8000/index.html?g=<一位女方賓客姓名>`
- [ ] 出現「喜餅兌換券」頁籤與區塊、顯示「此券專屬於 ◯◯◯」
- [ ] **券面 NO. 後方有編號**（編號來自 Firestore → 有編號＝重匯成功）
- [ ] 輕觸撕券 → 票根撕開 → 浮現 QR
- [ ] 英文名也測一個：`?g=Kevin` 或 `?g=Renee` → 一樣正常解鎖

### 測試 B — 工作人員端（名單 / 中式+西式）
瀏覽器開：`http://localhost:8000/verify.html` → 登入工作人員帳號
- [ ] **名單**分頁：女方 **23 位**、徽章顯示正確（中式／西式／**紫色「中式+西式」**）
- [ ] 統計列出現「中式 X · 西式 Y · 中+西 Z」
- [ ] 留言分頁：47 則相關；禮金分頁正常

### 測試 C — 核銷 + 即時蓋章（完整往返，建議用兩個視窗）
1. 視窗1：`index.html?g=<某女方>` → 撕券 → 記下 QR 連到的 `verify.html?h=<雜湊>`（點 QR 放大可看；或直接掃）
2. 視窗2：開那個 `verify.html?h=<雜湊>` → 登入 → 按「確認核銷」
- [ ] 視窗1 的券即時浮現紅色「已領取」印章
- [ ] verify 按「取消核銷」→ 視窗1 印章消失
> 此步在 localhost 同機即可測；跨手機的真機測留到第 5 步上線後做。

**A／B（至少）通過 → 才進第 4 步。**

---

## 4. 合併 master 上線

```bash
git checkout master
git merge --no-ff fsc -m "merge: fsc → master（最終名單上線：女方23・中式+西式・通用連結）"
git push origin master
git checkout fsc
```

> GitHub Pages 約 1 分鐘部署。`guests.json`／`wishes.json` 前端皆帶時戳抓取（免清快取）；verify.html 直接載入新版。
> 不需動 Firestore 規則（無新集合、giftType 只是欄位值）。

---

## 5. 上線後真機測試（兩支手機）

- [ ] 手機A 開某女方專屬連結 → 撕券 → 出現 QR
- [ ] 手機B（工作人員）相機掃 QR → verify 登入 → 確認核銷
- [ ] 手機A 的券即時浮現「已領取」印章
- [ ] 挑一位「中式+西式」賓客，工作人員端確認顯示紫色「中式+西式」徽章（提醒給兩盒）

全部通過 → 最終名單正式上線完成 🎉

---

## 發送連結對照（在 `data/voucher_links.txt`，gitignore，僅本機）
- **男方 28 + 女方未發券 2 = 30 位**：共用 1 條通用連結 `https://fsc0638.github.io/CY_Wedding/`（不需分人）
- **女方 23 位**：各自的 `?g=<姓名>` 專屬兌換券連結（個別發送）
- 測試公版（隨時可給人試）：`?g=測試人員`（碼全 9、不影響真實資料）

## 疑難排解
| 症狀 | 處理 |
|------|------|
| `找不到 serviceAccountKey.json` | 金鑰沒放 `data/`（見前置 0-a） |
| import 讀到舊 xlsx | `ls -t data/*.xlsx` 確認 0630 是最新；移走舊 xlsx |
| 賓客券「沒有編號」 | Firestore 沒重匯成功 / 讀錯 salt；重跑第 2 步並看輸出 |
| 線上英文名不解鎖 | 多半是還沒合 master（master 仍舊版）；完成第 4 步即可 |
| 核銷驗證碼 `0638` | 仍為暫定，活動前 3 天改 `script.js` 的 `UNLOCK_CODE` 並通知賓客 |

## ⚠️ 尚未定案
- **核銷驗證碼 `0638`**：暫定，活動前三天變更。
- 喜餅兌換券圖（`vouchers/` 23 張）：本機（Windows）已產生、靠 OneDrive 同步；若要在 Mac 重產需指定 Mac 字體路徑（`python3 data/make_vouchers.py "<某楷體.ttf>"`），否則直接用已產生的即可。

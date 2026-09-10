# -*- coding: utf-8 -*-
"""
make_news_video.py — 產生「新聞快報」風格的文定儀式影片（75 吋電視播放用）

作法：
    版面參考台灣新聞台的下半部框架（左下地區/天氣欄 + 大標題帶 + 跑馬燈），
    但配色改用本站的婚禮色票，右上角換成 CY 婚禮 logo。
    畫面主體是 Video/photos/ 的婚紗照，直幅照兩張並排、橫幅照滿版，都帶緩慢 Ken Burns。

    逐格用 Pillow 合成後以 rawvideo 管線餵給 ffmpeg 編碼，不落地中間幀；
    合成吃 CPU，所以用 multiprocessing 分工（40 分鐘 = 7.2 萬格，單核會跑半小時）。

三層節奏（互相獨立、但邊界對齊）：
    大標   每 cycle_minutes*60 / 大標數 秒換一則
    照片   每則大標切成 screens_per_headline 個畫面 → 照片換得比大標快，
           且每則大標的第一個畫面必定與換標同時發生
    時鐘   吃「絕對時間」，所以 cycles 輪的畫面雖然重複，時鐘仍連續跑
           （文定 08:00–08:40 → cycle_minutes=10 + cycles=4，時鐘剛好 08:00 走到 08:40）

主角取景：
    先用 macOS Vision（Video/detect_subjects.swift）抓出每張照片的人臉／人體框，
    裁切時不置中、而是讓主角落在「標題帶以上的可見區」——
    放得下就整個人塞進可見區，放不下就以頭部對齊，寧可裙襬被標題帶蓋到也不遮臉。
    偵測結果快取在 Video/.focus_raw.json，照片沒變就不重跑。

版面座標一律用「佔畫布寬/高的比例」，所以 --scale 2 直接產 4K 也不會跑版。

使用方式（在專案根目錄執行）：
    python Video/make_news_video.py                  # 產完整影片（依 config 的 cycles）
    python Video/make_news_video.py --at 65.5        # 只出第 65.5 秒的預覽 PNG（校版面）
    python Video/make_news_video.py --seconds 60     # 只產前 60 秒（試看節奏）
    python Video/make_news_video.py --scale 2        # 產 4K
    python Video/make_news_video.py --bgm Music/x.mp3  # 併入背景音樂

依賴：Pillow、ffmpeg、swift（macOS 內建，僅首次偵測主角時用到）
"""
import argparse
import bisect
import glob
import json
import math
import os
import random
import subprocess
import sys
from multiprocessing import get_context

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO = os.path.join(ROOT, "Video")
CONFIG = os.path.join(VIDEO, "config.json")
OUTDIR = os.path.join(VIDEO, "out")
FOCUS_CACHE = os.path.join(VIDEO, ".focus_raw.json")
DETECTOR = os.path.join(VIDEO, "detect_subjects.swift")

# ---- 色票（取自 styles.css 的婚禮色系，另補新聞感的酒紅與金） ----
CREAM = (246, 245, 236)
INK = (45, 43, 37)
TAUPE = (205, 193, 171)
ACCENT = (178, 144, 121)
WINE = (74, 26, 33)      # 深酒紅：代替新聞台的刺眼大紅，仍有快報感
GOLD = (242, 197, 78)
ICON_CLOUD = (216, 208, 192)   # 天氣 icon 的雲：淺灰褐，壓在深墨欄上讀得到
ICON_RAIN = (150, 186, 206)    # 雨滴：取自 styles.css 的 --wish-groom 系的藍，提亮後不跳色
LIVE_RED = (206, 42, 42)       # 右上 LIVE 的閃爍紅點

# ---- 版面參數（佔畫布寬/高的比例）----
R_LEFTCOL_W = 0.130     # 左下資訊欄寬
R_LEFTCOL_TOP = 0.650   # 左下資訊欄上緣
R_BAND_TOP = 0.805      # 大標題帶上緣（單行高度）
R_BAND_BOT = 0.940      # 大標題帶下緣（＝跑馬燈上緣）
R_PAD = 0.021           # 通用內距（佔寬）

R_F_HEAD = 0.088        # 字級（佔畫布高）
R_F_CITY = 0.034
R_F_TEMP = 0.034
R_F_LABEL = 0.026
R_F_TICKER = 0.027
R_F_CLOCK = 0.032
R_F_TAG = 0.021

ZOOM_MAX = 1.09         # Ken Burns 最大推近倍率（再大會開始糊）
TICKER_SPEED = 0.075    # 跑馬燈速度（每秒移動畫布寬的比例）
HEAD_IN_SEC = 0.45      # 大標滑入時間

# 主角取景：可見區＝標題帶上緣之上再留點邊距（皆為佔輸出高的比例）
CLEAR_TOP, CLEAR_BOT = 0.045, 0.775
CLEAR_H = CLEAR_BOT - CLEAR_TOP
HEAD_Q = 0.30           # 主角比可見區還高時，改讓「頭部」落在這個高度

# 字體堆疊：PingFang 在近期 macOS 被搬到 AssetsV2（路徑帶雜湊）→ 用 glob 找。
# 找不到就退到系統內建的 Hiragino / STHeiti，字重會略細但不會爆掉。
_PINGFANG = glob.glob(
    "/System/Library/AssetsV2/com_apple_MobileAsset_Font*/*/AssetData/PingFang.ttc"
)
FONT_STACK = {
    # (檔案候選, ttc 內的 face index)：PingFang.ttc 內 10=TC Semibold、6=TC Medium
    "bold": [(_PINGFANG, 10), (["/System/Library/Fonts/Hiragino Sans GB.ttc"], 2),
             (["/System/Library/Fonts/Supplemental/STHeiti Medium.ttc"], 0)],
    "medium": [(_PINGFANG, 6), (["/System/Library/Fonts/Hiragino Sans GB.ttc"], 2),
               (["/System/Library/Fonts/Supplemental/STHeiti Medium.ttc"], 0)],
    "mono": [(["/System/Library/Fonts/Menlo.ttc"], 1),
             (["/System/Library/Fonts/Courier.ttc"], 1)],
}
_font_cache = {}

G = {}   # 準備好的素材：fork 出去的 worker 靠寫入時複製共用，不必再各自重建


def font(kind, size):
    """依字重取字體；同 (字重, 字級) 只開一次。"""
    key = (kind, size)
    if key in _font_cache:
        return _font_cache[key]
    for paths, idx in FONT_STACK[kind]:
        for p in paths:
            if os.path.exists(p):
                try:
                    f = ImageFont.truetype(p, size, index=idx)
                    _font_cache[key] = f
                    return f
                except OSError:
                    continue
    sys.exit("找不到可用的中文字體，請改 FONT_STACK")


def fit_font(kind, text, max_w, start_size, min_size):
    """標題長度不一，逐級縮字讓它塞得進標題帶寬度。"""
    size = start_size
    while size > min_size:
        f = font(kind, size)
        if f.getlength(text) <= max_w:
            return f
        size -= 2
    return font(kind, min_size)


# ============================ 主角偵測 ============================

def photo_list(cfg):
    d = os.path.join(ROOT, cfg["photo_dir"])
    fs = [f for f in sorted(glob.glob(os.path.join(d, "*")))
          if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    if not fs:
        sys.exit("%s 裡沒有照片" % d)
    return fs


def load_detections(files):
    """讀主角偵測快取；缺哪幾張就只對那幾張跑 Vision，結果併回快取。"""
    cache = {}
    if os.path.exists(FOCUS_CACHE):
        try:
            cache = json.load(open(FOCUS_CACHE, encoding="utf-8"))
        except ValueError:
            cache = {}
    rel = {os.path.relpath(f, ROOT): f for f in files}
    missing = [r for r in rel if r not in cache]
    if missing:
        print("偵測主角（macOS Vision）：%d 張…" % len(missing), flush=True)
        try:
            out = subprocess.run(["swift", DETECTOR] + missing,
                                 cwd=ROOT, capture_output=True, text=True, check=True)
            cache.update(json.loads(out.stdout))
            json.dump(cache, open(FOCUS_CACHE, "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
        except (subprocess.CalledProcessError, FileNotFoundError, ValueError) as e:
            print("⚠ 主角偵測失敗（%s），改用畫面中央偏上取景" % type(e).__name__)
    return cache


def _union(boxes):
    return (min(b[0] for b in boxes), min(b[1] for b in boxes),
            max(b[0] + b[2] for b in boxes), max(b[1] + b[3] for b in boxes))


def focus_of(det):
    """把偵測結果換算成「焦點（頭部）」與「主角框」，皆為 0~1 正規化、左上原點。"""
    if not det:
        return (0.5, 0.42), (0.28, 0.14, 0.72, 0.86)
    faces = [b for b in det.get("faces", []) if b[4] >= 0.30]
    humans = [b for b in det.get("humans", []) if b[4] >= 0.35]
    if faces:
        fx0, fy0, fx1, fy1 = _union(faces)
        focus = ((fx0 + fx1) / 2, (fy0 + fy1) / 2)
    elif humans:
        hx0, hy0, hx1, hy1 = _union(humans)
        focus = ((hx0 + hx1) / 2, hy0 + 0.18 * (hy1 - hy0))   # 人體框頂端附近＝頭
    else:
        return (0.5, 0.42), (0.28, 0.14, 0.72, 0.86)

    keep = _union(faces + humans)
    if faces and not humans:
        # 只抓到臉時把框往下延伸，帶到一點身體，取景才不會只剩大頭
        fh = keep[3] - keep[1]
        keep = (keep[0], keep[1], keep[2], min(1.0, keep[3] + fh * 1.5))
    return focus, keep


# ============================ 素材準備 ============================

def cover_scale(src_w, src_h, tw, th):
    return max(tw / src_w, th / src_h)


def prepare_base(path, tw, th, det):
    """把照片縮到剛好覆蓋 (tw*ZOOM_MAX, th*ZOOM_MAX)，不裁切。

    刻意不在這裡裁——保留整張縮圖，逐格才有空間依主角位置上下挪裁窗。
    """
    bw, bh = tw * ZOOM_MAX, th * ZOOM_MAX
    im = Image.open(path)
    im.draft("RGB", (int(bw * 2), int(bh * 2)))   # JPEG 快速降採樣解碼，省一半以上時間
    im = im.convert("RGB")
    s = cover_scale(im.width, im.height, bw, bh)
    nw, nh = max(int(bw), round(im.width * s)), max(int(bh), round(im.height * s))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)

    (fx, fy), keep = focus_of(det)
    return {
        "img": im,
        "focus": (fx * nw, fy * nh),
        "keep": (keep[0] * nw, keep[1] * nh, keep[2] * nw, keep[3] * nh),
    }


def build_playlist(files, n_screens, seed=20260912):
    """把照片池排成 n_screens 個「畫面」：橫幅照單張滿版、直幅照兩張並排。

    每一輪重新洗牌配對，同一對直幅照才不會每次都黏在一起。
    """
    portrait, landscape = [], []
    for f in files:
        with Image.open(f) as im:
            (landscape if im.width > im.height else portrait).append(f)
    if not portrait and not landscape:
        sys.exit("照片池是空的")

    rnd = random.Random(seed)
    screens, pool_p, pool_l = [], [], []
    while len(screens) < n_screens:
        # 大約每 5 個畫面插一張橫幅滿版，節奏才不會全是並排
        want_full = landscape and len(screens) % 5 == 4
        if want_full:
            if not pool_l:
                pool_l = landscape[:]
                rnd.shuffle(pool_l)
            screens.append([pool_l.pop()])
            continue
        if len(pool_p) < 2:
            fresh = portrait[:]
            rnd.shuffle(fresh)
            pool_p += fresh
        if len(pool_p) < 2:            # 直幅不足兩張 → 退而用橫幅滿版
            if not pool_l:
                pool_l = landscape[:]
                rnd.shuffle(pool_l)
            screens.append([pool_l.pop()])
            continue
        screens.append([pool_p.pop(), pool_p.pop()])

    # 相鄰畫面撞到同一張就跟後面換一下，避免同一張連著出現
    for i in range(1, len(screens)):
        if set(screens[i]) & set(screens[i - 1]):
            for j in range(i + 1, len(screens)):
                if not (set(screens[j]) & set(screens[i - 1])):
                    screens[i], screens[j] = screens[j], screens[i]
                    break
    return screens


def scrim(w, h, band_top):
    """上下漸層壓暗：讓 logo／時間與標題帶不論照片明暗都讀得清楚。"""
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    top_h = int(h * 0.16)
    for y in range(top_h):
        a = int(105 * (1 - y / top_h) ** 1.6)
        d.line((0, y, w, y), fill=(0, 0, 0, a))
    lo = int(h * 0.13)
    for y in range(band_top - lo, band_top):
        p = (y - (band_top - lo)) / lo
        d.line((0, y, w, y), fill=(0, 0, 0, int(120 * p ** 1.4)))
    return im


def _sun(d, S, cx, cy, r, col):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
    lw = max(2, int(S * 0.022))
    for k in range(8):
        a = math.radians(k * 45)
        d.line((cx + math.cos(a) * r * 1.45, cy + math.sin(a) * r * 1.45,
                cx + math.cos(a) * r * 2.05, cy + math.sin(a) * r * 2.05), fill=col, width=lw)


def _cloud(d, x, y, w, col):
    """一朵雲＝三顆圓＋一塊底，比貝茲曲線好調又夠像。"""
    h = w * 0.62
    d.ellipse((x, y + h * 0.34, x + w * 0.46, y + h), fill=col)
    d.ellipse((x + w * 0.18, y, x + w * 0.74, y + h * 0.88), fill=col)
    d.ellipse((x + w * 0.54, y + h * 0.26, x + w, y + h), fill=col)
    d.rectangle((x + w * 0.06, y + h * 0.62, x + w * 0.94, y + h), fill=col)


def _drops(d, S, xs, y, ln, col, slant=0.0):
    lw = max(2, int(S * 0.026))
    for x in xs:
        d.line((x, y, x + ln * slant, y + ln), fill=col, width=lw)


def weather_icon(kind, size):
    """依 WMO 代碼對應的天氣 icon，全部程式畫：免素材、任何解析度都銳利。"""
    ss = 4                      # 超取樣後縮回來，邊緣才平滑
    S = size * ss
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    sun, cl, rn = GOLD + (255,), ICON_CLOUD + (255,), ICON_RAIN + (255,)

    if kind == "sun":
        _sun(d, S, S * 0.5, S * 0.5, S * 0.26, sun)
    elif kind == "sun_cloud":
        _sun(d, S, S * 0.70, S * 0.30, S * 0.155, sun)
        _cloud(d, S * 0.04, S * 0.40, S * 0.76, cl)
    elif kind == "fog":
        _cloud(d, S * 0.06, S * 0.14, S * 0.88, cl)
        lw = max(2, int(S * 0.030))
        for i, yy in enumerate((0.74, 0.86, 0.98)):
            off = S * (0.04 if i % 2 else 0.0)
            d.line((S * 0.14 + off, S * yy, S * 0.86 - off, S * yy), fill=cl, width=lw)
    elif kind in ("drizzle", "rain", "shower"):
        _cloud(d, S * 0.06, S * 0.12, S * 0.88, cl)
        ln = S * (0.14 if kind == "drizzle" else 0.22)
        _drops(d, S, [S * 0.30, S * 0.50, S * 0.70], S * 0.72, ln, rn,
               0.45 if kind == "shower" else 0.0)
    elif kind == "thunder":
        _cloud(d, S * 0.06, S * 0.10, S * 0.88, cl)
        d.polygon([(S * 0.56, S * 0.58), (S * 0.40, S * 0.80), (S * 0.50, S * 0.80),
                   (S * 0.44, S * 1.00), (S * 0.62, S * 0.74), (S * 0.52, S * 0.74)],
                  fill=sun)
        _drops(d, S, [S * 0.24, S * 0.76], S * 0.70, S * 0.16, rn)
    else:
        _cloud(d, S * 0.06, S * 0.24, S * 0.88, cl)
    return im.resize((size, size), Image.Resampling.LANCZOS)


def build_chrome(cfg, W, H, logo_img):
    """每格都一樣的固定框架：左下資訊欄、標題帶底、跑馬燈底、右上 logo 牌。"""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    lb = cfg["left_block"]
    pad = int(W * R_PAD)
    col_w = int(W * R_LEFTCOL_W)
    col_top = int(H * R_LEFTCOL_TOP)
    band_top = int(H * R_BAND_TOP)
    band_bot = int(H * R_BAND_BOT)

    # --- 左下資訊欄：只有標籤是常駐的，底下的天氣面板隨大標輪播（見 build_weather_panels）---
    d.rectangle((0, col_top, col_w, H), fill=INK + (232,))
    lab_h = int(H * 0.046)
    d.rectangle((0, col_top, col_w, col_top + lab_h), fill=WINE + (255,))
    f = font("bold", int(H * R_F_LABEL))
    d.text((col_w / 2, col_top + lab_h / 2), lb["label"], font=f, fill=CREAM, anchor="mm")

    # --- 大標題帶底（常駐，只有帶子上的字會隨段落抽換）---
    d.rectangle((col_w, band_top, W, band_bot), fill=WINE + (233,))
    d.rectangle((col_w, band_top, W, band_top + max(2, int(H * 0.005))), fill=ACCENT + (255,))

    # --- 跑馬燈底（奶油底、深墨字，左端酒紅標籤）---
    d.rectangle((col_w, band_bot, W, H), fill=CREAM + (238,))
    f = font("bold", int(H * R_F_TICKER * 0.92))
    lab_w = int(f.getlength(cfg["ticker_label"]) + W * 0.030)
    d.rectangle((col_w, band_bot, col_w + lab_w, H), fill=WINE + (255,))
    d.text((col_w + lab_w / 2, (band_bot + H) / 2), cfg["ticker_label"],
           font=f, fill=CREAM, anchor="mm")

    # --- 右上 logo 牌 ---
    chip_h = int(H * 0.104)
    tag_f = font("bold", int(H * 0.024))
    tag_w = int(tag_f.getlength(cfg["channel_tag"]))
    logo_h = int(chip_h * 0.78)
    logo = logo_img.resize((int(logo_img.width * logo_h / logo_img.height), logo_h),
                           Image.Resampling.LANCZOS)
    gap = int(W * 0.010)
    dot_r = int(H * 0.0095)
    dot_gap = int(W * 0.006)                 # 「L」左邊空的那一格
    group_w = dot_r * 2 + dot_gap + tag_w    # ●+空格+LIVE 當成一組來置中
    side = int(W * 0.016)
    chip_w = side * 2 + logo.width + gap + group_w
    cx0, cy0 = W - pad - chip_w, pad
    d.rounded_rectangle((cx0, cy0, cx0 + chip_w, cy0 + chip_h),
                        radius=int(H * 0.014), fill=CREAM + (235,))
    im.alpha_composite(logo, (cx0 + side, cy0 + (chip_h - logo.height) // 2))
    div_x = cx0 + side + logo.width + gap / 2
    d.line((div_x, cy0 + chip_h * 0.22, div_x, cy0 + chip_h * 0.78),
           fill=TAUPE + (170,), width=max(1, int(H * 0.002)))
    # 置中於「分隔線 → 牌子右緣」之間
    gx = (div_x + cx0 + chip_w) / 2 - group_w / 2
    ccy = cy0 + chip_h / 2
    d.text((gx + dot_r * 2 + dot_gap, ccy), cfg["channel_tag"], font=tag_f,
           fill=WINE, anchor="lm")

    return im, dict(col_w=col_w, band_top=band_top, band_bot=band_bot, pad=pad,
                    lab_w=lab_w, chip=(cx0, cy0, chip_w, chip_h),
                    live_dot=(gx + dot_r, ccy, dot_r),
                    wx_pos=(0, col_top + lab_h), wx_size=(col_w, H - col_top - lab_h))


def load_weather(cfg):
    """讀 Video/weather.json（由 fetch_weather.py 抓的婚宴當天縣市預報）。"""
    p = os.path.join(VIDEO, "weather.json")
    if not os.path.exists(p):
        sys.exit("找不到 Video/weather.json，請先跑：python3 Video/fetch_weather.py")
    w = json.load(open(p, encoding="utf-8"))
    cities = w["cities"]
    lead = cfg.get("left_block", {}).get("lead_city")
    if lead:                                   # 讓婚宴所在縣市排第一個
        i = next((k for k, c in enumerate(cities) if c["name"] == lead), 0)
        cities = cities[i:] + cities[:i]
    return w, cities


def build_weather_panels(W, H, geo, cities):
    """每個縣市一張天氣面板（縣市名 + 真實預報 icon + 最低/最高溫）。

    面板疊在左下資訊欄的標籤下方，換大標時一起換 → 與大標同步輪播。
    """
    pw, ph = geo["wx_size"]
    pad = int(W * R_PAD)
    f_city = font("bold", int(H * R_F_CITY))
    f_temp = font("bold", int(H * R_F_TEMP))
    icons, panels = {}, []
    for c in cities:
        im = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.text((pw / 2, int(H * 0.050)), c["name"], font=f_city, fill=CREAM, anchor="ma")
        yy = int(H * 0.104)
        d.line((pad * 0.6, yy, pw - pad * 0.6, yy), fill=TAUPE + (110,),
               width=max(1, int(H * 0.002)))
        if c["icon"] not in icons:
            icons[c["icon"]] = weather_icon(c["icon"], int(H * 0.085))
        ico = icons[c["icon"]]
        im.alpha_composite(ico, (int(pw / 2 - ico.width / 2), int(H * 0.122)))
        d.text((pw / 2, int(H * 0.216)), "%d-%d°" % (c["tmin"], c["tmax"]),
               font=f_temp, fill=GOLD, anchor="ma")
        panels.append(im)
    return panels


def build_headline(text, W, H, geo):
    """單則大標（透明底、單行）。每則畫一次，播放時在常駐標題帶內滑入。"""
    band_top, band_bot, col_w = geo["band_top"], geo["band_bot"], geo["col_w"]
    bh = band_bot - band_top
    im = Image.new("RGBA", (W, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = col_w + int(W * 0.022)
    f = fit_font("bold", text, W - x - int(W * 0.024), int(H * R_F_HEAD), int(H * 0.048))
    d.text((x, bh / 2), text, font=f, fill=GOLD, anchor="lm")
    return im


def build_ticker(cfg, W, H):
    """把所有跑馬燈句子接成一條長帶，播放時橫向裁窗移動。"""
    f = font("medium", int(H * R_F_TICKER))
    text = "　◆　".join(cfg["ticker_items"]) + "　◆　"
    one_w = int(f.getlength(text))
    # 接兩份，裁窗跨過尾端時右邊接得上，循環不出現空白
    strip = Image.new("RGBA", (one_w * 2, int(H * (1 - R_BAND_BOT))), (0, 0, 0, 0))
    d = ImageDraw.Draw(strip)
    for i in (0, 1):
        d.text((i * one_w, strip.height / 2), text, font=f, fill=INK, anchor="lm")
    return strip, one_w


def hms(start, secs):
    """把起始時刻往後推 secs 秒，回傳 HH:MM:SS。"""
    h, m, s = (int(v) for v in start.split(":"))
    t = (h * 3600 + m * 60 + s + int(secs)) % 86400
    return "%02d:%02d:%02d" % (t // 3600, t % 3600 // 60, t % 60)


def ease(t):
    return 1 - (1 - t) ** 3


def bounds(total, n):
    """把 total 格切成 n 段的邊界；用累積四捨五入，不會有累積誤差。"""
    return [round(i * total / n) for i in range(n + 1)]


# ============================ 逐格合成 ============================

def photo_crop(key, tw, th, t, zoom_in):
    """從預縮好的底圖裁一格：裁窗位置以主角為準，而非置中。"""
    b = G["bases"][key]
    im = b["img"]
    iw, ih = im.size
    kx0, ky0, kx1, ky1 = b["keep"]

    z = 1.0 + (ZOOM_MAX - 1.0) * (t if zoom_in else 1.0 - t)
    cw = min(tw * ZOOM_MAX / z, iw)
    ch = min(th * ZOOM_MAX / z, ih)

    drift = (t - 0.5) * 0.02          # 一點點漂移，畫面不會死板
    kh = (ky1 - ky0) / ch             # 主角框在這個裁窗下佔的高度比例
    if kh <= CLEAR_H:
        # 放得下 → 整個主角塞進可見區，略偏上（頭上留呼吸空間，像新聞取景）
        q = CLEAR_TOP + kh / 2 + (CLEAR_H - kh) * 0.38 + drift
        py = (ky0 + ky1) / 2
    else:
        # 放不下 → 以頭部對齊，寧可裙襬被標題帶蓋到也不遮臉
        q = HEAD_Q + drift
        py = b["focus"][1]
    cy = py + ch * (0.5 - q)
    cx = (kx0 + kx1) / 2

    cx = min(max(cx, cw / 2), iw - cw / 2)
    cy = min(max(cy, ch / 2), ih - ch / 2)
    return im.resize((tw, th), Image.Resampling.BILINEAR,
                     box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))


def screen_frame(si, t):
    """第 si 個畫面在進度 t（0~1）的底圖：單張滿版或兩張並排。"""
    W, H = G["W"], G["H"]
    shots = G["screens"][si % len(G["screens"])]
    zoom_in = si % 2 == 0
    if len(shots) == 1:
        return photo_crop(shots[0], W, H, t, zoom_in)
    half = W // 2
    im = Image.new("RGB", (W, H))
    im.paste(photo_crop(shots[0], half, H, t, zoom_in), (0, 0))
    im.paste(photo_crop(shots[1], W - half, H, t, zoom_in), (half, 0))
    lw = max(2, int(W * 0.0022))
    ImageDraw.Draw(im).rectangle((half - lw // 2, 0, half + lw // 2, H), fill=CREAM)
    return im


def render_frame(n):
    """畫出第 n 格（絕對格號）。回傳 RGB bytes，直接餵 ffmpeg。"""
    W, H, fps = G["W"], G["H"], G["fps"]
    geo, cfg = G["geo"], G["cfg"]
    cyc = G["cycle_frames"]
    f = n % cyc                       # 畫面在一輪內的位置（時鐘不吃這個，所以會連續）

    scr_b, head_b = G["scr_b"], G["head_b"]
    si = bisect.bisect_right(scr_b, f) - 1
    hi = bisect.bisect_right(head_b, f) - 1
    xf = G["xf_frames"]

    # --- 照片層（畫面之間交叉溶接；跨輪也接得上，所以整支片沒有接縫）---
    s0, s1 = scr_b[si], scr_b[si + 1]
    span = (s1 - s0) + xf
    img = screen_frame(si, min(1.0, (f - s0) / span))
    if f - s0 < xf and xf > 0:
        pi = si - 1
        p0, p1 = (scr_b[pi], scr_b[pi + 1]) if pi >= 0 else (scr_b[-2] - cyc, scr_b[-1] - cyc)
        prev = screen_frame(pi if pi >= 0 else len(scr_b) - 2,
                            min(1.0, ((p1 - p0) + (f - s0)) / ((p1 - p0) + xf)))
        img = Image.blend(prev, img, (f - s0) / xf)

    img = img.convert("RGBA")
    img.alpha_composite(G["scrim"])

    # 照片區左下的小來源標，模擬新聞畫面的浮水印
    d = ImageDraw.Draw(img)
    d.text((geo["pad"], int(H * R_LEFTCOL_TOP) - int(H * 0.014)),
           G["tags"][hi % len(G["tags"])], font=G["f_tag"], fill=CREAM + (195,), anchor="lb")

    img.alpha_composite(G["chrome"])
    # 天氣面板：索引跟著大標走 → 換標與換縣市同一格
    img.alpha_composite(G["wx"][hi % len(G["wx"])], geo["wx_pos"])

    # --- 大標：換標時滑入 ---
    p = min(1.0, (f - head_b[hi]) / (HEAD_IN_SEC * fps))
    dy = int((1 - ease(p)) * H * 0.028)
    band = G["heads"][hi]
    if p < 1.0:
        band = band.copy()
        band.putalpha(band.getchannel("A").point(lambda v: int(v * p)))
        band = band.crop((0, 0, W, band.height - dy))   # 裁掉溢出標題帶的部分
    img.alpha_composite(band, (0, geo["band_top"] + dy))

    # --- 跑馬燈：吃絕對格號，全程連續捲動 ---
    strip, strip_w = G["strip"], G["strip_w"]
    off = int(n / fps * W * TICKER_SPEED) % strip_w
    img.alpha_composite(strip.crop((off, 0, off + W - geo["col_w"], strip.height)),
                        (geo["col_w"], geo["band_bot"]))
    # 只把左端標籤補回最上層，讓捲動的字從標籤後方沒入
    img.alpha_composite(
        G["chrome"].crop((geo["col_w"], geo["band_bot"], geo["col_w"] + geo["lab_w"], H)),
        (geo["col_w"], geo["band_bot"]))

    # --- 右上時間：吃絕對格號 → 08:00:00 一路連續走到收尾 ---
    cx0, cy0, chip_w, chip_h = geo["chip"]
    txt = hms(cfg["clock_start"], n / fps)
    d = ImageDraw.Draw(img)

    # LIVE 紅點：1 秒一循環、亮 0.62 秒（做在逐格層，所以會閃）
    if (n / fps) % 1.0 < 0.62:
        lx, ly, lr = geo["live_dot"]
        d.ellipse((lx - lr, ly - lr, lx + lr, ly + lr), fill=LIVE_RED + (255,))

    bw = int(G["f_clock"].getlength(txt) + W * 0.024)
    bx0, by0 = cx0 + chip_w - bw, cy0 + chip_h + int(H * 0.012)
    d.rounded_rectangle((bx0, by0, bx0 + bw, by0 + int(H * 0.055)),
                        radius=int(H * 0.008), fill=INK + (205,))
    d.text((bx0 + bw / 2, by0 + int(H * 0.055) / 2), txt,
           font=G["f_clock"], fill=CREAM, anchor="mm")

    return img.convert("RGB").tobytes()


# ============================ 主流程 ============================

def prepare(cfg, scale):
    W = int(cfg["canvas"]["width"] * scale)
    H = int(cfg["canvas"]["height"] * scale)
    fps = cfg["canvas"]["fps"]
    tm = cfg["timing"]
    heads_txt = cfg["headlines"]
    n_head = len(heads_txt)
    n_scr_each = tm["screens_per_headline"]

    files = photo_list(cfg)
    det = load_detections(files)

    weather, cities = load_weather(cfg)
    print("天氣預報：%s（%s，%d 個縣市輪播）"
          % (weather["date"], weather["source"], len(cities)), flush=True)

    logo = Image.open(os.path.join(ROOT, cfg["logo"])).convert("RGBA")
    chrome, geo = build_chrome(cfg, W, H, logo)
    strip, strip_w = build_ticker(cfg, W, H)

    screens = build_playlist(files, n_head * n_scr_each)

    # 只有真的被排進 playlist 的照片才需要預縮；直幅走並排（半寬）、橫幅走滿版（全寬）
    used = {}
    for shots in screens:
        tw = W if len(shots) == 1 else W // 2
        for p in shots:
            used.setdefault(p, tw)
    print("預縮照片：%d 張…" % len(used), flush=True)
    bases = {}
    for p, tw in used.items():
        bases[p] = prepare_base(p, tw, H, det.get(os.path.relpath(p, ROOT)))

    cycle_frames = int(tm["cycle_minutes"] * 60 * fps)
    head_b = bounds(cycle_frames, n_head)
    scr_b = [head_b[0]]
    for i in range(n_head):                 # 每則大標再切成 n_scr_each 個畫面
        a, b = head_b[i], head_b[i + 1]
        scr_b += [a + round(j * (b - a) / n_scr_each) for j in range(1, n_scr_each + 1)]

    G.update(dict(
        cfg=cfg, W=W, H=H, fps=fps, geo=geo, chrome=chrome,
        scrim=scrim(W, H, geo["band_top"]),
        heads=[build_headline(t, W, H, geo) for t in heads_txt],
        strip=strip, strip_w=strip_w, screens=screens, bases=bases,
        wx=build_weather_panels(W, H, geo, cities),
        tags=cfg.get("tags") or ["本台記者／文定現場"],
        f_clock=font("mono", int(H * R_F_CLOCK)),
        f_tag=font("medium", int(H * R_F_TAG)),
        cycle_frames=cycle_frames, head_b=head_b, scr_b=scr_b,
        xf_frames=int(tm["xfade_seconds"] * fps),
    ))
    return W, H, fps, cycle_frames


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scale", type=float, default=1.0, help="1=1080p、2=4K")
    ap.add_argument("--at", type=float, default=None, help="只輸出第 N 秒的預覽 PNG")
    ap.add_argument("--seconds", type=float, default=None, help="只產前 N 秒（試看節奏）")
    ap.add_argument("--bgm", default=None, help="要併入的背景音樂檔")
    ap.add_argument("--crf", type=int, default=23)   # 23 → 40 分鐘約 720MB，文字與照片都還乾淨
    ap.add_argument("--jobs", type=int, default=0, help="合成用的行程數（預設 CPU-2）")
    ap.add_argument("-o", "--out", default=None)
    args = ap.parse_args()

    cfg = json.load(open(CONFIG, encoding="utf-8"))
    os.makedirs(OUTDIR, exist_ok=True)
    W, H, fps, cycle_frames = prepare(cfg, args.scale)

    if args.at is not None:
        p = os.path.join(OUTDIR, "_at_%08.2f.png" % args.at)
        Image.frombytes("RGB", (W, H), render_frame(int(args.at * fps))).save(p)
        print("預覽圖：%s" % p)
        return

    total = cycle_frames * cfg["timing"]["cycles"]
    if args.seconds:
        total = min(total, int(args.seconds * fps))
    secs = total / fps
    out = args.out or os.path.join(
        OUTDIR, "CY_Wedding_文定快報_%dp_%d分.mp4" % (H, round(secs / 60)))

    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", "%dx%d" % (W, H), "-r", str(fps), "-i", "-"]
    if args.bgm:
        cmd += ["-stream_loop", "-1", "-i", os.path.join(ROOT, args.bgm)]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", str(args.crf),
            "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1",
            "-g", str(fps * 2), "-movflags", "+faststart"]
    if args.bgm:
        cmd += ["-c:a", "aac", "-b:a", "192k", "-shortest",
                "-af", "afade=t=in:d=2,afade=t=out:st=%.1f:d=3" % (secs - 3)]
    cmd += ["-t", "%.3f" % secs, out]

    jobs = args.jobs or max(1, (os.cpu_count() or 4) - 2)
    print("輸出：%s\n  %dx%d · %d 格 · %.1f 分 · %d 則大標 · %d 個畫面 · %d 行程"
          % (out, W, H, total, secs / 60, len(cfg["headlines"]), len(G["screens"]), jobs),
          flush=True)

    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    # 分批平行合成：一次一批，記憶體上限固定，也不必擔心 worker 跑贏編碼器而爆量
    block = jobs * 4
    ctx = get_context("fork")            # fork 才能讓 worker 共用已備好的底圖
    with ctx.Pool(jobs) as pool:
        done = 0
        for start in range(0, total, block):
            idx = range(start, min(start + block, total))
            for buf in pool.map(render_frame, idx):
                pipe.stdin.write(buf)
            done += len(idx)
            print("  %5.1f%%  %d/%d 分" % (done / total * 100, done // fps // 60,
                                           round(secs / 60)), flush=True)
    pipe.stdin.close()
    if pipe.wait() != 0:
        sys.exit("ffmpeg 編碼失敗")
    print("完成：%s（%.1f MB）" % (out, os.path.getsize(out) / 1e6))


if __name__ == "__main__":
    main()

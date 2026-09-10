# -*- coding: utf-8 -*-
"""
fetch_weather.py — 抓婚宴當天（9/12）全台 22 縣市的真實天氣預報，存成 Video/weather.json

作法：
    用 Open-Meteo 的預報 API（免 API key，一次可帶多組座標），
    取每個縣市政府所在地的當日最高溫、最低溫與 WMO 天氣代碼。
    座標用縣市政府位置，與氣象署的「縣市預報」代表點一致。

    刻意把結果落地成 weather.json 而不是產片時即時抓：
    ①產片要能重跑且結果一致 ②現場網路不通也能重產 ③臨近當天可再更新一次。

使用方式（在專案根目錄執行）：
    python3 Video/fetch_weather.py              # 抓 config.json 的 wedding_date
    python3 Video/fetch_weather.py 2026-09-12   # 指定日期

依賴：只用標準庫（urllib）
"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "Video", "config.json")
OUT = os.path.join(ROOT, "Video", "weather.json")
API = "https://api.open-meteo.com/v1/forecast"

# 全台 22 縣市：名稱與縣市政府所在地座標
CITIES = [
    ("臺北市", 25.0330, 121.5654),
    ("新北市", 25.0169, 121.4628),
    ("桃園市", 24.9937, 121.2969),
    ("臺中市", 24.1477, 120.6736),
    ("臺南市", 22.9997, 120.2270),
    ("高雄市", 22.6273, 120.3014),
    ("基隆市", 25.1276, 121.7392),
    ("新竹市", 24.8138, 120.9675),
    ("新竹縣", 24.8387, 121.0177),
    ("苗栗縣", 24.5602, 120.8214),
    ("彰化縣", 24.0518, 120.5161),
    ("南投縣", 23.9099, 120.6858),
    ("雲林縣", 23.7092, 120.4313),
    ("嘉義市", 23.4800, 120.4491),
    ("嘉義縣", 23.4518, 120.2555),
    ("屏東縣", 22.6690, 120.4880),
    ("宜蘭縣", 24.7021, 121.7378),
    ("花蓮縣", 23.9871, 121.6015),
    ("臺東縣", 22.7583, 121.1444),
    ("澎湖縣", 23.5711, 119.5794),
    ("金門縣", 24.4321, 118.3171),
    ("連江縣", 26.1608, 119.9512),
]

# WMO 天氣代碼 → 自家 icon 代號（icon 由 make_news_video.py 程式畫，免素材）
WMO_ICON = {
    0: "sun", 1: "sun",
    2: "sun_cloud",
    3: "cloud",
    45: "fog", 48: "fog",
    51: "drizzle", 53: "drizzle", 55: "drizzle", 56: "drizzle", 57: "drizzle",
    61: "rain", 63: "rain", 65: "rain", 66: "rain", 67: "rain",
    71: "cloud", 73: "cloud", 75: "cloud", 77: "cloud",   # 台灣九月不會下雪，保險用雲
    80: "shower", 81: "shower", 82: "shower",
    85: "cloud", 86: "cloud",
    95: "thunder", 96: "thunder", 99: "thunder",
}


def main():
    date = sys.argv[1] if len(sys.argv) > 1 else None
    if not date:
        cfg = json.load(open(CONFIG, encoding="utf-8"))
        date = cfg.get("wedding_date", "2026-09-12")

    q = urllib.parse.urlencode({
        "latitude": ",".join("%.4f" % c[1] for c in CITIES),
        "longitude": ",".join("%.4f" % c[2] for c in CITIES),
        "daily": "temperature_2m_max,temperature_2m_min,weather_code",
        "timezone": "Asia/Taipei",
        "start_date": date,
        "end_date": date,
    })
    print("抓 %s 的縣市預報（%d 個測點）…" % (date, len(CITIES)))
    with urllib.request.urlopen(API + "?" + q, timeout=30) as r:
        data = json.load(r)
    if isinstance(data, dict):          # 單點時 API 回物件、多點時回陣列
        data = [data]
    if len(data) != len(CITIES):
        sys.exit("回傳測點數不符：%d ≠ %d" % (len(data), len(CITIES)))

    cities = []
    for (name, _, _), d in zip(CITIES, data):
        day = d["daily"]
        code = int(day["weather_code"][0])
        cities.append({
            "name": name,
            # 溫度只留個位數、小數直接捨去（32.9 → 32），不四捨五入
            "tmax": int(day["temperature_2m_max"][0]),
            "tmin": int(day["temperature_2m_min"][0]),
            "wmo": code,
            "icon": WMO_ICON.get(code, "cloud"),
        })

    now = datetime.now(timezone(timedelta(hours=8)))
    out = {
        "_說明": "婚宴當天各縣市預報，由 Video/fetch_weather.py 抓取；臨近當天可重跑更新。",
        "date": date,
        "source": "Open-Meteo (api.open-meteo.com)",
        "fetched_at": now.strftime("%Y-%m-%d %H:%M %z"),
        "cities": cities,
    }
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    print("已存 %s" % os.path.relpath(OUT, ROOT))
    for c in cities:
        print("  %-4s %2d-%2d°C  %-10s (wmo %d)" % (c["name"], c["tmin"], c["tmax"],
                                                    c["icon"], c["wmo"]))


if __name__ == "__main__":
    main()

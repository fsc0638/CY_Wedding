# -*- coding: utf-8 -*-
"""
build_music.py — 掃描 Music/ 內的音樂檔，產生 Music/tracks.json 供網站背景音樂隨機選曲。

靜態網站（GitHub Pages）瀏覽器端無法列出資料夾內容，故以此清單檔代替「偵測資料夾」。

用法（專案根目錄執行）：
    python data/build_music.py

流程：
    把 .mp3 丟進 Music/ → 跑這支 → commit Music/tracks.json，新歌即自動納入隨機歌單。

依賴：無（純標準函式庫）
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MUSIC_DIR = os.path.join(ROOT, "Music")
OUT = os.path.join(MUSIC_DIR, "tracks.json")

AUDIO_EXT = (".mp3", ".m4a", ".ogg", ".wav", ".aac")


def main():
    if not os.path.isdir(MUSIC_DIR):
        raise SystemExit("找不到 Music/ 資料夾。")
    files = sorted(
        f for f in os.listdir(MUSIC_DIR)
        if not f.startswith(".") and f.lower().endswith(AUDIO_EXT)
    )
    tracks = ["Music/" + f for f in files]
    with open(OUT, "w", encoding="utf-8") as fp:
        json.dump(tracks, fp, ensure_ascii=False, indent=2)
        fp.write("\n")
    print("掃描 Music/ → 共 %d 首：" % len(tracks))
    for t in tracks:
        print("  -", t)
    print("已寫入 → Music/tracks.json")


if __name__ == "__main__":
    main()

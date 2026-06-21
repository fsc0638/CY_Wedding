# -*- coding: utf-8 -*-
"""
共用工具：穩健讀取可能正開在 Excel / 被 OneDrive 鎖住的 .xlsx。

提供：
    find_latest_xlsx(folder)        取資料夾內最新的 .xlsx
    load_workbook_resilient(op, src) 讀取（被鎖時以共享模式繞過），回傳 (wb, tmp)
    cleanup_tmp(tmp)                清除暫存
    find_col(header, *keywords)     以關鍵字模糊比對欄位索引
"""
import glob
import os
import sys
import tempfile


def read_bytes_shared(path):
    """以完整共享模式讀取檔案位元組；可讀取正開在 Excel / 被 OneDrive 鎖住的檔案。"""
    if sys.platform != "win32":
        with open(path, "rb") as f:
            return f.read()
    import ctypes
    import msvcrt
    from ctypes import wintypes

    GENERIC_READ = 0x80000000
    FILE_SHARE_ALL = 0x01 | 0x02 | 0x04  # READ | WRITE | DELETE
    OPEN_EXISTING = 3
    FILE_ATTRIBUTE_NORMAL = 0x80
    INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value

    CreateFileW = ctypes.windll.kernel32.CreateFileW
    CreateFileW.restype = wintypes.HANDLE
    CreateFileW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD, wintypes.DWORD,
                            ctypes.c_void_p, wintypes.DWORD, wintypes.DWORD,
                            wintypes.HANDLE]
    handle = CreateFileW(path, GENERIC_READ, FILE_SHARE_ALL, None,
                         OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, None)
    if handle == INVALID_HANDLE_VALUE:
        raise ctypes.WinError(ctypes.get_last_error())
    fd = msvcrt.open_osfhandle(handle, os.O_RDONLY)
    with os.fdopen(fd, "rb") as f:  # 關閉 fd 時連帶關閉 handle
        return f.read()


def load_workbook_resilient(openpyxl, src):
    """正常開啟；若被鎖（PermissionError）則以共享模式複製到暫存再開。回傳 (wb, tmp)。"""
    try:
        return openpyxl.load_workbook(src, read_only=True, data_only=True), None
    except PermissionError:
        fd, tmp = tempfile.mkstemp(suffix=".xlsx")
        with os.fdopen(fd, "wb") as f:
            f.write(read_bytes_shared(src))
        return openpyxl.load_workbook(tmp, read_only=True, data_only=True), tmp


def cleanup_tmp(tmp):
    if tmp and os.path.exists(tmp):
        try:
            os.remove(tmp)
        except OSError:
            pass


# export_firestore.py 產出的核銷報表前綴；這類檔是「輸出」，不能被當成賓客來源讀回
EXPORT_PREFIXES = ("喜餅核銷報表",)


def find_latest_xlsx(folder):
    files = [f for f in glob.glob(os.path.join(folder, "*.xlsx"))
             if not os.path.basename(f).startswith("~$")            # Excel 鎖檔暫存
             and not os.path.basename(f).startswith(EXPORT_PREFIXES)]  # 排除 export 產出的報表
    if not files:
        sys.exit("找不到任何賓客回覆 .xlsx，請將表單匯出的 Excel 放進 data/ 後再執行。")
    return max(files, key=os.path.getmtime)


def find_col(header, *keywords):
    """以關鍵字模糊比對欄位索引，容忍表頭的 emoji 與空白差異。"""
    for i, h in enumerate(header):
        if h is None:
            continue
        text = str(h)
        if any(k in text for k in keywords):
            return i
    return None

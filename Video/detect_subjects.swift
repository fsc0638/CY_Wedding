// detect_subjects.swift — 用 macOS 內建 Vision 偵測照片裡的人臉與人體框
//
// 為什麼用 Swift：Vision 的偵測器精度夠、且 macOS 內建，
// 免得為了一支產片腳本在專案裡多裝 opencv / mediapipe 之類的重依賴。
//
// 用法：swift Video/detect_subjects.swift 照片1 照片2 …   → stdout 輸出 JSON
// 輸出座標一律「正規化 + 左上原點」，方便 Python / Pillow 直接用。
import Foundation
import Vision
import ImageIO
import CoreGraphics

/// 讀圖並縮到長邊 maxPx（順便套用 EXIF 轉向）：偵測不需要原始解析度，縮圖快很多
func loadCG(_ path: String, maxPx: Int) -> CGImage? {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil) else {
        return nil
    }
    let opts: [CFString: Any] = [
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceThumbnailMaxPixelSize: maxPx,
    ]
    return CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary)
}

/// Vision 的 boundingBox 原點在左下，這裡翻成左上原點
func rects<T: VNDetectedObjectObservation>(_ obs: [T]?) -> [[Double]] {
    (obs ?? []).map { o in
        let b = o.boundingBox
        return [Double(b.minX), Double(1 - b.maxY), Double(b.width), Double(b.height),
                Double(o.confidence)]
    }
}

var results: [String: Any] = [:]
for path in CommandLine.arguments.dropFirst() {
    guard let cg = loadCG(path, maxPx: 2000) else {
        FileHandle.standardError.write("讀不到：\(path)\n".data(using: .utf8)!)
        continue
    }
    let faceReq = VNDetectFaceRectanglesRequest()
    let humanReq = VNDetectHumanRectanglesRequest()
    humanReq.upperBodyOnly = false          // 要整個人的框，不只上半身
    let handler = VNImageRequestHandler(cgImage: cg, options: [:])
    do {
        try handler.perform([faceReq, humanReq])
    } catch {
        FileHandle.standardError.write("偵測失敗：\(path) \(error)\n".data(using: .utf8)!)
        continue
    }
    results[path] = [
        "w": cg.width,
        "h": cg.height,
        "faces": rects(faceReq.results),
        "humans": rects(humanReq.results),
    ]
}

let data = try JSONSerialization.data(withJSONObject: results,
                                      options: [.prettyPrinted, .sortedKeys])
FileHandle.standardOutput.write(data)

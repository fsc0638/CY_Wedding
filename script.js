/* ===================================================================
   CY Wedding — interactions
   loader · navbar · reveal-on-scroll · live countdown
   =================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     多語言 i18n（繁中 / 英 / 日 / 韓）
     =================================================================== */
  var I18N = {
    zh: {
      "title.page": "ChunYu & YanTing — 黃俊郁 & 范雁婷 婚禮邀請",
      "nav.story": "Our Love",
      "nav.invite": "Timeline",
      "nav.dresscode": "Dress Code",
      "nav.travel": "Getting There",
      "nav.wishes": "Words of Love",
      "nav.menu": "選單",
      "bgm.play": "播放背景音樂",
      "bgm.pause": "暫停背景音樂",
      "totop.aria": "回到頂端",
      "story.quote": "長跑十三年的愛情故事，<br />即將揭開新的序幕⋯",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "誠摯地邀請您一起來見證我們的婚禮",
      "invite.date": "2026 / 9 / 12（六）",
      "schedule.welcome": "迎賓入席",
      "schedule.banquet": "婚宴開席",
      "count.d": "天", "count.h": "時", "count.m": "分", "count.s": "秒",
      "count.done": "WE ARE MARRIED — 我們結婚囉",
      "cal.add": "加入 Google 行事曆",
      "dc.title": "Dress Code",
      "dc.subtitle": "服裝建議",
      "dc.note": "為了讓婚禮畫面更加和諧，敬請避免全白穿搭，感謝您的體貼！",
      "travel.title": "Getting there",
      "travel.subtitle": "婚禮地點 / 行車資訊",
      "travel.venue": "皇家薇庭婚宴會館 — 法蘭新廳",
      "travel.transit": "大眾運輸",
      "travel.transit.1": "北部南下：搭 9023、1662 至尊爵飯店，轉計程車約 8 分鐘",
      "travel.transit.2": "搭 9005A 至中國江山站，步行約 10 分鐘",
      "travel.transit.3": "桃園高鐵站搭 302、707 公車，中正莊敬路口站下車，轉計程車約 5 分鐘",
      "travel.driving": "自行開車",
      "travel.driving.1": "國道一號：南崁交流道往桃園方向 → 靠右經國路 → 莊敬路二段右轉",
      "travel.driving.2": "國道二號：南桃園交流道往桃園方向 → 靠右大興西路三段 → 寶慶路左轉 → 莊敬路二段左轉",
      "travel.parking": "周邊停車場",
      "travel.parking.notice.tag": "停 車 小 提 醒",
      "travel.parking.notice": "當日會館有多場喜宴同時舉行，停車位可能較為緊張。<br />若方便的話，<b>歡迎您提早一些抵達</b>，也能從容入席、不必為了找車位而匆忙。<br />搭乘遊覽車的貴賓，再麻煩於 <b>11:30 前</b> 到場，謝謝您的體諒。",
      "travel.parking.tap": "點擊地圖上任一標記，即可開啟該地點導航",
      "travel.parking.scale": "100 公尺",
      "travel.parking.venue": "皇家薇庭停車場",
      "travel.parking.venue.tag": "免費 · 車位有限",
      "travel.parking.p1.tag": "步行 9 分 · 汽車 $60/時、機車 $30/次",
      "travel.parking.p2.tag": "步行 10 分 · 汽車 $40/時",
      "travel.parking.venue.short": "皇家薇庭",
      "travel.parking.p1": "寶慶路停車場",
      "travel.parking.p2": "沃瑪寶慶路停車場",
      "travel.parking.p2.short": "沃瑪寶慶路",
      "travel.address": "地址",
      "travel.copy": "複製",
      "travel.copy.done": "已複製",
      "travel.copy.aria": "複製地址",
      "travel.map.open": "在 Google 地圖開啟導航 →",
      "closing.line": "Your presence is truly the best<br />gift we could ask for.",
      "closing.zh": "期待在最美好的一天，與您相見",
      "qr.note": "歡迎掃描下方 QR Code，加入婚禮小幫手<br />了解更多婚禮相關資訊",
      "share.note": "分享這份喜帖給朋友",
      "share.line": "分享到 LINE",
      "share.copy": "複製網址",
      "share.copy.done": "已複製",
      "wishes.subtitle": "賓客的祝福",
      "wishes.groom": "俊郁朋友",
      "wishes.bride": "雁婷朋友",
      "wishes.refresh": "重新抽取",
      "wishes.refresh.aria": "重新抽取祝福留言",
      "wishes.loading": "載入中⋯",
      "wishes.empty": "目前還沒有祝福留言，敬請期待 ♡",
      "wishes.error": "讀取資料失敗，請稍後再試",
      "wishes.post": "匿名留言",
      "wishes.post.title": "留下祝福",
      "wishes.post.sub": "您的祝福會匿名顯示在祝福牆上 ♡",
      "wishes.post.placeholder": "寫下想對新人說的話⋯",
      "wishes.post.submit": "送出",
      "wishes.post.cancel": "取消",
      "wishes.post.close": "關閉",
      "wishes.post.done": "已送出，感謝您的祝福 ♡",
      "wishes.post.empty": "請先輸入祝福內容",
      "wishes.post.cooldown": "您剛送出過，請稍候再留言",
      "wishes.post.error": "送出失敗，請稍後再試",
      "wishes.post.blocked": "留言含不當字詞，請修改後再送出",
      "nav.voucher": "喜餅兌換券",
      "voucher.subtitle": "喜餅兌換券",
      "voucher.for": "此券專屬於",
      "voucher.note": "請於婚禮當天憑此畫面至收禮台領取喜餅",
      "voucher.qr.note": "請於領取喜餅時，點一下 QR 碼放大，出示給工作人員掃描核銷",
      "voucher.stamp": "已領取",
      "voucher.tear": "輕觸撕開 ✂",
      "voucher.tear.aria": "撕開兌換券票根",
      "voucher.restore": "復原",
      "voucher.unlock.title": "兌換券解鎖",
      "voucher.unlock.codeLabel": "核銷驗證碼",
      "voucher.unlock.msg": "若您的兌換券因操作失誤而顯示已使用，請速與活動主辦單位聯繫並索取核銷驗證碼，以利為您辦理兌換券解鎖程序。",
      "voucher.unlock.placeholder": "請輸入核銷驗證碼",
      "voucher.unlock.note": "※ 請注意：基於活動安全機制，此驗證碼將於活動開始前三天進行變更，屆時請留意最新通知。",
      "voucher.unlock.submit": "解鎖",
      "voucher.unlock.cancel": "取消",
      "voucher.unlock.error": "驗證碼錯誤，請重新確認。",
      "voucher.unlock.close": "關閉"
    },
    en: {
      "title.page": "ChunYu & YanTing Wedding — September 12, 2026",
      "nav.story": "Our Love",
      "nav.invite": "Timeline",
      "nav.dresscode": "Dress Code",
      "nav.travel": "Getting There",
      "nav.wishes": "Words of Love",
      "nav.menu": "Menu",
      "bgm.play": "Play background music",
      "bgm.pause": "Pause background music",
      "totop.aria": "Back to top",
      "story.quote": "A thirteen-year love story<br />about to begin its next chapter…",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "We cordially invite you to witness our wedding",
      "invite.date": "2026 / 9 / 12 (Sat)",
      "schedule.welcome": "Welcome Reception",
      "schedule.banquet": "Banquet Begins",
      "count.d": "Days", "count.h": "Hrs", "count.m": "Min", "count.s": "Sec",
      "count.done": "WE ARE MARRIED!",
      "cal.add": "Add to Google Calendar",
      "dc.title": "Dress Code",
      "dc.subtitle": "Attire Suggestions",
      "dc.note": "To keep the wedding scene harmonious, please avoid all-white attire. Thank you for your kind consideration!",
      "travel.title": "Getting there",
      "travel.subtitle": "Venue & Directions",
      "travel.venue": "Royal Wedding Hall — La France Salon",
      "travel.transit": "Public Transit",
      "travel.transit.1": "From the north: Take bus 9023 or 1662 to Junjie Hotel, then ~8 min by taxi.",
      "travel.transit.2": "Bus 9005A to China Jiangshan Station, ~10 min walk.",
      "travel.transit.3": "From Taoyuan HSR: Bus 302 or 707 to Zhongzheng/Zhuangjing intersection, ~5 min by taxi.",
      "travel.driving": "By Car",
      "travel.driving.1": "Highway 1: Nankan IC toward Taoyuan → Jingguo Rd. → Right onto Zhuangjing Rd. Sec. 2.",
      "travel.driving.2": "Highway 2: South Taoyuan IC toward Taoyuan → Daxing W. Rd. Sec. 3 → Left on Baoqing Rd. → Left on Zhuangjing Rd. Sec. 2.",
      "travel.parking": "Nearby Parking",
      "travel.parking.notice.tag": "P A R K I N G   N O T E",
      "travel.parking.notice": "Several weddings are held at the venue that day, so parking may be tight.<br />If it suits you, <b>we\u2019d love for you to arrive a little early</b> \u2014 no rushing to find a space.<br />Guests arriving by coach, please arrive <b>before 11:30</b>. Thank you for understanding.",
      "travel.parking.tap": "Tap any marker on the map to open navigation",
      "travel.parking.scale": "100 m",
      "travel.parking.venue": "Venue Parking",
      "travel.parking.venue.tag": "Free · Limited spaces",
      "travel.parking.p1.tag": "9 min walk · Car NT$60/hr, Scooter NT$30",
      "travel.parking.p2.tag": "10 min walk · Car NT$40/hr",
      "travel.parking.venue.short": "Royal Wedding Hall",
      "travel.parking.p1": "Baoqing Rd. Parking",
      "travel.parking.p2": "Woma Baoqing Rd. Parking",
      "travel.parking.p2.short": "Woma Baoqing",
      "travel.address": "Address",
      "travel.copy": "Copy",
      "travel.copy.done": "Copied",
      "travel.copy.aria": "Copy address",
      "travel.map.open": "Open in Google Maps →",
      "closing.line": "Your presence is truly the best<br />gift we could ask for.",
      "closing.zh": "Looking forward to seeing you on this most beautiful day",
      "qr.note": "Scan the QR code below to add our Wedding Assistant<br />for more event details",
      "share.note": "Share this invitation with friends",
      "share.line": "Share on LINE",
      "share.copy": "Copy link",
      "share.copy.done": "Copied",
      "wishes.subtitle": "Words from our guests",
      "wishes.groom": "ChunYu's friends",
      "wishes.bride": "YanTing's friends",
      "wishes.refresh": "Draw again",
      "wishes.refresh.aria": "Draw a new set of messages",
      "wishes.loading": "Loading…",
      "wishes.empty": "No messages yet — check back soon ♡",
      "wishes.error": "Couldn't load messages, please try again",
      "wishes.post": "Leave a wish",
      "wishes.post.title": "Leave a wish",
      "wishes.post.sub": "Your message will appear anonymously on the wall ♡",
      "wishes.post.placeholder": "Write your wishes for the couple…",
      "wishes.post.submit": "Send",
      "wishes.post.cancel": "Cancel",
      "wishes.post.close": "Close",
      "wishes.post.done": "Sent — thank you for your wishes ♡",
      "wishes.post.empty": "Please write something first",
      "wishes.post.cooldown": "You just posted — please wait a moment",
      "wishes.post.error": "Couldn't send, please try again",
      "wishes.post.blocked": "Your message contains inappropriate words — please revise",
      "nav.voucher": "Pastry Voucher",
      "voucher.subtitle": "Pastry Voucher",
      "voucher.for": "Issued to",
      "voucher.note": "Show this screen at the gift desk on the wedding day to receive your pastry",
      "voucher.qr.note": "Tap the QR code to enlarge, then show it to our staff to redeem your pastry",
      "voucher.stamp": "REDEEMED",
      "voucher.tear": "Tap to tear ✂",
      "voucher.tear.aria": "Tear off the voucher stub",
      "voucher.restore": "Restore",
      "voucher.unlock.title": "Unlock Voucher",
      "voucher.unlock.codeLabel": "Verification code",
      "voucher.unlock.msg": "If your voucher shows as used by mistake, please contact the event organizer to obtain the verification code so we can unlock it for you.",
      "voucher.unlock.placeholder": "Enter verification code",
      "voucher.unlock.note": "※ Note: For event security, this code changes three days before the event. Please watch for the latest notice.",
      "voucher.unlock.submit": "Unlock",
      "voucher.unlock.cancel": "Cancel",
      "voucher.unlock.error": "Incorrect code, please try again.",
      "voucher.unlock.close": "Close"
    },
    ja: {
      "title.page": "ChunYu & YanTing 結婚式 — 2026年9月12日",
      "nav.story": "Our Love",
      "nav.invite": "式次第",
      "nav.dresscode": "Dress Code",
      "nav.travel": "アクセス",
      "nav.wishes": "お祝い",
      "nav.menu": "メニュー",
      "bgm.play": "BGMを再生",
      "bgm.pause": "BGMを一時停止",
      "totop.aria": "トップへ戻る",
      "story.quote": "13年続いた愛の物語、<br />新たな章が始まります…",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "私たちの結婚式にぜひお越しください",
      "invite.date": "2026 / 9 / 12（土）",
      "schedule.welcome": "ご来賓ご着席",
      "schedule.banquet": "披露宴開始",
      "count.d": "日", "count.h": "時", "count.m": "分", "count.s": "秒",
      "count.done": "結婚しました！",
      "cal.add": "Google カレンダーに追加",
      "dc.title": "Dress Code",
      "dc.subtitle": "ドレスコード",
      "dc.note": "会場の雰囲気を整えるため、全身白の装いはお控えくださいませ。ご協力ありがとうございます。",
      "travel.title": "Getting there",
      "travel.subtitle": "会場・アクセス情報",
      "travel.venue": "ロイヤルウェディング会館 — フランス新ホール",
      "travel.transit": "公共交通機関",
      "travel.transit.1": "北部から：9023番・1662番バスで尊爵ホテルへ、タクシー約8分。",
      "travel.transit.2": "9005A番バスで中国江山駅へ、徒歩約10分。",
      "travel.transit.3": "桃園新幹線駅から302・707番バスで中正荘敬路口下車、タクシー約5分。",
      "travel.driving": "お車でお越しの方",
      "travel.driving.1": "国道1号：南崁ICで桃園方面 → 経国路 → 荘敬路二段を右折。",
      "travel.driving.2": "国道2号：南桃園ICで桃園方面 → 大興西路三段 → 寶慶路を左折 → 荘敬路二段を左折。",
      "travel.parking": "周辺駐車場",
      "travel.parking.notice.tag": "駐 車 場 の ご 案 内",
      "travel.parking.notice": "当日は会館で複数の披露宴が重なるため、駐車場が混み合う可能性がございます。<br />ご都合がつくようでしたら、<b>少し早めにお越しいただけますと幸いです</b>。<br />観光バスでお越しの方は <b>11:30 まで</b> にご到着ください。ご協力ありがとうございます。",
      "travel.parking.tap": "地図上のマーカーをタップすると経路が開きます",
      "travel.parking.scale": "100 m",
      "travel.parking.venue": "会館駐車場",
      "travel.parking.venue.tag": "無料 · 台数に限りあり",
      "travel.parking.p1.tag": "徒歩9分 · 普通車 NT$60/時、バイク NT$30",
      "travel.parking.p2.tag": "徒歩10分 · 普通車 NT$40/時",
      "travel.parking.venue.short": "ロイヤルウェディング",
      "travel.parking.p1": "寶慶路駐車場",
      "travel.parking.p2": "沃瑪寶慶路駐車場",
      "travel.parking.p2.short": "沃瑪寶慶路",
      "travel.address": "住所",
      "travel.copy": "コピー",
      "travel.copy.done": "コピーしました",
      "travel.copy.aria": "住所をコピー",
      "travel.map.open": "Google マップで開く →",
      "closing.line": "皆さまのご臨席が<br />何よりの贈り物です。",
      "closing.zh": "最高の一日に皆さまにお会いできることを楽しみにしています",
      "qr.note": "下のQRコードからウェディングアシスタントを追加し、<br />詳細をご確認ください。",
      "share.note": "ご友人にこの招待状をシェア",
      "share.line": "LINE でシェア",
      "share.copy": "URL をコピー",
      "share.copy.done": "コピーしました",
      "wishes.subtitle": "ゲストからの祝福",
      "wishes.groom": "俊郁の友人",
      "wishes.bride": "雁婷の友人",
      "wishes.refresh": "引き直す",
      "wishes.refresh.aria": "メッセージを引き直す",
      "wishes.loading": "読み込み中…",
      "wishes.empty": "まだメッセージがありません ♡",
      "wishes.error": "読み込みに失敗しました。もう一度お試しください",
      "wishes.post": "メッセージを送る",
      "wishes.post.title": "祝福を送る",
      "wishes.post.sub": "メッセージは匿名で祝福ウォールに表示されます ♡",
      "wishes.post.placeholder": "新郎新婦へのメッセージ…",
      "wishes.post.submit": "送信",
      "wishes.post.cancel": "キャンセル",
      "wishes.post.close": "閉じる",
      "wishes.post.done": "送信しました。ありがとうございます ♡",
      "wishes.post.empty": "メッセージを入力してください",
      "wishes.post.cooldown": "先ほど送信しました。少し待ってください",
      "wishes.post.error": "送信に失敗しました。もう一度お試しください",
      "wishes.post.blocked": "不適切な語句が含まれています。修正してください",
      "nav.voucher": "引き菓子券",
      "voucher.subtitle": "引き菓子引換券",
      "voucher.for": "ご利用者",
      "voucher.note": "挙式当日、この画面を受付にご提示のうえ引き菓子をお受け取りください",
      "voucher.qr.note": "引き菓子のお受け取りの際、QRコードをタップして拡大し、スタッフにご提示ください",
      "voucher.stamp": "引換済",
      "voucher.tear": "タップで切り取る ✂",
      "voucher.tear.aria": "引換券の半券を切り取る",
      "voucher.restore": "元に戻す",
      "voucher.unlock.title": "引換券のロック解除",
      "voucher.unlock.codeLabel": "認証コード",
      "voucher.unlock.msg": "操作ミスで引換券が「使用済み」と表示された場合は、主催者までご連絡のうえ認証コードをお受け取りください。ロック解除の手続きをいたします。",
      "voucher.unlock.placeholder": "認証コードを入力",
      "voucher.unlock.note": "※ ご注意：イベントのセキュリティのため、この認証コードは開催3日前に変更されます。最新のお知らせをご確認ください。",
      "voucher.unlock.submit": "ロック解除",
      "voucher.unlock.cancel": "キャンセル",
      "voucher.unlock.error": "コードが正しくありません。もう一度お試しください。",
      "voucher.unlock.close": "閉じる"
    },
    ko: {
      "title.page": "ChunYu & YanTing 결혼식 — 2026년 9월 12일",
      "nav.story": "Our Love",
      "nav.invite": "식순",
      "nav.dresscode": "Dress Code",
      "nav.travel": "오시는 길",
      "nav.wishes": "축하 메시지",
      "nav.menu": "메뉴",
      "bgm.play": "배경 음악 재생",
      "bgm.pause": "배경 음악 일시정지",
      "totop.aria": "맨 위로",
      "story.quote": "13년의 사랑 이야기,<br />새로운 장을 열어갑니다…",
      "invite.title": "Join us as we tie the knot!",
      "invite.subtitle": "저희의 결혼식에 진심으로 초대합니다",
      "invite.date": "2026 / 9 / 12 (토)",
      "schedule.welcome": "하객 입장",
      "schedule.banquet": "피로연 시작",
      "count.d": "일", "count.h": "시", "count.m": "분", "count.s": "초",
      "count.done": "우리 결혼했습니다!",
      "cal.add": "Google 캘린더에 추가",
      "dc.title": "Dress Code",
      "dc.subtitle": "드레스 코드",
      "dc.note": "결혼식 분위기의 조화를 위해 전체 흰색 의상은 피해 주시기 바랍니다. 감사합니다!",
      "travel.title": "Getting there",
      "travel.subtitle": "식장 위치 / 교통 안내",
      "travel.venue": "로열 웨딩홀 — 라 프랑스 살롱",
      "travel.transit": "대중교통",
      "travel.transit.1": "북부 → 남부: 9023, 1662번 버스로 준제 호텔까지, 택시 약 8분.",
      "travel.transit.2": "9005A번 버스로 중국강산역까지, 도보 약 10분.",
      "travel.transit.3": "타오위안 고속철도역에서 302, 707번 버스로 중정장징로 교차로 하차, 택시 약 5분.",
      "travel.driving": "자가용",
      "travel.driving.1": "국도 1호: 난칸 IC에서 타오위안 방향 → 경국로 → 장징로 2단 우회전.",
      "travel.driving.2": "국도 2호: 남타오위안 IC에서 타오위안 방향 → 대흥서로 3단 → 보경로 좌회전 → 장징로 2단 좌회전.",
      "travel.parking": "주변 주차장",
      "travel.parking.notice.tag": "주 차 안 내",
      "travel.parking.notice": "당일 예식장에서 여러 결혼식이 함께 열려 주차 공간이 부족할 수 있습니다.<br />괜찮으시다면 <b>조금 일찍 도착해 주시면 감사하겠습니다</b>. 주차 자리를 찾느라 서두르지 않으셔도 되도록이요.<br />관광버스로 오시는 분은 <b>11:30 이전</b>에 도착 부탁드립니다. 양해해 주셔서 감사합니다.",
      "travel.parking.tap": "지도의 표시를 누르면 길안내가 열립니다",
      "travel.parking.scale": "100 m",
      "travel.parking.venue": "예식장 주차장",
      "travel.parking.venue.tag": "무료 · 자리 제한",
      "travel.parking.p1.tag": "도보 9분 · 승용차 NT$60/시간, 오토바이 NT$30",
      "travel.parking.p2.tag": "도보 10분 · 승용차 NT$40/시간",
      "travel.parking.venue.short": "로열 웨딩홀",
      "travel.parking.p1": "바오칭로 주차장",
      "travel.parking.p2": "워마 바오칭로 주차장",
      "travel.parking.p2.short": "워마 바오칭로",
      "travel.address": "주소",
      "travel.copy": "복사",
      "travel.copy.done": "복사됨",
      "travel.copy.aria": "주소 복사",
      "travel.map.open": "Google 지도에서 열기 →",
      "closing.line": "여러분의 참석이<br />저희에게 가장 큰 선물입니다.",
      "closing.zh": "가장 아름다운 날에 만나뵙기를 기대합니다",
      "qr.note": "아래 QR 코드를 스캔하여 웨딩 도우미를 추가하시면<br />결혼식 상세 정보를 확인하실 수 있습니다.",
      "share.note": "친구에게 청첩장 공유하기",
      "share.line": "LINE으로 공유",
      "share.copy": "링크 복사",
      "share.copy.done": "복사됨",
      "wishes.subtitle": "하객들의 축하 메시지",
      "wishes.groom": "ChunYu의 친구",
      "wishes.bride": "YanTing의 친구",
      "wishes.refresh": "다시 뽑기",
      "wishes.refresh.aria": "메시지 다시 뽑기",
      "wishes.loading": "불러오는 중…",
      "wishes.empty": "아직 메시지가 없습니다 ♡",
      "wishes.error": "불러오지 못했습니다. 다시 시도해 주세요",
      "wishes.post": "축하 남기기",
      "wishes.post.title": "축하 메시지 남기기",
      "wishes.post.sub": "메시지는 익명으로 축하 월에 표시됩니다 ♡",
      "wishes.post.placeholder": "신랑신부에게 한마디…",
      "wishes.post.submit": "보내기",
      "wishes.post.cancel": "취소",
      "wishes.post.close": "닫기",
      "wishes.post.done": "전송되었습니다. 축하해 주셔서 감사합니다 ♡",
      "wishes.post.empty": "내용을 입력해 주세요",
      "wishes.post.cooldown": "방금 보내셨습니다. 잠시 후 다시 시도해 주세요",
      "wishes.post.error": "전송하지 못했습니다. 다시 시도해 주세요",
      "wishes.post.blocked": "부적절한 표현이 포함되어 있습니다. 수정해 주세요",
      "nav.voucher": "답례품 교환권",
      "voucher.subtitle": "답례품 교환권",
      "voucher.for": "받는 분",
      "voucher.note": "예식 당일 이 화면을 접수처에 제시하고 답례품을 받으세요",
      "voucher.qr.note": "답례품을 받으실 때 QR 코드를 눌러 확대한 뒤 직원에게 보여주세요",
      "voucher.stamp": "수령완료",
      "voucher.tear": "탭하여 뜯기 ✂",
      "voucher.tear.aria": "교환권 절취선 뜯기",
      "voucher.restore": "복원",
      "voucher.unlock.title": "교환권 잠금 해제",
      "voucher.unlock.codeLabel": "인증 코드",
      "voucher.unlock.msg": "조작 실수로 교환권이 '사용됨'으로 표시된 경우, 주최 측에 연락하여 인증 코드를 받으시면 잠금 해제를 도와드립니다.",
      "voucher.unlock.placeholder": "인증 코드 입력",
      "voucher.unlock.note": "※ 안내: 행사 보안을 위해 이 코드는 행사 3일 전에 변경됩니다. 최신 공지를 확인해 주세요.",
      "voucher.unlock.submit": "잠금 해제",
      "voucher.unlock.cancel": "취소",
      "voucher.unlock.error": "코드가 올바르지 않습니다. 다시 시도해 주세요.",
      "voucher.unlock.close": "닫기"
    }
  };

  var LANG_HTML = { zh: "zh-Hant", en: "en", ja: "ja", ko: "ko" };
  var LANG_OG   = { zh: "zh_TW",   en: "en_US", ja: "ja_JP", ko: "ko_KR" };
  var LANG_KEY  = "cy.lang";

  function detectInitialLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && I18N[saved]) return saved;
    var n = (navigator.language || "zh").toLowerCase();
    if (n.indexOf("ja") === 0) return "ja";
    if (n.indexOf("ko") === 0) return "ko";
    if (n.indexOf("en") === 0) return "en";
    return "zh";
  }
  var currentLang = detectInitialLang();

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.zh && I18N.zh[key]) || key;
  }

  function applyI18n() {
    // 純文字
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    // 含 HTML（<br> 等）
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = v;
    });
    // aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-aria"));
      if (v != null) el.setAttribute("aria-label", v);
    });
    // placeholder
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-ph"));
      if (v != null) el.setAttribute("placeholder", v);
    });
    // 標題與 lang / og:locale
    document.title = t("title.page");
    document.documentElement.lang = LANG_HTML[currentLang] || "zh-Hant";
    var og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute("content", LANG_OG[currentLang] || "zh_TW");

    // 同步語言切換器 aria-pressed
    document.querySelectorAll(".lang-switch button[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === currentLang ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyI18n();
  }

  // 語言切換器初始化
  document.querySelectorAll(".lang-switch button[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  // 提供給其他模組使用
  window.__cy_i18n = { t: t, getLang: function () { return currentLang; } };

  // 首次套用
  applyI18n();

  /* ---------- 重新整理一律回到最頂，不記憶捲動位置 ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  window.addEventListener("load", function () { window.scrollTo(0, 0); });

  /* ---------- 進場載入：最少 3 秒，最多 5 秒 ---------- */
  var LOADER_START = Date.now();
  var LOADER_MIN = 3000;
  var LOADER_MAX = 5000;
  function hideLoader() {
    var loader = document.getElementById("loader");
    if (!loader || loader.classList.contains("hide")) return;
    var wait = Math.max(0, LOADER_MIN - (Date.now() - LOADER_START));
    setTimeout(function () {
      loader.classList.add("hide");
      var bgmBtn = document.getElementById("bgm-toggle");
      if (bgmBtn) setTimeout(function () { bgmBtn.classList.add("ready"); }, 400);
    }, wait);
  }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, LOADER_MAX); // 安全上限

  /* ---------- 地址複製 ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      var text = btn.getAttribute("data-copy");
      var label = btn.querySelector(".addr-copy-label");
      var done = function () {
        btn.classList.add("copied");
        if (label) label.textContent = t("travel.copy.done");
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = t("travel.copy");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      } else {
        // 後備方案
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- 背景音樂：洗牌全部歌曲成佇列，一首播完自動換下一首 ---------- */
  (function () {
    var audio = document.getElementById("bgm");
    var btn   = document.getElementById("bgm-toggle");
    if (!audio || !btn) return;

    // 後備歌單：當 Music/tracks.json 讀取失敗時使用
    var FALLBACK = [
      "Music/Troye Sivan - Angel Baby (SPOTISAVER).mp3",
      "Music/Taylor Swift - Enchanted (SPOTISAVER).mp3",
      "Music/Lauv - Love U Like That (SPOTISAVER).mp3"
    ];

    var queue = [];          // 洗牌後的播放順序
    var qi = 0;              // 目前播到第幾首
    var userPaused = false;

    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    }

    function setPlayingUI(on) {
      btn.classList.toggle("playing", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? t("bgm.pause") : t("bgm.play"));
    }

    function buildQueue(list) {
      queue = shuffle((Array.isArray(list) && list.length) ? list : FALLBACK);
      qi = 0;
      if (queue.length) audio.src = queue[0];
    }

    function advance() {
      if (!queue.length) return;
      qi++;
      if (qi >= queue.length) {           // 一輪播完 → 重新洗牌（避免與上一首立刻重複）
        var last = queue[queue.length - 1];
        queue = shuffle(queue);
        if (queue.length > 1 && queue[0] === last) queue.push(queue.shift());
        qi = 0;
      }
      audio.src = queue[qi];
    }

    // 一首播完自動接下一首（使用者沒手動暫停時）
    audio.addEventListener("ended", function () {
      advance();
      if (!userPaused) {
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
        setPlayingUI(true);
      }
    });

    // 讀取由 data/build_music.py 掃描 Music/ 產生的歌單清單
    fetch("Music/tracks.json?v=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (list) { buildQueue(list); })
      .catch(function () { buildQueue(FALLBACK); });

    audio.volume = 0.35;

    function tryPlay() {
      var p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(function () { setPlayingUI(true); })
         .catch(function () { /* 瀏覽器尚未授權，等下次互動 */ });
      } else {
        setPlayingUI(true);
      }
    }

    // 首次互動觸發（滾動 / 觸控 / 點擊任意位置）
    function onFirstInteract() {
      if (!audio.src) return;  // 歌單尚未載入，保留監聽待下次互動
      if (!userPaused && audio.paused) tryPlay();
      window.removeEventListener("scroll", onFirstInteract);
      window.removeEventListener("touchstart", onFirstInteract);
      window.removeEventListener("click", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    }
    window.addEventListener("scroll",     onFirstInteract, { passive: true, once: false });
    window.addEventListener("touchstart", onFirstInteract, { passive: true });
    window.addEventListener("click",      onFirstInteract);
    window.addEventListener("keydown",    onFirstInteract);

    // 按鈕手動切換
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (audio.paused) {
        userPaused = false;
        tryPlay();
      } else {
        userPaused = true;
        audio.pause();
        setPlayingUI(false);
      }
    });
  })();

  /* ---------- 回頂端浮動鈕 ---------- */
  var toTop = document.getElementById("to-top");
  if (toTop) {
    toTop.setAttribute("aria-label", t("totop.aria"));
    var toggleToTop = function () {
      toTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", toggleToTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 分享：產生帶時戳版本參數的網址（避開 LINE 縮圖快取） ---------- */
  function buildShareUrl() {
    var base = window.location.origin + window.location.pathname;
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var v = d.getFullYear() +
            pad(d.getMonth() + 1) +
            pad(d.getDate()) +
            pad(d.getHours()) +
            pad(d.getMinutes()) +
            pad(d.getSeconds());
    return base + "?v=" + v;
  }

  /* ---------- LINE 分享按鈕：點擊瞬間用最新時戳 ---------- */
  (function () {
    var lineBtn = document.getElementById("share-line");
    if (!lineBtn) return;
    lineBtn.addEventListener("click", function () {
      var shareUrl = "https://social-plugins.line.me/lineit/share?url=" +
                     encodeURIComponent(buildShareUrl());
      lineBtn.setAttribute("href", shareUrl);
    });
  })();

  /* ---------- 分享：複製網址 ---------- */
  (function () {
    var btn = document.getElementById("share-copy");
    if (!btn) return;
    var label = btn.querySelector("span");
    btn.addEventListener("click", function () {
      var url = buildShareUrl();
      var done = function () {
        btn.classList.add("copied");
        if (label) label.textContent = t("share.copy.done");
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = t("share.copy");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  })();

  /* ---------- Navbar：捲動變暗 + 漢堡 ---------- */
  var nav = document.getElementById("site-nav");
  var burger = nav && nav.querySelector(".nav-burger");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
  }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 點選連結後關閉
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 進場動畫（reveal） ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var delay = parseInt(el.dataset.delay || "0", 10);
          setTimeout(function () { el.classList.add("in"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    // 同一群組的 reveal 依序淡入
    reveals.forEach(function (el) {
      var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.dataset.delay = Math.min(sibs, 6) * 90;
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 倒數計時 ---------- */
  // 婚禮:2026/09/12 12:30(台灣時間 UTC+8)
  var target = new Date("2026-09-12T12:30:00+08:00").getTime();
  var wrap = document.getElementById("countWrap");
  var done = document.getElementById("countDone");
  var cells = {};
  document.querySelectorAll(".count-row b").forEach(function (el) {
    cells[el.getAttribute("data-k")] = el;
  });

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      if (wrap) wrap.style.display = "none";
      if (done) done.hidden = false;
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    if (cells.d) cells.d.textContent = Math.floor(s / 86400);
    if (cells.h) cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
    if (cells.m) cells.m.textContent = pad(Math.floor((s % 3600) / 60));
    if (cells.s) cells.s.textContent = pad(s % 60);
  }
  tick();
  var timer = setInterval(tick, 1000);

  /* ---------- 賓客祝福：泡泡牆 ---------- */
  (function () {
    var field = document.getElementById("wishField");
    var statusEl = document.getElementById("wishStatus");
    var refreshBtn = document.getElementById("wishes-refresh");
    if (!field) return;

    var DATA_URL = "data/wishes.json";

    function setStatus(key, show) {
      if (!statusEl) return;
      statusEl.textContent = key ? t(key) : "";
      statusEl.style.display = show ? "" : "none";
    }

    function rand(min, max) { return min + Math.random() * (max - min); }

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      return arr;
    }

    // 建一顆泡泡（三種浮動變體輪流 f1/f2/f3 + 各自隨機時長/相位）
    function makeBubble(text, idx) {
      var b = document.createElement("div");
      var variant = idx % 3;
      b.className = "wish-bubble" + (variant === 1 ? " f2" : variant === 2 ? " f3" : "");
      b.textContent = text;
      b.style.setProperty("--dur", rand(7, 13).toFixed(2) + "s");
      b.style.setProperty("--delay", (-rand(0, 6)).toFixed(2) + "s");
      return b;
    }

    function renderBubbles(wishes) {
      field.innerHTML = "";
      if (!wishes || !wishes.length) {
        setStatus("wishes.empty", true);
        return;
      }
      setStatus(null, false);
      // 每次隨機抽取 10–15 則（總數不足則全部顯示）；每次重新抽取都重抽
      var pool = shuffle(wishes.slice());
      var take = Math.min(pool.length, 10 + Math.floor(Math.random() * 6));  // 10..15
      var frag = document.createDocumentFragment();
      pool.slice(0, take).forEach(function (w, idx) {
        frag.appendChild(makeBubble(w.text, idx));
      });
      field.appendChild(frag);
    }

    function load(initial) {
      setStatus("wishes.loading", true);
      if (!initial) {
        if (refreshBtn) refreshBtn.classList.add("spinning");
        field.classList.add("fading");
      }
      // 池 = 表單匯入(wishes.json) + Firestore 匿名留言；任一來源失敗都不影響另一個
      var jsonP = fetch(DATA_URL + "?v=" + Date.now(), { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (d) { return (d && d.wishes) || []; })
        .catch(function () { return []; });
      var fsP = (window.__cyWishesLive && window.__cyWishesLive.fetchWishes)
        ? window.__cyWishesLive.fetchWishes() : Promise.resolve([]);
      var delayP = new Promise(function (res) { setTimeout(res, initial ? 0 : 360); });

      Promise.all([jsonP, fsP, delayP]).then(function (vals) {
        field.classList.remove("fading");
        var pool = (vals[0] || []).concat(vals[1] || []);
        renderBubbles(pool);
      }).catch(function () {
        field.classList.remove("fading");
        if (!field.children.length) setStatus("wishes.error", true);
      }).then(function () {
        if (refreshBtn) {
          setTimeout(function () { refreshBtn.classList.remove("spinning"); }, 500);
        }
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () { load(false); });
    }

    // 進入視窗才首次載入（順便讓泡泡入場更有感）
    if ("IntersectionObserver" in window) {
      var loaded = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !loaded) {
            loaded = true;
            load(true);
            io.disconnect();
          }
        });
      }, { rootMargin: "0px 0px -8% 0px" });
      io.observe(field);
    } else {
      load(true);
    }

    /* ---------- 匿名留言：寫入 Firestore（wishes-live.js）+ 立即顯示自己那則 ---------- */
    (function () {
      var postBtn = document.getElementById("wishPostBtn");
      var modal = document.getElementById("wishModal");
      var input = document.getElementById("wishInput");
      var countEl = document.getElementById("wishCount");
      var submitBtn = document.getElementById("wishSubmit");
      var cancelBtn = document.getElementById("wishCancel");
      var closeBtn = document.getElementById("wishModalClose");
      var toast = document.getElementById("wishToast");
      var errorEl = document.getElementById("wishError");
      if (!postBtn || !modal) return;

      var MAX = 150, COOLDOWN = 10000;
      var canDialog = typeof modal.showModal === "function";
      var toastTimer = null;

      // 敏感字詞黑名單（前端第一道防線，擋明顯髒話；可在此自由增減）。
      // 限制：純前端可被繞過、且抓不到誹謗/謾罵等情境性內容 → 最終把關仍靠後台刪除(verify.html)。
      var BANNED = [
        "幹你娘", "幹妳娘", "干你娘", "操你媽", "操你妈", "肏你", "你媽的", "你妈的", "他媽的", "去你媽",
        "媽的", "妈的", "雞掰", "機掰", "雞巴", "屌你", "王八蛋", "婊子", "賤人", "賤貨", "賤種", "妓女",
        "靠北", "靠盃", "靠杯", "死全家", "智障", "腦殘", "狗娘養", "龜兒子", "雜種", "騷貨", "蕩婦", "死娘炮",
        "fuck", "shit", "bitch", "bastard", "asshole", "dick", "cunt", "slut", "whore", "motherf", "retard"
      ];
      function normForCheck(s) { return (s || "").normalize("NFKC").replace(/\s+/g, "").toLowerCase(); }
      function isBanned(text) {
        var n = normForCheck(text);
        for (var i = 0; i < BANNED.length; i++) {
          if (n.indexOf(BANNED[i]) >= 0) return true;
        }
        return false;
      }

      function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.hidden = false;
        // 強制重繪後加 show 才有過場
        void toast.offsetWidth;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          toast.classList.remove("show");
          setTimeout(function () { toast.hidden = true; }, 300);
        }, 2600);
      }
      // 彈窗內、文字框下方的警示（不雅字詞 / 空白 / 冷卻 / 送出失敗）
      function showError(msg) {
        if (!errorEl) { showToast(msg); return; }
        errorEl.textContent = msg;
        errorEl.hidden = false;
      }
      function clearError() { if (errorEl) { errorEl.hidden = true; errorEl.textContent = ""; } }

      function updateCount() {
        if (countEl && input) countEl.textContent = String(input.value.length);
        clearError();   // 一邊打字一邊清掉警示
      }
      function openModal() {
        if (input) input.value = "";
        clearError();
        updateCount();
        if (canDialog) {
          modal.showModal();
          setTimeout(function () { if (input) input.focus(); }, 30);
        }
      }
      function closeModal() { if (canDialog && modal.open) modal.close(); }

      function submit() {
        var text = (input && input.value ? input.value : "").trim();
        if (!text) { showError(t("wishes.post.empty")); return; }
        if (text.length > MAX) text = text.slice(0, MAX);
        if (isBanned(text)) { showError(t("wishes.post.blocked")); return; }
        var last = 0;
        try { last = parseInt(localStorage.getItem("cy.wish.last") || "0", 10); } catch (e) {}
        if (Date.now() - last < COOLDOWN) { showError(t("wishes.post.cooldown")); return; }
        if (!(window.__cyWishesLive && window.__cyWishesLive.post)) { showError(t("wishes.post.error")); return; }

        if (submitBtn) submitBtn.disabled = true;
        window.__cyWishesLive.post(text).then(function () {
          try { localStorage.setItem("cy.wish.last", String(Date.now())); } catch (e) {}
          closeModal();
          // 立即把自己那則排到最前面（保證看得到）
          setStatus(null, false);
          field.insertBefore(makeBubble(text, 0), field.firstChild);
          showToast(t("wishes.post.done"));
        }).catch(function () {
          showError(t("wishes.post.error"));
        }).then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
      }

      postBtn.addEventListener("click", openModal);
      if (input) input.addEventListener("input", updateCount);
      if (submitBtn) submitBtn.addEventListener("click", submit);
      if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    })();
  })();

  /* ---------- 喜餅兌換券：依網址 ?g=<姓名> 判斷女方親友才解鎖 ---------- */
  (function () {
    var navItem = document.getElementById("nav-voucher");
    var section = document.getElementById("voucher");
    if (!navItem || !section) return;

    // 正規化（須與 data/build_guests.py 的 normalize_name 完全一致）
    function normName(s) {
      return (s || "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
    }
    function toHex(buf) {
      var b = new Uint8Array(buf), s = "";
      for (var i = 0; i < b.length; i++) {
        s += (b[i] < 16 ? "0" : "") + b[i].toString(16);
      }
      return s;
    }

    var raw;
    try { raw = new URLSearchParams(window.location.search).get("g"); }
    catch (e) { raw = null; }
    var norm = normName(raw);
    if (!norm) return;                                  // 沒帶姓名 → 維持隱藏

    // 測試公版：?g=測試人員 → 直接解鎖（免進女方名單），名稱即顯示「測試人員」
    if (norm === normName("測試人員")) { reveal(); return; }

    if (!(window.crypto && window.crypto.subtle)) return; // 不支援雜湊 → 安全起見維持隱藏

    function reveal() {
      navItem.hidden = false;
      section.hidden = false;
      // 顯示專屬姓名（用網址原值，textContent 防注入）
      var forLine = document.getElementById("voucherFor");
      var nameEl = document.getElementById("voucherName");
      if (nameEl && raw) {
        nameEl.textContent = raw;
        if (forLine) forLine.hidden = false;
      }
      // 解鎖後直接讓區塊內的進場動畫到位
      section.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }

    fetch("data/guests.json?v=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (g) {
        var enc = new TextEncoder();
        return window.crypto.subtle
          .digest("SHA-256", enc.encode((g.salt || "") + norm))
          .then(function (buf) {
            var hex = toHex(buf);
            if ((g.brideHashes || []).indexOf(hex) >= 0) reveal();
          });
      })
      .catch(function () { /* 失敗 → 維持隱藏 */ });
  })();

  /* ---------- 喜餅兌換券：撕票動畫 + 誤撕復原（純前端·記在本機）---------- */
  (function () {
    var tear = document.getElementById("voucherTear");
    var stub = document.getElementById("voucherStub");
    var restoreBtn = document.getElementById("voucherRestore");
    var section = document.getElementById("voucher");
    if (!tear || !stub) return;

    var raw;
    try { raw = new URLSearchParams(window.location.search).get("g"); }
    catch (e) { raw = null; }
    var who = (raw || "").normalize("NFKC").replace(/\s+/g, "").toLowerCase() || "default";
    var KEY = "cy.voucher.torn." + who;

    function setTorn(on, instant) {
      if (instant) tear.classList.add("is-initial");
      tear.classList.toggle("torn", on);
      if (section) section.classList.toggle("is-torn", on);   // 撕券後才顯示專屬核銷 QR
      if (restoreBtn) restoreBtn.hidden = !on;
      if (instant) { void tear.offsetWidth; tear.classList.remove("is-initial"); }
      try {
        if (on) localStorage.setItem(KEY, "1");
        else localStorage.removeItem(KEY);
      } catch (e) {}
    }

    function tearOff() { if (!tear.classList.contains("torn")) setTorn(true, false); }

    // 還原先前撕除狀態（不播動畫）
    var wasTorn = false;
    try { wasTorn = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (wasTorn) setTorn(true, true);

    stub.addEventListener("click", tearOff);
    stub.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tearOff(); }
    });
    // ---- 誤撕復原：點 [復原] → 自訂彈窗，須輸入主辦方核銷驗證碼才解鎖 ----
    // 核銷驗證碼（暫定值，活動開始前三天會變更；屆時同步更新此處與通知賓客）
    var UNLOCK_CODE = "0638";

    var modal = document.getElementById("voucherModal");
    var codeInput = document.getElementById("voucherCodeInput");
    var codeError = document.getElementById("voucherCodeError");
    var codeHint = document.getElementById("voucherCodeHint");
    var canDialog = modal && typeof modal.showModal === "function";

    // 彈窗上方顯示用的驗證碼，以 UNLOCK_CODE 為單一來源（改碼只需改 UNLOCK_CODE）
    function syncCodeHint() {
      if (codeHint) codeHint.textContent = "【" + t("voucher.unlock.codeLabel") + "：" + UNLOCK_CODE + "】";
    }
    syncCodeHint();

    var openedAt = 0;
    function openModal() {
      syncCodeHint();
      if (codeInput) codeInput.value = "";
      if (codeError) codeError.hidden = true;
      if (canDialog) {
        modal.showModal();
        openedAt = Date.now();
        setTimeout(function () { if (codeInput) codeInput.focus(); }, 30);
      }
    }
    function closeModal() { if (canDialog && modal.open) modal.close(); }
    function submitCode() {
      var val = (codeInput && codeInput.value ? codeInput.value : "").trim();
      if (val === UNLOCK_CODE) {
        closeModal();
        setTorn(false, false);
      } else if (codeError) {
        codeError.hidden = false;
        if (codeInput) { codeInput.focus(); codeInput.select(); }
      }
    }

    if (restoreBtn) restoreBtn.addEventListener("click", openModal);
    if (modal) {
      var submitBtn = document.getElementById("voucherCodeSubmit");
      var cancelBtn = document.getElementById("voucherModalCancel");
      var closeBtn = document.getElementById("voucherModalClose");
      if (submitBtn) submitBtn.addEventListener("click", submitCode);
      if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (codeInput) {
        codeInput.addEventListener("input", function () { if (codeError) codeError.hidden = true; });
        codeInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); submitCode(); }
        });
      }
      // 點背景關閉，但忽略「開窗那一下」的誤觸（iOS 觸控會把開窗的 tap 帶到背景上 → 秒關）
      modal.addEventListener("click", function (e) {
        if (e.target === modal && Date.now() - openedAt > 350) closeModal();
      });
    }
  })();
})();

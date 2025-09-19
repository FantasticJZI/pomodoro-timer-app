# 番茄鐘 Pomodoro Timer 🍅

一個現代化、功能完整的番茄鐘PWA應用程式，幫助你提高工作效率和時間管理。

## 🌟 功能特色

### 🎯 核心功能
- **25分鐘工作時間** - 經典番茄鐘工作時段
- **5分鐘短休息** - 工作間隙的短暫休息
- **15分鐘長休息** - 每4個番茄後的大休息
- **自動模式切換** - 工作結束後自動進入休息模式

### 🎨 界面設計
- **現代化UI** - 漸層背景和圓潤設計
- **進度環顯示** - 視覺化時間進度
- **響應式設計** - 支援手機、平板、桌面設備
- **動畫效果** - 流暢的過渡動畫

### ⚙️ 自定義設置
- **可調整時間** - 自定義工作、休息時間長度
- **長休息間隔** - 設定長休息的觸發間隔
- **音效開關** - 可選擇是否啟用提示音
- **設置保存** - 自動保存個人偏好設置

### 🎵 音效提示
- **時間到提醒** - 工作/休息時間結束時播放提示音
- **視覺通知** - 彈出式通知提醒
- **鍵盤快捷鍵** - 空格鍵開始/暫停，ESC關閉設置

## 📱 安裝方法

### 方法一：直接訪問
1. 在瀏覽器中打開：https://你的用戶名.github.io/pomodoro-timer-app
2. 點擊地址欄右側的「安裝」按鈕
3. 或者點擊菜單 → 「安裝應用程式」

### 方法二：手機安裝
1. 用Chrome瀏覽器打開網站
2. 點擊「添加到主屏幕」
3. 確認安裝

## 🚀 部署到GitHub Pages

### 1. Fork這個倉庫
點擊右上角的「Fork」按鈕

### 2. 啟用GitHub Pages
1. 進入你的倉庫頁面
2. 點擊「Settings」標籤
3. 滾動到「Pages」部分
4. 在「Source」下選擇「Deploy from a branch」
5. 選擇「main」分支和「/ (root)」文件夾
6. 點擊「Save」

### 3. 訪問你的APP
幾分鐘後，你的APP將在以下網址可用：
`https://你的用戶名.github.io/pomodoro-timer-app`

## 🛠️ 本地開發

### 安裝依賴
無需安裝任何依賴，直接打開 `index.html` 即可。

### 本地服務器
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx http-server

# 使用PHP
php -S localhost:8000
```

## 📁 文件結構

```
pomodoro-timer-app/
├── index.html          # 主HTML文件
├── styles.css          # 樣式文件
├── script.js           # JavaScript邏輯
├── manifest.json       # PWA配置文件
├── sw.js              # Service Worker
├── icons/             # 應用圖標
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── create-icons.html   # 圖標生成器
└── README.md          # 說明文件
```

## 🎮 使用方法

### 基本操作
1. **開始工作** - 點擊「開始」按鈕開始25分鐘工作計時
2. **暫停/恢復** - 點擊「暫停」按鈕或按空格鍵
3. **重置計時** - 點擊「重置」按鈕重新開始當前時段
4. **模式切換** - 手動切換工作、短休息、長休息模式

### 鍵盤快捷鍵
- `空格鍵` - 開始/暫停計時器
- `ESC鍵` - 關閉設置面板

### 設置面板
1. 點擊右上角「設置」按鈕
2. 調整各項時間設置
3. 選擇是否啟用音效
4. 點擊「保存設置」確認

## 🔧 技術特色

### 前端技術
- **純HTML/CSS/JavaScript** - 無需額外依賴
- **ES6+語法** - 現代JavaScript特性
- **CSS Grid/Flexbox** - 響應式布局
- **Web Audio API** - 音效生成
- **LocalStorage** - 設置持久化

### PWA特性
- **Service Worker** - 離線支持
- **Web App Manifest** - 原生APP體驗
- **響應式設計** - 適配各種設備
- **快速加載** - 資源緩存優化

### 瀏覽器支援
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🎯 番茄工作法簡介

番茄工作法是由Francesco Cirillo在1990年代創立的時間管理方法：

1. **選擇任務** - 選擇要完成的工作任務
2. **設定25分鐘計時器** - 專注工作25分鐘
3. **短休息5分鐘** - 工作結束後休息5分鐘
4. **重複循環** - 每4個番茄後進行15-30分鐘長休息

### 核心原則
- **專注當下** - 25分鐘內只專注於一個任務
- **避免干擾** - 關閉通知，專心工作
- **規律休息** - 定期休息保持大腦清醒
- **記錄追蹤** - 記錄完成的番茄數量

## 🤝 貢獻

歡迎提交Issue和Pull Request來改進這個項目！

### 如何貢獻
1. Fork這個倉庫
2. 創建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個Pull Request

## 📄 許可證

MIT License - 自由使用、修改和分發

## 🙏 致謝

- 感謝所有使用這個應用的用戶
- 感謝開源社區的貢獻
- 感謝Francesco Cirillo創立的番茄工作法

---

**開始你的高效工作之旅吧！** 🚀

## 📞 支持

如果你遇到任何問題或有建議，請：
1. 查看[Issues](https://github.com/你的用戶名/pomodoro-timer-app/issues)
2. 創建新的Issue
3. 或者發送郵件聯繫

**記住：專注當下，高效工作！** 🍅⏰
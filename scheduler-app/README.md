# NCU 排課助手 (NCU Course Scheduler)

這是一個協助中央大學學生規劃課程的輔助工具，結合了課程搜尋、課表排程以及 Google Gemini AI 自動填課功能。

## 功能特色

- **課程搜尋**：依照學院、系所、年級、時間等條件篩選課程。
- **課表視覺化**：直觀的週課表介面，即時顯示已選課程。
- **學分統計**：自動計算目前選課總學分。
- **AI 智能填課**：輸入你的期望（例如：「我想修輕鬆一點的課」或「我想主攻系必選」），由 AI 推薦適合的課程組合。
- **自動選課模擬**：模擬選課流程（開發中功能）。

## 執行環境需求

- **Node.js**: 版本需為 **v20 或以上**。
- **npm** 或 **yarn**, **pnpm**, **bun**。

## 安裝與執行教學

跟著以下步驟在你的電腦上執行此專案：

### 1. 取得專案代碼

如果你是直接下載的壓縮檔，請解壓縮。如果是透過 Git：

```bash
git clone <repository-url>
cd scheduler-app
```

### 2. 安裝套件

在專案根目錄 (`scheduler-app` 資料夾內) 執行：

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 3. 設定環境變數 (必要的 AI 功能)

為了讓 AI 自動填課功能正常運作，你需要一組 Google Gemini API Key。

1.  前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 申請 API Key。
2.  在專案根目錄建立一個名為 `.env.local` 的檔案。
3.  在 `.env.local` 中加入以下內容：

```env
GEMINI_API_KEY=你的_API_KEY_貼在這裡
```

### 4. 啟動開發伺服器

執行以下指令啟動網站：

```bash
npm run dev
```

成功啟動後，打開瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可開始使用！

## 專案結構

- `app/`: Next.js App Router 頁面與 API 路由。
- `components/`: React UI 元件。
- `lib/`: 工具函式庫 (包含 Gemini AI 呼叫邏輯)。
- `data/`: 靜態資料 (如系所結構)。

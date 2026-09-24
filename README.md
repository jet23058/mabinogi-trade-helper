# 瑪奇貿易小幫手

依據 `mabinogi_trade_material_calculator_v2.2.tsd` 與 ZIP 內最新版 v2.2 bootstrap data 實作的 Manifest V3 Chrome Extension。

## 已完成

- React + TypeScript + Vite extension popup。
- Popup / Full Page 雙 Surface，共用 React UI、Runtime Data、User State 與 Recipe Engine。
- `app.html` Full Page、Popup「在新分頁開啟」、Chrome Storage change synchronization。
- 四個貿易所、24 個貿易品與可收合階層式材料樹；數量右側對齊。
- 20 個固定總量需求，以及 `2026-08` 的 4 個每月特殊需求。
- 固定需求直接使用需求總量；每月需求使用 `quantityPerExchange × exchangeCount`，不乘貿易品的「材料」欄位。
- 全選／分區選取、共用根材料合併與結果即時計算。
- 貿易所 Tabs、全域 24 項 Toggle，以及各貿易所 tri-state 全選。
- 材料樹支援「類別區分／全部列出」，預設一次只顯示一個有需求類別。
- 絲綢、布料、線團與皮繩合併顯示為「紡織」，「金屬類」顯示為「金屬」；合併類別共用完成數量統計，保留原有材料勾選記錄。
- 材料樹類別依序為金屬、木柴、藥水、料理、紡織、手工藝、魔法製造、稀原工學、魔法陣、其他材料、魔法鍋；各類品項依自訂順序顯示，未指定者保留於類別末尾。「麥粉」顯示名稱更新為「大麥粉」。
- 材料完成 Checkbox 以 itemId 追蹤準備量，與庫存、停止拆解及配方公式完全分離。
- 材料樹可點整個品項區塊（含取得方式、製作資訊及空白處）切換完成勾選，Ctrl＋點擊則展開／收合，子材料各自獨立。展開三角形位於品項圖片正下方，也可直接點擊；複製、展開及停止拆解按鈕各自獨立操作。品項下方不再顯示已有／尚需／庫存輸入列，庫存仍可在「一次備料」編輯。
- 一次備料可點材料橫列切換完成勾選。「全部取消勾選」會清除所有類別（含收合子材料）的完成記錄並儲存。
- 76 張已核對的材料圖示使用本機資產，其中 69 張來自 Mabinogi 奇幻世界；待核對項目明確顯示開發用佔位圖。
- 每一個根、子與葉材料列都可複製目前語系的顯示名稱，並提供成功／失敗提示。
- Copy 操作與材料完成、配方展開、庫存、停止拆解及計算狀態隔離。
- Chrome Extension 使用使用者提供的 2.1 新圖示，並包含 16／32／48／128 px 本機資產。
- 整合 Mabinogi奇幻世界重新掃描結果：76 張本機圖示、3 筆仍只有精確頁、13 筆仍只有列表來源、8 筆替代來源及 9 筆允許未解析。
- 材料圖示可區分本機資產、FWS 精確頁、FWS 列表、替代來源與允許未解析；每張下載圖示都保留來源頁與原始圖片網址。
- 類別層級顯示藥劑師、裁縫師與寵物訓練師的一代宗師提醒，不修改配方公式。
- 匯入 29 個材料的網頁驗證取得方式，並修正「麥粉／小麥粉／旋轉齒輪」Canonical Name。
- Standard / Batch Recipe、Cooking Ratio、任意深度展開、FIFO 庫存扣除。
- Stop Expansion、Recipe Tree、Final Material Summary、特化專業。
- Cooking Instruction 與 Grandmaster Hint；宗師只提示，不改基礎公式。
- `RawUserState`、Inventory Quarantine、`gameData:<version>` / `activeDataVersion` Atomic Activation。
- zh-TW 完整 UI 與 zh-CN / ja sparse fallback 架構。
- Vitest 引擎回歸測試與遠端 Bundle semantic validation。

## 開發與打包

```bash
pnpm install
pnpm build
```

完成後在 Chrome 開啟 `chrome://extensions`，啟用「開發人員模式」，選擇「載入未封裝項目」，指定本專案的 `dist` 目錄。

## 自訂月份資料

完整頁面的「自訂月份資料」取代原本「圖片轉 JSON」。月份來源預設為「系統」，可切換為「自行匯入」，兩種來源分開保存。

依交易所填表的順序為卡魯森林、綠洲、凱麗達、佩拉，四處皆已開放並顯示交易所圖片。前兩處提供四種魔法鍋、共 20 個成品；後兩處提供三種手工藝箱子、三種冶煉板材與露明糖漿。材料視窗可搜尋名稱並顯示圖片，缺少圖示的項目標示「圖片待補」。品項名稱、完整兌換數量、重量、材料、位置可填寫；材料列填的是「每次所需數量」。例如搖椅 3 次，黑莓汁、花花洋裝、強力黏著劑各填 1，完整需求各為 3。可先儲存部分交易所並直接套用，未填的交易所會提示缺資料。

- 系統：內建月份加上最近一次成功下載的 GitHub 月份資料。預設索引網址為 `https://raw.githubusercontent.com/jet23058/mabinogi-trade-helper/main/months.json`；玩家可在頁面按「更新系統資料」下載最新索引，離線時使用已快取的資料。若 GitHub 預設分支不是 `main`，請同步修改 `src/monthly-source.json`。
- 自行匯入：選取 JSON 檔案或貼上內容，檢查四個特殊貿易品的材料與每次數量，確認後直接套用並選取該月份，不需重新打包。相同月份會提示取代，可先匯出備份。
- 資料存放於 `chrome.storage.local`，Popup 與完整頁面同步；本機網頁預覽使用 localStorage。下載失敗不會覆蓋既有資料。
- 沒有該來源的所選月份時，顯示缺資料提示，特殊品項不可選取，固定品項仍可計算；不會拿其他月份冒充。
- 「匯出分享」輸出單月份資料包；JSON 匯入保留在可收合的「匯入社群資料包」。表單輸出 v2 格式，包含交易所需求和貿易品資訊，可接受未填滿四處的月份；舊 v1 完整月份仍可匯入。未知材料需先由維護者加入材料字典。
- 更新版第一次需在 Chrome 擴充功能管理頁重新載入 `dist`，並重新整理已開啟的完整頁面；之後匯入月份不必再重新載入。

GitHub 與社群資料包的格式見 [月份資料格式](data/MONTHLY_DATA.md)。目前 GitHub 以「更新系統資料」按鈕手動下載，不會背景自動更新。

### 維護 GitHub 月份資料

- `months.json` 是擴充功能下載的系統索引，包含 `schemaVersion: 1` 與月份資料包陣列。
- `months/2026-09.json` 保存 2026 年 9 月的單月資料；修改月份時，請同時更新索引中的對應項目。
- 新增月份時，依 `data/MONTHLY_DATA.md` 的 v2 格式建立單月 JSON，然後把它加入 `months.json` 的 `months` 陣列。玩家在擴充功能中更新系統資料後即可取得，不需重新發布擴充功能。
- 目前索引包含 2026-09，來源是使用者提供的月份資料包。

## 資料界線

2026-09-23 依使用者提供的四張圖示與材料表，補齊閃耀／精巧／柔和／豐饒魔法鍋各 5 個品項（共 20 個），以及 7 種基礎材料。配方以每份成品計算，忽略 B 欄鑰匙。對照資料保存在 `data/magic-cauldron.json`；四張原始圖示保存在 `public/assets/materials/cauldron_*_strip.png`，畫面以 SVG viewBox 顯示對應品項，原始像素未修改。基礎材料尚無使用者提供圖示，保留待補狀態。

目前 runtime 使用 `src/bootstrap-v2.2.json` 作為離線內建資料，並由 `src/data.ts` 套用已下載且核對過的 FWS 本機圖示來源。材料圖示不會在執行階段爬網或 Hotlink；尚未取得的項目會保留來源定位狀態，不會猜測圖片。


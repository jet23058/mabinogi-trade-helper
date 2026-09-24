# 瑪奇貿易月份資料

本 repo 只存放瑪奇貿易小幫手的月份資料，不包含擴充功能程式碼。

## 新增或更新月份

上傳單月 JSON 至 `months/YYYY-MM.json`（例如 `months/2026-09.json`）並推送到 `main`。GitHub Actions 會檢查資料並更新根目錄的 `months.json`；之後在擴充功能按「更新系統資料」即可載入。

索引網址：

`https://raw.githubusercontent.com/jet23058/mabinogi-trade-helper/main/months.json`

## 檔案格式

月份檔使用 v2 格式。材料數量 `quantityPerExchange` 是每次兌換所需數量，實際需求會乘上 `exchangeCount`。材料 ID 須為擴充功能支援的項目。

```json
{
  "schemaVersion": 2,
  "month": "2026-09",
  "entries": []
}
```

單月資料放在 `months/`；`months.json` 由 GitHub Actions 自動產生，請勿手動編輯。

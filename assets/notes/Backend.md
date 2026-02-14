## API 設計原則

RESTful API 是現代 Web 開發的標準，遵循以下原則：

- URL 命名必須用「名詞」，不應該用「動詞」
- 使用標準的 HTTP 狀態碼來表示請求結果
- 資源之間應該有清晰的層次結構

### HTTP 方法對應

```txt
GET     // 獲取資源
HEAD    // 獲取資源(不包括主體)
POST    // 創建資源
PUT     // 更新資源(整體更新)
PATCH   // 更新資源(部分更新)
DELETE  // 刪除資源
```

### 狀態碼設計

信息響應

- 100 Continue
  成功響應
- 200 OK
- 201 Created
  重定向
- 301 Moved Permanently
- 303 See Other
- 304 Not Modified
  客戶端錯誤
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
  伺服器錯誤
- 500 Internal Server Error

### 路徑參數 - Path Parameters

出現在 URL 路徑中，例如：`/api/users/{id}`

- 用於標識特定資源，從網站就可以看到所以用於資源定位，不可用於密碼等敏感信息
- 雖然 Path Parameter 不會直接注入 SQL，但不能完全依賴前端，後端須做型別驗證

### 查詢參數 - Query Parameters

出現在 URL 的`?`後面，例如：`/items?category=books&page=2`

- 左邊是 key ，右邊是 value，多個參數用 `&` 分隔
- 用於過濾、排序和分頁等操作
- 需要對參數進行驗證和轉義，防止 XSS、注入攻擊

### 請求文本 - Request Body

出現在請求體中，通常用於 POST、PUT、PATCH 請求。不直接在 URL 中顯示。
用於傳遞數據，如 JSON 格式：

```json
{
  "email": "abc@gmail.com",
  "password": "PaSsword123"
}
```

- 可以包含多個字段，支持嵌套結構

### 標頭 - Header

出現在 HTTP 請求或響應的頭部 `Content-Type: application/json`

- 若 Content-Type 缺失可能造成 415 錯誤
- 內容通常是 JSON

### 驗證 - Authorization

在 Header 中傳遞授權資訊。例如：`Authorization: Bearer <token>`

### 令牌 - Token

- 常用於無狀態認證機制
- Token 通常包含用戶信息和過期時間，並經過簽名以防篡改
- Access Token：用於解析唯一用戶，通常有較短的有效期
- Refresh Token：用於獲取新的 Access Token，通常有較長的有效期
- 前端收到 Token 後必須安全保存，以防止被惡意應用程序訪問

## 資料邊界

### 為何要處理資料邊界

後端 API 需要接收或傳送資料，為了格式的正確性和安全性，必須對資料的邊界進行處理，防止不合法的資料進入系統，造成錯誤或安全漏洞。

### 如何處理資料邊界

- 驗證資料格式：使用 Hoppscotch 或類似工具傳送真實的請求，確保資料格式正確
- 後端使用適當的 HTTP 狀態碼來反饋錯誤，不必顯示具體的錯誤細節，以防止敏感信息洩露
- 在後端實施嚴格的資料驗證和清理，防止 SQL 注入、XSS 攻擊等安全問題

### Serializer 的角色

- 資料形狀(Schema)的定義：定義了資料的結構和類型，確保資料符合預期的格式
- 資料驗證：負責驗證輸入資料的有效性
- 內部、外部資料轉換：可以將內部資料結構轉換為外部格式（如 JSON），反之亦然
  很多人把 Serializer 等同於 JSON 轉換， 但在系統設計上，它的責任是定義資料邊界，而不是決定資料的傳輸格式

## 日誌紀錄

前期設計可以使用 print 語句來簡單地輸出調試信息，但在生產環境中，應該使用專業的日誌紀錄工具，如 Python 的 logging 模組，以便更好地管理和分析日誌。

### 標準分級

- DEBUG：詳細的調試信息，通常只在開發環境中使用
- INFO：一般的運行信息，適用於生產環境
- WARNING：可能的問題或重要事件，但不一定是錯誤
- ERROR：錯誤事件，通常需要關注和修復
- CRITICAL：嚴重錯誤，可能導致系統崩潰或重大問題

## 結論

RESTful API 是後端開發的基礎，遵循這些原則可以確保 API 的一致性、可維護性和安全性。根據具體需求選擇適合的設計模式，並確保對所有輸入進行適當的驗證和處理，以防止安全漏洞。
對於需要複雜查詢或前端主導資料需求的情況，也可以考慮使用 GraphQL，它提供單一端點、靈活查詢以及更細粒度的資料控制，但需注意權限與效能管理。

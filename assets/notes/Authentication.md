## 為什麼 Auth 必須獨立

- 單一責任：認證與授權邏輯獨立於業務服務，避免耦合
- 可擴展性：未來支援多種身份來源（OAuth、SSO）時更容易整合
- 安全隔離：降低攻擊面，敏感邏輯集中管理
- 資料庫最小化：只存必要的用戶資料，減少資料庫負擔

## JWT 架構

- Access Token（數分鐘至數十分鐘）：用於 API 請求的即時授權
- Refresh Token（數天至數週）：用於重新取得新的 Access Token
- 為什麼 Token 存後端 Cache 而不是資料庫：存取頻率高

## Refresh Token 為什麼放 HttpOnly Cookie

- HttpOnly：避免被 JavaScript 竊取（防止 XSS 攻擊）
- Secure：僅在 HTTPS 傳輸
- SameSite：降低 CSRF 風險
- 伺服器端控制：可集中管理 Refresh Token 的失效與撤銷

## Token 生命週期設計

- 每次使用 Refresh Token 重新簽發新 Access Token 與 Refresh Token
- 舊的 Refresh Token 立即失效，防止重放攻擊
- 如果 Refresh Token 過期(表示用戶久未登入)，使用者需重新登入以獲得新 Token

## 未來支援 OAuth / SSO

- Auth 2.0：支援第三方登入（Google、GitHub）
- OpenID Connect：標準化身份驗證流程
- SSO：企業環境下整合 AD / LDAP

## 結論
兩個 Token 設計方便管理安全性與使用者體驗，使用者每次進入網站不必頻繁輸入帳號及密碼，
同時能在多種設備上保持登入狀態。唯一的缺點是需要額外的 Cache 來存，但這是為了安全性與性能的必要權衡。
Access Token 可以解析出唯一識別用戶的資訊（如 user_id），後端不需查資料庫即可驗證授權，提升效能
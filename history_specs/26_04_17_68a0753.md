# Feature Spec: 淺色／深色主題切換

> 此文件由 Git Worktree Design 自動產生，供 AI Agent 作為開發指引。

## 分支資訊

| 項目 | 值 |
|------|-----|
| 分支名稱 | `feature/theme-toggle` |
| 基於分支 | `master` |
| Worktree 路徑 | `/Users/linweicheng/Documents/Code/Claud_Courses/Git_worktree/git-worktree-demo-theme` |
| 建立時間 | `2026-04-15` |

## 目標

建立全站淺色／深色主題系統，讓使用者可透過 Navbar 的切換按鈕在兩種模式間切換，並保存使用者偏好。

## 實作範圍

- [x] 在 `src/index.css` 以 CSS Custom Properties 定義完整的 light / dark token（背景色、文字色、卡片色、邊框色、accent 色）
- [x] 在 `src/index.css` 新增 `[data-theme="light"]` 與 `[data-theme="dark"]` 的 selector 覆蓋規則
- [x] 支援 `prefers-color-scheme` 作為初始預設值（無 localStorage 時）
- [x] 以 `localStorage` 保存使用者手動選擇的主題
- [x] 在 `src/components/Navbar.jsx` 加入主題切換 icon button（太陽／月亮圖示，使用 SVG inline）
- [x] 切換時透過 `document.documentElement.setAttribute('data-theme', ...)` 動態套用
- [x] 確認所有元件（Hero、SocialProof、Features、UseCases、Pricing、CallToAction、Footer）的樣式皆使用 CSS token，在兩種主題下顯示正常

## 驗收標準

- 點擊切換按鈕，全站顏色立即更新，無閃爍
- 重整頁面後主題維持使用者上次選擇
- 初次進站（無 localStorage）時，跟隨系統 `prefers-color-scheme`
- 手機版切換按鈕可正常操作
- 淺色模式下文字對比度 ≥ 4.5:1

## 技術約束

- 不引入任何新的 npm 依賴
- 主題切換邏輯用原生 JS，不使用 React Context 或狀態管理
- icon 使用 inline SVG，不用 emoji
- 所有顏色值改用 CSS token，禁止 hardcode hex

## 跨分支備註

- 建議**優先合併**此分支，讓 `feature/faq-section` 與 `feature/cookie-consent` 的新元件能直接繼承 token
- faq 與 cookie 分支的新元件開發時，應預先使用現有的 CSS token 變數命名

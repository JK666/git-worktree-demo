 # Feature Spec: 常見 QA 問答區塊

> 此文件由 Git Worktree Design 自動產生，供 AI Agent 作為開發指引。

## 分支資訊

| 項目 | 值 |
|------|-----|
| 分支名稱 | `feature/faq-section` |
| 基於分支 | `master` |
| Worktree 路徑 | `/Users/linweicheng/Documents/Code/Claud_Courses/Git_worktree/git-worktree-demo-faq` |
| 建立時間 | `2026-04-15` |

## 目標

新增常見問答手風琴區塊，插入於Pricing 與 CallToAction 之間，提供訪客快速查閱常見疑問。

## 實作範圍

- [x] 新增 `src/data/faq.js`，包含 6～8 組問答資料（問題 + 詳細答案）
- [x] 新增 `src/components/FAQ.jsx`，實作 accordion 展開／收合互動
  - 每次只展開一個項目（點擊已展開項目時收合）
  - 展開／收合使用 CSS max-height 過渡動畫
  - 使用語意化 HTML（`<details>` 或 ARIA `aria-expanded`）
- [x] 更新 `src/App.jsx`，在 `<Pricing />` 與 `<CallToAction />` 之間插入 `<FAQ />`
- [x] 樣式使用現有 CSS Custom Properties token，支援深色主題（變數優先）

## 驗收標準

- 點擊問題展開答案，再點收合，動畫流暢（200～300ms）
- 同時只有一個項目展開
- 手機版（375px）排版正常，無水平捲軸
- 深色主題下背景、文字顏色正確顯示

## 技術約束

- 不引入任何新的 npm 依賴
- 不使用原生 `<details>` 標籤（需自製以支援動畫控制）
- 樣式使用 CSS Custom Properties token，不 hardcode 顏色

## 跨分支備註

- 若 `feature/theme-toggle` 已先合併，可直接使用其定義的 light/dark token
- 若尚未合併，使用現有的 `--bg-*`、`--text-*` 等 token 命名規範即可，合併後自然相容

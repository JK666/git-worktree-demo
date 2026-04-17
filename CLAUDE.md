# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # 安裝依賴
pnpm dev          # 啟動開發伺服器（http://localhost:3000，自動開啟瀏覽器）
pnpm build        # 打包正式版本
pnpm preview      # 預覽打包後的正式版本
```

## Architecture

**SalesPilot CRM** 是以 React 18 + Vite 6 建置的行銷官網，採用純 Vanilla CSS（CSS Custom Properties）設計系統，無 CSS-in-JS 或 UI 框架。

### Config-Driven 架構

所有頁面文案與資料集中在 `src/data/` 的 JS 模組中。修改頁面內容只需編輯對應的 data 檔，**不需觸碰任何元件程式碼**：

| 資料檔 | 控制內容 |
|--------|---------|
| `navigation.js` | 品牌名稱、導覽連結 |
| `hero.js` | 主標、副標、統計數據、CTA 按鈕 |
| `socialProof.js` | 客戶 logo、見證引言 |
| `features.js` | 6 項功能的 icon / 標題 / 描述 |
| `useCases.js` | 3 種角色場景 & 亮點清單 |
| `pricing.js` | 3 組方案的價格 / 功能列表 |
| `footer.js` | 頁尾欄位、社群連結、版權 |

### 頁面組件順序

`App.jsx` 依序渲染：`Navbar → Hero → SocialProof → Features → UseCases → Pricing → CallToAction → Footer`

## Skills / Slash Commands（`.claude/commands/`）

每個 skill 支援兩種觸發方式：**AI 自動判斷觸發**（依下列條件）或**手動輸入 slash command**。

### 命名規則：`<動詞>-<對象>`，單一 worktree 不加後綴，全部加 `-all`

| 指令 | 範圍 | 手動觸發 | AI 自動觸發條件 |
|------|------|----------|----------------|
| `git-worktree-design` | ALL | `/git-worktree-design` | 說「worktree」、「平行開發」、「多分支」，或需求適合拆成多個 feature branch |
| `spec-exec` | Single | `/spec-exec` | 進入含 `git-worktree-spec.md` 的 worktree 後說「開始開發」、「執行 spec」、「按 spec 做」 |
| `spec-exec-all` | ALL | `/spec-exec-all` | 說「執行所有 spec」、「全部 spec 一起跑」、「平行執行所有 worktree」 |
| `git-smart-commit` | Single | `/git-smart-commit` | 說「幫我 commit」、「smart commit」（只 commit，不 push） |
| `commit-push` | Single | `/commit-push` | 說「commit 並 push」、「提交並推送」（單一 worktree，commit + push） |
| `commit-push-all` | ALL | `/commit-push-all` | 說「全部 commit push」、「提交所有分支」 |
| `git-pr-description` | Single | `/git-pr-description` | 說「寫 PR」、「PR 描述」、「建立 PR」（單一分支） |
| `pr-create-all` | ALL | `/pr-create-all` | 說「產生所有 PR」、「建立所有 PR」 |

### 混搭範例

```
# 全部一起跑
spec-exec-all → commit-push-all → pr-create-all

# 混合：全部跑 spec，各自手動確認後再統一推
spec-exec-all → commit-push → commit-push → ... → pr-create-all

# 單一 worktree 完整流程
spec-exec → commit-push → pr-create
```

### Worktree Workflow

當使用 git worktree 平行開發時：
1. 主專案執行 `pnpm install`（pnpm symlink 共享依賴，worktree 不需重複安裝）
2. 執行 `/worktree-design` → 分析需求、建立 worktrees、寫入 `git-worktree-spec.md`
3. 執行 `/spec-exec` 或 `/spec-exec-all` → 依 spec 逐項實作並打勾追蹤進度
4. 執行 `/commit-push` 或 `/commit-push-all` → 自動拆分 commit 並推送
5. 執行 `/pr-create` 或 `/pr-create-all` → 建立 PR
6. Code Review → Merge PR → `git pull` 更新 master
7. 刪除已合併的 worktree 與分支

**目錄規則：** Worktree 放在 repo 同層（`../`），格式：`../<repo-name>-<feature-short-name>`

### Commit Message 格式

```
<type>(<scope>): <繁體中文描述>
```

scope 對照：元件名稱小寫（`hero`、`navbar`）、`data`、`style`、`project`

## 設計系統重點

- 深色主題，底色 `#0a0e1a`，accent 色為 Indigo / Cyan 漸層
- Glassmorphism Navbar：`backdrop-filter` 毛玻璃效果
- 全域 CSS 變數定義在 `src/index.css`
- 三段響應式斷點：桌面 → 平板 → 手機

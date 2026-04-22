# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # 安裝依賴
pnpm dev          # 啟動開發伺服器（http://localhost:3000，自動開啟瀏覽器）
pnpm build        # 打包正式版本
pnpm preview      # 預覽打包後的正式版本

git config pull.rebase false   # 避免 pull 時 rebase 造成衝突（每人 clone 後執行一次）
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

> ⚠️ **執行任何 git / worktree / commit / push / PR / cleanup 操作前，必須先查下方 skill 表，找到對應 skill 後觸發，不可直接用 Bash 自行實作。**

每個 skill 支援兩種觸發方式：**AI 自動判斷觸發**（依下列條件）或**手動輸入 slash command**。

### 命名規則：`git-<對象>-<動作>`，單一不加後綴，全部加 `-all`

| 指令 | 範圍 | 動作 | 說明 |
|------|------|------|------|
| `git-worktree-design` | ALL | 設計+建立 | 分析需求 → 建立 worktrees → 寫 spec |
| `git-spec-exec` | Single | 執行 spec | 執行當前 worktree 的 spec |
| `git-spec-exec-all` | ALL | 執行 spec | 平行執行所有 worktree spec |
| `git-commit-description` | Single | 只 commit | 智慧拆分 commit，不 push |
| `git-commit-description-all` | ALL | 只 commit | 平行智慧 commit 所有 worktree，不 push |
| `git-push` | Single | 只 push | 推送已 commit 的變更，不 commit |
| `git-push-all` | ALL | 只 push | 推送所有 worktree 已 commit 的變更 |
| `git-commit-push` | Single | commit + push | 智慧 commit 並推送（一次完成） |
| `git-commit-push-all` | ALL | commit + push | 平行 commit + push 所有 worktree |
| `git-pr-description` | Single | 產生描述 | 只產生 PR 描述文字供複製，不建立 PR |
| `git-pr-create` | Single | 建立 PR | 執行 gh pr create 建立單一 PR |
| `git-pr-create-all` | ALL | 建立 PR | 平行建立所有分支的 PR |
| `git-worktree-cleanup` | Single | 清理 | PR 合併後清理單一 worktree、本地與遠端分支 |
| `git-worktree-cleanup-all` | ALL | 清理 | 掃描並清理所有已合併的 worktree |

### 混搭範例

```
# 完整生命週期（含清理）
git-worktree-design → git-spec-exec-all → git-commit-push-all → git-pr-create-all → git-worktree-cleanup-all

# 全部自動化（不含清理）
git-worktree-design → git-spec-exec-all → git-commit-push-all → git-pr-create-all

# 分離 commit / push（各自確認後再推）
git-spec-exec-all → git-commit-description-all → git-push-all → git-pr-create-all

# 單一 worktree 完整流程
git-spec-exec → git-commit-push → git-pr-create

# 只想先看 PR 描述再決定要不要建立
git-pr-description → （確認後）git-pr-create
```

### Worktree Workflow

當使用 git worktree 平行開發時：
1. 主專案執行 `pnpm install`（pnpm symlink 共享依賴，worktree 不需重複安裝）
2. 執行 `/git-worktree-design` → 分析需求、建立 worktrees、寫入 `git-worktree-spec.md`
3. 執行 `/git-spec-exec` 或 `/git-spec-exec-all` → 依 spec 逐項實作並打勾追蹤進度
4. 執行 `/git-commit-push` 或 `/git-commit-push-all` → 自動拆分 commit 並推送
5. 執行 `/git-pr-create` 或 `/git-pr-create-all` → 建立 PR
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

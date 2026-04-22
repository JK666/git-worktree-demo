---
description: 分析需求並建議 git worktree 拆分方案，經使用者確認後執行建立。當使用者說「worktree」、「git worktree」、「多分支開發」、「平行開發」、「parallel branches」，或需求適合拆分成多個 feature branch 時觸發。
---

# Git Worktree Design — 智慧拆分平行開發

分析使用者需求，判斷是否適合以 `git worktree` 拆分成多個 feature branch 平行開發，提供建議方案並執行。

## 流程

### 1. 分析當前狀態

```bash
git branch --show-current # 查看目前分支
git worktree list         # 列出這個 repo 的所有 worktree
git remote -v             # 查看遠端倉庫狀態，-v 會同時顯示 fetch/push 用的 URL。
git status --short        # 查看當前工作區狀態，--short 以簡潔格式顯示變更狀態。
```

若有未提交的變更，提醒使用者先 commit 或 stash 再繼續。

### 2. 全局設計（拆分方案 + Feature Spec）

在建立任何 worktree 之前，先完成所有 feature 的全局設計。

**拆分原則：**

| 原則 | 說明 |
|------|------|
| **功能獨立性** | 每個 worktree 負責一個獨立功能 |
| **最小相依** | 盡量避免分支間互相依賴 |
| **合理粒度** | 不宜太細或太粗 |
| **命名語意** | 格式 `feature/<功能名>` |

**每份 Feature Spec 應包含：**

| 區塊 | 說明 |
|------|------|
| 目標 | 這個 feature branch 要達成什麼 |
| 實作範圍 | 具體的任務 checklist |
| 驗收標準 | 可測試的行為或 UI 狀態描述 |
| 技術約束 | 專案慣例、不可引入的依賴 |
| 跨分支備註 | 與其他 feature 的相依關係、合併順序 |

### 2c. 呈現完整方案給使用者確認

```
📋 Worktree 拆分方案（共 N 個分支）

| # | 分支名稱 | Worktree 目錄 | 負責功能 |
|---|----------|---------------|----------|
| 1 | feature/xxx | ../project-xxx | 功能說明 |

📝 Feature Spec 摘要：
### 1. feature/xxx
- 目標：...
- 驗收：...
- 相依：...

建議合併順序：1 → 2 → 3
確認執行？(Y/n)
```

### 3. 建立 Worktree

使用者確認後依序執行：

```bash
git worktree add -b <branch_name> <worktree_path> 
# 創建新分支並建立 worktree
# worktree_path 要自動創建的工作路徑，建議放在 repo 同層級的 ../ 目錄下，格式為 ../<repo-name>-<feature-short-name>
# 若分支已存在則改用：
# git worktree add <worktree_path> <existing_branch>
# 例如：
# git worktree add -b feature/login ../myrepo-login master
# 若分支已存在：
# git worktree add <worktree_path> <existing_branch>
```

**目錄命名規則：**
- 放在 repo 的**同層級**（`../`）
- 格式：`../<repo-name>-<feature-short-name>`

### 4. 依賴說明

本專案使用 **pnpm**，透過 symlink 共享 `node_modules`。

> 各 worktree **不需要**執行 `pnpm install`，只要主專案已安裝即可直接使用。

若偵測到其他套件管理器（`yarn.lock` / `package-lock.json`），則各 worktree 需各自安裝：
```bash
cd <worktree_path> && yarn install  # 或 npm install
```

### 5. 寫入 Feature Spec 檔案

將設計好的 Spec 寫入每個 worktree 根目錄的 `git-worktree-spec.md`：

```markdown
# Feature Spec: <功能名稱>

> 此文件由 Git Worktree Design 自動產生，供 AI Agent 作為開發指引。

## 分支資訊
| 項目 | 值 |
|------|-----|
| 分支名稱 | `feature/<name>` |
| 基於分支 | `<base_branch>` |
| Worktree 路徑 | `<absolute_path>` |
| 建立時間 | `<timestamp>` |

## 目標
## 實作範圍
- [ ] 具體任務 1
## 驗收標準
## 技術約束
## 跨分支備註
```

### 6. 確認結果

```bash
git worktree list
```

## 邊界情況

- **分支已存在**：改用 `git worktree add <path> <existing-branch>`
- **目錄已存在**：提示衝突並建議替代目錄名
- **遠端分支同步**：建議先 `git fetch`
- **開發完成清理**：`git worktree remove` + `git branch -d`

## 常用維護指令

```bash
git worktree list
git worktree remove <path>
git worktree remove --force <path>
git worktree prune
git branch -d <branch_name>
```

---
description: 掃描所有 git worktree，對每個有未提交變更的 feature 分支平行啟動 subagent 進行智慧 commit（只 commit，不 push）。當使用者說「全部 commit」、「所有分支 commit」、「git-commit-description-all」時觸發。只 commit 不 push，需要 push 請再執行 git-push-all。
---

# Git Commit Description All — 平行智慧 Commit 所有 Worktree

掃描所有 git worktree，對每個有未提交變更的 feature 分支平行啟動 subagent 進行智慧 commit。

> 只做 commit，不 push。全部完成後可執行 `/git-push-all` 推送。

## 步驟一：掃描 Worktree 狀態

執行 `git worktree list --porcelain`，取得所有 worktree。

對每個 worktree（跳過 master/main）執行：
```bash
git -C <path> status --short
```

- **有未提交變更**：加入待處理清單
- **無變更（clean）**：標記跳過
- **有衝突**：標記警告，跳過

## 步驟二：回報掃描結果並等待確認

```
待 commit（N 個）：
  • feature/theme-toggle   → 5 個檔案有變更
  • feature/i18n           → 8 個檔案有變更

跳過：
  • feature/faq-section    → 無未提交變更 ✅

確認執行？(Y/n)
```

## 步驟三：平行啟動 Subagent

使用者確認後，**在同一則訊息中**對每個待處理 worktree 平行啟動 subagent（`run_in_background: true`）。

每個 subagent 的 prompt：

```
你是一個負責 git commit 的 agent。

目標 Worktree 路徑：<絕對路徑>
目標分支：<branch-name>

【第一步：切換工作目錄】
立即使用 EnterWorktree 工具，傳入 path: "<絕對路徑>"。

【第二步：分析變更並分群 commit】
執行 git status --short 與 git diff --stat 了解變更內容。
依功能邏輯將變更分成多個 commit 群組，每個 commit message 格式：
<type>(<scope>): <繁體中文描述>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

【第三步：回傳結果】
- 分支名稱
- Commit 清單（hash + message）
```

## 步驟四：彙整結果

| 分支 | Commits | 備註 |
|------|---------|------|
| feature/theme-toggle | 3 commits | ✅ |
| feature/i18n | 4 commits | ✅ |

最後提示：
```
✅ 所有分支 commit 完成。
確認無誤後，執行 /git-push-all 推送所有分支。
```

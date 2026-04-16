---
description: 掃描所有 git worktree，對每個有未提交變更的 feature 分支平行啟動 subagent 進行 commit 與 push。當使用者說「全部 commit push」、「commit push all」、「提交所有分支」、「推送所有分支」時觸發。
---

# 平行 Commit + Push 所有 Worktree

掃描所有 git worktree，對每個有未提交變更的 feature 分支平行 commit 並 push。

> 全部 worktree 版本。單一 worktree 請使用 `/commit-push`
> 通常在 `/exec-all-specs` 驗收確認後執行

## 步驟一：掃描 Worktree 狀態

執行 `git worktree list --porcelain`，取得所有 worktree。

對每個 worktree（跳過 master/main）執行：
```bash
git -C <worktree-path> status --short
```

- **有未提交變更**：加入待處理清單
- **無變更（clean）**：標記跳過
- **有衝突**：標記警告，跳過

## 步驟二：回報掃描結果並等待確認

```
待 commit + push（N 個）：
  • feature/faq-section    → 3 個檔案有變更
  • feature/theme-toggle   → 4 個檔案有變更

跳過：
  • feature/cookie-consent → 無未提交變更 ✅

確認執行？(Y/n)
```

## 步驟三：平行啟動 Subagent

使用者確認後，**在同一則訊息中**對每個待處理 worktree 平行啟動 subagent（`run_in_background: true`）。

每個 subagent 的 prompt：

```
你是一個負責 git commit 與 push 的 agent。

目標 Worktree 路徑：<絕對路徑>
目標分支：<branch-name>

【第一步：切換工作目錄】
立即使用 EnterWorktree 工具，傳入 path: "<絕對路徑>"。

【第二步：分析變更並分群 commit】
執行 git status --short 與 git diff --stat 了解變更內容。
依功能邏輯將變更分成多個 commit 群組：
- 新元件 / 新功能 → feat(<scope>)
- 樣式變更 → style(<scope>)
- 資料層 → feat(data)
- 設定 / Spec → chore(<scope>) 或 docs(<scope>)

每個 commit message 格式：
<type>(<scope>): <繁體中文描述>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

【第三步：Push】
git push -u origin <branch-name>

【第四步：回傳結果】
- 分支名稱
- Commit 清單（hash + message）
- Push 狀態（✅ 成功 / ❌ 失敗 + 原因）
```

## 步驟四：彙整結果

| 分支 | Commits | Push | 備註 |
|------|---------|------|------|
| feature/faq-section | 2 commits | ✅ | |
| feature/theme-toggle | 3 commits | ✅ | |

最後提示：
```
✅ 所有分支已 push 完成。
確認無誤後，執行 /pr-all 產生所有 PR。
```

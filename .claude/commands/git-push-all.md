---
description: 掃描所有 git worktree，對每個有 commit 未推送的 feature 分支平行執行 push。當使用者說「全部 push」、「推送所有分支」、「git-push-all」時觸發。只做 push，不做 commit。
---

# Git Push All — 推送所有 Worktree

掃描所有 git worktree，對每個有 commit 尚未推送到遠端的 feature 分支平行執行 push。

> 只做 push，不做 commit。若需要 commit + push 請使用 `/git-commit-push-all`。

## 步驟一：掃描 Worktree 狀態

執行 `git worktree list --porcelain`，取得所有 worktree。

對每個 worktree（跳過 master/main）執行：
```bash
git -C <path> log @{u}..HEAD --oneline 2>/dev/null
git -C <path> status --short
```

- **有 unpushed commits**：加入待推送清單
- **有未 commit 變更**：標記警告，提示先 commit
- **已是最新**：標記跳過

## 步驟二：回報掃描結果並等待確認

```
待 push（N 個）：
  • feature/theme-toggle   → 2 commits unpushed
  • feature/i18n           → 3 commits unpushed

跳過：
  • feature/faq-section    → 已是最新 ✅

確認執行？(Y/n)
```

## 步驟三：平行 Push

使用者確認後，對每個待推送 worktree 執行：

```bash
git -C <path> push -u origin <branch>
```

## 步驟四：彙整結果

| 分支 | Push | 備註 |
|------|------|------|
| feature/theme-toggle | ✅ | |
| feature/i18n | ✅ | |

最後提示：
```
✅ 所有分支 push 完成。
可執行 /git-pr-create-all 建立所有 PR。
```

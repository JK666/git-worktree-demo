---
description: 將當前 worktree 的已 commit 變更推送到遠端，只做 push 不做 commit。當使用者說「只 push」、「推送」、「git-push」時觸發（單一 worktree）。需要先 commit 請用 git-commit-description；commit + push 一次完成請用 git-commit-push。
---

# Git Push — 推送當前 Worktree

將已 commit 的變更推送到遠端分支，不做任何 commit 操作。

## 步驟一：確認狀態

```bash
git status --short
git log --oneline @{u}..HEAD 2>/dev/null || git log --oneline -5
```

- 若有未 commit 的變更，提醒使用者先執行 `/git-commit-description` 再 push
- 若無 commit ahead of remote，告知使用者沒有需要推送的內容

## 步驟二：確認遠端設定

```bash
git remote -v
git branch --show-current
```

## 步驟三：執行 Push

```bash
# 若已有 upstream tracking
git push

# 若尚無 upstream（新分支）
git push -u origin <current-branch>
```

## 步驟四：確認結果

```bash
git log --oneline -5
```

回報 push 狀態，並提示：
```
✅ Push 完成。
可執行 /git-pr-create 建立此分支的 PR。
```

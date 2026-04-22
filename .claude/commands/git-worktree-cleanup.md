---
description: 清理單一已合併的 git worktree：確認 PR 已合併後，移除 worktree、刪除本地分支、刪除遠端分支（若存在）、更新 master。當使用者說「清理 worktree」、「刪除分支」、「cleanup」、「git-worktree-cleanup」，或 PR 合併後想清理單一 feature 分支時觸發。
---

# Git Worktree Cleanup — 清理單一已合併 Worktree

PR 合併後，清除對應的 worktree、本地分支與遠端分支，並更新 master。

## 步驟一：列出可清理的 Worktree

```bash
git worktree list --porcelain
```

跳過 master/main，列出所有 feature worktree：

```
可清理的分支：
  • feature/hero-count-up  →  ../git-worktree-demo-hero-count-up

請輸入要清理的分支名稱：
```

若使用者已在指令中指定分支名稱（如 `cleanup feature/xxx`），直接使用，不需再詢問。

## 步驟二：確認 PR 已合併

```bash
gh pr list --repo <owner>/<repo> --head <branch> --state merged
```

用 `git remote -v` 取得 repo 名稱（`origin` 的 URL）。

- **已合併**：繼續執行
- **未合併 / 找不到 PR**：顯示警告，詢問使用者是否強制清理：
  ```
  ⚠️  找不到 feature/xxx 已合併的 PR。
  仍要強制清理？(y/N)
  ```

## 步驟三：執行清理

依序執行（**必須在主 worktree 的 master 分支下執行**，不可在目標 worktree 內操作）：

```bash
# 1. 移除 worktree 目錄
git worktree remove <worktree-path>

# 2. 刪除本地分支
git branch -d <branch>
# 若 -d 失敗（未完全 merge 到本地 master），改用：
git branch -D <branch>

# 3. 嘗試刪除遠端分支（通常 GitHub PR merge 時已自動刪除，失敗不影響）
git push origin --delete <branch> 2>/dev/null || echo "遠端分支已不存在，略過"

# 4. 更新本地 master
git pull
```

## 步驟四：回報結果

```bash
git worktree list
git log --oneline -3
```

```
✅ 清理完成！

  移除 Worktree：../git-worktree-demo-hero-count-up
  刪除本地分支：feature/hero-count-up
  遠端分支：已自動刪除（PR merge 時）
  master 已更新至最新 commit

後續可執行 /git-worktree-design 開始下一個 feature。
```

## 邊界情況

- **目前在目標 worktree 內**：提醒使用者先切回主 repo 再執行本指令
- **worktree 有未提交變更**：警告使用者，詢問是否 `--force` 移除
- **找不到 worktree 路徑**：`git worktree prune` 清理殘留紀錄後再嘗試

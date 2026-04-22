---
description: 掃描所有 git worktree，找出已合併的 feature 分支，確認後平行清理全部（移除 worktree、刪除本地與遠端分支、更新 master）。當使用者說「清理所有 worktree」、「全部清理」、「cleanup all」、「git-worktree-cleanup-all」，或多個 PR 合併後想一次清乾淨時觸發。
---

# Git Worktree Cleanup All — 清理所有已合併 Worktree

掃描所有 feature worktree，找出 PR 已合併的分支，一次清理完畢。

> 單一分支請使用 `/git-worktree-cleanup`

## 步驟一：掃描所有 Worktree 的合併狀態

執行 `git worktree list --porcelain`，跳過 master/main，對每個 feature worktree 檢查：

```bash
gh pr list --repo <owner>/<repo> --head <branch> --state merged
```

分類結果：
- **已合併**：加入待清理清單
- **未合併 / 開放中**：標記保留，跳過
- **無 PR 記錄**：標記未知，跳過（不強制清理）

## 步驟二：回報掃描結果並等待確認

```
待清理（N 個）：
  • feature/hero-count-up    → PR #9 已合併 ✅
  • feature/dark-mode        → PR #10 已合併 ✅

跳過：
  • feature/new-feature      → PR 尚未合併（open）
  • feature/wip              → 無 PR 記錄

確認清理以上 N 個分支？(Y/n)
```

## 步驟三：依序清理（單執行緒，避免 git 狀態競爭）

使用者確認後，依序對每個待清理分支執行：

```bash
# 1. 移除 worktree
git worktree remove <path>          # 有變更時加 --force

# 2. 刪除本地分支
git branch -d <branch>              # 失敗時改用 -D

# 3. 嘗試刪除遠端分支（已自動刪除不影響）
git push origin --delete <branch> 2>/dev/null || true
```

全部清理完成後，執行一次 `git pull --no-rebase` 更新 master。

## 步驟四：彙整結果

| 分支 | Worktree 移除 | 本地分支 | 遠端分支 | 備註 |
|------|-------------|--------|--------|------|
| feature/hero-count-up | ✅ | ✅ | 已自動刪除 | |
| feature/dark-mode | ✅ | ✅ | ✅ 已刪除 | |

```bash
git worktree list   # 確認只剩 master
git log --oneline -3
```

```
✅ 清理完成！master 已更新至最新 commit。
後續可執行 /git-worktree-design 開始下一個 feature。
```

## 邊界情況

- **所有 worktree 均未合併**：告知無需清理，結束
- **worktree 有未提交變更**：逐一警告，預設跳過，詢問是否 `--force` 移除
- **gh 指令不可用**：提示安裝 GitHub CLI，或手動確認後繼續
- **git pull 衝突**：提示使用者手動處理，已完成的清理不回滾

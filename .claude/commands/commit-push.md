---
description: 將當前 worktree 的變更依功能邏輯拆分 commit，並 push 到遠端分支。當使用者說「commit 並 push」、「提交並推送」、「commit push」、「commit-push」時觸發（單一 worktree）。
---

# Commit + Push 當前 Worktree

將當前 worktree 所有變更依功能邏輯分群 commit，然後 push 到遠端。

> 單一 worktree 版本。全部 worktree 請使用 `/commit-push-all`

## 步驟一：確認狀態

```bash
git status --short
git diff --stat
```

- 若無任何變更，告知使用者後結束
- 若有衝突或 merge 狀態，提醒先解決後再執行

## 步驟二：分析並規劃 Commit 分群

根據以下優先級分群：

| 優先級 | 維度 | 範例 |
|--------|------|------|
| 1 | 專案設定 | `package.json`, `.gitignore`, `CLAUDE.md` |
| 2 | 資料層 | `src/data/*.js` |
| 3 | 元件（按元件名稱） | `src/components/Foo.jsx` + 對應樣式 |
| 4 | 頁面 / App 入口 | `src/App.jsx` |
| 5 | 全域樣式 | `src/index.css` |
| 6 | 文件 / Spec | `*.md`, `git-worktree-spec.md` |
| 7 | Claude 設定 | `.claude/**` |

## 步驟三：展示 Commit 計畫並等待確認

```
📋 Commit 計畫（共 N 個 commit）

1. feat(cookie-consent): 新增 Cookie 同意彈窗元件
   → CookieConsent.jsx, App.jsx

2. style(cookie-consent): 新增 Cookie 彈窗樣式
   → index.css

確認執行？(Y/n)
```

## 步驟四：逐批執行 Commit

使用者確認後，依序執行：

```bash
git add <files>
git commit -m "<type>(<scope>): <繁體中文描述>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

## 步驟五：Push

```bash
git push -u origin <current-branch>
```

## 步驟六：確認結果

```bash
git log --oneline -5
```

回報 commit 清單與 push 狀態，並提示：
```
✅ Push 完成。
可執行 /git-pr-description 產生此分支的 PR。
```

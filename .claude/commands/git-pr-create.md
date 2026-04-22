---
description: 分析當前分支與 master 的差異，產生 PR 描述並執行 gh pr create 建立 PR 到 GitHub（單一分支）。當使用者說「建立 PR」、「create PR」、「git-pr-create」時觸發。會真正執行 gh pr create，與只產生描述文字的 git-pr-description 不同。
---

# Git PR Create — 建立單一 PR

分析當前分支的變更，產生結構化 PR 描述，並執行 `gh pr create` 建立到 GitHub。

> 與 `/git-pr-description` 的差異：本 skill 會真正執行 `gh pr create` 建立 PR；`git-pr-description` 只產生描述文字供複製。

## 步驟一：確認狀態

```bash
git branch --show-current
git log master..HEAD --oneline
git diff --stat master..HEAD
```

- 若無 commits ahead of master，告知使用者後結束
- 若有未 push 的 commit，提示先執行 `/git-push`

## 步驟二：確認遠端 Repo

```bash
gh repo set-default JK666/git-worktree-demo
gh pr list --head <current-branch>
```

若已有 PR，告知使用者並顯示 PR URL，不重複建立。

## 步驟三：分析變更並產生 PR 描述

```bash
git log master..HEAD --oneline
git log --format="%h %s%n%b" master..HEAD
git diff master..HEAD --stat
```

**PR Title 格式：** `feat(<scope>): <繁體中文簡述，50 字以內>`

**PR Description 模板：**

```markdown
## 🎯 為什麼要這樣做

（根據 git-worktree-spec.md 的「目標」區塊填寫背景與動機）

## ⚠️ 修改的內容

規則（嚴格遵守）：
- 禁止任何 Markdown 連結格式：[文字](...)
- 禁止 URI / scheme（file://、cci: 等）
- 禁止出現任何檔案路徑，一律改用純功能描述

### [功能名稱]
- **修改方向**：簡述目的
- **內容**：
  - 具體修改點（純功能描述）

## 🧪 測試步驟

### 測試案例 1：[模組名稱]
1. 步驟一
2. 步驟二
3. **預期結果**：描述預期行為
```

## 步驟四：建立 PR

```bash
gh pr create \
  --repo JK666/git-worktree-demo \
  --base master \
  --title "<title>" \
  --body "<description>"
```

## 步驟五：確認結果

回報 PR URL，並提示使用者前往 GitHub 進行 Code Review。

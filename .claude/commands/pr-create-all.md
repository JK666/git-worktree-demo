---
description: 掃描所有已 push 的 feature 分支，平行啟動 subagent 依 PR 模板產生 Pull Request 並建立到 GitHub。當使用者說「產生所有 PR」、「建立所有 PR」、「pr all」、「pr-all」、「pr-create-all」時觸發。
---

# 平行產生所有 Worktree PR

掃描所有已 push 的 feature 分支，平行啟動 subagent 依 PR 模板撰寫並建立 PR。

> 全部 worktree 版本。單一 worktree 請使用 `/git-pr-description`
> 通常在 `/commit-push-all` 完成確認後執行

## 步驟一：掃描可建立 PR 的分支

執行 `git worktree list --porcelain`，取得所有 worktree。

對每個 worktree（跳過 master/main）：
```bash
git -C <path> log master..HEAD --oneline
git -C <path> ls-remote --heads origin <branch>
```

- **已 push 且有 commits ahead of master**：加入待建立清單
- **尚未 push**：標記跳過，提示先執行 `/commit-push-all`
- **已有 PR**：用 `gh pr list --head <branch>` 確認，跳過

## 步驟二：回報掃描結果並等待確認

```
待建立 PR（N 個）：
  • feature/faq-section    → 2 commits ahead of master
  • feature/theme-toggle   → 3 commits ahead of master

跳過：
  • feature/cookie-consent → 已有 PR #12 ✅

確認建立 PR？(Y/n)
```

## 步驟三：平行啟動 PR Subagent

使用者確認後，**在同一則訊息中**對每個待建立分支平行啟動 subagent（`run_in_background: true`）。

每個 PR subagent 的 prompt：

```
你是一個負責撰寫並建立 Pull Request 的 agent。

目標 Worktree 路徑：<絕對路徑>
目標分支：<branch-name>
Base 分支：master

【第一步：切換工作目錄】
立即使用 EnterWorktree 工具，傳入 path: "<絕對路徑>"。

【第二步：分析變更】
執行以下指令了解完整變更：
- git log master..HEAD --oneline
- git diff master...HEAD --stat

【第三步：撰寫 PR Title 與 Description】

PR Title 格式：feat(<scope>): <繁體中文簡述，50 字以內>

PR Description 依照以下模板撰寫：

---
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

每個修改模組至少一個測試案例：

### 測試案例 1：[模組名稱]
1. 步驟一
2. 步驟二
3. **預期結果**：描述預期行為
---

【第四步：建立 PR】
先執行 `gh repo set-default JK666/git-worktree-demo` 確保 PR 開在正確的 repo，再執行：
gh pr create --repo JK666/git-worktree-demo --base master --title "<title>" --body "<description>"

【第五步：回傳結果】
- 分支名稱
- PR URL
- PR Title
```

## 步驟四：彙整最終結果

| 分支 | PR Title | PR URL | 狀態 |
|------|----------|--------|------|
| feature/faq-section | feat(faq): 新增常見問答區塊 | https://... | ✅ |
| feature/theme-toggle | feat(theme): 新增亮色/深色主題切換 | https://... | ✅ |

所有 PR 建立完成，可前往 GitHub 進行 Code Review。

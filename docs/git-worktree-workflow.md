# Git Worktree 平行開發工作流程教學

本文件說明如何在 **SalesPilot CRM** 專案中使用 git worktree + Claude Code skill 進行平行多分支開發。

---

## 概念說明

**傳統流程的問題：** 一次只能在一個 branch 工作，多個 feature 只能排隊。

**本流程的優勢：** 每個 feature 建立獨立 worktree（獨立資料夾），Claude subagent 平行執行，互不干擾。

```
repo/
├── git-worktree-demo/          ← master（主線）
├── git-worktree-demo-faq/      ← feature/faq-section
├── git-worktree-demo-cookie/   ← feature/cookie-consent
└── git-worktree-demo-theme/    ← feature/theme-toggle
```

---

## Skill 速查表

> 命名規則：`git-<對象>-<動作>`，單一不加後綴，全部加 `-all`

| 指令 | 範圍 | 動作 | 說明 |
|------|------|------|------|
| `/git-worktree-design` | ALL | 設計+建立 | 分析需求 → 建立 worktrees → 寫 spec |
| `/git-spec-exec` | Single | 執行 spec | 執行**當前** worktree 的 spec |
| `/git-spec-exec-all` | ALL | 執行 spec | 平行執行**所有** worktree 的 spec |
| `/git-commit-description` | Single | 只 commit | 智慧拆分 commit，不 push |
| `/git-commit-description-all` | ALL | 只 commit | 平行智慧 commit 所有 worktree，不 push |
| `/git-push` | Single | 只 push | 推送已 commit 的變更 |
| `/git-push-all` | ALL | 只 push | 推送所有 worktree 已 commit 的變更 |
| `/git-commit-push` | Single | commit + push | 智慧 commit 並推送（一次完成） |
| `/git-commit-push-all` | ALL | commit + push | 平行 commit + push 所有 worktree |
| `/git-pr-description` | Single | 產生描述 | 只產生 PR 描述文字供複製，不建立 PR |
| `/git-pr-create` | Single | 建立 PR | 執行 gh pr create 建立單一 PR |
| `/git-pr-create-all` | ALL | 建立 PR | 平行建立所有分支的 PR |

---

## 標準完整流程

### 步驟 1：設定主專案

Clone repo 後，在主專案安裝依賴與設定環境：

```bash
cd git-worktree-demo
pnpm install        # 安裝依賴（只需在主專案執行一次）
cp .env.example .env  # 若有環境變數，複製並填寫
```

> **pnpm 注意事項：** pnpm 透過 symlink 共享 `node_modules`，各 worktree 會直接指向主專案的依賴，**不需在每個 worktree 重複安裝**。

### 步驟 2：設計並建立 Worktree

告訴 Claude 你有哪些需求，讓它分析後建立 worktree 與 spec：

```
/git-worktree-design
```

Claude 會：
- 分析需求，建議拆分成幾個 worktree
- 執行 `git worktree add` 建立各資料夾
- 在每個 worktree 寫入 `git-worktree-spec.md`（任務清單）

### 步驟 3：執行 Spec（實作）

**全部一起跑（推薦）：**
```
/git-spec-exec-all
```

**只跑某一個：** 切換到該 worktree 資料夾後：
```
/git-spec-exec
```

Claude 會依 spec 的 checklist 逐項實作，完成後回報驗收結果。

### 步驟 4：確認結果

人工確認各 worktree 的實作結果無誤後，繼續下一步。

### 步驟 5：Commit + Push

**全部一起（commit + push）：**
```
/git-commit-push-all
```

**只做某一個：** 切換到該 worktree 後：
```
/git-commit-push
```

**或分開執行：**
```
/git-commit-description-all   # 先全部 commit
/git-push-all                 # 再全部 push
```

Claude 會依功能邏輯自動拆分 commit，並 push 到遠端分支。

> commit 執行後，post-commit hook 會自動將 `git-worktree-spec.md` 歸檔到 `history_specs/`。

### 步驟 6：建立 PR

**全部建立：**
```
/git-pr-create-all
```

**只建立某一個：**
```
/git-pr-create
```

**只想先看描述再決定：**
```
/git-pr-description   # 產生文字，確認後再執行 /git-pr-create
```

### 步驟 7：Code Review → Merge

前往 GitHub 進行 Code Review，確認後 Merge PR。

### 步驟 8：更新 master 並清理

```bash
# 切回主 repo
cd ../git-worktree-demo

# 拉取最新 master
git pull --ff-only

# 刪除已合併的 worktree
git worktree remove ../git-worktree-demo-faq
git worktree remove ../git-worktree-demo-cookie

# 刪除 local branch（已合併可直接刪）
git branch -d feature/faq-section
git branch -d feature/cookie-consent
```

---

## 混搭範例

### 場景 A：全部自動化

```
/git-worktree-design → /git-spec-exec-all → /git-commit-push-all → /git-pr-create-all
```

### 場景 B：分離 commit / push（各自確認後再推）

```
/git-spec-exec-all
/git-commit-description-all   # 先全部 commit，逐一確認
/git-push-all                 # 確認無誤後統一 push
/git-pr-create-all
```

### 場景 C：各自手動確認 spec，之後統一推

```
/git-spec-exec（faq worktree）
/git-spec-exec（cookie worktree）
... 逐一確認 ...
/git-commit-push-all
/git-pr-create-all
```

### 場景 D：某個 feature 先完成，不等其他

```
/git-spec-exec（faq worktree）
/git-commit-push（faq worktree）
/git-pr-create（faq worktree）
... 其他繼續跑 spec ...
```

---

## Spec 檔格式說明

每個 worktree 的 `git-worktree-spec.md` 包含以下區塊：

| 區塊 | 說明 |
|------|------|
| **目標** | 這個 feature 要達成什麼 |
| **實作範圍** | 具體 checklist，`- [ ]` 未完成，`- [x]` 已完成 |
| **驗收標準** | 完成後需通過的條件 |
| **技術約束** | 開發限制（如：不引入新依賴、遵守 CSS 變數規範） |
| **跨分支備註** | 是否相依其他分支 |

Spec 完成後會自動歸檔到 `history_specs/<日期>_<hash>.md`。

---

## GitHub PR 機制設定

### 概念：PR 的完整生命週期

```
local branch → git push → GitHub branch → 開 PR → Review → Merge → 刪除 branch
```

### 一、GitHub Repo 設定（Settings）

**1. Branch Protection Rules（保護 master 不能直接 push）**

前往：`Settings → Branches → Add branch ruleset`

| 設定項目 | 建議值 | 說明 |
|---------|--------|------|
| Branch name pattern | `master` | 套用到 master 分支 |
| Require a pull request before merging | ✅ 開啟 | 所有變更必須走 PR |
| Required approvals | 1（團隊用）/ 0（個人用） | PR 需要幾人 review |
| Require status checks to pass | 視 CI 而定 | 若有 CI 需全過才能 merge |
| Do not allow bypassing | ✅ 開啟（團隊建議） | 即使 admin 也要走 PR |

**2. Auto-delete head branches（Merge 後自動刪除遠端分支）**

前往：`Settings → General → Pull Requests`

勾選 **Automatically delete head branches** — Merge 完遠端 feature branch 自動刪除，不需手動清。

**3. Merge 策略選擇**

同一位置可設定允許哪些 Merge 方式：

| 方式 | 說明 | 適用情境 |
|------|------|---------|
| **Merge commit** | 保留完整歷史，產生一個 merge commit | 需要完整追蹤時 |
| **Squash and merge** | 把所有 commit 壓成一個再 merge | feature branch commit 很碎時 |
| **Rebase and merge** | 把 commit 接在 master 後面，無 merge commit | 喜歡線性歷史時 |

> 本專案 skill 產出的 commit 已依功能邏輯拆分，建議使用 **Merge commit** 保留完整記錄。

---

### 二、PR 流程相關 git 指令

#### 推送分支（開 PR 前）

```bash
# 推送並設定 upstream tracking
git push -u origin feature/faq-section

# 之後同一分支再推，只需
git push
```

#### 查看遠端分支狀態

```bash
# 列出所有遠端分支
git branch -r

# 確認遠端是否有某分支
git ls-remote --heads origin feature/faq-section

# 取得遠端最新狀態（不合併）
git fetch origin
```

#### 開 PR（用 GitHub CLI）

```bash
# 建立 PR（base 為 master）
gh pr create --base master --title "feat(faq): 新增 FAQ 區塊" --body "..."

# 查看現有 PR 列表
gh pr list

# 查看某個 PR 狀態
gh pr view 12

# 在 terminal 開啟 PR 頁面
gh pr view 12 --web
```

#### Merge 後清理

```bash
# 更新本地 master（fast-forward）
git pull --ff-only

# 刪除本地 feature branch（已合併）
git branch -d feature/faq-section

# 若遠端已刪但本地 remote tracking 還在，清理它
git remote prune origin

# 刪除 worktree
git worktree remove ../git-worktree-demo-faq

# 一次查看所有 worktree 狀態
git worktree list
```

#### 緊急狀況

```bash
# 查看某 PR 的 commits（在 feature branch 上）
git log master..HEAD --oneline

# 比較 feature branch 與 master 的差異
git diff master...HEAD

# 強制刪除尚未合併的 local branch（謹慎使用）
git branch -D feature/abandon-this
```

---

## 常見問題

**Q：worktree 要放在哪裡？**  
A：放在 repo 同層目錄，格式 `../<repo-name>-<feature-short-name>`。

**Q：git pull 出現 divergent branches 錯誤？**  
A：執行 `git pull --ff-only`，若無法 fast-forward 再用 `git pull --rebase`。

**Q：某個 spec 只完成一半，能繼續跑嗎？**  
A：可以。`/git-spec-exec` 會讀取 spec 中未打勾的項目繼續執行。

**Q：PR merge 後 local branch 和 worktree 怎麼清？**  
A：參考步驟 8，`git worktree remove` + `git branch -d`。

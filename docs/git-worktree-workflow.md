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

| 指令 | 範圍 | 說明 |
|------|------|------|
| `/worktree-design` | ALL | 分析需求 → 建立所有 worktree → 寫 spec |
| `/spec-exec` | Single | 執行**當前** worktree 的 spec |
| `/spec-exec-all` | ALL | 平行執行**所有** worktree 的 spec |
| `/commit-push` | Single | **當前** worktree commit + push |
| `/commit-push-all` | ALL | 平行 commit + push **所有** worktree |
| `/pr-create` | Single | 建立**當前**分支的 PR |
| `/pr-create-all` | ALL | 平行建立**所有**分支的 PR |

> 命名規則：`<動詞>-<對象>`，單一 worktree 不加後綴，全部加 `-all`

---

## 標準完整流程

### 步驟 1：設計並建立 Worktree

告訴 Claude 你有哪些需求，讓它分析後建立 worktree 與 spec：

```
/worktree-design
```

Claude 會：
- 分析需求，建議拆分成幾個 worktree
- 執行 `git worktree add` 建立各資料夾
- 在每個 worktree 寫入 `git-worktree-spec.md`（任務清單）

### 步驟 2：安裝依賴

每個新建的 worktree 資料夾都需要安裝依賴：

```bash
cd ../git-worktree-demo-faq
pnpm install
```

### 步驟 3：執行 Spec（實作）

**全部一起跑（推薦）：**
```
/spec-exec-all
```

**只跑某一個：** 切換到該 worktree 資料夾後：
```
/spec-exec
```

Claude 會依 spec 的 checklist 逐項實作，完成後回報驗收結果。

### 步驟 4：確認結果

人工確認各 worktree 的實作結果無誤後，繼續下一步。

### 步驟 5：Commit + Push

**全部一起推：**
```
/commit-push-all
```

**只推某一個：** 切換到該 worktree 後：
```
/commit-push
```

Claude 會依功能邏輯自動拆分 commit，並 push 到遠端分支。

> commit-push 執行後，post-commit hook 會自動將 `git-worktree-spec.md` 歸檔到 `history_specs/`。

### 步驟 6：建立 PR

**全部建立：**
```
/pr-create-all
```

**只建立某一個：**
```
/pr-create
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
/worktree-design → /spec-exec-all → /commit-push-all → /pr-create-all
```

### 場景 B：各自手動確認 spec，之後統一推

```
/spec-exec（faq worktree）
/spec-exec（cookie worktree）
... 逐一確認 ...
/commit-push-all
/pr-create-all
```

### 場景 C：某個 feature 先完成，不等其他

```
/spec-exec（faq worktree）
/commit-push（faq worktree）
/pr-create（faq worktree）
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

## 常見問題

**Q：worktree 要放在哪裡？**  
A：放在 repo 同層目錄，格式 `../<repo-name>-<feature-short-name>`。

**Q：git pull 出現 divergent branches 錯誤？**  
A：執行 `git pull --ff-only`，若無法 fast-forward 再用 `git pull --rebase`。

**Q：某個 spec 只完成一半，能繼續跑嗎？**  
A：可以。`/spec-exec` 會讀取 spec 中未打勾的項目繼續執行。

**Q：PR merge 後 local branch 和 worktree 怎麼清？**  
A：參考步驟 8，`git worktree remove` + `git branch -d`。

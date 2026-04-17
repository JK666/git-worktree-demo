---
description: 掃描所有 git worktree，對每個有未完成 spec 的 worktree 平行啟動 subagent 執行並驗收，完成後回報結果等待人工確認。當使用者說「執行所有 spec」、「全部 spec 一起跑」、「exec all specs」、「平行執行所有 worktree」、「spec-exec-all」時觸發。
---

# 平行執行所有 Worktree Spec

掃描所有 git worktree，對每個有未完成 spec 的 worktree 啟動獨立 subagent 平行執行與驗收，完成後彙整結果供人工確認。

> 後續流程：確認無誤後執行 `/commit-push-all`，再執行 `/pr-all`

## 步驟一：掃描所有 Worktree

執行 `git worktree list --porcelain`，取得所有 worktree 的路徑與分支名稱。

對每個 worktree 進行以下判斷：
- 跳過 `master` / `main` 分支（主線不執行 spec）
- 依序檢查 spec 來源：
  1. `<worktree-path>/git-worktree-spec.md` 是否存在（尚未歸檔）
  2. 若不存在，檢查 `<worktree-path>/history_specs/` 是否有檔案（已歸檔）→ 取最新一筆（檔名排序最後）
- 若找到 spec，讀取全文，計算 `- [ ]` 數量
- **未完成數 > 0**：加入待執行清單（標註來源路徑）
- **未完成數 = 0**：標記為「已完成，跳過」
- **無 spec 檔案且無歸檔**：標記為「無 spec，跳過」

## 步驟二：回報掃描結果

以清單呈現給使用者：

```
待執行（N 個）：
  • feature/faq-section     → 4 項未完成
  • feature/theme-toggle    → 7 項未完成

跳過：
  • feature/cookie-consent  → 已全部完成 ✅
  • master                  → 主線略過
```

## 步驟三：平行啟動 Subagent

**在同一則訊息中**，對「待執行清單」裡的每個 worktree，用 Agent tool 同時啟動對應 subagent（`run_in_background: true`）。

每個 subagent 的 prompt 使用以下模板：

```
你是一個專門執行 git worktree feature spec 的開發 agent。

目標 Worktree 路徑：<絕對路徑>
目標分支：<branch-name>

【第一步：切換工作目錄】
立即使用 EnterWorktree 工具，傳入 path: "<絕對路徑>"，切換進入目標 worktree。
這是必要步驟，確保所有後續檔案讀寫都在正確 worktree 下執行，不需要確認。

以下是此 worktree 的 spec 全文（來源：<spec 來源路徑>）：
<貼入 spec 全文>

【第二步：逐項實作】
依「實作範圍」checklist 逐項實作：
- 切換進入 worktree 後，使用相對路徑操作檔案即可
- 每完成一項，立即更新 git-worktree-spec.md，將對應項目改為 [x]
- 嚴格遵守「技術約束」的所有限制
- 不引入任何 spec 未要求的額外功能或依賴
- 建立新檔案時直接執行，不需詢問確認

【第三步：驗收並回傳結果】
實作完成後，逐項核對「驗收標準」，回傳以下格式：
- 分支名稱
- 完成項目數 / 總項目數
- 驗收標準逐項結果（✅ / ❌ + 說明）
- 若有失敗項目，說明原因
```

## 步驟四：彙整驗收結果

所有 subagent 完成後，以表格回報：

| 分支 | 完成 | 驗收 | 備註 |
|------|------|------|------|
| feature/faq-section | 4/4 | ✅ 全通過 | |
| feature/theme-toggle | 7/7 | ⚠️ 部分失敗 | 說明原因 |

最後提示：
```
✅ 所有 spec 執行完畢，請確認上方結果。
確認無誤後，執行 /commit-push-all 進行提交與推送。
```

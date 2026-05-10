# Session handoff (rolling)

> **読み手**: 次セッションの Claude / 共同メンテナ。
>
> 本書は **「直前のセッションが何を完了し、次に何から手を付けるか」** だけを 1 か所に集める。粒度は track 内 deliverable レベル。完了済みの古いエントリは末尾の「履歴」セクションへ落とす。
>
> セッション運用ルール:
>
> 1. セッション開始時、本書の "Active session" を読む。`docs/release/v1-execution-plan.md` の対応 deliverable も合わせて開く。
> 2. セッション中に区切りが付いたら、本書を更新（`Active session` を書き換え、完了分は `履歴` に追記）してから commit + push する。
> 3. 完了基準を満たさない作業は中断扱いで `In flight` に残し、ブロッカーを明記する。

---

## Active session — Track A-1 (toolbar + icon-button) と A-2 (bundle L4 計測 PoC)

最新 push: `a89158d` (2026-05-10) + ADR 0017 commit (本セッション末でこの後 push)

### 直近の完了 (2026-05-10 セッション 01)

| Track | 内容                                                                                   | コミット         |
| ----- | -------------------------------------------------------------------------------------- | ---------------- |
| —     | v1 execution plan を main に push                                                      | `467b3d5`        |
| D2    | Layer 4 から visual `data-*` を剥がし、Atelier に移管（CSS contract 18 に明文化）      | `77ceee7`        |
| D3    | `/api` ページ刷新 + `pnpm check:api-docs` CI gate + `predev` で `docs/api/` 自動再生成 | `b7792a4`        |
| D4    | コンポーネントページに layer-by-layer family table、sidebar を Layer 0〜5 で折り畳み化 | `a89158d`        |
| C-1   | **ADR 0017 (Atelier GA at v1.0)** 起票、ADR 0010 を supersede、CLAUDE.md 同期          | (本セッション末) |
| F-2   | ADR 0010 supersede ノート（C-1 と同居）                                                | (同上)           |

### 次セッションの優先キュー

`docs/release/v1-execution-plan.md` §「着手順（最初の 2 週間）」に沿って残務を進める。

#### 1. **Track A-1 — `toolbar` machine + headless** (推定 2-3 日)

最も小さい A-1 アイテム。`packages/{machines,headless}/src/toolbar/` がまだ存在しない。完了基準:

- `packages/machines/src/toolbar/index.ts` に `createToolbarMachine` を `defineMachine` で実装。`toJSON()` が stately viz 互換。
- APG `toolbar` パターン: `Home` / `End` / `Arrow*` がすべて `direction` を読んで RTL 反転（ロジックは machine 側）。
- `packages/headless/src/toolbar/index.ts` に attachment factory。
- `docs/components/toolbar.md` を `_template.md` に沿って起票（A-1 と F-1 が同居）。
- `apps/docs/keyboard/toolbar.kb.ts` を APG 整備（A-2 a11y 列の前倒し）。
- `pnpm check:layering`, `pnpm check:locale-shape`, `pnpm typecheck`, `pnpm test` が緑。

参考: `references/zag/packages/machines/toolbar/` と `references/bits-ui/` を grep してから書くこと。

#### 2. **Track A-2 — L4 bundle 計測 PoC** (推定 2-3 日、A-1 と並列着手可)

`scripts/measure-svelte-size.mjs` を Toggle 1 個で動かす。完了基準:

- Toggle の Svelte コンパイル後 `.js` を size-limit で計測できるラッパー（候補 1）か、`apps/docs/sizes/<comp>.js` の brotli 計測（候補 2）を 1 つ決めて起こす。
- ADR を 1 本起票（[ADR 0009](../design/16-decisions/0009-tsdown-bundler.md) を補完。番号は 0018 想定）。タイトル候補: "Measuring `.svelte` brotli for L4 / Atelier bundle gates"。
- Toggle 1 個で実測値が出て、`docs/design/09-bundle-budget.md` の数字と整合（or 差分があれば doc 側を更新）。
- まだ全 component への展開は不要 — PoC 段階。

#### 3. **Track A-1 — `time-field` machine + headless** (推定 3-5 日)

`datetime-field` への内部共有を見据えて先行。完了基準は toolbar と同形式。`@internationalized/date` を peer dep として読む。`docs/components/time-and-datetime-field.md` は既存なので追記でよい。

#### 4. **Track F-2 / C-7 — preview 文言の整理** (推定 0.5 日、機械的)

C-1 で発生した text drift を潰す:

- `docs/design/14-versioning-release.md` の「Layer 5 preview」記述を Atelier GA に書き換え、ADR 0017 にリンク。
- `docs/design/15-roadmap.md` の「Phase 0a/0b/0c の "🟡 未完了" マーカー」を実態に合わせ、Phase 2 の「Layer 5 stable」項目を削除（GA に格上げ済み）。

### In flight / 持ち越し

なし（セッション 01 で開けたタスクはすべて完了 or 上記の優先キューに入れ替わっている）。

### ブロッカー / 注意

- **flyle-nexus 側手動コミット待ち** (B-1: Deliverable E, I, J): kumiki 側からは触れない。次セッションで動くものではない。
- **共同メンテナ獲得** (E-1〜E-3): セッション内で完結する性格の作業ではない。ただし「session の合間にバックグラウンドで進める」枠として常時意識する。
- **新規 component 追加凍結** (M3 完了まで): toolbar / time-field / datetime-field は既に flyle-nexus マッピング表の対象なので OK。それ以外のコンポーネントを思いつきで増やさないこと。
- **bundle budget の引き上げは新規 ADR 必須**。A-1 で toolbar / time-field を追加した際に L3 のバジェット行を `docs/design/09-bundle-budget.md` に必ず追記する（増やすのではなく **新規行を引く**）。

### コマンドメモ

セッション開始時に走らせる典型的な health check:

```bash
git status --short                    # 未コミット変更があれば handoff の指示通りか確認
git log --oneline -5                  # 最新コミットが handoff の "直近の完了" と一致するか
pnpm install                          # 念のため
pnpm check:all                        # layering / locale / jsdoc / node-compat / api-report / api-docs / coverage
```

新規 ADR を書いたら:

```bash
# ADR テンプレ: 0015 / 0017 が比較的最近で参考になる
ls docs/design/16-decisions/
```

---

## 履歴

### 2026-05-10 — セッション 01

- 範囲: 未コミットの 79 ファイル分の進行中変更を 4 つの論理 deliverable に分けて main へ push、その上で C-1 (ADR 0017) を起票。
- 成果: D1〜D4 の 4 commit + C-1 の 1 commit。`pnpm ci:health` 緑。pre-push hook (typecheck + test + ci:health) 緑。
- 学び:
  - 進行中の作業ツリーは「Layer 4 を真の headless 契約にする」+ 「`/api` ページの再設計」+ 「layer-by-layer family ナビ」+ 「v1 計画書」の 4 テーマが混ざっていた。テーマ別に分けると 4 commit がきれいに切れた。
  - `treatWarningsAsErrors: true` 化に伴い `packages/core/types/src/index.ts` の relative `@see` を絶対 URL に置換する必要があった（D3 に同梱）。
  - `pnpm ci:health` は size-limit 込みで 56 秒。CI でも余裕で通る。

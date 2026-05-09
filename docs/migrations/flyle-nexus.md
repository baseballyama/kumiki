# 依頼書 — flyle-nexus デザインシステム を Kumiki に置き換える

> **目的**: `@flyle-lib/design-system` (`flyle-nexus/packages/frontend/design-system`) の
> 47 コンポーネント群を Kumiki ベースに置換する。a11y / i18n / バンドル予算 /
> メンテ性を担保しつつ、最終的にはデザインシステム自体を OSS 化できる状態
> に持っていく。
>
> **読み手**: Kumiki と flyle-nexus の両方を触る担当者。Kumiki 初見でも
> 進められるように構成してある。設計判断はすべて ADR 化済み — 再議論は
> 不要、参照のみで判断すること。

---

## 1. プロジェクト概要

### Kumiki

- Svelte 5 専用のヘッドレス UI ライブラリ。`@kumiki/*` の **9 パッケージ** ([ADR 0012](../design/16-decisions/0012-package-consolidation.md))。
- 5 レイヤ構造（types / primitives+locale / runtime+machines / headless / components / atelier）。設計詳細: [`docs/design/02-architecture.md`](../design/02-architecture.md)。
- **必読**:
  - [`CLAUDE.md`](../../CLAUDE.md) — リポジトリの "宪法"。命令の優先順位がここで決まる。
  - [`docs/design/16-decisions/`](../design/16-decisions/) — 16 本の ADR。受諾済みの決定。
  - [`docs/design/17-integration-boundaries.md`](../design/17-integration-boundaries.md) — Kumiki が **やらない** ことの境界。
  - [`docs/design/18-css-variable-contract.md`](../design/18-css-variable-contract.md) — Layer 4 の CSS カスタムプロパティ契約。

### flyle-nexus design-system

- 場所: `flyle-nexus/packages/frontend/design-system`（**別リポジトリ**）。
- 47 コンポーネント、Storybook + Chromatic 運用、`@floating-ui/dom` + `sortablejs` 利用。
- token CSS あり: `src/lib/css/variables/{color,radius,semantic,shadow,spacing,typography}.css`。
- 内部依存: `@flyle-lib/utils` / `@nexus/types`。

---

## 2. 既に完了している作業（参照のみ）

すべて `main` にマージ済み。以下は **やり直し不要**。

### 2.1 受諾済み ADR (0014–0016)

| ADR  | 決定                                                          |
| ---- | ------------------------------------------------------------- |
| 0014 | Icon は consumer-supplied snippet。`@kumiki/icons` は作らない |
| 0015 | 意味的 `<table>` は in-scope (Phase 1.5)、Data Grid は defer  |
| 0016 | リッチテキストエディタ / DnD は **恒久的に out-of-scope**     |

### 2.2 ドキュメント基盤

- `docs/design/17-integration-boundaries.md` — Kumiki が引き受けない領域 + 推奨ペアリング (TanStack Table / tiptap / dnd-kit-svelte 等)
- `docs/design/18-css-variable-contract.md` — Layer 4 の CSS 変数契約。19 + 12 個のコンポーネント分の表あり
- `docs/components/<name>.md` — Phase 1.5 全コンポーネントの仕様書（button / alert / badge / breadcrumb / pagination / avatar / chips / loading-spinner / definition-list / horizontal-rule / table / time-and-datetime-field）
- `docs/design/15-roadmap.md` §15.5b — Phase 1.5 のスコープ定義

### 2.3 実装済み Phase 1.5 コンポーネント

| コンポーネント | レイヤ  | 場所                                                                        |
| -------------- | ------- | --------------------------------------------------------------------------- |
| Button         | L3 + L4 | `packages/headless/src/button/` + `packages/components/src/button/`         |
| Alert          | L3 + L4 | `packages/headless/src/alert/` + `packages/components/src/alert/`           |
| Badge          | L4      | `packages/components/src/badge/`                                            |
| LoadingSpinner | L4      | `packages/components/src/loading-spinner/`                                  |
| HorizontalRule | L4      | `packages/components/src/horizontal-rule/`                                  |
| DefinitionList | L4      | `packages/components/src/definition-list/`                                  |
| Avatar         | L4      | `packages/components/src/avatar/`                                           |
| AvatarGroup    | L4      | `packages/components/src/avatar-group/`                                     |
| Chips          | L4      | `packages/components/src/chips/`                                            |
| Breadcrumb     | L4      | `packages/components/src/breadcrumb/`                                       |
| Pagination     | L3 + L4 | `packages/headless/src/pagination/` + `packages/components/src/pagination/` |
| Table          | L4      | `packages/components/src/table/`                                            |

各コンポーネントは:

- subpath export 設定済み (`packages/components/package.json` `exports` フィールド)
- dot-namespace barrel に登録済み (`packages/components/src/index.ts`)
- 必要に応じて `@kumiki/locale/<lang>` に message bundle 追加 (10 言語)

---

## 3. 依頼内容（Deliverable A〜L）

優先度順（依存関係に沿って並べた）。Deliverable ごとに **scope / acceptance / 参照**
を切ってある。1 PR = 1 Deliverable を推奨。

### Deliverable A — ドキュメントサイトに Phase 1.5 を露出

**Scope**

- `apps/docs/src/lib/playgrounds/registry.ts` の `PLAYGROUNDS` 配列に **12 件** 追加 (button / alert / badge / loading-spinner / horizontal-rule / definition-list / avatar / avatar-group / chips / breadcrumb / pagination / table)
- 同 `LIVE_PLAYGROUNDS` マップに lazy import エントリ追加
- 同 `apps/docs/src/lib/playgrounds/demos/component-<name>.svelte` を 12 件作成。既存 `component-toggle.svelte` がテンプレートになる
- `apps/docs/src/lib/playgrounds/snippets.ts` 相当があればコード例も追加

**Acceptance**

- `pnpm --filter @kumiki/docs dev` で `/components/<slug>` が 12 件全て表示される
- 各ページに live demo + APG リンク + status バッジが見える
- `pnpm --filter @kumiki/docs typecheck` がパスする

**参照**

- `apps/docs/src/lib/playgrounds/registry.ts` 既存エントリ (`component-toggle` 等)
- `apps/docs/src/lib/playgrounds/demos/component-toggle.svelte`

**見積**: M (3-5 日)

---

### Deliverable B — バリアント・補完コンポーネント

仕様は `docs/components/` に揃っている。実装のみ未着手。

| サブタスク                                         | 場所                                                                            | 仕様参照                                                                                                      | 見積 |
| -------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---- |
| **B-1: IconButton**                                | `packages/components/src/icon-button/`                                          | `docs/components/button.md` の "icon-only" 節                                                                 | S    |
| **B-2: Drawer**（Dialog `side` prop）              | 既存 `packages/components/src/dialog/Root.svelte` 拡張                          | `docs/components/dialog.md` "Drawer variant"                                                                  | S    |
| **B-3: Toggle.Group**                              | `packages/components/src/toggle/Group.svelte` 等を追加                          | `docs/components/toggle.md` "Toggle.Group variant"                                                            | M    |
| **B-4: TimeField + DateTimeField**                 | `packages/{machines,headless,components}/src/{time-field,datetime-field}/` 新設 | `docs/components/time-and-datetime-field.md`                                                                  | L    |
| **B-5: Popconfirm**                                | `packages/components/src/popover/with-confirm/` (subpath)                       | `docs/components/popover.md` "Popconfirm pattern"                                                             | S    |
| **B-6: Toolbar**（APG `toolbar`、roving tabindex） | `packages/{machines,headless,components}/src/toolbar/` 新設                     | 仕様未作成 — APG (https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) を直接参照しつつ `_template.md` で起こす | M    |

**Acceptance（共通）**

- 各サブパスの subpath export が `package.json` `exports` に登録される
- `@kumiki/components/<name>` の dot-namespace barrel に追加される
- `pnpm typecheck` / `pnpm test` / `pnpm size` / `pnpm ci:health` 全通過
- 必要なら `@kumiki/locale/<lang>` に message bundle 追加（10 言語、`scripts/check-locale-shape.mjs` 通過）
- `etc/<pkg>.api.md` を `node scripts/run-api-extractor.mjs` で再生成する

**見積（合計）**: L (2 週間程度)

---

### Deliverable C — APG keyboard YAML + axe スモーク

**Scope**

- `apps/docs/keyboard/<comp>.kb.ts` を Phase 1.5 全コンポーネント分追加（12 + B-1〜B-6 = ~18 件）。既存 `apps/docs/keyboard/toggle.kb.ts` 等が雛形
- APG-driven な Playwright テストハーネス (`apps/docs/tests/`) が動くように紐付け
- `axe-core` チェックを LTR + RTL の各 documented state について実施

**Acceptance**

- 各コンポーネントが `pnpm --filter @kumiki/docs test:e2e` で axe + APG keyboard をパス
- `docs/design/05-accessibility.md` §5.6 の Kumiki-ready チェックリストを全項目満たす

**参照**

- 既存の `apps/docs/keyboard/*.kb.ts` ファイル
- `docs/design/05-accessibility.md`

**見積**: M〜L

---

### Deliverable D — Atelier プリセット拡充

`packages/atelier/src/` に現状 toggle / dialog のみ。**残り 17 + 12 = 29 件** のプリセットを追加。

**Scope**

- 各コンポーネントに対して
  - `packages/atelier/src/<name>/index.ts` (Layer 4 component を re-export + token consumption layer)
  - tokens.css または `<name>.css`（`docs/design/18-css-variable-contract.md` §18.3 の per-component table に従って各 leaf var を提供）
- atelier の `package.json` `exports` に subpath を追加
- Tailwind v4 + vanilla CSS の 2 variant を toggle / dialog 同様に揃える
- `data-state` / `data-side` / `data-variant` 等の Layer 4 hooks を全て活用する

**Acceptance**

- atelier の subpath が全件 `pnpm --filter @kumiki/atelier build` を通る
- atelier 経由で Phase 1.5 全コンポーネントが画面に出る demo を作成
- `pnpm size` の atelier-side budget もパス

**参照**

- `docs/design/18-css-variable-contract.md` — leaf var の表
- 既存 `packages/atelier/src/toggle` / `packages/atelier/src/dialog` がテンプレート

**見積**: L〜XL（コンポーネント数が多い）

---

### Deliverable E — flyle トークン → Kumiki 変数のブリッジ

**Scope**

flyle 側のリポジトリで `--base-background-1` / `--primary-foreground-1` 等を Kumiki の leaf 変数 (`--kumiki-button-bg` 等) にマップする 1 ファイルを作る。`docs/design/18-css-variable-contract.md` §18.5 Strategy A をベースに。

**Acceptance**

- flyle 側に `packages/frontend/design-system/src/lib/css/kumiki-bridge.css` 等を新設
- 1 ページが kumiki Button / Modal (Dialog) / Toast / Combobox を表示し、見た目が flyle の他ページと統一される
- atelier の独自 default が override されていることを DevTools で確認

**Acceptance（kumiki 側の作業）**

- `docs/design/18-css-variable-contract.md` の §18.5 Strategy A example を flyle トークン名で具体化したスニペットに更新
- もし atelier 側の internal palette alias が不足していたら追記

**見積**: S（1-2 日、flyle 側の作業含む）

---

### Deliverable F — per-subpath bundle budget の整備

**Scope**

- `packages/components/package.json` の `size-limit` 配列に Phase 1.5 全 subpath を追加
- 各 subpath の brotli 値を `docs/components/<name>.md` 宣言値に合わせる
- `pnpm size` がパスすることを確認

**現状**

- `packages/headless/package.json` の `size-limit` には button / alert / pagination は追加済み
- `packages/components/package.json` の `size-limit` は **空** または Phase 1 のみ

**Acceptance**

- `pnpm size` が Phase 1.5 全 subpath を計測する
- 値が docs/components/\*.md の "Bundle (Layer 4 target, brotli)" を超えない
- 超える場合は新規 ADR を起こして承認を得てから引き上げ ([ADR 0009](../design/16-decisions/0009-tsdown-bundler.md) §5 参照)

**見積**: S

---

### Deliverable G — Testing utility 公開

**Scope**

- `@kumiki/components/testing` を新設し、flyle が `@testing-library/svelte` で書いたテストが切らないようにする最小ヘルパーを公開
  - `getByRoleStrict(role, name)` — `aria-label` フォールバック付き
  - `expectComponentState(node, expected)` — `data-state` ベースのアサート
  - その他 `flyle-nexus/packages/frontend/design-system/src/lib/testing.ts` で参照されているヘルパーの kumiki 版
- `packages/components/package.json` の `exports` に `./testing` を追加

**Acceptance**

- flyle 側のテスト 1 ファイルを kumiki 経由に置き換え、`pnpm test` がパス
- 公開 API は `@kumiki/components/testing` 経由のみ

**見積**: M

---

### Deliverable H — Validation library の Standard Schema 互換チェック

**Scope**

- flyle の dependencies を確認: 使われている validation lib（おそらく zod）
- バージョン要件: `zod ≥ 3.24` / `valibot` / `arktype` のいずれかなら追加作業ゼロ
- 該当しなければ Standard Schema 互換アダプタの設計を ADR 化（[ADR 0004](../design/16-decisions/0004-standard-schema.md) を参照しつつ supersede 案を起こす）

**Acceptance**

- flyle 側で 1 つの form を kumiki `FormField` + Standard Schema validator に置き換え
- `pnpm test` がパス
- 検出した lib バージョンを `docs/migrations/flyle-nexus.md` に追記

**見積**: S（互換なら）/ L（互換でないなら）

---

### Deliverable I — Storybook 統合サンプル

**Scope**

- 単一の Storybook story を kumiki コンポーネント (`Button` または `Dialog`) で書く
- flyle の Storybook 設定 (`packages/frontend/design-system/.storybook/`) で動作確認
- `docs/migrations/flyle-nexus.md` の §"Storybook integration" 節に記録

**Acceptance**

- `pnpm --filter @flyle-lib/design-system dev` (Storybook) で kumiki story が動く
- Chromatic CI も green を維持

**見積**: S

---

### Deliverable J — flyle 側 1 ページの完全移行（パイロット）

**Scope**

- flyle のうち比較的シンプルな本番ページを **1 つ** 選び、design-system の使用箇所を全て kumiki に置換
- 移行前後のスクリーンショット / a11y スコア / バンドルサイズを `docs/migrations/flyle-nexus.md` に記録
- これが [`docs/design/15-roadmap.md`](../design/15-roadmap.md) §15.5b の exit criterion

**候補ページの選定基準**

- 内部ツール内、エンドユーザーへの影響が小さいもの
- form / table / dialog / button いずれかを含むもの
- E2E test がある or 書ける

**Acceptance**

- そのページで `@flyle-lib/design-system` の import が **ゼロ**
- 既存の E2E test が green
- a11y / lighthouse スコアが移行前と同等以上

**見積**: M

---

### Deliverable K — CLI / 利用ガイド整備

**Scope**

- `kumiki add <component>` は atelier をスキャフォールドする CLI (現在の挙動)。これを flyle のような import-only consumer に対しては不要であることを明文化
- flyle のような既存デザインシステムを Kumiki に乗せ換えるパターン（Strategy A / B）を `docs/migrations/flyle-nexus.md` の §"Adoption modes" に整理

**Acceptance**

- ドキュメント更新のみ。テストなし。

**見積**: S

---

### Deliverable L — 移行マッピング表（このドキュメントの §4 を完成させる）

**Scope**

`docs/migrations/flyle-nexus.md` の §4 にある表を埋める。flyle 側で
**実コード移行作業をする際の単一ソース** にする。

**Acceptance**

- 47 ディレクトリすべてに 1 行
- "kumiki でどう書くか" の最小コード片がついていること
- 不可能なものは "見送り（理由）" を明記

**見積**: M

---

## 4. flyle コンポーネント → Kumiki マッピング表

> Deliverable L で完成させる作業表。現状の素案を貼っておく。
> "kumiki" 列は実装済みのみ ✅、変種で追加実装が必要なものは ⚠️、
> Kumiki 側に存在しないものは ❌。

### 4.1 直接置換可能（ ✅ 群）

| flyle                                                                                                                                     | kumiki                            | 注                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------- |
| accordion                                                                                                                                 | `@kumiki/components/accordion`    | そのまま                                                       |
| modal                                                                                                                                     | `@kumiki/components/dialog`       | naming 差のみ                                                  |
| popover                                                                                                                                   | `@kumiki/components/popover`      | そのまま                                                       |
| tooltip                                                                                                                                   | `@kumiki/components/tooltip`      | そのまま                                                       |
| tabs                                                                                                                                      | `@kumiki/components/tabs`         | そのまま                                                       |
| toast                                                                                                                                     | `@kumiki/components/toast`        | そのまま                                                       |
| dropdown / dropdown-menu / dropdown-menu-item / dropdown-trigger                                                                          | `@kumiki/components/menu`         | flyle 側の 4 ディレクトリは kumiki/menu の Trigger/Item で吸収 |
| form/checkbox                                                                                                                             | `@kumiki/components/checkbox`     | そのまま                                                       |
| form/radio-button                                                                                                                         | `@kumiki/components/radio-group`  | flyle の単独 radio は radio-group + 1 item                     |
| form/switch                                                                                                                               | `@kumiki/components/switch`       | そのまま                                                       |
| form/combobox/single-combobox                                                                                                             | `@kumiki/components/combobox`     | そのまま                                                       |
| form/number-input                                                                                                                         | `@kumiki/components/number-field` | そのまま                                                       |
| form/date-input                                                                                                                           | `@kumiki/components/date-picker`  | そのまま                                                       |
| form/field                                                                                                                                | `@kumiki/components/form-field`   | そのまま                                                       |
| toggle-button                                                                                                                             | `@kumiki/components/toggle`       | そのまま                                                       |
| accordion / alert / badge / breadcrumb / pagination / chips / loading-spinner / definition-list / horizontal-rule / avatar / avatar-group | Phase 1.5 にて新規実装済み        | §2.3 の表参照                                                  |
| table（基本セル）                                                                                                                         | `@kumiki/components/table`        | semantic table。virtualize / cell-edit は対象外                |

### 4.2 変種実装が必要（ ⚠️ 群）

| flyle                                     | kumiki + 必要作業                                 | Deliverable |
| ----------------------------------------- | ------------------------------------------------- | ----------- |
| icon-button / text-button / filter-button | Button + IconButton variant                       | B-1         |
| drawer                                    | Dialog + side prop                                | B-2         |
| toggle-button-group                       | Toggle.Group variant                              | B-3         |
| form/datetime-input / form/time-input     | DateTimeField / TimeField                         | B-4         |
| popconfirm                                | popover/with-confirm                              | B-5         |
| form/combobox/multi-combobox              | combobox + `withMultiSelect` (実装済み、確認のみ) | —           |

### 4.3 kumiki 側で受けない（ ❌ 群）

[ADR 0014/0015/0016](../design/16-decisions/) と
[`docs/design/17-integration-boundaries.md`](../design/17-integration-boundaries.md) の方針に従って、flyle 側に残す or 別ライブラリで補う。

| flyle                                                                                                    | 方針                                                                                       |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| editor / editor-field                                                                                    | tiptap / Lexical / ProseMirror で flyle 側に残す。Toolbar (B-6) は kumiki が提供           |
| sortable                                                                                                 | dnd-kit-svelte / sortablejs を flyle 側で利用                                              |
| table の virtualize / cell-edit / column-resize                                                          | TanStack Table を flyle 側で利用。kumiki Table は markup + sort/select/tree のみ           |
| icon / decorative-icon                                                                                   | flyle 側で Lucide 等を利用 (ADR 0014)                                                      |
| color-palette / environment-ribbon / page-header / sidebar / sidebar-menu / upload-progress / @shared 群 | flyle 内で kumiki primitive を組み合わせるレシピ。専用コンポーネントは kumiki に追加しない |

### 4.4 軽量で残作業少（◯ 群）

| flyle                  | 方針                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| text / horizontal-rule | kumiki に既に存在 (HorizontalRule)、テキストはセマンティックタグ |
| definition-list        | kumiki に存在                                                    |
| highlight              | flyle 側で `<mark>` 等のセマンティック要素直書きで OK            |
| card-select            | flyle 側で `<RadioGroup.Root> + label` の合成レシピ              |
| chips-with-close       | kumiki Chips の `dismissible` variant で代替                     |
| avatar-with-text       | Avatar + text の合成レシピ                                       |

---

## 5. ワークフロー / 環境

### 5.1 ローカル準備

```bash
git clone git@github.com:baseballyama/kumiki.git
cd kumiki
pnpm install        # lefthook も自動セットアップされる
```

`flyle-nexus` 側の clone も併せて行う。両方とも同じユーザー所有。

### 5.2 主要コマンド

| やりたいこと                    | コマンド                                 |
| ------------------------------- | ---------------------------------------- |
| 全パッケージビルド              | `pnpm build`                             |
| 個別 typecheck                  | `pnpm --filter @kumiki/<name> typecheck` |
| 全 typecheck                    | `pnpm typecheck`                         |
| 個別 test                       | `pnpm --filter @kumiki/<name> test`      |
| 全 test                         | `pnpm test`                              |
| Lint                            | `pnpm lint`                              |
| Format（書き込み）              | `pnpm format`                            |
| Format チェックのみ             | `pnpm format:check`                      |
| バンドルサイズ計測              | `pnpm size`                              |
| Health check（CI ゲートと同等） | `pnpm ci:health`                         |
| docs サイト dev                 | `pnpm --filter @kumiki/docs dev`         |
| API report 再生成               | `node scripts/run-api-extractor.mjs`     |
| Locale shape チェック           | `pnpm check:locale-shape`                |
| Layering チェック               | `pnpm check:layering`                    |

### 5.3 hooks

`lefthook.yml` 設定済み。**回避禁止** (`--no-verify` は ADR 違反)。

- pre-commit: format / lint / layering / locale-shape
- pre-push: typecheck / test / **ci:health** (publint / attw / agadoo / size-limit / api-report)

### 5.4 ブランチ運用

- 1 Deliverable = 1 feature branch + 1 PR
- branch 名: `feat/flyle-<deliverable-id>` 推奨 (例: `feat/flyle-D2-icon-button`)
- main への直 push は **maintainer の明示承認時のみ**
- `--force-push` / `--no-verify` / `git reset --hard` 等の destructive 操作は事前承認

### 5.5 commit メッセージ

```
<type>(<scope>): <subject> (Deliverable <ID>)

<body>

Co-Authored-By: <name> <email>
```

`type`: feat / fix / docs / refactor / test / chore / build。

---

## 6. 守るべきルール（議論不要、変更には ADR）

| ルール                                                                              | 根拠                              |
| ----------------------------------------------------------------------------------- | --------------------------------- |
| Svelte 5 のみ (≥ 5.29 で `{@attach}`)                                               | ADR 0001                          |
| Standard Schema 経由のみ。zod / valibot 個別アダプタなし                            | ADR 0004                          |
| `child` snippet パターン (Bits UI v2 風)。`asChild` 禁止                            | ADR 0007                          |
| pnpm workspace のみ                                                                 | ADR 0008                          |
| tsdown (TS-only) / svelte-package (Svelte) の二本立て                               | ADR 0009                          |
| Layer N は Layer ≤ N にのみ依存可 (`scripts/check-layering.mjs` で強制)             | `docs/design/02-architecture.md`  |
| アイコンは consumer-supplied snippet。`@kumiki/icons` を作らない                    | ADR 0014                          |
| Data Grid / virtualize / cell-edit は kumiki Table の対象外                         | ADR 0015                          |
| リッチテキストエディタ / DnD は **恒久的に out-of-scope**                           | ADR 0016                          |
| `sideEffects: false` を全 package に維持                                            | `agadoo` で CI ゲート             |
| `--no-verify` / hooks スキップ禁止                                                  | `CLAUDE.md`                       |
| `pnpm size` / `pnpm publint` / `pnpm attw` / `pnpm agadoo` への `--ignore` 追加禁止 | `CLAUDE.md`                       |
| バンドル予算の **引き上げ** には ADR が必須                                         | `docs/design/09-bundle-budget.md` |
| `package.json` の `exports` 形状を変える時は要相談                                  | `CLAUDE.md`                       |
| 新規依存追加は要相談                                                                | `CLAUDE.md`                       |
| `references/` への submodule 追加は要相談                                           | `CLAUDE.md`                       |

---

## 7. CI ゲート（PR が green になる条件）

PR を出す前に手元で `pnpm ci:health` を必ず通すこと。内訳:

1. **format** — `oxfmt` (TS/JS/MD/YAML) + `prettier` (.svelte)
2. **lint** — `oxlint` (注: `eslint` ではなく oxlint)
3. **typecheck** — `pnpm -r typecheck`（svelte-check + tsc）
4. **test** — `vitest`
5. **layering** — Layer N → ≤ N の依存制約
6. **locale-shape** — 10 言語の `Messages` 形状一致
7. **jsdoc** — Layer 4 各 subpath が APG URL を JSDoc に持つ（`scripts/check-jsdoc.mjs` の `APG_EXEMPT` セットに入れない限り）
8. **node-compat** — Layer 1-2 が pure Node (no DOM globals) で `import` できる
9. **api-report** — `etc/<pkg>.api.md` が最新
10. **publint / attw / agadoo / size-limit** — 公開健全性

新コンポーネントの `etc/<pkg>.api.md` は **コミット時に必ず再生成** (`node scripts/run-api-extractor.mjs`) する。これを忘れると pre-push で失敗する。

---

## 8. 連絡 / 相談ポイント

以下は必ず maintainer に相談する:

- Bundle budget を引き上げる必要が出た
- 新規依存パッケージを追加したい
- `package.json` `exports` の形状（`./types/svelte/import` 三本立て）を変えたい
- ADR と矛盾する判断が必要
- 上記表 (§4.3) で "out-of-scope" となっているものを引き受けるべきと判断した
- main / release ブランチに直接何かしたい

それ以外（実装 / テスト / docs 編集 / atelier 拡充 / 1 PR の中で完結する変更）は自走可。

---

## 9. 進捗の見せ方

- 1 Deliverable = 1 PR、PR description に
  - Deliverable ID
  - Acceptance criteria の checkbox リスト
  - 計測値（bundle size の比較等）を記載
- ステータス更新は週次でこのドキュメントに節を切って追記する（必要なら）

---

## 10. リファレンス（ブックマーク推奨）

| 用途                     | パス                                         |
| ------------------------ | -------------------------------------------- |
| 5 レイヤ設計             | `docs/design/02-architecture.md`             |
| パッケージ配置           | `docs/design/03-package-structure.md`        |
| 状態機械仕様             | `docs/design/04-state-machines.md`           |
| a11y 戦略                | `docs/design/05-accessibility.md`            |
| i18n / RTL / locale      | `docs/design/06-i18n.md`                     |
| Form / Standard Schema   | `docs/design/07-form-validation.md`          |
| TS / generics            | `docs/design/08-typescript.md`               |
| Bundle budget            | `docs/design/09-bundle-budget.md`            |
| `with*` 合成             | `docs/design/11-composition.md`              |
| Versioning               | `docs/design/14-versioning-release.md`       |
| Roadmap (Phase 1.5 含む) | `docs/design/15-roadmap.md`                  |
| ADR (16 本)              | `docs/design/16-decisions/`                  |
| 引き受けない領域         | `docs/design/17-integration-boundaries.md`   |
| CSS 変数契約             | `docs/design/18-css-variable-contract.md`    |
| コンポーネント仕様雛形   | `docs/components/_template.md`               |
| 既存実装の参考           | `docs/components/combobox.md` (一番複雑な例) |

不明点はまずここを当たる。それでも分からない場合だけ maintainer に相談。

---

**最終更新**: 2026-05-09
**担当**: 未割当
**Maintainer**: baseballyama

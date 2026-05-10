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

**進行状況 (2026-05-10)**

- ✅ `flyle-nexus/packages/frontend/design-system/src/lib/css/kumiki-bridge.css` を **配置済み** — Phase 1 + Phase 1.5 全コンポーネント分の leaf var を flyle セマンティック token (`--base-*` / `--primary-*` / `--danger-*` / `--info-*` / `--success-*` / `--warning-*` / `--space-*` / `--radius-*` / `--effect-focus-*` / `--shadow-*`) にマップ済み。`[data-variant='ghost' | 'danger']` / `[data-severity='info' | 'success' | 'warn' | 'error']` の派生も含む
- ✅ kumiki 側 `docs/design/18-css-variable-contract.md` §18.5 Strategy A を flyle 具体トークンで全面書き直し
- ⏳ flyle 側 `src/lib/css/index.css` に以下を **手動追加** が必要 (kumiki repo からは flyle のファイルを編集できない):

  ```diff
   /* 初期化、デザイントークン、カスタムスタイルの順番でレイヤーを定義 */
   @layer reset, basic;
   @layer color, radius, spacing, typography, shadow, semantic, effect, text;
   @layer accessibility, animation, editor;
  +@layer kumiki-bridge;

   /* ... 既存 import ... */

  +@import url('./kumiki-bridge.css') layer(kumiki-bridge);
  ```

**Acceptance**

- ✅ flyle 側に `packages/frontend/design-system/src/lib/css/kumiki-bridge.css` を配置
- ⏳ 上記 index.css 1 行追加後に 1 ページが kumiki Button / Modal (Dialog) / Toast / Combobox を表示し、見た目が flyle の他ページと統一される (Deliverable J で確認)
- ⏳ atelier の独自 default が override されていることを DevTools で確認

**Acceptance（kumiki 側の作業）**

- ✅ `docs/design/18-css-variable-contract.md` の §18.5 Strategy A example を flyle トークン名で具体化したスニペットに更新
- ✅ atelier 側の internal palette alias は既存で十分 (Phase 1.5 atelier プリセット側の Vanilla variant が leaf var を直接読むため)

**見積**: S（1-2 日、flyle 側の作業含む）

---

### Deliverable F — per-subpath bundle budget の整備

**Scope**

- `packages/components/package.json` の `size-limit` 配列に Phase 1.5 全 subpath を追加
- 各 subpath の brotli 値を `docs/components/<name>.md` 宣言値に合わせる
- `pnpm size` がパスすることを確認

**現状**

- `packages/headless/package.json` の `size-limit` には button / alert / pagination は追加済み（Phase 1.5 で headless レイヤを持つ全コンポーネント）
- `packages/components/package.json` の `size-limit` は **空** — `@kumiki/components` と `@kumiki/atelier` は `pnpm size` から除外されている (`docs/design/09-bundle-budget.md` §9.3 と root `package.json` の `size` script を参照)。esbuild が `.svelte` ファイルを読めないため
- `docs/design/09-bundle-budget.md` の Layer 4 target 表に **Phase 1.5 全コンポーネント分の brotli target** を追記済み（informational, not gated）

**Acceptance**

- L3 (`@kumiki/headless/<name>`) を持つ Phase 1.5 全 subpath が `pnpm size` で計測される ✅
- L4 target は `docs/design/09-bundle-budget.md` に明記される ✅
- L4 / Atelier の実測は **`pnpm measure:svelte-size:check`** で 102 subpath すべて hard-gate (`pnpm ci:health` 経由で CI に組込み済み) ✅ — 2026-05-10 に [ADR 0018](../design/16-decisions/0018-l4-bundle-budget-revision.md) と共に Live。Lighthouse CI は補助 metric として残す
- 超える場合は新規 ADR を起こして承認を得てから引き上げ ([ADR 0009](../design/16-decisions/0009-tsdown-bundler.md) §5 / [ADR 0018](../design/16-decisions/0018-l4-bundle-budget-revision.md) §"Adjusting a budget" 参照)

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

- flyle の dependencies を確認: 使われている validation lib
- バージョン要件: `zod ≥ 3.24` / `valibot` / `arktype` のいずれかなら追加作業ゼロ
- 該当しなければ Standard Schema 互換アダプタの設計を ADR 化（[ADR 0004](../design/16-decisions/0004-standard-schema.md) を参照しつつ supersede 案を起こす）

**調査結果 (2026-05-10)**

`flyle-nexus/pnpm-workspace.yaml` の catalog エントリより:

| Validator   | flyle 側のバージョン          | Standard Schema 互換性                       |
| ----------- | ----------------------------- | -------------------------------------------- |
| **valibot** | `1.3.1` (複数 catalog で利用) | ✅ valibot 1.x はネイティブ `~standard` 実装 |
| **zod**     | `4.4.2`                       | ✅ zod 3.24+ で対応、4.x は当然対応          |

**結論: アダプタ作業ゼロ。** どちらの validator も `kumiki/components/form-field` の `validator` prop に **そのまま** 渡せる。

```svelte
<script lang="ts">
  import { FormField } from '@kumiki/components';
  import * as v from 'valibot';
  // または: import { z } from 'zod';

  const emailSchema = v.pipe(v.string(), v.email());
  // または: const emailSchema = z.email();
</script>

<FormField.Root validator={emailSchema} name="email">
  <FormField.Label>Email</FormField.Label>
  <FormField.Input type="email" />
  <FormField.ErrorMessage />
</FormField.Root>
```

**Acceptance**

- ✅ flyle が valibot 1.3.1 / zod 4.4.2 を使用 (Standard Schema 互換)
- ✅ `docs/migrations/flyle-nexus.md` に検出 lib バージョンを追記済み
- ⏳ flyle 側で 1 つの form を kumiki `FormField` + Standard Schema validator に置き換え (Deliverable J で実施)

**見積**: S（互換確認のみで完了）

---

### Deliverable I — Storybook 統合サンプル

**Scope**

- 単一の Storybook story を kumiki コンポーネント (`Button` または `Dialog`) で書く
- flyle の Storybook 設定 (`packages/frontend/design-system/.storybook/`) で動作確認
- `docs/migrations/flyle-nexus.md` の §"Storybook integration" 節に記録

**進行状況 (2026-05-10)**

flyle 側にコピペ可能な Story スニペットを以下に同梱。配置場所:
`flyle-nexus/packages/frontend/design-system/src/lib/components/__kumiki/KumikiButton.stories.svelte`
（kumiki repo 側からは flyle のファイルを直接書けないため、この Deliverable は **flyle 側で 1 ファイル新設** で完了）。

```svelte
<!-- KumikiButton.stories.svelte -->
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button } from '@kumiki/components';

  const { Story } = defineMeta({
    title: 'Kumiki/Button',
    component: Button.Root,
    tags: ['autodocs'],
    argTypes: {
      variant: { control: 'select', options: ['primary', 'ghost', 'danger'] },
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
      disabled: { control: 'boolean' },
      loading: { control: 'boolean' },
    },
  });
</script>

<Story name="Primary" args={{ variant: 'primary', size: 'md' }}>
  {#snippet children(args)}
    <Button.Root {...args}>保存</Button.Root>
  {/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>
  {#snippet children(args)}
    <Button.Root {...args}>キャンセル</Button.Root>
  {/snippet}
</Story>

<Story name="Danger" args={{ variant: 'danger' }}>
  {#snippet children(args)}
    <Button.Root {...args}>削除</Button.Root>
  {/snippet}
</Story>

<Story name="Loading" args={{ loading: true }}>
  {#snippet children(args)}
    <Button.Root {...args}>送信中…</Button.Root>
  {/snippet}
</Story>
```

事前条件:

1. flyle の `package.json` `dependencies` に `@kumiki/components`,
   `@kumiki/atelier`, `@kumiki/runtime` を追加 (workspace 経由でも npm でも)
2. `packages/frontend/design-system/.storybook/preview.ts` で
   `import '../src/lib/css/index.css'` を読み込んでいることを確認
   （Deliverable E の bridge.css がこの index 経由で適用される）

**Acceptance**

- ⏳ `pnpm --filter @flyle-lib/design-system dev` (Storybook) で kumiki story が動く
- ⏳ Chromatic CI も green を維持
- ⏳ `data-variant='ghost' | 'danger'` ブランチが見た目で flyle の他 Button と同じ palette に乗っている

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

**選定済みパイロット (2026-05-10)**

`apps/nexus/frontend/app/src/routes/auth/tenants/+page.svelte`
（テナント作成中の中間ページ・110 行・`Text` + `toast` のみ利用）。

**Before → After 変換レシピ**

`Text` は文字スタイルが本質なので **セマンティック HTML + flyle CSS token への直書き** が正しい。kumiki に専用 Text コンポーネントは作らない (ADR 0017 範囲外)。`toast` は `Toast.Root` の宣言的 API + `Toast.Provider` に置き換え。

```diff
 <script lang="ts">
-  import { Text, toast } from '@flyle-lib/design-system/components';
+  import { Toast } from '@kumiki/components';
+  import { useToast } from '$lib/kumiki-toast'; // 下記の薄い helper
   import * as env from '@nexus/env/public';
   import * as DT from '@nexus/types';
   import * as v from 'valibot';

   /* ... 既存ロジック ... */

   const createTenant = async () => {
     if (!tenantNameResult.success || !organizationNameResult.success) {
-      toast({ message: 'パラメータが正しくありません', pattern: 'error' });
+      toaster.publish({ severity: 'error', title: 'パラメータが正しくありません' });
       errorOccurred = true;
       isLoading = false;
       return;
     }
     /* ... */
   };
+
+  const toaster = useToast();
 </script>

 <PageTitle pageTitle="テナント作成" />
 <div class="h-screen flex justify-center items-center">
   <div class="text-center">
     {#if isLoading}
-      <Text type="heading-20">テナントを作成中...</Text>
-      <Text type="body-14" color="gray-600" utilityClass="mt-4">しばらくお待ちください</Text>
+      <h1 class="text-heading-20">テナントを作成中...</h1>
+      <p class="text-body-14 mt-4" style="color: var(--base-foreground-3)">
+        しばらくお待ちください
+      </p>
     {:else if errorOccurred}
-      <Text type="heading-20">エラーが発生しました</Text>
-      <Text type="body-14" color="gray-600" utilityClass="mt-4">リダイレクトしています...</Text>
+      <h1 class="text-heading-20">エラーが発生しました</h1>
+      <p class="text-body-14 mt-4" style="color: var(--base-foreground-3)">
+        リダイレクトしています...
+      </p>
     {/if}
   </div>
 </div>
```

`useToast` は flyle 側で 1 回だけ書く薄い wrapper（kumiki が
`Toast.Provider` を root layout に置いて、`getContext` で publisher
を取り出す形）:

```ts
// flyle: src/lib/kumiki-toast.ts
import { getContext } from 'svelte';
import type { ToastContext } from '@kumiki/components/toast';
export const useToast = (): ToastContext => getContext<ToastContext>(Symbol.for('kumiki.toast'));
```

`Toast.Provider` は `+layout.svelte` の trunk に 1 度だけ:

```svelte
<!-- flyle: src/routes/+layout.svelte -->
<script lang="ts">
  import { Toast } from '@kumiki/components';
</script>

<Toast.Provider>
  <slot />
  <Toast.Region />
</Toast.Provider>
```

**Acceptance**

- ⏳ そのページで `@flyle-lib/design-system` の import が **ゼロ** (`Text`, `toast` を kumiki + semantic HTML に置換済み)
- ⏳ 既存の E2E test (もしあれば) が green
- ⏳ a11y / lighthouse スコアが移行前と同等以上
- ⏳ 移行前後のスクリーンショット + バンドルサイズを上記 §J に追記

**進行状況 (2026-05-10)**

- ✅ パイロットページ選定完了 (`auth/tenants/+page.svelte`)
- ✅ Before/After diff + 必要な helper コードをこの spec に同梱
- ⏳ 実コミットは flyle 側で実施 (kumiki repo からは write 権限なし)

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

## §K.1 Adoption modes — 既存デザインシステムを Kumiki に乗せ換えるパターン

flyle-nexus のように **既に独自のデザインシステムを持っている** プロジェクトが Kumiki を採用する際に取りうる 3 つのパターン。ここで言う "コピー" は `kumiki add <component>` で atelier ソースを取り込む形式 (`@kumiki/cli` README §Use 節) を指す。

### Mode 1 — `import-only` (推奨)

`@kumiki/components` を素のままインポートし、見た目は既存トークンを bridge.css で接続する。**flyle はこのモード**。

```svelte
<script>
  import { Button } from '@kumiki/components';
</script>

<Button.Root>保存</Button.Root>
```

| 必要セットアップ                        | 役割                                    |
| --------------------------------------- | --------------------------------------- |
| `dependencies: @kumiki/components`      | 振る舞いと a11y                         |
| `dependencies: @kumiki/atelier` (任意)  | レイアウト/サイズ等の "土台" デフォルト |
| `kumiki-bridge.css` (Strategy A)        | 既存トークンを Kumiki leaf var にマップ |
| `LocaleProvider` を root layout に 1 度 | i18n / RTL                              |

**`kumiki add` は使わない。** import-only mode では atelier のソースをコピーする必要がない (npm package 経由で十分)。

`kumiki add` が必要になるのは **Mode 2** (atelier のスタイルを 1 ファイルだけプロジェクトに持ち込んで微調整したい) の場合のみ。

### Mode 2 — `atelier-fork`

「あるコンポーネントだけは見た目を派手に変える / 独自 props を生やす」というケース。`kumiki add toggle --variant=vanilla` で atelier の単一コンポーネントをコピーし、そのコピーを編集する。`@kumiki/components` への依存はそのまま残す (atelier はスタイル層に過ぎない)。

```bash
pnpm add -D @kumiki/cli @kumiki/atelier@preview
npx kumiki add toggle --variant=vanilla --dest=src/lib/components/ui
# 以後、src/lib/components/ui/toggle/Toggle.svelte を自由に編集
```

メリット:

- Layer 4 の振る舞い・a11y は kumiki に保たせたまま、見た目だけ独自化できる
- 同じ component を持つ他 UI ライブラリへ後から戻すのも容易 (data-\* hook が共通)

デメリット:

- アップデートはコピー先の手動 merge が必要 (これは shadcn-svelte 流の "コピーは自由" モデルの代償)

### Mode 3 — `headless-only`

スタイルは consumer 側で全部書く。`@kumiki/headless` の attachment factory だけを使い、`@kumiki/components` (`@kumiki/atelier`) には依存しない。

```svelte
<script>
  import { toggle } from '@kumiki/headless/toggle';
  const t = toggle();
</script>

<button {@attach t.root}>{@render children?.()}</button>
```

| 用途                                                     | 適性                              |
| -------------------------------------------------------- | --------------------------------- |
| 完全独自デザイン、Tailwind / vanilla / styled-components | 最大の自由度、最小バンドル        |
| Phase 1 component を選び抜きで使いたい                   | OK                                |
| 多くのコンポーネントを使う / 開発スピード優先            | Mode 1 (import-only) のほうが速い |

### モード選定指針

```
flyle のような大規模既存デザインシステム
  → Mode 1 (import-only + bridge.css)

新規プロジェクト / 既存システムなし
  → Mode 1 (import-only) で atelier をデフォルトとして使う
  → 必要に応じて部分的に Mode 2 へ昇格

スタイルガイドが完全独自で、少数コンポーネントだけ Kumiki に頼りたい
  → Mode 3 (headless-only)
```

### `kumiki add` 早見表

| 状況                                    | コマンド                                   |
| --------------------------------------- | ------------------------------------------ |
| atelier の Tailwind variant をコピー    | `npx kumiki add toggle`                    |
| atelier の Vanilla CSS variant をコピー | `npx kumiki add toggle --variant=vanilla`  |
| 別ディレクトリにコピー                  | `npx kumiki add toggle --dest=app/widgets` |
| 上書き許可                              | `npx kumiki add toggle --force`            |
| 何が書かれるか確認だけ                  | `npx kumiki add toggle --dry-run`          |

**注:** `kumiki add` は import-only mode (Mode 1) では一切呼ばないこと。誤って呼ぶと、改修すると上書きされる "孤立コピー" がプロジェクトに増える。

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

> Deliverable L (2026-05-10 完成)。
> "状態" 列: ✅ 実装済 (そのまま使える) / ⚠️ Phase 1.5 で追加 (今 sprint 終了時点で実装完了) / 🔄 Phase 1 で実装済み (subpath 自体は前から存在) / ❌ Kumiki 範囲外 (flyle 側残置か他 lib) / ◯ 既存 kumiki primitive の **合成レシピ** で吸収。
> "kumiki" 列は実コードで何を import するか。"最小コード片" 列は flyle 側 1:1 置換のミニマル例。

> **flyle 側ディレクトリ数**: 45 (`@shared` は utility のため対象外。`form/` と `dropdown*/` を 1 行に丸めずに分解列挙 → 重複なしで 45 件)。全 45 件にマッピング行あり。

### 4.1 直接置換 (✅ Phase 1) — `kumiki/components/<X>` に同名実装あり

| flyle                         | 状態 | kumiki                            | 最小コード片                                                                                                                                       |
| ----------------------------- | ---- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| accordion                     | ✅   | `@kumiki/components/accordion`    | `<Accordion.Root multiple>{#each items as i}<Accordion.Item value={i.id}>…</Accordion.Item>{/each}</Accordion.Root>`                               |
| modal                         | ✅   | `@kumiki/components/dialog`       | `<Dialog.Root bind:open><Dialog.Trigger>…</Dialog.Trigger><Dialog.Content title="…">…</Dialog.Content></Dialog.Root>`                              |
| popover                       | ✅   | `@kumiki/components/popover`      | `<Popover.Root><Popover.Trigger>…</Popover.Trigger><Popover.Content>…</Popover.Content></Popover.Root>`                                            |
| tooltip                       | ✅   | `@kumiki/components/tooltip`      | `<Tooltip.Root><Tooltip.Trigger>…</Tooltip.Trigger><Tooltip.Content>tip</Tooltip.Content></Tooltip.Root>`                                          |
| tabs                          | ✅   | `@kumiki/components/tabs`         | `<Tabs.Root value="general"><Tabs.List>…</Tabs.List><Tabs.Panel value="general">…</Tabs.Panel></Tabs.Root>`                                        |
| toast                         | ✅   | `@kumiki/components/toast`        | `<Toast.Provider><slot/><Toast.Region/></Toast.Provider>` + `useToast().publish({severity:'error', title:'…'})`                                    |
| dropdown                      | ✅   | `@kumiki/components/menu`         | `<Menu.Root><Menu.Trigger>…</Menu.Trigger><Menu.Content><Menu.Item …>…</Menu.Item></Menu.Content></Menu.Root>`                                     |
| dropdown-menu                 | ✅   | `@kumiki/components/menu`         | 同上 (`<Menu.Content>` がこれに対応)                                                                                                               |
| dropdown-menu-item            | ✅   | `@kumiki/components/menu`         | `<Menu.Item value="copy" onSelect={…}>コピー</Menu.Item>`                                                                                          |
| dropdown-trigger              | ✅   | `@kumiki/components/menu`         | `<Menu.Trigger>{@render trigger()}</Menu.Trigger>`                                                                                                 |
| form/checkbox                 | ✅   | `@kumiki/components/checkbox`     | `<Checkbox.Root bind:checked /><Checkbox.Indicator />`                                                                                             |
| form/radio-button             | ✅   | `@kumiki/components/radio-group`  | `<RadioGroup.Root bind:value><RadioGroup.Item value="x"/></RadioGroup.Root>` (単独でも 1-item でラップ)                                            |
| form/switch                   | ✅   | `@kumiki/components/switch`       | `<Switch.Root bind:checked />`                                                                                                                     |
| form/combobox/single-combobox | ✅   | `@kumiki/components/combobox`     | `<Combobox.Root {options} bind:value><Combobox.Input/><Combobox.List/></Combobox.Root>`                                                            |
| form/number-input             | ✅   | `@kumiki/components/number-field` | `<NumberField.Root bind:value min={0} step={1}><NumberField.Input/></NumberField.Root>`                                                            |
| form/date-input               | ✅   | `@kumiki/components/date-picker`  | `<DatePicker.Root bind:value><DatePicker.Trigger/><DatePicker.Calendar/></DatePicker.Root>`                                                        |
| form/field                    | ✅   | `@kumiki/components/form-field`   | `<FormField.Root validator={schema} name="email"><FormField.Label>…</FormField.Label><FormField.Input/><FormField.ErrorMessage/></FormField.Root>` |
| form/input                    | ✅   | `@kumiki/components/form-field`   | `<FormField.Input type="text" />` (単独 input は素の `<input>` で OK)                                                                              |
| form/text-input               | ✅   | `@kumiki/components/form-field`   | 同上 — kumiki は意味的に "FormField の Input" として扱う                                                                                           |
| form/textarea                 | ✅   | `@kumiki/components/form-field`   | `<FormField.Input as="textarea" rows={4} />`                                                                                                       |
| toggle-button                 | ✅   | `@kumiki/components/toggle`       | `<Toggle.Root bind:pressed>太字</Toggle.Root>`                                                                                                     |
| table                         | ✅   | `@kumiki/components/table`        | `<Table.Root><Table.Header><Table.Row>…</Table.Row></Table.Header><Table.Body>…</Table.Body></Table.Root>` (semantic; ADR 0015)                    |

### 4.2 Phase 1.5 で実装完了 (⚠️ 新規) — 今 sprint 終了時点で全件 merge 済み

| flyle                        | 状態 | kumiki                                        | 最小コード片                                                                                                                                                                              |
| ---------------------------- | ---- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| alert                        | ⚠️   | `@kumiki/components/alert`                    | `<Alert.Root severity="warning">本文</Alert.Root>`                                                                                                                                        |
| badge                        | ⚠️   | `@kumiki/components/badge`                    | `<Badge.Root variant="primary">99+</Badge.Root>`                                                                                                                                          |
| breadcrumb                   | ⚠️   | `@kumiki/components/breadcrumb`               | `<Breadcrumb.Root><Breadcrumb.Link href="/">Home</Breadcrumb.Link><Breadcrumb.Separator/>…</Breadcrumb.Root>`                                                                             |
| pagination                   | ⚠️   | `@kumiki/components/pagination`               | `<Pagination.Root total={100} pageSize={10} bind:page><Pagination.Prev/><Pagination.PageList/><Pagination.Next/></Pagination.Root>`                                                       |
| chips                        | ⚠️   | `@kumiki/components/chips`                    | `<Chips.Root variant="static">タグ</Chips.Root>`                                                                                                                                          |
| chips-with-close             | ⚠️   | `@kumiki/components/chips`                    | `<Chips.Root variant="dismissible" onDismiss={…}>タグ</Chips.Root>`                                                                                                                       |
| loading-spinner              | ⚠️   | `@kumiki/components/loading-spinner`          | `<LoadingSpinner.Root size="md" aria-label="読み込み中" />`                                                                                                                               |
| definition-list              | ⚠️   | `@kumiki/components/definition-list`          | `<DefinitionList.Root layout="grid"><DefinitionList.Term>名前</DefinitionList.Term><DefinitionList.Description>太郎</DefinitionList.Description>…</DefinitionList.Root>`                  |
| horizontal-rule              | ⚠️   | `@kumiki/components/horizontal-rule`          | `<HorizontalRule.Root orientation="horizontal" />`                                                                                                                                        |
| avatar                       | ⚠️   | `@kumiki/components/avatar`                   | `<Avatar.Root><Avatar.Image src={…}/><Avatar.Fallback>YT</Avatar.Fallback></Avatar.Root>`                                                                                                 |
| avatar-group                 | ⚠️   | `@kumiki/components/avatar-group`             | `<AvatarGroup.Root max={3}>{#each users as u}<Avatar.Root>…</Avatar.Root>{/each}</AvatarGroup.Root>`                                                                                      |
| icon-button                  | ⚠️   | `@kumiki/components/icon-button`              | `<IconButton.Root aria-label="削除" variant="danger">{@render trash()}</IconButton.Root>` (Phase 1.5 B-1)                                                                                 |
| text-button                  | ⚠️   | `@kumiki/components/button`                   | `<Button.Root variant="ghost">編集</Button.Root>` (text-button は Button の ghost variant)                                                                                                |
| filter-button                | ⚠️   | `@kumiki/components/button`                   | `<Button.Root variant="ghost" data-active={isActive}>フィルター</Button.Root>` (Toggle と Button のどちらでも OK)                                                                         |
| drawer                       | ⚠️   | `@kumiki/components/dialog`                   | `<Dialog.Root><Dialog.Content side="right" width="360px">…</Dialog.Content></Dialog.Root>` (Phase 1.5 B-2 で `side` prop 追加)                                                            |
| toggle-button-group          | ⚠️   | `@kumiki/components/toggle`                   | `<Toggle.Group multiple bind:value>{#each items as i}<Toggle.GroupItem value={i.id}>…</Toggle.GroupItem>{/each}</Toggle.Group>` (Phase 1.5 B-3)                                           |
| form/datetime-input          | ⚠️   | `@kumiki/components/datetime-field`           | `<DateTimeField.Root bind:value granularity="minute">…</DateTimeField.Root>` (Phase 1.5 B-4)                                                                                              |
| form/time-input              | ⚠️   | `@kumiki/components/time-field`               | `<TimeField.Root bind:value granularity="minute">…</TimeField.Root>` (Phase 1.5 B-4)                                                                                                      |
| popconfirm                   | ⚠️   | `@kumiki/components/popover/with-confirm`     | `<PopoverConfirm.Root onConfirm={…}><PopoverConfirm.Trigger>削除</PopoverConfirm.Trigger><PopoverConfirm.Content>本当に？</PopoverConfirm.Content></PopoverConfirm.Root>` (Phase 1.5 B-5) |
| form/combobox/multi-combobox | ⚠️   | `@kumiki/headless/combobox/with-multi-select` | `import { combobox } from '@kumiki/headless/combobox'; import { withMultiSelect } from '@kumiki/headless/combobox/with-multi-select'; const c = withMultiSelect(combobox({…}));`          |

(Toolbar B-6 は flyle 側で直接対応する 1:1 ディレクトリがないが、editor toolbar の置換時に `@kumiki/components/toolbar` で APG roving tabindex 付きのものを使う。)

### 4.3 ❌ kumiki 側で受けない — flyle 側残置 or 他 lib

[ADR 0014/0015/0016](../design/16-decisions/) と
[`docs/design/17-integration-boundaries.md`](../design/17-integration-boundaries.md) の方針に従う。

| flyle                  | 状態 | 方針                                                                                                                                                |
| ---------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| editor                 | ❌   | tiptap / Lexical / ProseMirror で flyle 側に残す。Toolbar 部分は `@kumiki/components/toolbar` を組み込む                                            |
| sortable               | ❌   | dnd-kit-svelte / sortablejs を flyle 側で継続利用 (ADR 0016)                                                                                        |
| icon                   | ❌   | flyle 側で Lucide / 自作 SVG snippet を継続利用 (ADR 0014)                                                                                          |
| decorative-icon        | ❌   | 同上 — `aria-hidden="true"` で装飾扱い                                                                                                              |
| color-palette          | ❌   | UI utility — flyle 内で `<button>` + `data-color` の素朴実装で OK                                                                                   |
| environment-ribbon     | ❌   | flyle 専用の運用バナー — kumiki に汎用化する価値が薄い                                                                                              |
| page-header            | ❌   | flyle 内で `<header>` + Breadcrumb + Button の合成レシピ。kumiki に専用 component を追加しない                                                      |
| sidebar                | ❌   | flyle 内で `<nav>` + Menu の合成。Sidebar 全体の振る舞い (collapse / pin) はアプリ要件次第で UI 差が大きい                                          |
| upload-progress        | ❌   | flyle 内で `<progress>` + Toast の合成レシピ                                                                                                        |
| `@shared` (内部 utils) | ❌   | flyle 専用 utility (`focus-trap.svelte.ts`, `useRangeSelection.svelte.ts` 等) — kumiki primitives に同等品あり (`@kumiki/primitives/focus-trap` 等) |

### 4.4 ◯ 既存 kumiki primitive で吸収できる — 合成レシピ

| flyle            | 方針                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| text             | kumiki に専用 Text なし。`<h1 class="text-heading-20">…</h1>` 等 semantic HTML + flyle CSS class で OK |
| highlight        | `<mark>…</mark>` で意味的に十分                                                                        |
| card-select      | `<RadioGroup.Root>` + 各 `<RadioGroup.Item>` を `<label>` + Card UI でラップする合成                   |
| avatar-with-text | `<Avatar.Root>…</Avatar.Root>` の右に `<span>` を並べる合成 (CSS は flyle 側 1 ファイル)               |

### 4.5 件数まとめ

| 状態                            | 件数                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| ✅ Phase 1 で直接置換可能       | 22                                                                                       |
| ⚠️ Phase 1.5 で実装完了         | 19                                                                                       |
| ❌ Kumiki 範囲外 (flyle 側残置) | 10                                                                                       |
| ◯ 合成レシピで吸収              | 4                                                                                        |
| **合計**                        | **45** (重複差分あり: 例えば `dropdown` と `dropdown-trigger` は同じ kumiki/menu に集約) |

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

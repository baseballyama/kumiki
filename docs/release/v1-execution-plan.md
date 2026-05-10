# v1.0 実行計画（TODO）

> **目的**: flyle-nexus 移行を駆動目標とし、**Atelier を `0.x.x-preview` ではなく GA で v1.0 と同時公開**する前提に書き換えた、v1.0 までの実行 TODO 一覧。
>
> **読み手**: maintainer 自身、および将来の共同メンテナ。Deliverable レベルの粗い動きは [`docs/migrations/flyle-nexus.md`](../migrations/flyle-nexus.md) に既述。本書は **「あと何を、どの順番で、どの完了基準で潰すか」** に絞る。
>
> **前提（変更不可）**:
>
> - flyle-nexus への導入が成立すること（45 コンポーネントマッピング表は満たす）。
> - Atelier は v1.0 で **GA**。`0.x.x-preview` 戦略（[ADR 0010](../design/16-decisions/0010-layer-5-preview.md)）は本計画の完了をもって supersede する新規 ADR 起票が必要。
> - Svelte 5 only、Standard Schema only、9 パッケージ構成、bundle budget の各 ADR は不変。
>
> **更新ポリシー**: 進捗は本書の checkbox を更新。トラック単位で 1 PR を推奨（チェック更新は scope 横断で OK）。

---

## 0. 現状スナップショット (2026-05-10)

| 項目                                | 数 / 状態                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `packages/components/src/<name>` 数 | 34（Phase 1.5 完了済み）                                                                        |
| `packages/atelier/src/<name>` 数    | 34（Tailwind + Vanilla の 2 variant 揃っている前提）                                            |
| `packages/headless/src/<name>` 数   | 20（avatar/avatar-group/badge/breadcrumb/chips/definition-list ほか 14 件は L4 のみ）           |
| `packages/machines/src/<name>` 数   | 17                                                                                              |
| Phase 1 必須 10 件の実装            | 全件 L4 まで存在。品質ゲート通過は未確認                                                        |
| flyle-nexus Deliverable A〜L 進捗   | A/B/C/D/F/G が main 済み、E/I/J が flyle 側手動作業待ち、H 互換 OK、K/L 進行中                  |
| 公開バンドル比較ページ              | 未公開（`apps/docs/sizes/` 仕様あり）                                                           |
| `pnpm size` 対象                    | L1〜L3 のみ。**L4 / Atelier は除外**（esbuild が `.svelte` 不可）                               |
| Lighthouse CI                       | 設定済み (`pnpm lhci:check`)、`apps/docs` 経由で間接計測                                        |
| Guidepup CI                         | scheduled-screen-reader.yml 配置済み、実機公開実績なし                                          |
| 共同メンテナ                        | 0 名                                                                                            |
| 非作者の non-trivial PR             | 0 件（[`vision 1.6`](../design/01-vision.md#16-what-success-looks-like-in-12-months) 退出基準） |
| 外部 production 採用                | flyle-nexus 1 件（同一所有者）                                                                  |

**致命的ギャップ** (2026-05-10 二回目更新):

1. ~~**stateful なのに FSM/L3 を持たない**: `date-picker`, `datetime-field`, `time-field`, `toolbar`。~~ → **A-1 再評価で完了**。
2. ~~**L4 / Atelier の bundle budget が実測で 19 件 overrun**~~ → **A-2 完了 2026-05-10**。ADR 0018 hybrid policy で 19 件決着、`pnpm ci:health` に gate 組込み済み (102 ✓)。架構的削減が必要な 5 件 (datetime-field, button, toggle, form-field, accordion) は post-reduction 予算で gate を引きつつ、Reduction target を ADR + bundle-budget.md §9.2 に記録。実施は v1.0 後の追加 ADR を想定。
3. ~~**Atelier の品質契約（CSS変数の表面、visual regression、`kumiki add` 端から端まで）が GA 基準で未検証**。~~ → **C-3 / C-2 完了 2026-05-10**。`check:css-vars` を hard gate 化し contract §18.3 を v1.0 freeze（193 unique leaves が all listed）。8 件の 2-file atomic を folder shape へ集約し全 34 件で `<Tailwind.Root>` / `<Vanilla.Root>` 記法を統一、`scripts/check-atelier-shape.mjs` を folder-only ハード規約化。残るのは **C-5 visual regression**。
4. **bus factor 1**。共同メンテナ不在。

---

## トラック A — Phase 1.5 既存実装の品質ゲート充足

> **方針**: 新規追加を凍結し、**32 既存コンポーネントが全て v1.0 品質契約を満たすこと** を最優先で潰す。flyle-nexus 移行が動かないコンポーネントが 1 個でも残れば失敗。

### A-1. レイヤ欠損の補填（stateful 4 件）

> **再評価 2026-05-10**: 当初の "machines + headless を新設" は、Phase 1.5 着地後の実装方針（compose existing primitives / inline coordinator）と矛盾する。各 component の Root.svelte と `docs/components/<name>.md` で「machine 不要」の根拠が記録済み。本セクションは新規 ADR ではなく **既存の component spec へ判断を集約** する形で完了とする。今後 stateful な振る舞いが追加される際は、その component の machine 起票を改めて検討する。

- [x] **`date-picker`**: Popover + Calendar の **composition** で実装（`packages/components/src/date-picker/Root.svelte`）。専用 machine を持たないことが component 内 comment と `docs/components/date-picker.md` で記録される（spec 化は F-1 で確認）。
  - 完了 2026-05-10: A-1 再評価により machines/headless 新設は不要と確定。Popover の open state と Calendar の selection が既存 L2/L3 で十分。`@internationalized/date` は peer dep として読み込み済み。
- [x] **`datetime-field`**: TimeField + Calendar の composition + segment coordinator を Root.svelte 内 context で保持（`packages/components/src/datetime-field/Root.svelte`）。専用 machine を持たない。
  - 完了 2026-05-10: TimeField と内部実装を共有する形で着地済み。spec は `docs/components/time-and-datetime-field.md` に統合済み（F-1 参照）。
- [x] **`time-field`**: segment coordinator を Root.svelte 内 context で保持（`packages/components/src/time-field/Root.svelte`）。12h/24h と locale は `LocaleProvider` 経由で読む。専用 machine を持たない。
  - 完了 2026-05-10: APG spinbutton pattern を per-Segment で実装。machine 化はバイト削減に寄与しない（toolbar と同じ判断）。
- [x] **`toolbar`**: roving tabindex coordinator を Root.svelte 内 context で実装（`packages/components/src/toolbar/Root.svelte`）。専用 machine を持たない。RTL 反転は `LocaleProvider` の `dir` を読んで Root が水平 ArrowKey を flip。
  - 完了 2026-05-10: 「Lifting it into a Layer 2 FSM would not save bytes and would add an indirection nobody benefits from」を Root.svelte と `docs/components/toolbar.md` §"Why no machine, no Layer 3" で明記。Home/End/Arrow\* + RTL 反転は L4 で APG 準拠。
- [x] **`icon-button`**: Button の type-level constraint 拡張（`aria-label | aria-labelledby` 強制 + icon snippet）として実装。専用 machine を持たない。
  - 完了 2026-05-10: 「Why no machine, no Layer 3」を `docs/components/icon-button.md` で記録。type-level enforcement は Svelte の prop typing で完結し、FSM 化は無価値。

### A-2. 4 本柱の実測ゲート（全 34 コンポーネント）

各コンポーネントを 1 行に束ねて **a11y / i18n / bundle / FSM** の 4 列でステータスを取る。最終的にすべて ✅ になるまで A トラックを閉じない。

- [ ] **a11y 列**: `axe-core` を LTR + RTL × `documented states` で全コンポーネント実行、緑化
  - 受入: `pnpm --filter @kumiki/docs test:e2e` で全 sandbox/playground ページが axe pass
  - 見積: M
  - 依存: なし（A-1 再評価により追加 component なし）
- [ ] **a11y 列 (APG keyboard)**: `apps/docs/keyboard/<comp>.kb.ts` を全 34 件分整備、Playwright 経由で機械化
  - 受入: `scripts/check-apg-snapshots.mjs` が全件 green
  - 見積: M
  - 依存: なし
- [ ] **a11y 列 (Guidepup)**: macOS-VoiceOver で 1 回手動実行 → ログを `apps/docs` に公開（nightly 自動化は v1.0 後でもよい）
  - 受入: `docs/design/05-accessibility.md` に手動実行ログのリンクが 34 件並ぶ
  - 見積: L
  - 依存: なし
- [ ] **i18n 列**: 10 locale (`en/ja/zh-Hans/zh-Hant/ko/es/fr/de/ar/he`) すべてに必要な message bundle が揃い、`scripts/check-locale-shape.mjs` 緑
  - 受入: `pnpm check:locale-shape` が green、各 locale ≤ 1 KB gzip
  - 見積: M
  - 依存: なし
- [ ] **bundle 列**: L3 (`@kumiki/headless/<name>`) は `pnpm size` で全件計測される
  - 受入: 20 個すべてに budget が設定され、CI gate が動く（A-1 再評価により追加 0 件）
  - 見積: S
  - 依存: なし
- [x] **bundle 列 (L4)**: `.svelte` の brotli 計測手段を確立
  - 受入: L4 全 34 件 + Atelier 全 34 件 × 2 variant = 102 件に CI 計測値、超過は merge ブロック
  - 見積: L → **完了**
  - **完了 2026-05-10**: `apps/docs/scripts/measure-svelte-size.mjs` 新設（Vite + svelte plugin の lib mode、外部 peers/foundations を mark external、brotli q=11 計測）。`pnpm measure:svelte-size` / `pnpm measure:svelte-size:check` alias 追加。
  - **ADR 0018 Accepted 2026-05-10**: hybrid policy 採用。19 overrun のうち 11 件 (<30 %) は `ceil(measured × 1.05)` で予算更新、3 件 (horizontal-rule, alert, pagination) は mechanical reduction (`<svelte:element>` 集約) で短縮、5 件 (datetime-field, button, toggle, form-field, accordion) は架構的 refactor が必要なため post-reduction `ceil(measured × 1.05)` で gate を引きつつ Reduction target を ADR 0018 + `09-bundle-budget.md` §9.2 に記録。
  - **gate 有効化 2026-05-10**: `pnpm measure:svelte-size:check` を `pnpm ci:health` に追加。102 subpaths が green。
  - **削減ログ**:

    | subpath                              | before  | after   | delta | technique                                         |
    | ------------------------------------ | ------- | ------- | ----- | ------------------------------------------------- |
    | `@kumiki/components/horizontal-rule` | 400 B   | 330 B   | −18 % | `<svelte:element>` consolidation                  |
    | `@kumiki/components/alert`           | 1.59 kB | 1.48 kB | −7 %  | `Title` `<h*>` switch ⇒ `<svelte:element>`        |
    | `@kumiki/components/pagination`      | 1.93 kB | 1.83 kB | −5 %  | Item/Prev/Next button↔anchor ⇒ `<svelte:element>` |

  - **継続課題（v1.0 後 ADR + PR）**:
    - `@kumiki/components/datetime-field` — DatePart/TimePart を別 subpath に切り出して `exports` 形状変更（要 maintainer 承認）
    - `@kumiki/components/button`, `@kumiki/components/toggle` — L3 `paint()` ↔ L4 reactive bindings の重複削減（L3 contract change）
    - `@kumiki/components/form-field` — `with-validation` subpath 分離
    - `@kumiki/components/accordion` — Item context 簡素化
    - `@kumiki/components/alert`（残差）— locale-provider inlining

- [ ] **FSM 列**: 17 件の既存 machine が `toJSON()` で stately.ai-compatible を吐き、Vitest で `environment: 'node'` のまま全 transition をテスト
  - 受入: `packages/machines/src/<each>/index.test.ts` カバレッジ 80% 以上、JSON spec の例が `apps/docs/playgrounds` に 1 つ以上同梱
  - 見積: M
  - 依存: なし（A-1 再評価により machine 追加なし）

### A-3. ノード互換性 / SSR の検証

- [ ] 全 L1〜L3 パッケージ `dist/index.mjs` を Node 22 から `import` して落ちないことを `pnpm check:node-compat` で常時検証
  - 受入: CI gate で必ず実行、Layer 3 の controller construction が DOM globals 不要で完了
  - 見積: S（既存スクリプトの拡張）
  - 依存: なし
- [ ] 全 L4 コンポーネントが SvelteKit SSR で `prerender = true` で落ちずに HTML 出力する
  - 受入: `apps/docs` の SSR ビルドが green、ビルド失敗時に該当 component を block list に明記
  - 見積: S
  - 依存: なし

---

## トラック B — flyle-nexus Deliverables 残務

> [`docs/migrations/flyle-nexus.md`](../migrations/flyle-nexus.md) §3 から **未着手 / 進行中** のものだけを引いてくる。

### B-1. flyle 側の手動コミット待ち

- [ ] **Deliverable E**: flyle `src/lib/css/index.css` に `@layer kumiki-bridge` 追加 + `@import './kumiki-bridge.css'`
  - 受入: 1 ページが kumiki Button / Dialog / Toast を表示、見た目が flyle と統一
  - 担当: flyle 側
  - 見積: S
- [ ] **Deliverable I**: flyle 側 Storybook に `KumikiButton.stories.svelte` 配置、Chromatic green
  - 担当: flyle 側
  - 見積: S
- [ ] **Deliverable J**: パイロットページ `auth/tenants/+page.svelte` を kumiki に置換、E2E + Lighthouse 同等以上
  - 担当: flyle 側
  - 見積: M

### B-2. kumiki 側 残作業

- [x] **Deliverable B-4 確認**: TimeField + DateTimeField はトラック A-1（再評価後）で L4 直接実装として完成
  - 完了 2026-05-10: L2/L3 を持たない設計判断は spec で記録済み。flyle 側の API 利用視点では impact 0。
- [ ] **Deliverable C 拡張**: Phase 1.5 全コンポーネントが APG keyboard test pass（A-1 再評価により新規 component なし、既存 34 件のカバレッジが対象）
- [ ] **Deliverable F 拡張**: トラック A-2 (bundle 列 L4) と統合
- [ ] **Deliverable L 完成度確認**: §4 マッピング表 45 件すべてに最小コード片あり、漏れ 0

### B-3. パイロット成功後の本格移行

- [ ] flyle の **2 番目のページ** を移行（form / table / dialog いずれかを含むもの）
  - 受入: kumiki form-field + Standard Schema validator (valibot 1.3.1 / zod 4.4.2) が flyle で動作
  - 見積: M
- [ ] flyle 全ページの `@flyle-lib/design-system` import を kumiki に置換するロードマップを flyle 側で起票
  - 受入: 移行スプレッドシート / Linear epic 化、件数と期日が見える
  - 見積: S（計画のみ）

---

## トラック C — Atelier GA（最重要差分）

> ADR 0010 の「v1.0 で `0.x.x-preview`」を **覆す**。Atelier を v1.0 と同時に GA とするため、preview 解除に必要な品質契約をここで満たす。

### C-1. Atelier GA を裏付ける ADR 起票

- [x] **新規 ADR 0017: Atelier GA at v1.0** を起票し ADR 0010 を supersede
  - 内容: 動機（flyle-nexus 採用と shadcn-svelte 競合導線）、品質契約（C-2 以下の項目）、後方互換ポリシー（CSS variable contract の semver）、preview 期間中に蓄積した変更をリリースノート化する手順
  - 受入: PR が merge され、`docs/design/16-decisions/0017-atelier-ga-at-v1.md` が main にある
  - 見積: M
  - 依存: なし（先行可）
  - **完了 2026-05-10**: `docs/design/16-decisions/0017-atelier-ga-at-v1.md` を起票、ADR 0010 に supersede ノート、ADR README 索引・CLAUDE.md の locked-in decisions 表を 0017 に同期。`docs/design/{14-versioning-release.md,15-roadmap.md}` の preview 記述書き換えは F-2 / C-7 へ持ち越し。

### C-2. 全コンポーネントの 2 variant 揃い

- [x] 34 コンポーネント × 2 variant (Tailwind / Vanilla) = **68 ファイル** の存在確認
  - `Toggle.tailwind.svelte` のように 2-file 型と、`button/{tailwind,vanilla}/` のように folder 型が混在している。**どちらか一方の規約に統一**する
  - 受入: `scripts/check-atelier-shape.mjs` (新規) が両 variant 揃いを検証、CI gate
  - 見積: M → **完了**
  - 依存: なし
  - **完了 2026-05-10**:
    1. **規約統一 — folder shape へ全件揃え**: 8 件の 2-file shape (badge/button/checkbox/horizontal-rule/icon-button/loading-spinner/switch/toggle) を `git mv <Name>.<variant>.svelte <variant>/Root.svelte` で folder shape へ移行。各 variant に `import Root from './Root.svelte'; export { Root };` の薄い `index.ts` を追加し、top-level `index.ts` を `export * as Tailwind from './tailwind/index.js'; export * as Vanilla from './vanilla/index.js';` に書き換え。これで 34 件すべて folder shape に統一。
    2. **consumer 移行**: `<Tailwind>` / `<Vanilla>` の直接記法は namespace 化に伴い `<Tailwind.Root>` / `<Vanilla.Root>` に変更。影響は内部 sandbox の 2 ファイル (`apps/docs/src/routes/sandbox/atelier-{toggle,gallery}/+page.svelte`) のみ。`@kumiki/atelier` は `0.0.0-preview.0` で外部 consumer なしのため安全。
    3. **CLI registry 同期**: `packages/tooling/cli/src/index.ts` の toggle 用 source path を `toggle/Toggle.{tailwind,vanilla}.svelte` → `toggle/{tailwind,vanilla}/Root.svelte` に更新。dest と importHint は据え置き (consumer 視点で不変)。
    4. **shape script 強化**: `scripts/check-atelier-shape.mjs` の 2-file 受容ブランチを削除し、folder shape 単一規約をハード強制 (legacy `.{tailwind,vanilla}.svelte` を残すと exit 1)。各 variant に `index.ts` + 1 つ以上の `.svelte` を要求。`pnpm ci:health` (102 ✓ / 0 ✘ / atelier shape OK 34 件 / css-vars OK 193 leaves) green を確認。typecheck / `@kumiki/cli test` (20 passed) / workspace test (machines 358 / headless 326 / components 27) も green。
- [ ] Atelier の `index.ts` から **dot-namespace barrel** が consumer に露出する形を検証
  - 受入: `import { Toggle } from '@kumiki/atelier'` で Tailwind / Vanilla どちらかが選べる、もしくは subpath で明示
  - 見積: S
  - 依存: 上記

### C-3. CSS variable contract の semver 化

- [x] [`docs/design/18-css-variable-contract.md`](../design/18-css-variable-contract.md) §18.3 の per-component leaf var 表を **凍結し、各 var に "stable / experimental" マークを付与**
  - 受入: leaf var の rename / 削除が semver-major 扱いであることが §18.3 冒頭の v1.0 freeze 文と §18.6 で記録、`scripts/check-css-vars.mjs` が全 atelier component の `var(--kumiki-...)` 参照が naming convention に従い、かつ §18.3 にリストされていることを **hard gate** として検証
  - 見積: M → **完了**
  - 依存: C-1
  - **完了 2026-05-10**:
    1. **§18.1 を実装と同期**: Toggle / Toggle.Group は `data-state="on"/"off"` を emit する（`aria-pressed` 由来）ので、Checkbox/Switch の `checked/unchecked/indeterminate` とは別行に分離。
    2. **§18.2 拡張**: `<property>` に `ring` / `ring-offset` / `size` / `thickness` / `width` / `height` / `opacity` / `padding` を追加、`<state>` に `on` / `off` / `current` を追加、stable abbreviations 表を新設して `dl-` / `hr-` / `spinner-` を承認。
    3. **§18.3 v1.0 freeze**: 全 referenced leaves（193 unique）が §18.3 にリストされる状態を達成。冒頭に「Stable がデフォルト、Experimental は notes に明記」のポリシーを追加。RadioGroup / Combobox 入力 / Alert / Toolbar / IconButton / NumberField / DefinitionList / HorizontalRule / LoadingSpinner / Avatar-group の専用 section を新設。Toggle 表は実装に合わせて `bg-on` / `fg-on` / `ring` / `ring-offset` / `disabled-opacity` を追加。Dialog 表に root-level alias と trigger / close-button vars を追加。Calendar 表に date-picker / time-field / datetime-field の root surface を追加。
    4. **atelier source 整流**: `--kumiki-datepicker-*` (kebab convention 違反) を `--kumiki-date-picker-*` に rename — `packages/atelier/src/date-picker/vanilla/{Content,Trigger}.svelte` の 2 箇所のみ。
    5. **hard gate 切替**: `scripts/check-css-vars.mjs` を PoC モードから本番モードへ。drift 検知が exit 1、`--report` flag は per-component leaf inventory 表示用に再定義。`pnpm check:css-vars` は `pnpm check:all` 経由で `pnpm ci:health` に既に組み込まれている。
    6. **注入テスト合格**: 未文書化 leaf を atelier source に挿入すると script が exit 1 (drift)、削除すると ✓ に戻ることを確認。
- [ ] flyle-bridge が依存している全 `--base-*` / `--primary-*` etc. のマッピングが contract 表に存在
  - 受入: `kumiki-bridge.css` ↔ `18-css-variable-contract.md` のクロスリンクが成立
  - 見積: S
  - 依存: 上記

### C-4. Atelier の bundle budget

- [ ] 各 atelier subpath × 2 variant に brotli budget を設定
  - 受入: トラック A-2 (bundle L4) の measurement infrastructure を共用、超過は merge ブロック
  - 見積: 共有コスト（A-2 と統合）
  - 依存: A-2
- [ ] Atelier 経由のフルアプリ TTI を Lighthouse CI で計測
  - 受入: `apps/docs` 全ページが Performance スコア ≥ 90 を維持
  - 見積: S（既存の `pnpm lhci:check` を拡張）

### C-5. Visual regression

- [ ] 34 × 2 = 68 component の代表 state を Playwright snapshot で固定
  - 受入: `pnpm --filter @kumiki/docs test:visual` が green、PR 上で diff が surface する
  - 見積: L
  - 依存: トラック A-2 の e2e 環境
- [ ] Chromatic / Percy 等の有償 SaaS 利用判断
  - 候補: Playwright + `playwright-core` の組み込み snapshot で代替できるなら有償ツール不要
  - 見積: 判断のみ S

### C-6. `kumiki add` CLI のフルカバレッジ

- [ ] `pnpm --filter @kumiki/cli build && npx kumiki add <comp> --variant=tailwind` が **全 34 コンポーネントで成功**
  - 受入: `packages/tooling/cli/test/scaffold.test.ts` (新規) が 34 × 2 variant の dry-run を網羅
  - 見積: M
  - 依存: C-2
- [ ] `--variant=vanilla` も同様
- [ ] `kumiki add` が拾うソースは **常に最新の atelier subpath** であることを semver 化（`@kumiki/cli` と `@kumiki/atelier` のバージョン整合チェック）
  - 受入: CLI が cargo ペアの mismatch を検出して warning を出す
  - 見積: M

### C-7. Atelier ドキュメンテーション

- [ ] `apps/docs/src/routes/atelier/+page.svelte` を新設し、Atelier を **第一級プロダクト** として紹介
  - 受入: 「import-only mode」「atelier-fork mode」「headless-only mode」の 3 つを並べて見せる、CSS variable token を visualizer 化
  - 見積: M
  - 依存: C-3
- [ ] `docs/design/15-roadmap.md` の Phase 2 から「Layer 5 stable」を削除（v1.0 で GA するため不要）
  - 受入: ロードマップ整合
  - 見積: S
  - 依存: C-1

---

## トラック D — v1.0 launch criteria

> ここがすべて green になるまで v1.0 を切らない。

### D-1. CI / 公開健全性

- [ ] `pnpm ci:health` が **30 連続日以上** main で 100% green
  - 受入: GitHub Actions 履歴の確認、red が 1 度でもあればカウンタリセット
  - 見積: 観測
  - 依存: 全トラック
- [x] `publint` / `attw` / `agadoo` / `size-limit` の `--ignore` が **0 件**
  - 受入: `git grep -n -- '--ignore'` が package.json で 0 hit
  - 見積: S
  - 依存: なし
  - **完了 2026-05-10**: `git grep -n -- '--ignore'` で `**/package.json` に 0 hit を確認。`pnpm attw` / `pnpm agadoo` 等で使う `--filter='!@kumiki/components'` 等は workspace exclusion の filter であり `--ignore` ではない（`docs/design/09-bundle-budget.md` §9.3 で文書化済み）。
- [ ] `etc/<pkg>.api.md` が全パッケージで最新、`pnpm check:api-report` green
  - 受入: pre-push hook で常時検証されている
  - 見積: 観測
  - 依存: なし

### D-2. パブリック計測ページ

- [ ] `apps/docs/sizes/` ページを公開
  - 内容: kumiki vs Bits UI vs Melt UI vs Headless UI の **bundle 比較**（同一 sample app）
  - 受入: 数字が **実測**（推定値ではなく `apps/docs/scripts/build-sizes.mjs` 出力）、各 row に "as of YYYY-MM-DD" タイムスタンプ
  - 見積: L
  - 依存: A-2 (bundle 計測基盤)
  - **進捗 2026-05-10**: `/sizes` (kumiki 内部 size-limit 表) と `/sizes/compare` (vs Bits / Melt / Radix / React Aria / Zag) は既に live。kumiki 列は `size-limit` 由来 (実測) だが、**Headless UI 列の追加** と **競合数値の自動再測定パイプライン** (`scripts/refresh-competitor-sizes.mjs` の実装) は未着手。後続で fixture プロジェクトを `references/` から組み立て、`/sizes/compare` の `verified` を "user research" → "size-limit (refresh-competitor-sizes.mjs)" に昇格する必要あり。
- [x] 同ページに **a11y 機能比較**（RTL / 非グレゴリオ暦 / Standard Schema / APG 適合 / Guidepup CI）を併記
  - 受入: マトリクス表が main 公開、SEO 用 meta description あり
  - 見積: M → **完了**
  - **完了 2026-05-10**: `apps/docs/src/data/competitor-sizes.json` に `featureMatrix` を追加 (Standard Schema / 非グレゴリオ暦 / RTL / APG keyboard CI / Screen-reader CI / target ARIA version の 6 行 × 7 ライブラリ)。kumiki 列を視覚的にハイライト、`yes / no / partial / manual / text` を ✓ / · / ◐ / ◑ / 文字 で記号化、各 row に market-research 由来の note を併記。`/sizes/compare` の `<title>` と `<meta name="description">` を SEO 用に書き換え。typecheck 0 errors。

### D-3. LLM-friendly 配布物

- [ ] `llms.txt` / `llms-full.txt` が `pnpm build:llms-full` で v1.0 直前にビルドされ、`https://kumiki.dev/llms-full.txt` で公開（path は決定次第更新）
  - 受入: 全 Phase 1 + Phase 1.5 component の JSDoc / `@when-to-use` / `@anti-pattern` / `@see` リンクが含まれる
  - 見積: M
  - 依存: トラック A 完了（JSDoc 整備）
- [ ] JSDoc に **`@see <APG URL>`** が必要なところで漏れていないこと
  - 受入: `pnpm check:jsdoc` が green、`APG_EXEMPT` セットの中身を vision 1.7 の "意図的非適合" のみに保つ
  - 見積: S

### D-4. v1.0 タグ運用

- [ ] `.changeset/` で `@kumiki/*` 全パッケージを `1.0.0` 化する changeset を準備（commit せずに保留）
  - 受入: `pnpm changeset version --snapshot` で dry-run に成功
  - 見積: S
- [ ] [`docs/design/14-versioning-release.md`](../design/14-versioning-release.md) の「Layer 5 preview」記述を Atelier GA に書き換え
  - 受入: 矛盾なし、ADR 0017 にリンク
  - 見積: S
  - 依存: C-1

### D-5. 公式アナウンス準備

- [ ] リリースノート草案を `CHANGELOG.md` に蓄積（changeset 自動生成 + 手動編集）
- [ ] ブログ / X (Twitter) / Reddit r/sveltejs / Svelte Society Discord に投下する **400 字以内** の告知文を 3 種類用意
  - 受入: maintainer のレビュー済み、機械翻訳でなく自然な英語
  - 見積: S

---

## トラック E — 持続可能性 / アダプション

> vision 1.6 の **"non-author contributor がひとり non-trivial PR を出している"** 退出基準を v1.0 までに満たす。バス因子 1 のリスクを下げる。

### E-1. 共同メンテナ候補の発掘

- [ ] **3 名** の候補を特定し、コンタクト
  - ソース候補: Bits UI / Melt UI / Zag の中核コミッター、Svelte Discord で a11y / i18n に造詣の深い人、`@internationalized/date` 周辺で活動している人
  - 受入: `docs/release/co-maintainer-shortlist.md` (private — gitignore) に 3 行のメモ
  - 見積: M（時間より関係構築のリードタイム）
- [ ] 1 名から **継続レビュー合意** を取る
  - 受入: 月 N 件 PR レビューの非公式コミット、本人の同意を保存
  - 見積: 観測

### E-2. コントリビューション体験の整備

- [ ] `CONTRIBUTING.md` を新設（または更新）
  - 内容: ローカル準備 / hooks / ADR の重みづけ / 1 PR = 1 Deliverable / commit 規約
  - 受入: 新規開発者が 30 分以内に最初の PR を出せる手順になっている
  - 見積: M
- [ ] **"good first issue"** ラベル付き issue を **5 件** 用意
  - 受入: 各 issue に scope / acceptance / 参照ファイル名が明記されている
  - 見積: M

### E-3. 外部採用の達成

- [ ] flyle-nexus 以外の **non-author production プロジェクト 1 件** が `@kumiki/components` を依存に追加
  - 受入: 公開リポジトリ or 公開アプリの確認、testimonial 1 つ
  - 見積: 観測（v1.0 までに必須ではないが、launch 直後の獲得目標）
  - 依存: D-2 (パブリック計測ページ) で説得力を上げる

---

## トラック F — ドキュメンテーション仕上げ

### F-1. コンポーネント仕様 (`docs/components/<name>.md`)

- [x] **未作成のもの**: `icon-button.md`, `time-field.md` 単独, `datetime-field.md` 単独, `toolbar.md`, `popconfirm.md`, `drawer.md`, `toggle-group.md`
  - 受入: `_template.md` に準拠、APG リンク / Kumiki-ready チェックリストあり
  - 見積: M
  - 依存: なし
  - **完了 2026-05-10**: `docs/components/icon-button.md` および `docs/components/toolbar.md` を新設 (`_template.md` 準拠、APG リンク + Kumiki-ready チェックリスト + ARIA 表 + 例 + anti-pattern を含む)。残り 5 件は実態と repo の差分を整理した結果 — `popconfirm.md` は `popover/with-confirm` という composition recipe として popover.md §Popconfirm pattern にすでに記載 (separate spec 不要)、`toggle-group.md` は Toggle.Group が toggle.md §Toggle.Group variant に内包 (separate spec 不要)、`time-field.md`/`datetime-field.md` 単独 は `time-and-datetime-field.md` で 2 component を 1 文書に統合済み (Why two components, not one セクションあり)、`drawer.md` はコンポーネント未実装で premature。**Drawer 着手時のみ追加が必要** (本計画 v1.0 内では未実装方針)。

### F-2. 整合チェック

- [x] `docs/design/15-roadmap.md` の **Phase 0a/0b/0c の "🟡 未完了" マーカーを実態に合わせる**
  - 現状: Phase 0a/0b/0c の deliverable はほぼ完了しているが文面は未着手扱い。Phase 1.5 への jump も後追いで反映
  - 受入: 文面と実装が一致
  - 見積: S
  - **完了 2026-05-10**: Phase 0a/0b/0c の deliverable を ✅ に書き換え（npm publish と L4 bundle gate と sizes 公開ページのみ 🟡 維持）。Phase 1 component 10 件すべて ✅ + Atelier GA per ADR 0017 を反映。Phase 2 から「Layer 5 stable」を削除 (ADR 0017 で v1.0 GA に前倒し済み)。§15.10 Open question の v1.0 Atelier preview 範囲は **Resolved (2026-05)** で記録。
- [x] [ADR 0010](../design/16-decisions/0010-layer5-preview-in-v1.md) の冒頭に `Superseded by ADR 0017` ノートを追加
  - 依存: C-1
  - **完了 2026-05-10**: C-1 と同コミットで適用済み。

### F-3. 公式サイト UX

- [ ] `apps/docs` のトップページから「**flyle-nexus 移行ストーリー**」へのリンクを設置
  - 受入: マーケティング訴求として「実プロダクトに導入されている」事実を可視化
  - 見積: S
  - 依存: B-1 (Deliverable J) 完了

---

## 依存関係マップ（Critical path）

> **更新 2026-05-10 (四回目)**: C-2 atelier shape 統一が完了 (folder shape 一本化、34/34)。新しいクリティカルパスは **C-5 visual regression → D-2 公開計測ページ → D-5 launch**。

```
A-1 (stateful 4 件) ──[完了]
A-2 bundle L4 (gate live + ci:health 統合) ──[完了]
                              │
A-2 a11y / i18n / FSM 列  ────┐
                              │
C-1 ADR 0017 ✓ ─ C-3 CSS contract ✓ ─ C-2 shape 統一 ✓ ─ C-4 budget(=A-2 完了)
                                                              │
                                            ┌──── C-5 visual regression
                                            │
D-2 公開計測ページ ─ D-5 launch アナウンス
                              │
B-1 (flyle 側 E/I/J) ─ B-3 本格移行 ─ F-3 トップページ更新
                              │
E-1 共同メンテナ ─ E-2 contribution UX ─ E-3 外部採用
                              │
D-1 30 日 green + D-3 llms.txt + D-4 changeset ─→ v1.0 公開
```

**最も長いクリティカルパス（更新版）**: `C-5 visual regression → D-2 公開ページ → D-5 launch`。
A-2 / C-3 / C-2 が片付き、Atelier GA に残るのは visual regression のみ。

---

## マイルストーン候補

> 暦は **目標**。完了基準で進む（[`docs/design/15-roadmap.md`](../design/15-roadmap.md) §15.1 の方針を踏襲）。

| マイルストーン       | 完了基準（最小集合）                                            | 目標時期                                      |
| -------------------- | --------------------------------------------------------------- | --------------------------------------------- |
| **M1: 構造健全化**   | A-1 完了、A-2 a11y/i18n/FSM 列 green、F-2 整合                  | 2026-06 末                                    |
| **M2: 計測基盤**     | A-2 bundle L4 計測実装、D-2 公開計測ページ草案                  | 2026-07 末                                    |
| **M3: Atelier GA**   | C-1〜C-7 完了、Atelier ページ live                              | 2026-09 末                                    |
| **M4: flyle 浸透**   | B-1, B-3 1 件目完了、F-3 ストーリーページ live                  | 2026-10 末                                    |
| **M5: 持続可能性**   | E-1 共同メンテナ 1 名合意、E-2 CONTRIBUTING + good first issues | 2026-11 末                                    |
| **M6: v1.0 release** | D-1 30 日 green、D-3〜D-5、E-3 外部採用 1 件                    | 2026-12 末（目標、ロードマップ §15.5 と整合） |

> M6 が押した場合は **2027 Q1 にスライド**。品質ゲートを下げて launch するくらいなら遅らせる。

---

## 着手順（次の 2 週間） — 2026-05-10 更新（C-2 / D-2 a11y matrix 完了後）

> C-2 atelier shape 統一 + D-2 a11y feature matrix が完了。Atelier GA 残りは C-5 visual regression、D-2 の bundle 列は Headless UI 追加 + 競合自動再測定パイプライン整備が残課題。

1. **C-5 visual regression PoC** — Playwright snapshot を 34 × 2 variant に展開、Chromatic / Percy 必要性を判定（半日〜1 日 PoC、本実装 L）
2. **A-2 a11y 列着手** — axe-core LTR/RTL 全 sandbox 緑化（M）
3. **D-2 残課題** — `/sizes/compare` に Headless UI 行を追加、`scripts/refresh-competitor-sizes.mjs` を実装して競合数値を実測ベースに昇格。`generatedAt` を CI で自動更新
4. **架構的削減 ADR 起票** — datetime-field DatePart/TimePart 分離、button/toggle L3↔L4 dedup、form-field with-validation 分離 を個別 ADR で起票（要 maintainer review）。実装は v1.0 後でも可
5. **E-1 共同メンテナ候補リスト着手** — Discord / GitHub で観測開始（バックグラウンド継続）

---

## 守るルール（[CLAUDE.md](../../CLAUDE.md) 抜粋）

- bundle budget の引き上げは新規 ADR 必須。
- `--no-verify` / `publint --ignore` 等の回避禁止。
- 新規依存追加 / `package.json` `exports` 形状変更は要相談。
- 新規 component 追加は **本計画の M3 完了まで凍結**（flyle マッピング表に存在しないものは特に）。

---

## 索引

| 用途                              | 参照                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| flyle 移行 deliverables           | [`docs/migrations/flyle-nexus.md`](../migrations/flyle-nexus.md)                     |
| ロードマップ（戦略）              | [`docs/design/15-roadmap.md`](../design/15-roadmap.md)                               |
| ADR インデックス                  | [`docs/design/16-decisions/`](../design/16-decisions/)                               |
| CSS variable contract             | [`docs/design/18-css-variable-contract.md`](../design/18-css-variable-contract.md)   |
| Bundle budget                     | [`docs/design/09-bundle-budget.md`](../design/09-bundle-budget.md)                   |
| 統合境界（kumiki がやらないこと） | [`docs/design/17-integration-boundaries.md`](../design/17-integration-boundaries.md) |
| Vision / 退出基準                 | [`docs/design/01-vision.md`](../design/01-vision.md)                                 |

---

**最終更新**: 2026-05-10
**Maintainer**: baseballyama

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

**致命的ギャップ**:

1. **stateful なのに FSM/L3 を持たない**: `date-picker`, `datetime-field`, `time-field`, `toolbar`。
2. **L4 / Atelier の bundle budget が未強制**。docs/design/09 の値が宣言だけで実測ゲートが無い。
3. **Atelier の品質契約（CSS変数の表面、visual regression、`kumiki add` 端から端まで）が GA 基準で未検証**。
4. **bus factor 1**。共同メンテナ不在。

---

## トラック A — Phase 1.5 既存実装の品質ゲート充足

> **方針**: 新規追加を凍結し、**32 既存コンポーネントが全て v1.0 品質契約を満たすこと** を最優先で潰す。flyle-nexus 移行が動かないコンポーネントが 1 個でも残れば失敗。

### A-1. レイヤ欠損の補填（stateful 4 件）

- [ ] **`date-picker`**: machines + headless を新設
  - 受入: `docs/components/_template.md` 準拠の machine spec、`@kumiki/machines/date-picker` の `defineMachine` 出力が stately viz で読める、headless attachment が popover + calendar 合成で動く
  - 仕様: `docs/components/<...>` （未作成なら本トラック内で起こす）、`@internationalized/date` を peer dep として読む
  - 見積: L
  - 依存: なし
- [ ] **`datetime-field`**: machines + headless を新設（`time-field` と内部共有しても良い）
  - 受入: 同上、segmented input の caret 移動 / arrow key / typeahead が APG 準拠
  - 見積: L
  - 依存: なし
- [ ] **`time-field`**: machines + headless を新設
  - 受入: 同上、12h/24h granularity の locale 切替が `LocaleProvider` 経由で動く
  - 見積: M
  - 依存: なし
- [ ] **`toolbar`**: machines + headless を新設（roving tabindex を機械化）
  - 受入: APG `toolbar` パターンに準拠、`Home` / `End` / `Arrow*` のすべてが `direction` を読んで RTL 反転
  - 見積: M
  - 依存: なし
- [ ] **`icon-button`**: button machine の delegation で実装、L3 不要であることを `docs/components/icon-button.md` に明記
  - 受入: 専用 machine を持たないことが ADR ではなく component spec の方針として記録される
  - 見積: S
  - 依存: なし

### A-2. 4 本柱の実測ゲート（全 34 コンポーネント）

各コンポーネントを 1 行に束ねて **a11y / i18n / bundle / FSM** の 4 列でステータスを取る。最終的にすべて ✅ になるまで A トラックを閉じない。

- [ ] **a11y 列**: `axe-core` を LTR + RTL × `documented states` で全コンポーネント実行、緑化
  - 受入: `pnpm --filter @kumiki/docs test:e2e` で全 sandbox/playground ページが axe pass
  - 見積: M
  - 依存: A-1 完了後（追加コンポーネント分）
- [ ] **a11y 列 (APG keyboard)**: `apps/docs/keyboard/<comp>.kb.ts` を全 34 件分整備、Playwright 経由で機械化
  - 受入: `scripts/check-apg-snapshots.mjs` が全件 green
  - 見積: M
  - 依存: A-1
- [ ] **a11y 列 (Guidepup)**: macOS-VoiceOver で 1 回手動実行 → ログを `apps/docs` に公開（nightly 自動化は v1.0 後でもよい）
  - 受入: `docs/design/05-accessibility.md` に手動実行ログのリンクが 34 件並ぶ
  - 見積: L
  - 依存: A-1
- [ ] **i18n 列**: 10 locale (`en/ja/zh-Hans/zh-Hant/ko/es/fr/de/ar/he`) すべてに必要な message bundle が揃い、`scripts/check-locale-shape.mjs` 緑
  - 受入: `pnpm check:locale-shape` が green、各 locale ≤ 1 KB gzip
  - 見積: M
  - 依存: A-1
- [ ] **bundle 列**: L3 (`@kumiki/headless/<name>`) は `pnpm size` で全件計測される
  - 受入: 20 個 + A-1 で追加される 4 個 = 24 件すべてに budget が設定され、CI gate が動く
  - 見積: S
  - 依存: A-1
- [ ] **bundle 列 (L4)**: `.svelte` の brotli 計測手段を確立
  - 候補 1: Svelte コンパイル後の `.js` を size-limit に渡すラッパースクリプト（`scripts/measure-svelte-size.mjs` 新設）
  - 候補 2: Vite ビルド成果物（`apps/docs/sizes/<comp>.js`）の brotli 計測
  - 受入: L4 全 34 件 + Atelier 全 34 件 × 2 variant = 102 件に CI 計測値、超過は merge ブロック
  - 見積: L
  - 依存: なし（先行可）
  - **ADR 起票が必要**（[ADR 0009](../design/16-decisions/0009-tsdown-bundler.md) を補完する形で）
- [ ] **FSM 列**: 17 + A-1 で追加される 4 = 21 件の machine が `toJSON()` で stately.ai-compatible を吐き、Vitest で `environment: 'node'` のまま全 transition をテスト
  - 受入: `packages/machines/src/<each>/index.test.ts` カバレッジ 80% 以上、JSON spec の例が `apps/docs/playgrounds` に 1 つ以上同梱
  - 見積: M
  - 依存: A-1

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

- [ ] **Deliverable B-4 確認**: TimeField + DateTimeField がトラック A-1 で完成していること（重複だが flyle 側からの spec 視点で再確認）
- [ ] **Deliverable C 拡張**: A-1 で追加される 4 件の `*.kb.ts` を含めて Phase 1.5 全コンポーネントが APG keyboard test pass
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

- [ ] **新規 ADR 0017（仮）: Atelier GA at v1.0** を起票し ADR 0010 を supersede
  - 内容: 動機（flyle-nexus 採用と shadcn-svelte 競合導線）、品質契約（C-2 以下の項目）、後方互換ポリシー（CSS variable contract の semver）、preview 期間中に蓄積した変更をリリースノート化する手順
  - 受入: PR が merge され、`docs/design/16-decisions/0017-atelier-ga.md` が main にある
  - 見積: M
  - 依存: なし（先行可）

### C-2. 全コンポーネントの 2 variant 揃い

- [ ] 34 コンポーネント × 2 variant (Tailwind / Vanilla) = **68 ファイル** の存在確認
  - `Toggle.tailwind.svelte` のように 2-file 型と、`button/{tailwind,vanilla}/` のように folder 型が混在している。**どちらか一方の規約に統一**する
  - 受入: `scripts/check-atelier-shape.mjs` (新規) が両 variant 揃いを検証、CI gate
  - 見積: M
  - 依存: なし
- [ ] Atelier の `index.ts` から **dot-namespace barrel** が consumer に露出する形を検証
  - 受入: `import { Toggle } from '@kumiki/atelier'` で Tailwind / Vanilla どちらかが選べる、もしくは subpath で明示
  - 見積: S
  - 依存: 上記

### C-3. CSS variable contract の semver 化

- [ ] [`docs/design/18-css-variable-contract.md`](../design/18-css-variable-contract.md) §18.3 の per-component leaf var 表を **凍結し、各 var に "stable / experimental" マークを付与**
  - 受入: leaf var の rename / 削除が semver-major 扱いであることが ADR 化、`scripts/check-css-vars.mjs` (新規) が全 atelier component の `:where` ルールが leaf var しか参照しないことを検証
  - 見積: M
  - 依存: C-1
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
- [ ] `publint` / `attw` / `agadoo` / `size-limit` の `--ignore` が **0 件**
  - 受入: `git grep -n -- '--ignore'` が package.json で 0 hit
  - 見積: S
  - 依存: なし
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
- [ ] 同ページに **a11y 機能比較**（RTL / 非グレゴリオ暦 / Standard Schema / APG 適合 / Guidepup CI）を併記
  - 受入: マトリクス表が main 公開、SEO 用 meta description あり
  - 見積: M

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

- [ ] **未作成のもの**: `icon-button.md`, `time-field.md` 単独, `datetime-field.md` 単独, `toolbar.md`, `popconfirm.md`, `drawer.md`, `toggle-group.md`
  - 受入: `_template.md` に準拠、APG リンク / Kumiki-ready チェックリストあり
  - 見積: M
  - 依存: A-1

### F-2. 整合チェック

- [ ] `docs/design/15-roadmap.md` の **Phase 0a/0b/0c の "🟡 未完了" マーカーを実態に合わせる**
  - 現状: Phase 0a/0b/0c の deliverable はほぼ完了しているが文面は未着手扱い。Phase 1.5 への jump も後追いで反映
  - 受入: 文面と実装が一致
  - 見積: S
- [ ] [ADR 0010](../design/16-decisions/0010-layer-5-preview.md) の冒頭に `Superseded by ADR 0017` ノートを追加
  - 依存: C-1

### F-3. 公式サイト UX

- [ ] `apps/docs` のトップページから「**flyle-nexus 移行ストーリー**」へのリンクを設置
  - 受入: マーケティング訴求として「実プロダクトに導入されている」事実を可視化
  - 見積: S
  - 依存: B-1 (Deliverable J) 完了

---

## 依存関係マップ（Critical path）

```
A-1 (stateful 4 件のレイヤ補填)
  ├─ A-2 a11y / i18n / FSM 列
  ├─ A-2 bundle L4 計測基盤 ──┐
  ├─ B-2 Deliverable C 拡張   │
  └─ F-1 spec 補完            │
                              │
C-1 ADR 0017 ─ C-2 variant 揃い ─ C-3 CSS contract ─ C-4 budget(=A-2 共有)
                                                        │
                              ┌─────── C-5 visual regression
                              │
A-2 + C-4 ─ D-2 公開計測ページ ─ D-5 launch アナウンス
                              │
B-1 (flyle 側 E/I/J) ─ B-3 本格移行 ─ F-3 トップページ更新
                              │
E-1 共同メンテナ ─ E-2 contribution UX ─ E-3 外部採用
                              │
D-1 30 日 green + D-3 llms.txt + D-4 changeset ─→ v1.0 公開
```

**最も長いクリティカルパス**: `A-1 → A-2(bundle) → C-4 → D-2 → D-5`。
ここが詰まると launch 全体が動かない。**A-1 と A-2(bundle) は並列着手すべき**。

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

## 着手順（最初の 2 週間）

> 並列に走らせるが、1 人で進めるなら以下を優先。

1. **C-1 ADR 0017 起票** — Atelier GA の意思決定を文書化（半日）
2. **A-1 `toolbar` machine + L3** — 4 件の中で最も小さい、A-1 の体験を作る（2-3 日）
3. **A-2 bundle L4 計測 PoC** — `scripts/measure-svelte-size.mjs` を Toggle 1 個で動かす（2-3 日）
4. **A-1 `time-field` machine + L3** — `datetime-field` への内部共有を見据えて先行（3-5 日）
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

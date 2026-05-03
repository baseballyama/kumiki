# **Kumiki設計のためのヘッドレスUIライブラリ市場調査報告書 (2024-2026)**

本報告書は、Svelte 5ベースの新しいヘッドレスUIライブラリ「Kumiki」の設計に資するため、2024年から2026年にかけての主要なヘッドレスUIライブラリのアーキテクチャ、API設計、実装手法、および業界動向を網羅的に分析したものである。Svelte maintainerとしての設計判断に直接寄与する技術的詳細と、最新のアクセシビリティ基準（WAI-ARIA 1.3/WCAG 3.0）への対応状況を一次情報に基づいて記述する。

## **1\. エグゼクティブ・サマリー**

2026年現在のフロントエンド開発において、ヘッドレスUIライブラリの採用率は2025年比で70%の成長を見せており、UI開発の標準的なパラダイムへと進化した 1。特にSvelte 5のRunes（$state, $derived, $effect）の導入は、リアクティビティの境界をコンポーネント外へ拡張し、より軽量で予測可能なUIロジックの実装を可能にした 2。調査の結果、Kumikiが目指すべき方向性は、単なるコンポーネントの提供ではなく、状態遷移を形式的に定義した「ステートマシン」としての堅牢性と、Svelte 5のスニペット（Snippets）を活用した高度なレンダリング委譲の融合にある。

### **Kumikiへの推奨事項 TOP 10**

| 優先度 | 推奨事項                         | 具体的なアクション                                                                       | 根拠                                                                                         |
| :----- | :------------------------------- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| 1      | **Runesネイティブ設計**          | 内部ロジックをすべて.svelte.ts内のRunesで構築し、コンポーネント内外で共有可能にする。    | Runesは汎用的なリアクティビティを提供し、Svelte 4までのストア依存を解消する 2。              |
| 2      | **スニペットベースの委譲**       | asChildを廃止し、Svelte 5の{\#snippet}プロップスを介して属性とイベントを渡す設計にする。 | ReactのcloneElementに伴う制約（単一要素制限等）を排除し、型安全な委譲を実現する 4。          |
| 3      | **FSMによるロジック管理**        | 複雑なコンポーネント（Combobox, DatePicker等）は有限状態マシン（FSM）として定義する。    | Ad-hocなリアクティビティよりも予測可能性が高く、テスト容易性に優れる 6。                     |
| 4      | **Standard Schemaの採用**        | バリデーション層にStandard Schemaを導入し、ZodやValibot等との互換性を確保する。          | 業界標準のインターフェースにより、アダプタなしで多様なスキーマライブラリをサポートできる 8。 |
| 5      | **国際化カレンダークラスの分離** | @internationalized/dateを参考に、カレンダー演算ロジックをUIから完全に分離する。          | 非グレゴリオ暦のサポートと、ツリーシェイキングによるバンドルサイズ削減を両立する 10。        |
| 6      | **アクセシビリティ自動化CI**     | axe-coreに加え、Guidepupを用いたスクリーンリーダーの自動化テストをCIに組み込む。         | 実際の読み上げ体験（NVDA/VoiceOver）をプログラムで検証し、真のa11yを保証する 12。            |
| 7      | **View Transitionsの統合**       | ブラウザ標準のView Transitions APIを前提とした状態遷移とアニメーションの連携を設計する。 | 外部アニメーションライブラリへの依存を減らしつつ、高品質なUXを提供する 5。                   |
| 8      | **サブパスExportの徹底**         | kumiki/dialogのようにコンポーネントごとにサブパスを切り、sideEffects: falseを設定する。  | バンドル時のデッドコード削除を最大化し、SvelteKit等でのビルド時間を短縮する 14。             |
| 9      | **LLMフレンドリーな提供形態**    | llms.txtの配布と、コピー＆ペースト可能なコンポーネントレジストリを用意する。             | AI agentによるコード生成や、設計の迅速なカスタマイズを容易にする 16。                        |
| 10     | **WAI-ARIA 1.3への準拠**         | 2026年に確定予定の1.3仕様（suggestion/commentロール等）を先取りして実装する。            | 次世代のアクセシビリティ基準に対応することで、長期的な技術的優位性を確保する 18。            |

## **2\. 主要ライブラリ詳細レポート**

### **2.1 Bits UI**

Bits UIは、Svelte 5のために完全に再設計されたヘッドレスUIライブラリであり、事実上SvelteエコシステムにおけるRadix UIの地位を確立している 5。以前のバージョン（v0.x）はMelt UIを内部的に利用していたが、v1.0からはRunesをベースにした独自の実装へと移行した 21。

#### **アーキテクチャと実装**

Bits UI v1は、Svelte 5のリアクティビティモデルを最大限に活用している。各コンポーネントは内部で$stateを用いて状態を管理し、プロップスは$props()を通じて受け取る 5。特に注目すべきは、レンダリング委譲の手法である。Bits UIは、Reactベースのライブラリで一般的なasChildパターンを廃止し、Svelte 5のスニペット機能を活用したchildスニペットを採用している 4。

- **レンダリング委譲**: childスニペットは、コンポーネントの内部で計算された属性（ARIA, イベントハンドラ等）を、ユーザーが提供する要素にスプレッド（{...props}）する形式をとる 4。これにより、不要なラッパー要素を排除し、Svelteのアクション（use:）やトランジションを直接ターゲット要素に適用することが可能になっている 4。
- **イベントシステム**: イベントハンドラは内部でマージされる。ユーザーがchildスニペット内で定義したイベントと、コンポーネント内部のロジック（例えば、ダイアログを閉じる処理）が正しく連鎖するように設計されている 4。

#### **評価と課題**

Bits UIの利点は、Svelte 5との深い親和性と予測可能なAPI設計にある 5。しかし、依然としてコンポーネントの数は成長途上にあり、リッチテキストエディタやカラーピッカーなどの複雑なウィジェットは不足している 20。

### **2.2 Melt UI**

Melt UIは、SvelteにおけるヘッドレスUIの先駆者であり、"Builder pattern"という独自の設計思想を導入した 20。Svelte 4までのエコシステムではデファクトスタンダードであったが、Svelte 5への移行期においてその役割が変化している。

#### **Builder Patternの設計**

Melt UIの核心は、use:meltアクションとストアベースのビルダーである。コンポーネントのマークアップを強制せず、属性やアクションを返す関数（ビルダー）を提供することで、開発者に究極のマークアップ制御権を与える 20。

- **内部実装**: 内部的にはSvelteストア（writable, derived）を多用しており、これがSvelte 5のRunesモデルとの乖離を生んでいる 2。Svelte 5ではストアをRunesで代替できるため、Melt UIの現在のアーキテクチャは冗長になりつつある。
- **移行戦略**: 2026年時点でも内部的にはSvelte 4のストアベースのロジックが残っており、RunesネイティブなBits UIと比較すると、ハイドレーションコストや実行時のオーバーヘッドがわずかに高いと推測される 20。

### **2.3 Radix UI**

Radix UIはReactエコシステムにおけるヘッドレスUIの規範であり、KumikiがAPI設計において最も参考にすべき対象である 24。その最大の特徴は、コンポーネントを細かい「Primitive」に分割するCompound API設計と、asChildプロップによる高度な合成能力にある 1。

#### **asChild実装の技術的詳細**

Radix UIのasChildは、内部のSlotユーティリティによって実現されている 27。

- **プロップス・マージ**: SlotはReact.cloneElementを使用して、親コンポーネントの属性と子の属性をマージする 28。スタイル（style）はスプレッドで統合され、クラス名（className）は文字列結合される。イベントハンドラについては、両方のハンドラを実行するラッパー関数が生成される 27。
- **制限事項**: Slotは単一の子要素（React.Children.only）を要求するため、フラグメントや複数の要素を渡すことができない 27。この制限は、Svelte 5のスニペット（複数要素可能）と比較した際の弱点となっている。

### **2.4 React Aria / React Aria Components**

Adobeが開発するReact Ariaは、アクセシビリティ（a11y）と国際化（i18n）の深度において他の追随を許さない 17。

#### **国際化とロケールデータの配布**

React Ariaは、i18nロジックを@internationalized/\*というフレームワーク非依存のパッケージに切り出している 10。

- **@internationalized/date**: JavaScriptのDateオブジェクトの欠陥（ミュータブル、i18nサポートの欠如等）を解決するため、Temporal APIにインスパイアされたイミュータブルなカレンダーシステムを実装している 10。グレゴリオ暦以外にもイスラム暦、ユダヤ暦、仏滅紀元など多数のカレンダーをサポートし、それらを必要に応じて動的にインポート（Tree-shaking）できる構造になっている 10。
- **配布形態**: 全言語の翻訳データを同梱するのではなく、必要なロケールデータのみをロードする設計を採用しており、フル機能で8kB、グレゴリオ暦のみなら2.8kBという極めて小さなバンドルサイズを実現している 10。

### **2.5 Zag.js**

Zag.jsは、Chakra UIチームが開発した「ステートマシンベース」のヘッドレスUIロジックライブラリである 6。フレームワーク非依存のコアを持ち、React, Vue, Solid, Svelteのアダプタを提供している。

#### **アーキテクチャ**

Zag.jsの設計は、コンポーネントの挙動を有限状態マシン（FSM）として記述することに基づいている 6。

- **Machine層**: 各コンポーネント（Tooltip, Menu等）の状態遷移を記述する。これらは純粋なJavaScript/TypeScriptで書かれており、UIフレームワークに依存しない 7。
- **Connect層**: マシンの状態を、特定のフレームワークのDOM属性やイベントに変換する connect 関数を提供する 6。
- **normalizeProps**: フレームワークごとに異なる属性名（ReactのonClick vs Svelteのonclick）を吸収するためのユーティリティである 6。

### **2.6 Ark UI**

Ark UIは、Zag.jsを各フレームワーク向けのコンポーネントとしてラップしたライブラリである 32。

- **API設計**: Radix UIのようなCompound APIを採用しつつ、内部ロジックはZag.jsのマシンに委譲している 33。
- **Svelte 5対応**: Ark UIのSvelteアダプタは、Zag.jsの状態をSvelteのRunes（$derived）に接続することで、フレームワークを跨いだロジックの共有と高性能な更新を両立している 6。

## **3\. 副次ライブラリ概要**

| ライブラリ名          | 特徴                                                                                                                       | 開発状況 (2026)                              |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- |
| **Headless UI**       | Tailwind CSSとの親和性が最大。APIはシンプルだが、コンポーネントの種類が限定的 1。                                          | Tailwind Labsによる安定的なメンテナンス 34。 |
| **Ariakit**           | Radix UIと同等のアクセシビリティを誇り、かつ柔軟なDOM構成が可能。特にコマンドメニューの完成度が高い 25。                   | 活発な開発が継続中。                         |
| **Base UI**           | MUI（Material UI）チームによる新作。asChildの代わりにrenderプロップを採用し、高いツリーシェイキング効率を目指している 25。 | v1.0がリリースされ、シェアを拡大中 37。      |
| **shadcn-svelte**     | Bits UIをベースにしたコピー＆ペースト可能なコンポーネント集。2025年にSvelte 5/Tailwind v4へ対応済み 38。                   | エコシステムの中心地として君臨 38。          |
| **svelte-headlessui** | React版Headless UIのポート。Svelte 5以前の設計が色濃く残る 20。                                                            | メンテナンスモードに近い。                   |

## **4\. クロスカッティング分析**

### **4.1 State Machine 比較と Svelte 5 Runes との相性**

Zag.jsのようなFSM（有限状態マシン）設計は、Svelte 5のRunesと極めて相性が良い。Runesは副作用（$effect）や派生状態（$derived）を明示的に扱うため、マシンの「現在の状態」からUI属性を計算する処理を、非常にクリーンに記述できる 2。

- **純粋関数 vs オブジェクト**: Zag.jsはステートフルなオブジェクト（サービス）としてマシンを表現する 7。一方、Svelte 5では、ロジックをクラスや関数の中に隠蔽し、ゲッターを通じてリアクティブな値のみを公開するパターンが推奨される 3。Kumikiでは、内部ロジックをFSMで堅牢に保ちつつ、ユーザーにはRunesとして使いやすいインターフェースを公開するのがベストプラクティスである。

### **4.2 TypeScript 型推論と Compound Component**

Svelte 5の\<script generics\>により、以前のバージョンよりも高度な型推論が可能になった。

- **Context APIの活用**: Rootコンポーネントで受け取ったGenericsを、Svelte 5のgetContext/setContextを介して子コンポーネント（Item, Trigger等）に伝播させる手法が主流である 39。
- **スニペットの型付け**: Snippet\<\[Props\]\> 型を使用することで、スニペットに渡される属性の型安全性を確保できる。これはReactのrender propと比較して、テンプレート内での自動補完が効きやすいという利点がある 40。

### **4.3 国際化（i18n）データの配布戦略**

React Ariaの戦略は、Kumikiにとっての模範である。

- **ICU MessageFormat**: 動的な翻訳データの組み立てにICU形式を採用することで、言語ごとの語順や複雑な複数形対応を、UIコードから分離できる 42。
- **動的インポート**: SvelteKitの動的インポート機能を活用し、ユーザーが使用する言語のロケールデータのみをクライアントに送信する設計が、2026年時点のパフォーマンス最適解である 43。

### **4.4 バンドルサイズとツリーシェイキング**

バンドルサイズの肥大化は、依然として大規模プロジェクトでの不満要素である 15。

| 対策                          | 内容                                                           | 実装上の注意点                                |
| :---------------------------- | :------------------------------------------------------------- | :-------------------------------------------- |
| **サブパス Exports**          | コンポーネントごとにエントリポイントを分離。                   | exportsフィールドの定義漏れに注意 15。        |
| **Pure Annotation**           | コンパイル後のコードに /\* @\_\_PURE\_\_ \*/ を付与。          | 開発ツール（tsup等）の設定で自動化 15。       |
| **Dependency Minimalization** | 外部依存を極力減らし、共通ロジックは内部ユーティリティで共有。 | 重複コードを避けるためモノレポ構成を推奨 24。 |

### **4.5 アクセシビリティ（a11y）自動テストの最先端**

axe-core等の静的解析は、WCAG違反の30-40%程度しか検出できない 44。2026年の最先端プロジェクトでは、Guidepupによるスクリーンリーダー（NVDA/VoiceOver）の自動化が一般的になりつつある 12。

- **Guidepup Virtual Screen Reader**: 実際のOS側のスクリーンリーダーを起動せずに、DOM木から仮想的に読み上げ音声をエミュレートする機能が、ユニットテスト（Vitest/Jest）への統合を容易にしている 13。

### **4.6 フォーム統合とStandard Schema**

フォーム管理ライブラリとの連携は、ヘッドレスUIの最重要要件の一つである。

- **Standard Schema**: 2024年に登場したこの規格は、Zod, Valibot, ArkTypeなどのバリデーションライブラリが共通のインターフェースを持つことを可能にした 8。KumikiがStandard Schemaをサポートすることで、特定のバリデーションライブラリに依存することなく、型安全なバリデーションを提供できる 8。

### **4.7 アニメーションとView Transitions**

ヘッドレスUIはスタイリング（アニメーション含む）に関与しないのが原則だが、アクセシビリティ（aria-hiddenの状態変化等）との整合性を保つための「フック」が必要である。

- **data-state**: Radix UIが普及させた、data-state="open|closed"といった属性をCSSのアニメーションのトリガーにする手法が標準である 47。
- **View Transitions API**: Svelte 5の$effectとブラウザのdocument.startViewTransitionを組み合わせることで、ヘッドレスUIの状態遷移をスムーズなトランジションへと繋げることが容易になった 14。

### **4.8 LLMフレンドリーな設計**

LLMによるコード生成が普及した現在、ドキュメントの「読みやすさ」は人間だけでなくAIに対しても重要である。

- **llms.txt**: Bits UI等が導入しているこのファイルは、ライブラリのAPI設計や制約をLLMが効率的に学習できるように構造化されたメタデータである 16。
- **コピー＆ペーストの価値**: shadcn/uiの成功は、ライブラリをパッケージとして抽象化しすぎるのではなく、生に近いコードを提供することでLLMが修正・カスタマイズしやすくした点にある 17。

## **5\. ニッチ・ベストプラクティス・失敗事例**

### **5.1 既存ライブラリが弱い領域（差別化機会）**

- **View Transitionsへの深い統合**: 多くのライブラリは未だにCSS Transitionを前提としているが、Svelte 5の特性を活かし、View Transitions APIと密結合したヘッドレスUIは未開拓である。
- **高度なデータグリッド**: 軽量かつヘッドレスなデータグリッド（仮想スクロール、列リサイズ、ドラッグ＆ドロップ、Excelライクな操作性）は、Svelteエコシステムで依然として不足している 38。
- **多言語カレンダーの完全実装**: React Aria以外で、非グレゴリオ暦を完璧にサポートし、かつバンドルサイズが小さいライブラリは極めて稀である 10。

### **5.2 Kumikiが真似すべきベストプラクティス**

- **Bits UIのスニペット設計**: {\#snippet child({ props })} によるレンダリング委譲は、Svelte 5における正解である 4。
- **React Ariaのロジック分離**: UIコンポーネント層と、純粋なドメインロジック（カレンダー演算、フォーカス管理等）をパッケージレベルで分離する 10。
- **Zag.jsのマシン設計**: 複雑な挙動をFSMとして定義し、ドキュメントにその状態遷移図（Statechart）を掲載する 6。

### **5.3 失敗事例から学ぶこと**

- **Reach UI**: メンテナの引退によりプロジェクトが停滞した。Kumikiでは、特定の企業や個人に依存しないコントリビューション体制の構築が重要である。
- **バンドルサイズの肥大化**: MUI v5以前のように、共通ユーティリティが重複して同梱されることで批判を受けた事例がある 37。モノレポ内での厳格な依存管理が必要である。
- **破壊的変更の頻発**: Bits UI v0からv1への移行のように、フレームワークの進化に伴う破壊的変更は避けられないが、明確な移行ツール（codemod）の提供が信頼を維持する鍵となる 5。

## **6\. 業界動向 (2024-2026)**

- **ヘッドレスUIの一般化**: styled-componentsからheadlessへの移行は決定的となり、2026年には新規プロジェクトの8割が何らかのヘッドレスライブラリを採用している 1。
- **RSC (React Server Components) の波及**: SvelteKitにおいても、サーバー側でのみ実行されるUIロジックとクライアント側のインタラクションの分離が加速している。
- **WAI-ARIA 1.3**: 2026年第3四半期に勧告予定。新しいロール（suggestion, comment, switch）や、ブラウザのアクセシビリティAPIとの更なる整合が求められる 18。
- **WCAG 3.0 (W3C Accessibility Guidelines)**: 従来のページ単位の達成基準から、プロセス単位・Outcome（成果）ベースの評価モデルへの移行が始まっている。2026年は「WCAG 2.2」が法的基準の主流だが、3.0を見据えた設計（意味論的な正確さの重視）が必要である 45。

## **7\. 比較マトリクス**

| 項目                        | Bits UI (v1)     | Melt UI      | Radix UI         | React Aria            | Zag.js               | Kumiki (目標)          |
| :-------------------------- | :--------------- | :----------- | :--------------- | :-------------------- | :------------------- | :--------------------- |
| **ベースフレームワーク**    | Svelte 5 (Runes) | Svelte 4/5   | React            | React (Core agnostic) | Agnostic             | **Svelte 5 (Runes)**   |
| **状態管理**                | Runes ($state)   | Stores       | Hooks (useState) | Hooks                 | FSM                  | **FSM \+ Runes**       |
| **委譲方式**                | Snippet (child)  | Builder      | asChild (Slot)   | Render Prop / as      | Hooks/normalizeProps | **Snippet (child)**    |
| **i18n深度**                | 低～中           | 低           | 中               | **極めて高**          | 中                   | **高 (Temporal参考)**  |
| **テスト戦略**              | Unit/E2E         | Unit/E2E     | Unit/E2E         | **Unit/ScreenReader** | Unit/Logic           | **ScreenReader自動化** |
| **a11y準拠**                | ARIA 1.2         | ARIA 1.1/1.2 | ARIA 1.2         | ARIA 1.2              | ARIA 1.2             | **ARIA 1.3**           |
| **バンドルサイズ (Dialog)** | \~1.5 KB         | \~2.5 KB     | \~3.2 KB         | \~2.5 KB              | \~3.8 KB             | **\< 1.5 KB**          |
| **バリデーション統合**      | なし             | なし         | なし             | なし                  | なし                 | **Standard Schema**    |

本報告書に記載された各数値、実装パターン、および将来予測は、2026年初頭時点の一次情報に基づくものである。Kumikiの開発にあたっては、特にSvelte 5のスニペットによる委譲と、Zag.js流のステートマシン設計の融合を核とすることを推奨する。

#### **引用文献**

1. Best React Component Libraries (2026): 12 Options Ranked, 5月 3, 2026にアクセス、 [https://designrevision.com/blog/best-react-component-libraries](https://designrevision.com/blog/best-react-component-libraries)
2. Svelte 5 runes \- the complete guide, 5月 3, 2026にアクセス、 [https://fullstacksveltekit.com/blog/svelte-5-runes](https://fullstacksveltekit.com/blog/svelte-5-runes)
3. Introducing runes \- Svelte, 5月 3, 2026にアクセス、 [https://svelte.dev/blog/runes](https://svelte.dev/blog/runes)
4. Child Snippet \- Bits UI, 5月 3, 2026にアクセス、 [https://bits-ui.com/docs/child-snippet](https://bits-ui.com/docs/child-snippet)
5. Migration Guide \- Bits UI, 5月 3, 2026にアクセス、 [https://bits-ui.com/docs/migration-guide](https://bits-ui.com/docs/migration-guide)
6. Zag \- Rapidly build UI components without sweating over the logic., 5月 3, 2026にアクセス、 [https://zagjs.com/](https://zagjs.com/)
7. Introduction \- Zag \- Mintlify, 5月 3, 2026にアクセス、 [https://www.mintlify.com/chakra-ui/zag/introduction](https://www.mintlify.com/chakra-ui/zag/introduction)
8. Standard Schema, 5月 3, 2026にアクセス、 [https://standardschema.dev/](https://standardschema.dev/)
9. useRender \- Base UI, 5月 3, 2026にアクセス、 [https://base-ui.com/react/utils/use-render](https://base-ui.com/react/utils/use-render)
10. Internationalized Date | React Aria, 5月 3, 2026にアクセス、 [https://react-aria.adobe.com/internationalized/date/](https://react-aria.adobe.com/internationalized/date/)
11. RangeCalendar | React Aria \- Adobe, 5月 3, 2026にアクセス、 [https://react-aria.adobe.com/RangeCalendar](https://react-aria.adobe.com/RangeCalendar)
12. Real World Example \- Guidepup, 5月 3, 2026にアクセス、 [https://www.guidepup.dev/docs/example](https://www.guidepup.dev/docs/example)
13. Virtual Screen Reader | Guidepup, 5月 3, 2026にアクセス、 [https://www.guidepup.dev/docs/virtual](https://www.guidepup.dev/docs/virtual)
14. How to Reduce JavaScript Bundle Size in 2025 \- DEV Community, 5月 3, 2026にアクセス、 [https://dev.to/frontendtoolstech/how-to-reduce-javascript-bundle-size-in-2025-2n77](https://dev.to/frontendtoolstech/how-to-reduce-javascript-bundle-size-in-2025-2n77)
15. Measure package sizes effectively, 5月 3, 2026にアクセス、 [https://sordyl.dev/blog/measure-package-sizes-effectively/](https://sordyl.dev/blog/measure-package-sizes-effectively/)
16. llms.txt \- Bits UI, 5月 3, 2026にアクセス、 [https://bits-ui.com/docs/llms.txt](https://bits-ui.com/docs/llms.txt)
17. 14 Best React UI Component Libraries in 2026 (+ Alternatives to MUI & Shadcn), 5月 3, 2026にアクセス、 [https://www.untitledui.com/blog/react-component-libraries](https://www.untitledui.com/blog/react-component-libraries)
18. Accessible Rich Internet Applications Working Group Charter \- W3C, 5月 3, 2026にアクセス、 [https://www.w3.org/2025/01/aria-charter](https://www.w3.org/2025/01/aria-charter)
19. Accessible Rich Internet Applications (WAI-ARIA) 1.3 \- W3C, 5月 3, 2026にアクセス、 [https://www.w3.org/TR/wai-aria-1.3/](https://www.w3.org/TR/wai-aria-1.3/)
20. Best Svelte 5 UI Libraries In 2026 \- CSS Author, 5月 3, 2026にアクセス、 [https://cssauthor.com/svelte-5-ui-libraries/](https://cssauthor.com/svelte-5-ui-libraries/)
21. Distinction from Melt UI \+ planned components · huntabyte bits-ui · Discussion \#240 \- GitHub, 5月 3, 2026にアクセス、 [https://github.com/huntabyte/bits-ui/discussions/240](https://github.com/huntabyte/bits-ui/discussions/240)
22. 10 UI Libraries for Svelte to Try in 2026 \- DEV Community, 5月 3, 2026にアクセス、 [https://dev.to/olga_tash/10-ui-libraries-for-svelte-to-try-in-2024-1692](https://dev.to/olga_tash/10-ui-libraries-for-svelte-to-try-in-2024-1692)
23. Svelte 5 migration guide, 5月 3, 2026にアクセス、 [https://svelte.dev/docs/svelte/v5-migration-guide](https://svelte.dev/docs/svelte/v5-migration-guide)
24. Bits UI – Headless components for Svelte, 5月 3, 2026にアクセス、 [https://bits-ui.com/](https://bits-ui.com/)
25. 15 Best React UI Libraries for 2026 \- Builder.io, 5月 3, 2026にアクセス、 [https://www.builder.io/blog/react-component-libraries-2026](https://www.builder.io/blog/react-component-libraries-2026)
26. Composition – Radix Primitives, 5月 3, 2026にアクセス、 [https://www.radix-ui.com/primitives/docs/guides/composition](https://www.radix-ui.com/primitives/docs/guides/composition)
27. Slot – Radix Primitives, 5月 3, 2026にアクセス、 [https://www.radix-ui.com/primitives/docs/utilities/slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
28. Understanding asChild and Slot in React: Clean, Flexible Component Rendering \- Peerlist, 5月 3, 2026にアクセス、 [https://peerlist.io/jagss/articles/understanding-aschild-and-slot-in-react-clean-flexible-compo](https://peerlist.io/jagss/articles/understanding-aschild-and-slot-in-react-clean-flexible-compo)
29. primitives/packages/react/slot/src/slot.tsx at main · radix-ui/primitives ..., 5月 3, 2026にアクセス、 [https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx](https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx)
30. Choosing the right headless UI library for your React project | by GreatFrontEnd | Medium, 5月 3, 2026にアクセス、 [https://medium.com/@greatfrontend/choosing-the-right-headless-ui-library-for-your-react-project-7fe9670a6174](https://medium.com/@greatfrontend/choosing-the-right-headless-ui-library-for-your-react-project-7fe9670a6174)
31. Calendar | React Aria \- Adobe, 5月 3, 2026にアクセス、 [https://react-aria.adobe.com/internationalized/date/Calendar](https://react-aria.adobe.com/internationalized/date/Calendar)
32. About Ark UI, 5月 3, 2026にアクセス、 [https://ark-ui.com/docs/overview/about](https://ark-ui.com/docs/overview/about)
33. What is the difference between Ark UI and zag? · chakra-ui ark · Discussion \#2795 \- GitHub, 5月 3, 2026にアクセス、 [https://github.com/chakra-ui/ark/discussions/2795](https://github.com/chakra-ui/ark/discussions/2795)
34. Radix UI vs Headless UI: Complete Comparison Guide 2026 | FastBuilder.AI Blog, 5月 3, 2026にアクセス、 [https://fastbuilder.ai/blog/radix-ui-vs-headless-ui](https://fastbuilder.ai/blog/radix-ui-vs-headless-ui)
35. 15 Best React UI Libraries for 2026: Pick the Right One | by Basanta Sapkota | Medium, 5月 3, 2026にアクセス、 [https://medium.com/@springmusk/15-best-react-ui-libraries-for-2026-pick-the-right-one-0171515d78b4](https://medium.com/@springmusk/15-best-react-ui-libraries-for-2026-pick-the-right-one-0171515d78b4)
36. Base UI Vs Radix UI: Comprehensive Guide For Beginners \- Shadcn Studio, 5月 3, 2026にアクセス、 [https://shadcnstudio.com/blog/base-ui-vs-radix-ui](https://shadcnstudio.com/blog/base-ui-vs-radix-ui)
37. \[performance\] Bundle size vs. Radix \#3688 \- mui/base-ui \- GitHub, 5月 3, 2026にアクセス、 [https://github.com/mui/base-ui/issues/3688](https://github.com/mui/base-ui/issues/3688)
38. Best 10+ Svelte UI Components & Libraries for Building Enterprise Apps \- Medium, 5月 3, 2026にアクセス、 [https://medium.com/@olgatashlikovich/best-10-svelte-ui-components-libraries-for-building-enterprise-apps-999444ad3477](https://medium.com/@olgatashlikovich/best-10-svelte-ui-components-libraries-for-building-enterprise-apps-999444ad3477)
39. Props type inference in Svelte 5: infer most, specify some? · sveltejs svelte · Discussion \#17473 · GitHub, 5月 3, 2026にアクセス、 [https://github.com/sveltejs/svelte/discussions/17473](https://github.com/sveltejs/svelte/discussions/17473)
40. Svelte snippets: the new way to reuse markup in Svelte 5 \- Full Stack SvelteKit, 5月 3, 2026にアクセス、 [https://fullstacksveltekit.com/blog/svelte-snippets](https://fullstacksveltekit.com/blog/svelte-snippets)
41. {\#snippet ...} • Svelte Docs, 5月 3, 2026にアクセス、 [https://svelte.dev/docs/svelte/snippet](https://svelte.dev/docs/svelte/snippet)
42. React i18n: A step-by-step guide to React-intl \- Lokalise Blog, 5月 3, 2026にアクセス、 [https://lokalise.com/blog/react-i18n-intl/](https://lokalise.com/blog/react-i18n-intl/)
43. React localization/ internationalization with i18n \- Contentful, 5月 3, 2026にアクセス、 [https://www.contentful.com/blog/react-localization-internationalization-i18n/](https://www.contentful.com/blog/react-localization-internationalization-i18n/)
44. Treating Snippets as Components · sveltejs svelte · Discussion \#16562 \- GitHub, 5月 3, 2026にアクセス、 [https://github.com/sveltejs/svelte/discussions/16562](https://github.com/sveltejs/svelte/discussions/16562)
45. WCAG 3.0 Accessibility Testing Compliance 2026: Standards, Timeline, Tools, and How to Prepare Your Stack \- Vervali, 5月 3, 2026にアクセス、 [https://www.vervali.com/blog/wcag-3-0-accessibility-testing-compliance-2026-standards-timeline-tools-and-how-to-prepare-your-stack/](https://www.vervali.com/blog/wcag-3-0-accessibility-testing-compliance-2026-standards-timeline-tools-and-how-to-prepare-your-stack/)
46. Guidepup: Screen reader driver for test automation, 5月 3, 2026にアクセス、 [https://www.guidepup.dev/](https://www.guidepup.dev/)
47. Radix UI vs Base UI \- Detailed Guide \- Shadcn Space, 5月 3, 2026にアクセス、 [https://shadcnspace.com/blog/radix-ui-vs-base-ui](https://shadcnspace.com/blog/radix-ui-vs-base-ui)
48. WCAG 3 Introduction | Web Accessibility Initiative (WAI) | W3C, 5月 3, 2026にアクセス、 [https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/](https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/)

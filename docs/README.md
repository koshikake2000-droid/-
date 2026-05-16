# 週刊おすすめスポット

地域別・週替わりのおすすめ観光スポットを紹介する静的Webサイトです。

## 構成

```
weekly-spots/
├── index.html              # メインページ
├── spots.js                # レガシーデータ（後方互換用）
├── src/
│   ├── api/
│   │   ├── spots.json      # スポットデータ（週次更新）
│   │   └── dataLoader.js   # データ取得モジュール
│   └── components/
│       ├── Header.js       # ヘッダーコンポーネント（カテゴリーフィルター含む）
│       ├── TabBar.js       # タブバーコンポーネント（キーボードナビゲーション対応）
│       └── SpotCard.js     # スポットカードコンポーネント
├── tests/
│   ├── spotCard.test.js
│   └── dataLoader.test.js
└── docs/
    └── README.md
```

## 動作環境

ES Modules と Fetch API を使用しているため、**ローカルHTTPサーバー**が必要です。

```bash
# Node.jsがある場合
npx serve .

# Pythonがある場合
python -m http.server 8080
```

ブラウザで `http://localhost:3000`（または8080）を開いてください。

## 新機能

### カテゴリーフィルター

`Header.js` の `initCategoryFilter(categories, onFilter)` を使ってカテゴリーで絞り込めます。

- `#category-filter` 要素に「すべて」ボタンと各カテゴリーボタンを自動生成します。
- ボタンをクリックすると `onFilter(category)` が呼ばれます（「すべて」の場合は `null`）。

```js
import { initCategoryFilter } from './src/components/Header.js';

initCategoryFilter(["観光地・名所", "飲食店・カフェ"], (category) => {
  // category が null なら全件表示、文字列なら絞り込み
});
```

### キーボードナビゲーション

`TabBar.js` は WAI-ARIA に準拠したタブナビゲーションに対応しています。

- タブ要素に `role="tablist"` / `role="tab"` / `aria-selected` 属性が付与されます。
- **← →** キーでタブを切り替えられます。

### ローディング / エラー表示

データ取得中はローディング表示、失敗時はエラーメッセージを表示します。  
`dataLoader.js` はネットワークエラーと HTTPエラーを区別して詳細なエラーメッセージをスローします。

## コンポーネント一覧

| コンポーネント | ファイル | 主な関数・機能 |
|---|---|---|
| ヘッダー | `Header.js` | `initCategoryFilter(categories, onFilter)` — カテゴリーフィルターUI生成 |
| タブバー | `TabBar.js` | タブ切り替え、`role="tablist/tab"`、`aria-selected`、← → キーナビゲーション |
| スポットカード | `SpotCard.js` | `createSpotCard(spot)` — DOM要素をcreateElで構築、address/access の条件表示 |
| データローダー | `dataLoader.js` | `loadSpots()` / `getSpotsByCategory(data, category)` / `getSpotsByRegion(data, regionId)` |

## データ更新方法

`src/api/spots.json` を編集するだけで表示内容が変わります。

`address`（住所）と `access`（アクセス）は省略可能です。指定した場合のみカードに表示されます。

```json
{
  "week_label": "2026年X月X日（月）〜 X月X日（日）",
  "published_at": "2026-XX-XX",
  "regions": [
    {
      "id": "kanto",
      "name": "関東",
      "spots": [
        {
          "name": "スポット名",
          "category": "観光地・名所",
          "location": "都道府県市区町村（地区・エリア名）",
          "address": "具体的な住所・番地",
          "access": "最寄り駅・バス停から徒歩XX分など",
          "description": "説明文",
          "reason": "今週のポイント"
        }
      ]
    }
  ]
}
```

### スポットスキーマ

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `name` | string | 必須 | スポット名 |
| `category` | string | 必須 | カテゴリー（下表参照） |
| `location` | string | 必須 | 都道府県市区町村（地区・エリア名） |
| `address` | string | 任意 | 具体的な住所・番地。指定時のみカードに表示 |
| `access` | string | 任意 | 最寄り駅・バス停からのアクセス情報。指定時のみカードに表示 |
| `description` | string | 必須 | スポットの説明文 |
| `reason` | string | 必須 | 今週のおすすめポイント |

### カテゴリー一覧

| カテゴリー | バッジ色 |
|---|---|
| 観光地・名所 | 青 |
| 飲食店・カフェ | オレンジ |
| アクティビティ | 緑 |
| ショッピング | 紫 |
| 穴場 | ティール |

## テスト

```bash
npm install
npm test
```

## GitHub Pages への公開

1. このリポジトリをGitHubにプッシュ
2. Settings → Pages → Source: `main` ブランチ / `/(root)`
3. 数分後に `https://<username>.github.io/<repo>/weekly-spots/` で公開されます

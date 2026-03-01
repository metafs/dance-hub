# 公演作成機能 仕様書

## 概要

ダンスハブアプリケーションの公演作成機能の詳細仕様書です。主催者が新しい公演を登録するためのフォーム機能を提供します。

## ファイル構成

- **メインファイル**: `dance-hub/src/app/performances/new/page.tsx`
- **型定義**: `dance-hub/src/types/database.ts`
- **データベース接続**: `dance-hub/src/lib/supabase.ts`

## 機能概要

### 1. 基本機能

- 公演の基本情報入力
- 会場選択（データベースから動的取得）
- 複数スケジュール設定
- 複数チケット種別設定
- バリデーション機能
- エラーハンドリング
- 日本語 UI

### 2. 入力項目

#### 2.1 基本情報セクション

| 項目     | 必須 | 型     | 説明                     |
| -------- | ---- | ------ | ------------------------ |
| タイトル | ✓    | string | 公演のタイトル           |
| 説明     | -    | string | 公演の詳細説明（複数行） |

#### 2.2 会場・チケット情報セクション

| 項目              | 必須 | 型     | 説明                        |
| ----------------- | ---- | ------ | --------------------------- |
| 会場              | ✓    | select | venues テーブルから動的取得 |
| チケット/申込 URL | -    | string | チケット購入・申込用 URL    |

#### 2.3 チケット種別セクション

| 項目   | 必須 | 型     | 説明                               |
| ------ | ---- | ------ | ---------------------------------- |
| 種別名 | -    | string | チケットの種別名（例：一般、学生） |
| 料金   | -    | string | チケット料金（例：¥3,000）         |

- 初期値：「一般」種別が 1 つ設定済み
- 動的追加・削除可能（最低 1 つは必須）
- 削除ボタンは 1 つの場合は無効化

#### 2.4 スケジュールセクション

| 項目     | 必須 | 型       | 説明           |
| -------- | ---- | -------- | -------------- |
| 公演日時 | ✓    | DateTime | 公演の開始日時 |

- 初期値：翌日 19:00 が 1 つ設定済み
- 動的追加・削除可能（最低 1 つは必須）
- 削除ボタンは 1 つの場合は無効化
- DateTimePicker で日時選択

## 3. データベース構造

### 3.1 使用テーブル

#### performances テーブル

```typescript
interface Performance {
  id: string; // 自動生成
  organizer_id: string; // 固定値（テスト用）
  title: string; // フォーム入力
  description: string; // フォーム入力
  performance_date: string; // 最初のスケジュールから自動設定
  performance_time: string; // 最初のスケジュールから自動設定
  venue_name: string; // 選択された会場名
  region: Region; // 選択された会場の地域
  ticket_url?: string; // フォーム入力（任意）
  plan_type: PlanType; // 固定値 'basic'
  status: PerformanceStatus; // 固定値 'active'
  view_count: number; // 初期値 0
  created_at: string; // 自動生成
  updated_at: string; // 自動生成
}
```

#### performance_schedules テーブル

```typescript
interface PerformanceSchedule {
  id: string; // 自動生成
  performance_id: string; // 作成された公演のID
  start_at: string; // ISO文字列形式の開始日時
}
```

#### performance_ticket_types テーブル

```typescript
interface PerformanceTicketType {
  id: string; // 自動生成
  performance_id: string; // 作成された公演のID
  name: string; // チケット種別名
  price: string; // チケット料金
  display_order: number; // 表示順序
}
```

#### venues テーブル（参照のみ）

```typescript
interface Venue {
  id: string;
  name: string;
  region: Region;
}
```

### 3.2 データ保存フロー

1. **バリデーション実行**

   - タイトル必須チェック
   - 会場選択必須チェック
   - スケジュール存在チェック

2. **performances テーブルへの保存**

   - 基本情報の保存
   - 最初のスケジュールから日付・時間を抽出
   - 選択された会場情報を設定

3. **performance_schedules テーブルへの保存**

   - 全スケジュールを一括保存
   - ISO 文字列形式で日時を保存

4. **performance_ticket_types テーブルへの保存**

   - 名前と料金が入力されたチケット種別のみ保存
   - 表示順序を自動設定

5. **リダイレクト**
   - 成功時：`/performances/{id}` へ遷移

## 4. UI/UX 仕様

### 4.1 レイアウト

- **コンテナ**: Material-UI Container（maxWidth: md）
- **間隔**: 各セクション間に 6 単位のスペース
- **フォント**: 太字（fontWeight: 900）を多用したモダンデザイン

### 4.2 セクション構成

#### ヘッダー

- タイトル：「公演を作成」（h2、太字）
- エラーアラート（エラー発生時のみ表示）

#### 基本情報セクション

- セクションタイトル：「基本情報」
- タイトル入力：必須、標準バリアント
- 説明入力：複数行（4 行）、標準バリアント

#### 会場・URL 情報セクション

- 2 カラムグリッドレイアウト
- 会場選択：ドロップダウン、必須
- URL 入力：標準バリアント、任意

#### チケット種別セクション

- 黒枠ボックス（2px solid black）
- セクションタイトル：「チケット種別」
- 動的リスト：種別名・料金の入力ペア
- 追加ボタン：「種別を追加」
- 削除ボタン：各行に配置（1 つの場合は無効）

#### スケジュールセクション

- 灰色背景ボックス（#f9f9f9）、黒枠
- セクションタイトル：「スケジュール」
- 動的リスト：DateTimePicker コンポーネント
- 追加ボタン：「日程を追加」
- 削除ボタン：各行に配置（1 つの場合は無効）

#### 送信ボタン

- 全幅ボタン
- 黒背景、白文字
- ローディング時：「保存中...」+ スピナー
- 通常時：「公演を公開」+ 保存アイコン

### 4.3 スタイリング詳細

#### カラーパレット

- **メインカラー**: 黒（#000000）
- **背景色**: 白、薄灰色（#f9f9f9）
- **ボーダー**: 黒（2px solid、1.5px solid）
- **ホバー**: ダークグレー（#333333）

#### フォント

- **見出し**: fontWeight: 900
- **ラベル**: fontWeight: 900、color: black
- **ボタン**: fontWeight: 900

#### レスポンシブ

- **ブレークポイント**: md（768px）
- **グリッド**: 12 カラムシステム
- **モバイル**: xs=12（全幅）
- **デスクトップ**: md=6（半幅）

## 5. バリデーション仕様

### 5.1 必須項目チェック

| 項目         | エラーメッセージ                              |
| ------------ | --------------------------------------------- |
| タイトル     | 「タイトルを入力してください」                |
| 会場         | 「会場を選択してください」                    |
| スケジュール | 「最低 1 つのスケジュールを設定してください」 |

### 5.2 データ整合性チェック

| 項目         | エラーメッセージ                   |
| ------------ | ---------------------------------- |
| 会場存在確認 | 「選択された会場が見つかりません」 |

### 5.3 エラー表示

- Material-UI Alert コンポーネント使用
- severity="error"
- 角丸なし（borderRadius: 0）
- 太字（fontWeight: 700）

## 6. 技術仕様

### 6.1 使用ライブラリ

- **React**: 19.x（Hooks 使用）
- **Next.js**: 16.x（App Router）
- **Material-UI (MUI Core)**: 7.x
- **Material-UI X Date Pickers**: 8.x
- **Day.js**: 日時操作
- **Supabase**: データベース接続

### 6.2 状態管理

```typescript
// 基本状態
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [venues, setVenues] = useState<any[]>([]);

// フォーム状態
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [selectedVenueId, setSelectedVenueId] = useState("");
const [ticketUrl, setTicketUrl] = useState("");

// 動的リスト状態
const [schedules, setSchedules] = useState<Dayjs[]>([
  dayjs().add(1, "day").hour(19).minute(0),
]);
const [ticketTypes, setTicketTypes] = useState([{ name: "一般", price: "" }]);
```

### 6.3 国際化設定

- **ロケール**: 日本語（ja）
- **日時フォーマット**: Day.js 日本語ロケール
- **DateTimePicker**: 日本語表示

## 7. エラーハンドリング

### 7.1 ネットワークエラー

- Supabase エラーをキャッチ
- ユーザーフレンドリーなメッセージ表示
- ローディング状態の適切な管理

### 7.2 ユーザー入力エラー

- リアルタイムバリデーション
- 送信前の包括的チェック
- 明確なエラーメッセージ

## 8. パフォーマンス考慮事項

### 8.1 データ取得最適化

- 会場データの初回取得のみ
- useEffect での適切な依存関係管理

### 8.2 レンダリング最適化

- 状態更新の最小化
- 不要な再レンダリングの防止

## 9. セキュリティ考慮事項

### 9.1 入力サニタイゼーション

- Supabase の自動エスケープ機能活用
- XSS 攻撃対策

### 9.2 認証・認可

- 現在はテスト用固定 ID 使用
- 将来的にはログインユーザー ID 使用予定

## 10. 今後の拡張予定

### 10.1 機能拡張

- 画像アップロード機能
- 出演者情報入力
- 公演時間（duration）設定
- 会場住所入力

### 10.2 UI/UX 改善

- プレビュー機能
- 下書き保存機能
- 入力内容の自動保存

### 10.3 バリデーション強化

- URL 形式チェック
- 料金形式チェック
- 日時の論理チェック

## 11. テスト項目

### 11.1 機能テスト

- [ ] 正常な公演作成フロー
- [ ] 必須項目バリデーション
- [ ] 動的リストの追加・削除
- [ ] エラーハンドリング
- [ ] リダイレクト動作

### 11.2 UI/UX テスト

- [ ] レスポンシブデザイン
- [ ] アクセシビリティ
- [ ] ローディング状態表示
- [ ] エラーメッセージ表示

### 11.3 データ整合性テスト

- [ ] データベース保存確認
- [ ] 関連テーブル連携確認
- [ ] 文字エンコーディング確認

---

**作成日**: 2026 年 1 月 4 日  
**バージョン**: 1.1  
**最終更新**: 2026 年 3 月 1 日

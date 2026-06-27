# JobFit Analytics

JobFit Analytics は、就職活動中の学生を想定したプロトタイプです。FastAPI のバックエンドと Next.js のフロントエンドを使い、ダミー企業データをもとに企業比較、相性スコア算出、応募管理、分析の見せ方までを一通りまとめています。

## プロジェクト概要

このアプリは、企業データを一覧・詳細で確認しながら、希望条件に基づくマッチング結果、応募状況、スコアの考え方を同じ体験の中で扱えるようにした就活分析ツールです。UI は日本語で統一しており、実装の意図が伝わることを重視しています。

## 開発動機

私自身が就職活動を進める中で、対象企業が多く、自分の希望条件に合う企業を効率よく探すことに難しさを感じたこと、および、複数企業の選考を同時進行する際に、選考フェーズや応募状況の管理負荷が大きいと感じ、これを解決するような何らかの方法が就活中の学生に求められているのではないかと考えたためです。

本アプリは、新卒就活生を主なペルソナとして、次の 2 点を主要な課題に設定しています。

- 多数の企業から、自分に合う企業を見つけにくい
- 複数企業の選考状況を、就活の実態に合わせて管理しにくい

高度情報社会では選択肢が増えるほど意思決定の負荷も高まります。このアプリでは企業情報の一覧表示に加え、データ分析による適合度スコアを提示し、就活における判断を支援することを目指しています。

## ポートフォリオとしての目的

このプロジェクトは、本番運用を前提にしたサービスではなく、次のような実装力を示すための作品です。

- API 設計とフロントエンド連携
- ダミーデータを使った分析 UI の設計
- マッチング指標の可視化
- ブラウザ保存を使った軽量な状態管理
- 将来の DB 化を見据えた段階的な設計

## 対象ユーザーと解決したい課題

対象は、就職活動中の学生や、複数企業を並行して比較したい利用者です。主に次の課題を扱います。

- 企業ごとの条件差を比較しづらい
- 自分の希望に合う企業を絞り込みにくい
- 応募した企業の進捗を一元管理しにくい
- スコアの意味が分からず、結果を解釈しづらい

## 現在の機能

- FastAPI によるバックエンド API
- Next.js / TypeScript / Tailwind CSS によるフロントエンド
- JSON で管理するダミー企業データ
- 企業一覧・企業詳細ページ
- 希望条件に基づく相性スコア算出
- POST API による希望条件別マッチング
- localStorage による希望条件・応募管理の簡易保存
- ダッシュボードによる応募状況の概要表示
- 分析ラボによるスコア説明、企業タイプ分類、トレードオフ分析、条件別おすすめ表示

## スコアリングモデル概要

企業は数値特徴量のベクトルとして扱います。年収、残業、休日は $0〜100$ に正規化し、1〜10 の特徴スコアは $0〜100$ に変換します。そのうえで、以下の指標を計算します。

- `weighted_satisfaction_score`
- `cosine_similarity_score`
- `career_priority_score`
- `risk_penalty`
- `match_score`

総合スコアは次の式で計算します。

```text
match_score =
  0.5 * weighted_satisfaction_score
  + 0.3 * cosine_similarity_score
  + 0.2 * career_priority_score
  - risk_penalty
```

## 使用技術

- Backend: FastAPI, Python, Pydantic, scikit-learn
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Data: JSON dummy data, browser localStorage
- Planned later: SQLite, PostgreSQL

## ディレクトリ構成

```text
JobFit_Analytics/
├─ backend/
│  └─ app/
│     ├─ data/
│     ├─ routers/
│     ├─ services/
│     └─ main.py
├─ frontend/
│  ├─ app/
│  │  ├─ applications/
│  │  ├─ companies/
│  │  ├─ dashboard/
│  │  ├─ lab/
│  │  ├─ preferences/
│  │  └─ layout.tsx
│  └─ lib/
└─ README.md
```

## バックエンドの起動方法

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend は通常 `http://localhost:8000` で起動します。

## フロントエンドの起動方法

```bash
cd frontend
npm install
npm run dev
```

Frontend は通常 `http://localhost:3000` で起動します。

## API エンドポイント

- `GET /companies`
- `GET /companies/{company_id}`
- `GET /matching/companies`
- `POST /matching/companies`
- `GET /matching/companies/{company_id}`
- `GET /analytics/dashboard`
- `GET /analytics/lab`

## 現在の制限

- 企業データはダミー JSON です。
- 希望条件と応募管理は browser localStorage に保存しています。
- データは端末・ブラウザをまたいで共有されません。
- 認証機能は未実装です。
- DB 永続化は未実装です。
- スコアリングは説明可能性を重視したプロトタイプ用のルールベースです。
- 学習済みモデルによる予測ではありません。
- API 連携はローカル開発を前提にしています。

## 今後の拡張予定

- 認証・ユーザー管理
- SQLite / PostgreSQL によるデータベース永続化
- 応募企業ごとの締切日管理
- 締切が近い企業の通知機能
- 締切順・選考フェーズ別のソート機能
- 外部 API や公式サイトからの企業データ取得
- LLM を用いた企業情報・ユーザー文章からの特徴量抽出
- 抽出結果の正確性評価と人手確認フロー
- ユーザーの応募結果や志望度評価を用いたモデル評価
- 回帰分析などによるスコアリングモデルの検証
- 推薦結果の改善と分析ラボの拡張

将来的には、ユーザーの応募結果や志望度評価を用いて、企業特徴量が応募判断や選考結果にどの程度関係するかを検証する予定です。現段階のスコアリングは説明可能性を重視したルールベースであり、学習済みモデルによる予測ではありません。

LLM 連携を行う場合は、企業ホームページやユーザーの文章入力から抽出した特徴量をそのまま利用するのではなく、数値特徴量やカテゴリ分類などについて評価する予定です。また、抽出根拠を確認できる形にし、人手確認を組み合わせることで信頼性を高める設計を目指します。

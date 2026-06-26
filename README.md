# JobFit Analytics

JobFit Analytics は、就職活動中の学生を対象にしたポートフォリオ用プロトタイプです。企業データとユーザーの希望条件をもとに、企業との相性を可視化し、応募進捗もまとめて管理できる Web アプリとして設計しています。

## 目的

就活では、次の 2 つが大きな負担になります。

- 多数の企業を横並びで比較し、自分の条件に合う企業を見つけにくい
- 複数企業の応募・選考状況を同時に管理しづらい

このプロトタイプは、企業データ、ユーザー嗜好、データ分析を組み合わせて fit score を算出し、企業選びと進捗管理を一つの画面で支援することを目指します。

## ターゲットユーザー

- 就職活動中の学生
- 複数企業へ同時に応募している利用者
- 企業研究と選考管理を一体で行いたい利用者

## このプロジェクトで示したい技術要素

このリポジトリは、単なる UI サンプルではなく、以下の実践スキルを見せるためのポートフォリオです。

- AI の活用方針を含む分析設計
- 統計・データ分析の基礎
- Web アプリケーション開発
- データベースを見据えたプロダクト設計

## Tech Stack

- Frontend: Next.js, TypeScript, React, Tailwind CSS
- Backend: FastAPI, Python
- Analysis: pandas, scikit-learn
- Database: SQLite を最初に採用し、将来的に PostgreSQL へ移行

## Current MVP 方針

最初の動く版では、DB はまだ使わず、JSON に保存したダミー企業データを FastAPI から返します。フロントエンドはページ構成を先に用意し、後から API とつなぎます。

## MVP Roadmap

1. バックエンドの最小 API を作る
	- `/companies` でダミー企業データを返す
	- `/companies/{company_id}` で企業詳細を返す
	- `/analytics/dashboard` で分析用サマリーを返す

2. フロントエンドのページ構成を作る
	- `/`
	- `/companies`
	- `/companies/[id]`
	- `/preferences`
	- `/dashboard`
	- `/applications`
	- `/lab`

3. fit score の考え方を段階的に実装する
	- まずはルールベースの簡易スコア
	- 次に pandas で集計・分析
	- その後 scikit-learn を使った発展的な分析へ拡張

4. データ保存を追加する
	- 最初は SQLite
	- 将来的には PostgreSQL へ移行できる構成にする

## 現在の状態

- README の整理
- FastAPI バックエンドの雛形作成予定
- Next.js フロントエンドの雛形作成予定
- JSON ベースのダミー企業データ追加予定

この段階では、まずローカルで backend が起動し、`/companies` がダミーデータを返せる状態を目標にします。

## ローカル起動

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend は Next.js の雛形を追加済みですが、まだ依存関係はインストールしていません。最初の `npm install` が必要です。

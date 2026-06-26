# JobFit Analytics

JobFit Analytics は、就職活動中の学生を想定したポートフォリオ用プロトタイプです。FastAPI のバックエンドと Next.js のフロントエンドを使い、ダミー企業データをもとに企業比較、相性スコア算出、応募管理、分析の見せ方までを一通りまとめています。

## Project Overview

このアプリは、企業データを一覧・詳細で確認しながら、希望条件に基づくマッチング結果、応募状況、スコアの考え方を同じ体験の中で扱えるようにした就活分析ツールです。UI は日本語で統一しており、ポートフォリオとして実装の意図が伝わることを重視しています。

## Purpose As A Portfolio Project

このプロジェクトは、本番運用を前提にしたサービスではなく、次のような実装力を示すための作品です。

- API 設計とフロントエンド連携
- ダミーデータを使った分析 UI の設計
- マッチング指標の可視化
- ブラウザ保存を使った軽量な状態管理
- 将来の DB 化を見据えた段階的な設計

## Target Users And Problems Solved

対象は、就職活動中の学生や、複数企業を並行して比較したい利用者です。主に次の課題を扱います。

- 企業ごとの条件差を比較しづらい
- 自分の希望に合う企業を絞り込みにくい
- 応募した企業の進捗を一元管理しにくい
- スコアの意味が分からず、結果を解釈しづらい

## Current Features

- FastAPI バックエンド
- Next.js フロントエンド
- JSON で管理するダミー企業データ
- 企業一覧ページと企業詳細ページ
- 日本語 UI
- Matching score calculation API
- Preference-based matching page
- LocalStorage-based application tracking
- Dashboard overview
- Analysis lab explaining the scoring model

## Scoring Model Overview

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

## Tech Stack

- Backend: FastAPI, Python, Pydantic, scikit-learn
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Data: JSON dummy data, browser localStorage
- Planned later: SQLite, PostgreSQL

## Directory Structure

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

## How To Run Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend は通常 `http://localhost:8000` で起動します。

## How To Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend は通常 `http://localhost:3000` で起動します。

## API Endpoints

- `GET /companies`
- `GET /companies/{company_id}`
- `GET /matching/companies`
- `POST /matching/companies`
- `GET /matching/companies/{company_id}`
- `GET /analytics/dashboard`

## Current Limitations

- 企業データはダミー JSON です。
- preferences と applications はまだ DB に保存していません。
- application tracking は frontend の localStorage に依存しています。
- 認証機能は未実装です。
- スコアリングはプロトタイプ用の重みづけです。
- API 連携はローカル開発を前提にしています。

## Future Roadmap

1. SQLite を使った永続化
2. PostgreSQL への移行を見据えたデータ層の整理
3. 認証・ユーザー管理の追加
4. 応募履歴と選考結果の保存
5. スコア重みの調整と分析精度の改善
6. 比較・分析ページの拡張

この README は現在の MVP 実装に合わせて更新しています。プロトタイプとしての位置づけを保ちながら、後から DB 化や認証を追加できる構成です。

# 推奨開発環境
エディター：VSCode\
API動作確認：Postman\
DB：A5M2\
redis：なし。。\
動作環境：local/docker\

# frontend
cd frontend\
npm ci （初回起動　and package.jsonに更新が入った時のみ実施\
npm start

## backend
cd backend\
go mod tidy\
通常起動時\
docker compose up -d\
デバッグ起動時\
VSCodeのRun（上）→Start Debugging\
※　あえてdockerで動かすメリットなんだってのは怪しい

## backendTest
VSCodeのtesting（左）\
CIもあるけどfrontをPR出しても走るの後でなんとかする

## db
MYSQL_USER: temp_project\
MYSQL_PASSWORD: temp_project\
MYSQL_DATABASE: temp_project\
backend/_tools/mysql/schema.sqlを実行（ついでにコメントアウトされている初期ユーザも追加）

## API doc
http://localhost:9000/
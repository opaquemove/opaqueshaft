# opaqueshaft
OpaqueShaft is management tool for element school children.
OpaqueShaftは施設における生徒のチェックイン、チェックアウトを管理するWebアプリのサンプルコードです。

利用しているテクノロジ
・node.js
・PostgreSQL
・HTML5/CSS3

Webアプリはnode.jsを使用します。
データベースにはPostgreSQLを使用します。

データベースopaqueshaftを次のSQLを実行して生成しておきます。

>psql -U xxx -P -f create_ddl.sql

テーブル準備：

２つのテーブルにレコードを追加します。

rangesテーブル
年度を登録します。

例)
insert into ranges( range_id, sotd, eotd ) values( 2021, '2021-4-1','2022-3-31');

accountsテーブル
ログインアカウントを登録します。

例)
insert into accounts( acc_id, acc_name, password, range_id ) values( 'acc1', 'ACC1', 'password', 2021 );

環境変数の準備
アプリからPostgreSQLに接続するための環境変数を準備しておきます。
(id/passwordはPostgreSQLのログインアカウント情報)

$export DATABASE_URL=postgres://[id]:[password]@localhost:5432/opaqueshaft



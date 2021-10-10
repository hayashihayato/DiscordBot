# DiscordBot
ディスコードで機能するボット

## 使用Package
```
"@discordjs/opus": "github:discordjs/opus",
"discord.js": "^12.3.1",
"ffmpeg-static": "^4.4.0",
"node": "^16.9.1",
"opusscript": "0.0.8",
"util": "^0.12.4",
"ytdl-core": "^4.9.1",
"ytpl": "^2.2.3",
"ytsr": "^3.5.3"
```

## 機能一覧

```
:help(:h)
コマンド一覧表示
:roles(:r)
役職名一覧
:join(:j)
ボイスチャンネルに接続
:play [URL or 検索したい文字列](:p)
URL or 検索結果一番目の動画を再生
:skip(:fs)
再生中の音楽をスキップ
:loop(:l)
音楽のループ切り替え
:list(:ml)
予約されている音楽の一覧
:nowplay(:np)
再生中の音楽の情報
:disconnected(:dc)
ボイスチャンネルから切断
:dice [最大値]
指定した最大値までのサイコロを振ります
+[rolename]
役職付与
-[rolename]
役職剝奪
```

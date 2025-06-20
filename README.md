# 🎛️NAI utils

NAIがちょっと便利になるかもしれない機能をまとめたChrome拡張です。

![Image](https://github.com/user-attachments/assets/c5a8338d-4b80-4201-879c-e9f2882269bd)

## 📲インストール

1. Releasesから`NaiUtils.zip`をダウンロードし、解凍します。
2. ChromeのURL欄に`chrome://extensions/`と入力し、拡張機能の管理画面に移動します。
3. 右上隅で「デベロッパーモード」をONにします。
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、手順1.で解凍された"dist"フォルダを選択すると拡張機能がインストールされます。
    - 再インストール時は前のバージョンを削除しておいてください。

## ⚠注意事項

-   本拡張機能は完璧な動作や性能を保証するものではありません。  
    本拡張機能の使用によって生じた問題や損害について、開発者はいかなる責任も負いかねます。  
    上記の点をご理解いただいた上、自己責任でのご利用をお願いいたします。
-   Anlasの購入やサブスクリプションプランの変更などの重要な操作を行う場合、**必ず NAI utils を停止**してください。  
    停止するには、画像のようにChromeの拡張機能管理画面で NAI utils のスイッチをOFFにし、NAIをリロードします。

    ![Image](https://github.com/user-attachments/assets/e1d6a5f6-7a1c-46f0-b0a8-69e3c1ea1e4f)

## ⚙️設定

-   Chromeのメニューバーの拡張機能ボタンを押し、`NAI utils`を選択すると各機能のON/OFFを設定するページが開きます。
-   各設定を反映する場合は、NAIのページリロードが必要です。

## 🧩機能

### プロンプト関連設定を有効にする

-   プロンプト欄に関連する機能を使用する場合はONに設定してください。

> [!IMPORTANT]
> NAI V4 リリース以降のUI仕様変更に伴い、プロンプト欄に関連する機能の動作が不安定になっています。  
> また、機能を有効にする場合は以下の制約が発生します。
>
> -   NAI側プロンプト欄の表示が、通常/ネガティブプロンプトが上下に並んだ状態になっている必要があります。
>     -   タブ表示になっている場合、プロンプト関連機能は正常に動作しません。
> -   プロンプト欄にキーボードから入力した文字列は、生成ボタンを押すまで確定されません。
>     -   確定していないプロンプトは、Inpaintなどで画面が切り替わると消失します。
> -   通常/ネガティブプロンプト欄のいずれかを空欄にした状態でNAIのリロードが発生すると、その直後は動作しません。
>     -   両方のプロンプト欄を埋めた状態での生成や、Import Metadataでのプロンプト読み込みを実行したあとに再度リロードする必要があります。

> [!WARNING]
>
> -   NAI V4 のキャラクタープロンプト上では動作しません。現状、対応予定もありません。

### 📜プロンプト欄設定

#### "( )" / "[ ]" を自動で閉じる

-   各開き括弧キーを押すと自動で括弧を閉じます。
-   文字列の選択状態によって動作が変わります。
    -   選択中の場合
        -   選択中の文字列を括弧で閉じる
    -   未選択の場合
        -   キャレットの後ろに文字がない場合のみ括弧を閉じる

#### プロンプト欄の幅・高さを変更する

-   プロンプト欄の幅・高さを画面サイズの割合で指定して変更します。
-   0でOFFになります。
-   ⚠️幅を広げるとi2i欄の画像が引き伸ばして表示され見にくくなることがあります。

### ⌨️プロンプト欄ショートカットキー設定

-   Ctrl / Alt + ↑ / ↓ キーで "{ }", "[ ]" の数を増減する
-   Ctrl + Alt + ↑ / ↓ キーで行を移動する
    -   動作は[Naildcardのショートカットキー](https://github.com/xmitoux/naildcard#%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%AD%E3%83%BC)と同様です。
-   ⚠️ショートカットキーによる文字列操作は標準のundo/redoができません。

### 🕘生成履歴機能

#### 生成履歴の右クリック保存

生成履歴エリアを右クリックで表示中の画像を保存します。

#### 生成履歴のマウスホイール選択

-   生成履歴エリアでマウスホイールすると画像を選択します。
-   `Alt`キーを押している間は通常のスクロールをします。

#### 閲覧済みの生成履歴の強調

一度選択した生成履歴画像に水色の枠線を付け、閲覧済みであることをわかりやすくします。

#### 生成履歴の即時削除

削除確認ダイアログを表示せず、すぐに削除します。

#### ⚠️生成履歴機能の注意事項

inpaint画面を開いた直後は機能が失われますが、1枚生成すると元に戻ります。

### 👀見た目の機能

#### 画像設定欄を生成画像上部に移動する

プロンプト欄下にある生成枚数とアスペクト比の設定欄を生成画像の上に移動します。

#### モデル選択欄の非表示

モデル選択欄を非表示にし、プロンプト欄とi2i欄の表示領域を広げます。

#### Director Toolsボタンの非表示

Director Toolsボタンを非表示にします。

### 🛠️その他の機能

#### 画面上のどこでも Ctrl + Enter で生成

`Ctrl + Enter`で画面上のどこにフォーカスがあっても生成を行います。

#### 保存ファイル名を<日時-シード値>にする

-   ファイル名をデフォルトの`プロンプト s-シード値.png`から`yyyyMMddHHmmsss-シード値.png`に変更します。
-   ⚠️この機能がONの場合、inpaint画面を開くと生成履歴保存ボタンの状態が失われ、保存済みの灰色が白色に戻ります。NAI標準とは異なる動作となりますのでご注意ください。

#### 一部の数値設定スライダーに +/- ボタンを表示する

-   スライダーでの数値設定をボタンでもできるようにします。
-   対象のスライダーは以下のとおりです。
    -   inpaintのペンサイズ
    -   i2iのStrength・Noise

#### Anlas消費時の確認ダイアログを表示する

-   Anlasを消費する操作を行う際に はい/ いいえ の確認ダイアログを表示するようにします。いいえを選択すると操作を中止します。
-   対象の操作は以下の通りです。
    -   複数枚生成
    -   Upscale
    -   Variation生成

#### 生成完了時に音を鳴らす

-   生成完了時に音を鳴らします。
-   音はデフォルトのものから変更可能です。任意のmp3ファイルを`generated-sound.mp3`にリネームし、解凍した拡張機能のフォルダ配下の`dist/assets/`に置いたあと、NAIをリロードしてください。

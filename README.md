# Vue 3 Chrome拡張開発用テンプレート
- Vue 3でChome拡張を開発するためのテンプレートリポジトリです。
## 構成
Vite + crxjs + Vue 3 + TypeScript + ESLint + Prettier
## クイックスタート
※パッケージ管理に`pnpm`を使用します。なければ[こちら](https://pnpm.io/ja/installation)からインストールしてください。
```
pnpm i
pnpm run dev
```

## VSCode設定
- エディタにはVSCodeを使用します。
- 以下の拡張機能のインストールが必要です。
  - Volar: Vueのコーディングに必須
  - ESLint: JS, TS用のlinter
  - Prettier: コードフォーマッタ

## crxjsバグ対応
- ビルドができないバグがある
  - https://github.com/crxjs/chrome-extension-tools/issues/836
- `node_modules/@crxjs/dist/index.mjs`の101行目を以下のように修正する
  ```js
  const asset = bundle[key] || bundle[`.vite/${key};`];
  ```

<details>
<summary>Vite Orginal README</summary>

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

-   [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

</details>

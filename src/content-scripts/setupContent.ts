import { ID_ATTRIBUTE } from '@/constants/nai';
import { createClassName } from '@/utils';

export let saveButton: HTMLButtonElement;

export const setupContent = () => {
    let saveButtonIconClass = '';

    const proc = () => {
        // 保存ボタンを取得できるようにする
        const setupSaveButton = () => {
            // 保存ボタンの親または子要素を取得
            // (ページ表示後最初の1回は親(projection-idで特定)、以降(i2iで再描画時)は保持したclass名で子要素を取得)
            if (!saveButtonIconClass) {
                const projectionId = 10;
                const parentDiv = document.querySelector<HTMLDivElement>(
                    `div[${ID_ATTRIBUTE}="${projectionId}"]`,
                );
                if (!parentDiv) {
                    return;
                }

                saveButton = parentDiv.querySelector('button') as HTMLButtonElement;
                // ボタン特定用に子要素のclass名を保持
                saveButtonIconClass = createClassName(saveButton.querySelector('div')!.className);
            } else {
                // ボタンの子要素(フロッピーアイコン)を取得
                const saveButtonIconDiv =
                    document.querySelector<HTMLDivElement>(saveButtonIconClass);
                if (!saveButtonIconDiv) {
                    return;
                }

                // 親であるボタンを取得
                saveButton = saveButtonIconDiv.parentNode as HTMLButtonElement;
            }
        };
        setupSaveButton();
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

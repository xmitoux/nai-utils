import { createClassName } from '@/utils';

export const saveHistoryShortcut = () => {
    let saveButtonIconClass = '';

    const proc = () => {
        let saveButton: HTMLButtonElement | null = null;

        // 保存ボタンの親または子要素を取得
        // (ページ表示後最初の1回は親(projection-idで特定)、以降(i2iで再描画時)は保持したclass名で子要素を取得)
        if (!saveButtonIconClass) {
            const parentDiv = document.querySelector<HTMLDivElement>(
                'div[data-projection-id="10"]',
            );
            if (!parentDiv) {
                return;
            }

            saveButton = parentDiv.querySelector('button') as HTMLButtonElement;
            // ボタン特定用に子要素のclass名を保持
            saveButtonIconClass = createClassName(saveButton.querySelector('div')!.className);
        } else {
            // ボタンの子要素(フロッピーアイコン)を取得
            const saveButtonIconDiv = document.querySelector<HTMLDivElement>(saveButtonIconClass);
            if (!saveButtonIconDiv) {
                return;
            }

            // 親であるボタンを取得
            saveButton = saveButtonIconDiv.parentNode as HTMLButtonElement;
        }

        const onSave = (event: MouseEvent) => {
            event.preventDefault();
            saveButton!.click();
        };

        const thumbnailContainer = document.getElementById('historyContainer')!;

        // 既にイベントリスナが追加されていないか確認
        if (!thumbnailContainer.dataset.contextmenuListenerAdded) {
            thumbnailContainer.addEventListener('contextmenu', onSave);
            thumbnailContainer.dataset.contextmenuListenerAdded = 'true';
        }
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

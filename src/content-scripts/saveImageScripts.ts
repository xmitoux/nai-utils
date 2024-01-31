import dayjs from 'dayjs';
import { createClassName } from '@/utils';

export const saveImageScripts = ({
    datetimeFilename,
    enableHistorySaveShortcut,
}: ExtensionSettings) => {
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

        const thumbnailContainer = document.getElementById('historyContainer')!;

        // 既にイベントリスナが追加されていないか確認
        if (thumbnailContainer.dataset.contextmenuListenerAdded) {
            return;
        }

        // ファイル名を日時にして保存するボタンをクローンして置き換え
        const saveButtonClone = saveButton.cloneNode(true) as HTMLButtonElement;
        saveButtonClone.addEventListener('click', () =>
            // 設定で動作切り替え
            datetimeFilename ? downloadDatetimeNamedImage() : saveButton!.click(),
        );
        saveButton.style.display = 'none';
        saveButton.parentNode!.insertBefore(saveButtonClone, saveButton);

        // 履歴エリアに右クリック保存イベントを追加
        const onSave = (event: MouseEvent) => {
            event.preventDefault();
            saveButtonClone.click();
        };
        enableHistorySaveShortcut && thumbnailContainer.addEventListener('contextmenu', onSave);
        thumbnailContainer.dataset.contextmenuListenerAdded = 'true';
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

const downloadDatetimeNamedImage = async () => {
    const imageElement = document.querySelector<HTMLImageElement>('img')!;

    // Blob URLからBlobを取得
    const response = await fetch(imageElement.src);
    const blob = await response.blob();

    // Blobからダウンロード用のURLを作成
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const now = dayjs().format('YYYYMMDDHHmmss');
    const seed = getSeed() || '';
    const fileName = `${now}-${seed}.png`;
    link.download = fileName;

    link.click();
    URL.revokeObjectURL(url);
};

const getSeed = (): string | null => {
    const spans = document.querySelectorAll('span');

    // シードコピーボタンの直前にあるシード値span要素を探してシードを取得
    for (const span of spans) {
        if (span.textContent?.trim() === 'Copy to Seed') {
            const previousElement = span.previousElementSibling as HTMLSpanElement;
            return previousElement?.textContent?.trim() ?? null;
        }
    }
    return null;
};

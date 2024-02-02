import dayjs from 'dayjs';
import { saveButton } from '@/content-scripts/setupContent';

export const saveImageScripts = ({
    datetimeFilename,
    enableHistorySaveShortcut,
}: ExtensionSettings) => {
    const proc = () => {
        const thumbnailContainer = document.getElementById('historyContainer')!;

        // 既にイベントリスナが追加されていないか確認
        if (thumbnailContainer.dataset.contextmenuListenerAdded) {
            return;
        }

        // 設定で動作切り替え
        if (datetimeFilename) {
            saveButton.addEventListener('click', (event: Event) => {
                downloadDatetimeNamedImage();
                saveButton!.style.opacity = '0.4';
                event.stopPropagation();
            });
        }

        // 履歴エリアに右クリック保存イベントを追加
        const onSave = (event: MouseEvent) => {
            event.preventDefault();
            saveButton!.click();
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

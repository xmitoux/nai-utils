import { imageSettings } from '@/content-scripts/setupContents';

export const rearrangeImageSettings = ({ rearrangeImageSettings }: ExtensionSettings) => {
    const proc = () => {
        // 画像設定欄(枚数・アスペクト比)を生成画像上部に移動
        const appendImageSettings = () => {
            if (!imageSettings) {
                return;
            }

            // 生成画像の上にある<div class="display-grid-top">を探す
            const targetDiv = document.querySelector<HTMLDivElement>('div.display-grid-top');
            if (!targetDiv) {
                console.warn('画像設定欄の挿入先が見つかりません。');
                return;
            }

            // 挿入先に画像設定要素を追加
            const targetParentDiv = targetDiv?.parentElement?.parentElement as HTMLDivElement;
            if (targetParentDiv && !targetParentDiv.dataset.addedImageSettings) {
                targetParentDiv?.prepend(imageSettings);
                targetParentDiv.dataset.addedImageSettings = 'true';
            }
        };
        appendImageSettings();
    };

    rearrangeImageSettings &&
        new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

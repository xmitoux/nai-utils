import { imageSettings } from '@/content-scripts/setupContents';

export const rearrangeImageSettings = ({ rearrangeImageSettings }: ExtensionSettings) => {
    const proc = () => {
        // 画像設定欄(枚数・アスペクト比)を生成画像上部に移動
        const appendImageSettings = () => {
            if (!imageSettings) {
                return;
            }

            // 生成画像の上にあるaタグ持ちのdivを探す
            const targetDivs = Array.from(document.querySelectorAll<HTMLDivElement>('div')).filter(
                (div) => {
                    const firstChild = div.firstChild;

                    return firstChild && firstChild.nodeName === 'A';
                },
            );

            // 1つ目は左ペインの上にある要素なので2つ目を取得しそこに挿入
            const targetParentDiv = targetDivs?.[1]?.parentElement?.parentElement as HTMLDivElement;
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

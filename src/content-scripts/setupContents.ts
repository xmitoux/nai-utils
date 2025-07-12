import {
    BUTTON_TEXT_GENERATE_EN,
    BUTTON_TEXT_GENERATE_JA,
    BUTTON_TEXT_UPSCALE_EN,
    BUTTON_TEXT_UPSCALE_JA,
    BUTTON_ICON_SAVE,
    BUTTON_ICON_VARIATIONS,
    BUTTON_ICON_UPSCALE,
    DIV_TEXT_IMAGE_SETTINGS_EN,
    DIV_TEXT_IMAGE_SETTINGS_JA,
} from '@/constants/nai';
import { getIconButton } from '@/utils';

export let generateButton: HTMLButtonElement | undefined;
export let upscaleButtonText: HTMLButtonElement | undefined;
export let saveButton: HTMLButtonElement | undefined;
export let variationButton: HTMLButtonElement | undefined;
export let upscaleButton: HTMLButtonElement | undefined;
export let overlay: HTMLDivElement | undefined;
export let generatedImage: HTMLImageElement | undefined;
export let leftPaneDiv: HTMLDivElement | undefined;
export let imageSettings: HTMLDivElement | undefined;

export const setupContents = ({ highlightViewedHistory }: ExtensionSettings) => {
    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    const observer = new MutationObserver(proc);
    observer.observe(document.body, { childList: true, subtree: true });

    function proc() {
        const buttons = [...document.querySelectorAll<HTMLButtonElement>('button')];

        const setupTextButtons = () => {
            // 生成ボタンのupscaleボタンをテキストで探す
            for (const button of buttons) {
                const buttonText = button.textContent;
                if (
                    buttonText?.includes(BUTTON_TEXT_GENERATE_EN) ||
                    buttonText?.includes(BUTTON_TEXT_GENERATE_JA)
                ) {
                    generateButton = button;
                    // 最初の1個だけを取得
                    break;
                }
            }

            // i2iのupscaleボタンをテキストで探す
            for (const button of buttons) {
                const buttonText = button.textContent;
                if (
                    buttonText?.includes(BUTTON_TEXT_UPSCALE_EN) ||
                    buttonText?.includes(BUTTON_TEXT_UPSCALE_JA)
                ) {
                    upscaleButtonText = button;
                    // 最初の1個だけを取得
                    break;
                }
            }
        };
        setupTextButtons();

        const setupIconButtons = () => {
            saveButton = getIconButton(buttons, BUTTON_ICON_SAVE);
            variationButton = getIconButton(buttons, BUTTON_ICON_VARIATIONS);
            upscaleButton = getIconButton(buttons, BUTTON_ICON_UPSCALE);
        };
        setupIconButtons();

        const setupGeneratedImage = () => {
            // 生成画像要素を取得(<img class="image-grid-image">)
            const imageElements =
                document.querySelectorAll<HTMLImageElement>('img.image-grid-image');

            if (!imageElements.length) {
                console.warn('生成画像セットアップ失敗: 画像要素が見つかりません。');
                return;
            } else if (imageElements.length > 1) {
                console.warn('生成画像セットアップ失敗: 画像要素が複数見つかりました。');
                return;
            }

            generatedImage = imageElements[0];
        };
        setupGeneratedImage();

        const setupViewedHighlightOverlay = () => {
            if (!generatedImage) {
                return;
            }

            // 生成画像の親要素を取得
            const imageGrandParent = generatedImage.parentElement?.parentElement;
            if (!imageGrandParent) {
                return;
            }

            if (!imageGrandParent.dataset.overlayAdded) {
                // 閲覧済み画像の枠線を追加する
                // NOTE: 元々はオーバーレイだったが見づらいしドラッグできないので変更した
                const createOverlay = () => {
                    const overlayTmp = document.createElement('div');
                    overlayTmp.style.display = 'none';
                    overlayTmp.style.position = 'absolute';
                    // 画像の上と左にずらして配置しつつ大きくすることで枠線にする
                    overlayTmp.style.top = '-5px';
                    overlayTmp.style.left = '-5px';
                    overlayTmp.style.width = 'calc(100% + 10px)';
                    overlayTmp.style.height = 'calc(100% + 10px)';
                    overlayTmp.style.zIndex = '-1'; // ドラッグできるようにするため
                    overlayTmp.style.border = '5px solid rgba(255, 128, 200, 0.7)';

                    return overlayTmp;
                };

                overlay = createOverlay();

                // imgタグができる前に追加すると画面が止まる(謎)のでちょっと待つ
                setTimeout(() => {
                    imageGrandParent.append(overlay!);
                }, 100);

                imageGrandParent.dataset.overlayAdded = 'true';
            }
        };
        highlightViewedHistory && setupViewedHighlightOverlay();

        const setupImageSettings = () => {
            // 画像設定欄をラベルから取得
            const imageSettingsLabel = Array.from(
                document.querySelectorAll<HTMLDivElement>('div'),
            ).find((div) => {
                const textContent = div.textContent;
                return (
                    textContent === DIV_TEXT_IMAGE_SETTINGS_EN ||
                    textContent === DIV_TEXT_IMAGE_SETTINGS_JA
                );
            });

            const parent = imageSettingsLabel?.parentNode?.parentElement;
            if (parent) {
                imageSettings = parent as HTMLDivElement;
            }
        };
        setupImageSettings();
    }
};

import {
    BUTTON_TEXT_GENERATE_EN,
    BUTTON_TEXT_GENERATE_JA,
    BUTTON_TEXT_UPSCALE_EN,
    BUTTON_TEXT_UPSCALE_JA,
    BUTTON_ICON_SAVE,
    BUTTON_ICON_VARIATIONS,
    BUTTON_ICON_UPSCALE,
} from '@/constants/nai';

export let generateButton: HTMLButtonElement | undefined;
export let upscaleButtonText: HTMLButtonElement | undefined;
export let saveButton: HTMLButtonElement | undefined;
export let variationButton: HTMLButtonElement | undefined;
export let upscaleButton: HTMLButtonElement | undefined;
export let overlay: HTMLDivElement | undefined;
export let generatedImage: HTMLImageElement | undefined;

export const setupContents = () => {
    const proc = () => {
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
            saveButton = setupIconButton(buttons, BUTTON_ICON_SAVE);
            variationButton = setupIconButton(buttons, BUTTON_ICON_VARIATIONS);
            upscaleButton = setupIconButton(buttons, BUTTON_ICON_UPSCALE);
        };
        setupIconButtons();

        const setupViewedHighlightOverlay = () => {
            // 生成画像要素を取得
            const imageElements = document.querySelectorAll<HTMLImageElement>('img');
            if (!imageElements.length) {
                return;
            }

            // inpaint中は対象画像がimgタグとして2つ存在するので3つ目を取得
            generatedImage = imageElements.length === 1 ? imageElements[0] : imageElements[2];

            // 生成画像の親要素を取得
            const imageGrandParent = generatedImage.parentElement?.parentElement;
            if (!imageGrandParent) {
                return;
            }

            if (!imageGrandParent.dataset.overlayAdded) {
                const createOverlay = () => {
                    const overlayTmp = document.createElement('div');
                    overlayTmp.style.display = 'none';
                    overlayTmp.style.position = 'absolute';
                    overlayTmp.style.top = '0';
                    overlayTmp.style.left = '0';
                    overlayTmp.style.right = '0';
                    overlayTmp.style.bottom = '0';
                    overlayTmp.style.background = 'rgba(128, 128, 128, 0.3)';
                    overlayTmp.style.zIndex = '10'; // ないとオーバーレイされない

                    return overlayTmp;
                };

                overlay = createOverlay();

                // imgタグができる前に追加すると画面が止まる(謎)のでちょっと待つ
                setTimeout(() => {
                    imageGrandParent.prepend(overlay!);
                }, 100);

                imageGrandParent.dataset.overlayAdded = 'true';
            }
        };
        setupViewedHighlightOverlay();
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

const setupIconButton = (
    iconButtons: HTMLButtonElement[],
    buttonIconName: string,
): HTMLButtonElement => {
    const targetButton = iconButtons.find((button) => {
        if ([...button.children].some((child) => child.tagName === 'SPAN')) {
            // ボタン直下にspanを含む場合(テキストボタン)はスルー
            // (upscaleのアイコンがi2i欄と被っているため)
            return false;
        }

        const iconDiv = button.querySelector<HTMLDivElement>('div');
        if (!iconDiv) {
            return false;
        }

        const iconUrl = getComputedStyle(iconDiv).maskImage;
        return iconUrl.includes(buttonIconName);
    });
    return targetButton!;
};

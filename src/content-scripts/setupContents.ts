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

        const setupSaveButton = () => {
            saveButton = setupIconButton(buttons, BUTTON_ICON_SAVE);
        };
        setupSaveButton();

        const setupVariationButton = () => {
            variationButton = setupIconButton(buttons, BUTTON_ICON_VARIATIONS);
        };
        setupVariationButton();

        const setupUpscaleButton = () => {
            upscaleButton = setupIconButton(buttons, BUTTON_ICON_UPSCALE);
        };
        setupUpscaleButton();
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

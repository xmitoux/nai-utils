import {
    BUTTON_TEXT_GENERATE_EN,
    BUTTON_TEXT_GENERATE_JA,
    BUTTON_TEXT_UPSCALE_EN,
    BUTTON_TEXT_UPSCALE_JA,
    ID_ATTRIBUTE,
    PROJECTION_ID_SAVE,
    PROJECTION_ID_UPSCALE,
    PROJECTION_ID_VARIATION,
} from '@/constants/nai';
import { createClassName } from '@/utils';

export let generateButton: HTMLButtonElement | undefined;
export let upscaleButtonText: HTMLButtonElement | undefined;
export let saveButton: HTMLButtonElement | undefined;
export let variationButton: HTMLButtonElement | undefined;
export let upscaleButton: HTMLButtonElement | undefined;

export const setupContents = () => {
    let saveButtonIconClass: string | undefined;
    let variationButtonIconClass: string | undefined;
    let upscaleButtonIconClass: string | undefined;

    const proc = () => {
        const setupTextButton = () => {
            const buttons = document.querySelectorAll<HTMLButtonElement>('button');

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
        setupTextButton();

        const setupSaveButton = () => {
            [saveButton, saveButtonIconClass] = setupIconButton(
                PROJECTION_ID_SAVE,
                saveButtonIconClass,
            );
        };
        setupSaveButton();

        const setupVariationButton = () => {
            [variationButton, variationButtonIconClass] = setupIconButton(
                PROJECTION_ID_VARIATION,
                variationButtonIconClass,
            );
        };
        setupVariationButton();

        const setupUpscaleButton = () => {
            [upscaleButton, upscaleButtonIconClass] = setupIconButton(
                PROJECTION_ID_UPSCALE,
                upscaleButtonIconClass,
            );
        };
        setupUpscaleButton();
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

const setupIconButton = (
    projectionId: number,
    buttonIconClassName: string | undefined,
): [button?: HTMLButtonElement, buttonClassName?: string] => {
    // ボタンの親または子要素を取得
    // (ページ表示後最初の1回は親(projection-idで特定)、以降(i2iで再描画時)は保持したclass名で子要素を取得)
    if (!buttonIconClassName) {
        const parentDiv = document.querySelector<HTMLDivElement>(
            `div[${ID_ATTRIBUTE}="${projectionId}"]`,
        );
        if (!parentDiv) {
            return [];
        }

        const button = parentDiv.querySelector<HTMLButtonElement>('button')!;
        // ボタン特定用に子要素(アイコン)のclass名を保持
        const buttonIconClassName = createClassName(button.querySelector('div')!.className);
        return [button, buttonIconClassName];
    } else {
        // 子要素(アイコン)のdivからボタンを特定
        const buttons = document.querySelectorAll<HTMLButtonElement>(
            `button:has(> div${buttonIconClassName})`,
        );

        // upscaleは2つある(i2iと生成画像の上)ので2個目を取る
        const button = projectionId === PROJECTION_ID_UPSCALE ? buttons[1] : buttons[0];
        return [button, buttonIconClassName];
    }
};

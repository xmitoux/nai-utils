import { ID_ATTRIBUTE } from '@/constants/nai';
import { createClassName } from '@/utils';

export let saveButton: HTMLButtonElement | undefined;
export let variationButton: HTMLButtonElement | undefined;
export let upscaleButton: HTMLButtonElement | undefined;

export const setupContent = () => {
    let saveButtonIconClass: string | undefined;
    let variationButtonIconClass: string | undefined;
    let upscaleButtonIconClass: string | undefined;

    const proc = () => {
        const setupSaveButton = () => {
            const projectionId = 10;
            [saveButton, saveButtonIconClass] = setupButton(projectionId, saveButtonIconClass);
        };
        setupSaveButton();

        const setupVariationButton = () => {
            const projectionId = 2;
            [variationButton, variationButtonIconClass] = setupButton(
                projectionId,
                variationButtonIconClass,
            );
        };
        setupVariationButton();

        const setupUpscaleButton = () => {
            const projectionId = 3;
            [upscaleButton, upscaleButtonIconClass] = setupButton(
                projectionId,
                upscaleButtonIconClass,
            );
        };
        setupUpscaleButton();
    };

    // inpaint等で画面が切り替わるとイベントリスナが破壊されるので監視して登録
    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

const setupButton = (
    projectionId: number,
    buttonClassName: string | undefined,
): [button?: HTMLButtonElement, buttonClassName?: string] => {
    // ボタンの親または子要素を取得
    // (ページ表示後最初の1回は親(projection-idで特定)、以降(i2iで再描画時)は保持したclass名で子要素を取得)
    if (!buttonClassName) {
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
        // ボタンの子要素(アイコン)を取得
        const buttonIconDiv = document.querySelector<HTMLDivElement>(buttonClassName);
        // 親であるボタンを取得
        const button = buttonIconDiv?.parentNode as HTMLButtonElement;
        return [button, buttonClassName];
    }
};

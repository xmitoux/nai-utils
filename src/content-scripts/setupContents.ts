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
import { getElementsByStyle } from '@/utils';

export let generateButton: HTMLButtonElement | undefined;
export let upscaleButtonText: HTMLButtonElement | undefined;
export let saveButton: HTMLButtonElement | undefined;
export let variationButton: HTMLButtonElement | undefined;
export let upscaleButton: HTMLButtonElement | undefined;
export let overlay: HTMLDivElement | undefined;
export let generatedImage: HTMLImageElement | undefined;
export let leftPaneDiv: HTMLDivElement | undefined;
export let promptTextarea: HTMLTextAreaElement | undefined;
export let originalPromptAreaDiv: HTMLDivElement | undefined;
export let originalNegativePromptAreaDiv: HTMLDivElement | undefined;
export let promptNegativeTextarea: HTMLTextAreaElement | undefined;
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
            saveButton = setupIconButton(buttons, BUTTON_ICON_SAVE);
            variationButton = setupIconButton(buttons, BUTTON_ICON_VARIATIONS);
            upscaleButton = setupIconButton(buttons, BUTTON_ICON_UPSCALE);
        };
        setupIconButtons();

        const setupGeneratedImage = () => {
            // 生成画像要素を取得
            const imageElements = document.querySelectorAll<HTMLImageElement>('img');
            if (!imageElements.length) {
                return;
            }

            // inpaint中は対象画像がimgタグとして2つ存在するので3つ目を取得
            generatedImage = imageElements.length === 1 ? imageElements[0] : imageElements[2];
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
        highlightViewedHistory && setupViewedHighlightOverlay();

        const setupLeftPaneDiv = () => {
            const targetStyle = 'cursor: e-resize;';

            const targets = getElementsByStyle(targetStyle);
            if (!targets.length) return;

            const target = targets[0].parentElement;
            if (!target) return;

            leftPaneDiv = target as HTMLDivElement;
        };
        setupLeftPaneDiv();

        const setupPromptArea = () => {
            // 監視を一時停止！⏸️
            observer.disconnect();

            // 元の要素を取得！🎯
            // const proseMirror = document.querySelector<HTMLDivElement>('.ProseMirror');
            const proseMirrorList = document.querySelectorAll<HTMLDivElement>('.ProseMirror');
            // すでにtextareaになってたら処理しない！🚫
            if (!proseMirrorList || proseMirrorList.length === 0 || proseMirrorList.length >= 6) {
                // 監視再開して終了！▶️
                observer.observe(document.body, { childList: true, subtree: true });
                return;
            }
            console.log({ proseMirrorList: proseMirrorList });

            const promptAreaDiv = proseMirrorList[0] as HTMLDivElement;
            console.log({ proseMirror: promptAreaDiv });

            // テキストを抽出して改行で結合！📝
            const text = Array.from(promptAreaDiv.querySelectorAll('p'))
                .map((p: HTMLParagraphElement) => p.textContent ?? '')
                .join('\n');
            console.log({ text: text });
            // 画面表示序盤はtextが空なので処理しない！🚫
            // もし普通にプロンプト欄が空の場合は知らん！入力して！
            if (!text) {
                // 監視再開して終了！▶️
                observer.observe(document.body, { childList: true, subtree: true });
                return;
            }

            // 元の要素を透明に！🌫️
            promptAreaDiv.style.opacity = '0';
            promptAreaDiv.style.position = 'relative'; // 基準位置になるよ！

            // textarea作って重ねるよ！🎨
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.className = 'ProseMirror';
            // 絶対位置で重ねる！📌
            textarea.style.position = 'absolute';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '100%';

            const promptAreaDivNega = proseMirrorList[1] as HTMLDivElement;
            console.log({ promptDivNega: promptAreaDivNega });

            // テキストを抽出して改行で結合！📝
            const textNega = Array.from(promptAreaDivNega.querySelectorAll('p'))
                .map((p: HTMLParagraphElement) => p.textContent ?? '')
                .join('\n');
            console.log({ textNega: textNega });
            // 画面表示序盤はtextが空なので処理しない！🚫
            // もし普通にプロンプト欄が空の場合は知らん！入力して！
            if (!textNega) {
                // 監視再開して終了！▶️
                observer.observe(document.body, { childList: true, subtree: true });
                return;
            }

            // 元の要素を透明に！🌫️
            promptAreaDivNega.style.opacity = '0';
            promptAreaDivNega.style.position = 'relative'; // 基準位置になるよ！

            // textarea作って重ねるよ！🎨
            const textareaNega = document.createElement('textarea');
            textareaNega.value = textNega;
            textareaNega.className = 'ProseMirror';
            // 絶対位置で重ねる！📌
            textareaNega.style.position = 'absolute';
            textareaNega.style.top = '0';
            textareaNega.style.left = '0';
            textareaNega.style.width = '100%';

            // textareaを追加！🔥
            promptAreaDiv.parentElement?.appendChild(textarea);
            promptAreaDivNega.parentElement?.appendChild(textareaNega);

            promptTextarea = textarea;
            promptNegativeTextarea = textareaNega;

            originalPromptAreaDiv = promptAreaDiv;
            originalNegativePromptAreaDiv = promptAreaDivNega;

            // 処理完了後に監視再開！▶️
            observer.observe(document.body, { childList: true, subtree: true });
        };
        setupPromptArea();

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

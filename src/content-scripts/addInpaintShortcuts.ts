import {
    BUTTON_ICON_CLOSE,
    BUTTON_ICON_TRASH,
    BUTTON_TEXT_INPAINT_SAVE_AND_CLOSE_EN,
    BUTTON_TEXT_INPAINT_SAVE_AND_CLOSE_JA,
} from '@/constants/nai';
import { getIconButton, getIconButtons, getTextButton } from '@/utils';

export const addInpaintShortcuts = () => {
    document.body.addEventListener('keydown', handleKeyDown, { capture: true });
};

function handleKeyDown(event: KeyboardEvent) {
    if (!isInpaintPage()) {
        // inpaint画面ではないので何もしない
        return;
    }

    event.preventDefault();

    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowRight':
            // ↑または→キーでペンサイズを1増やす
            changePenSize('+', event.metaKey || event.ctrlKey);
            break;

        case 'ArrowDown':
        case 'ArrowLeft':
            // ↓または←キーでペンサイズを1減らす
            changePenSize('-', event.metaKey || event.ctrlKey);
            break;

        case 'Enter':
            // Enterキーでマスクを保存
            saveMask();
            break;

        case 'Delete':
            // Deleteキーでマスクを削除
            removeMask();
            break;

        case 'Escape':
        case 'Backspace':
            // EscapeキーまたはBackspaceキーでinpaint画面を閉じる
            closeInpaint();
            break;
    }
}

/** inpaint画面かどうか */
function isInpaintPage(): boolean {
    // inpaint画面の特定要素を確認
    const inpaintPageClass = '.image-gen-canvas';
    const imageGenCanvas = document.querySelector<HTMLDivElement>(inpaintPageClass);
    if (!imageGenCanvas) {
        return false;
    }

    return true;
}

/** 全てのボタン要素を取得 */
function getAllButtonElements(): HTMLButtonElement[] {
    console.log([...document.querySelectorAll<HTMLButtonElement>('button')]);

    return [...document.querySelectorAll<HTMLButtonElement>('button')];
}

/** ペンサイズを変更する */
function changePenSize(operationType: '+' | '-', withCtrl: boolean) {
    // スライダーを取得
    const sliders = document.querySelectorAll<HTMLInputElement>('input[type="range"]');
    if (!sliders.length) {
        console.warn('ペンサイズスライダーが見つかりません。');
        return;
    }
    const slider = sliders[0];

    const currentSliderValue = Number(slider.value);
    const stepValue = withCtrl ? 5 : 1;
    const resultValue =
        operationType === '+' ? currentSliderValue + stepValue : currentSliderValue - stepValue;

    // 微妙にカクつくときがあるので少し遅延を入れる
    setTimeout(() => {
        slider.value = resultValue.toString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (slider as any)._valueTracker = '';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
    }, 10);
}

/** マスクを保存する */
function saveMask() {
    const button = getTextButton(
        getAllButtonElements(),
        BUTTON_TEXT_INPAINT_SAVE_AND_CLOSE_EN,
        BUTTON_TEXT_INPAINT_SAVE_AND_CLOSE_JA,
    );

    if (!button) {
        console.warn('保存ボタンが見つかりません。');
        return;
    }

    button.click();
}

/** マスクを削除する */
function removeMask() {
    const button = getIconButton(getAllButtonElements(), BUTTON_ICON_TRASH);

    if (!button) {
        console.warn('削除ボタンが見つかりません。');
        return;
    }

    button.click();
}

/** inpaint画面を閉じる */
function closeInpaint() {
    const buttons = getIconButtons(getAllButtonElements(), BUTTON_ICON_CLOSE);

    if (buttons.length < 2 || !buttons[1]) {
        console.warn('閉じるボタンが見つかりません。');
        return;
    }

    // 目的の閉じるボタンは2つ目(1つ目は謎の非表示要素)
    buttons[1].click();
}

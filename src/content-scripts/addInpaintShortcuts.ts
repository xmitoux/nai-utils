import {
    BUTTON_ICON_CLOSE,
    BUTTON_ICON_TRASH,
    BUTTON_TEXT_INPAINT_SAVE_AND_CLOSE_EN,
    BUTTON_TEXT_INPAINT_SAVE_AND_CLOSE_JA,
    INPAINT_PEN_SIZE_BUTTON_CLASS,
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

    console.log('⌨️ shortcut key pressed:', event.key);

    event.preventDefault();

    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowRight':
            // ↑または→キーでペンサイズを1増やす
            changePenSize('increase', event.metaKey || event.ctrlKey);
            break;

        case 'ArrowDown':
        case 'ArrowLeft':
            // ↓または←キーでペンサイズを1減らす
            changePenSize('decrease', event.metaKey || event.ctrlKey);
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
function changePenSize(operationType: 'increase' | 'decrease', withCtrl: boolean) {
    const targetButton = getTargetPenSizeButton(operationType);
    if (!targetButton) {
        return;
    }

    if (withCtrl) {
        // Ctrlキーと同時押しの場合は5回クリックすることで擬似的に5変更する
        clickButtonMultiple(targetButton, 5);
    } else {
        // ペンサイズを1変更する
        targetButton.click();
    }
}

// インペイントペンボタンの要素を取得
function getTargetPenSizeButton(
    operationType: 'increase' | 'decrease',
): HTMLButtonElement | undefined {
    // サイズボタン追加処理で付けたclass名で特定
    const inpaintPenButtons = document.querySelectorAll(`.${INPAINT_PEN_SIZE_BUTTON_CLASS}`);

    if (inpaintPenButtons.length === 0) {
        console.warn('inpaintのペンサイズボタンが見つかりません。');
        return;
    }

    return Array.from(inpaintPenButtons).find((button) =>
        button.classList.contains(operationType),
    ) as HTMLButtonElement | undefined;
}

// 指定ボタンをn回クリックする共通関数
function clickButtonMultiple(button: HTMLButtonElement, times: number) {
    let count = 0;
    const intervalId = setInterval(() => {
        button.click();
        count++;
        if (count >= times) {
            clearInterval(intervalId);
        }
    }, 30);
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
    console.log('閉じるボタン:', buttons);

    if (buttons.length < 2 || !buttons[1]) {
        console.warn('閉じるボタンが見つかりません。');
        return;
    }

    buttons[1].click();
}

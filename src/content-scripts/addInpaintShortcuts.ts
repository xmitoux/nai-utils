import { INPAINT_PEN_SIZE_BUTTON_CLASS } from '@/constants/nai';
import { addEvent } from '@/utils';

export const addInpaintShortcuts = () => {
    addEvent(document.body, 'keydown', 'inpaintPenShortcut', handleKeyDown, true);
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

    // inpaint画面のボタン数を確認
    const inpaintPageButtonCount = 18;
    const buttons = getAllButtonElements();
    console.log({ '📠 buttons 📠': buttons });
    if (buttons.length !== inpaintPageButtonCount) {
        console.warn('inpaint画面ではない可能性があります。');
        return false;
    }

    return true;
}

/** 全てのボタン要素を取得 */
function getAllButtonElements(): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll<HTMLButtonElement>('button');
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

/** 指定インデックスのボタンをクリックする */
function clickTargetIndexButton(index: number) {
    const targetButton = getAllButtonElements()[index];
    targetButton?.click();
}

/** マスクを保存する */
function saveMask() {
    // inpaint画面のマスク保存ボタンは8番目
    clickTargetIndexButton(8);
}

/** マスクを削除する */
function removeMask() {
    // inpaint画面のマスク削除ボタンは13番目
    clickTargetIndexButton(13);
}

/** inpaint画面を閉じる */
function closeInpaint() {
    // inpaint画面の閉じるボタンは9番目
    clickTargetIndexButton(9);
}

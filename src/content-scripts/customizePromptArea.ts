import {
    leftPaneDiv,
    promptNegativeTextarea,
    promptTextarea,
} from '@/content-scripts/setupContents';
import { addEvent } from '@/utils';
import { autoBracket, controlBracket } from './shortcutBracket';

export const costomizePromptArea = ({
    promptWidth,
    promptHeight,
    resizePromptHeight,
    pasteNewline,
    shortcutControlBracket,
    shortcutAutoBracket,
}: ExtensionSettings) => {
    const proc = () => {
        // プロンプト欄の幅(左ペイン)を広げる
        const extendPromptWidth = () => {
            if (!leftPaneDiv || promptWidth === 0) {
                return;
            }

            leftPaneDiv.style.width = `${promptWidth}vw`;
        };
        extendPromptWidth();

        // プロンプト欄の高さを変更する
        const resizePromptArea = () => {
            const updatePromptAreaStyle = (promptArea: HTMLTextAreaElement) => {
                // 高さ固定かリサイズ可のどちらかを適用
                // (固定時にリサイズも可にすると、リサイズ後即高さが戻る挙動になるため二者択一とする)
                if (promptHeight > 0) {
                    promptArea.style.height = `${promptHeight}vh`;
                } else if (resizePromptHeight) {
                    promptArea.style.resize = 'vertical';
                }
            };

            procPositiveAndNegative(
                () => updatePromptAreaStyle(promptTextarea!),
                () => updatePromptAreaStyle(promptNegativeTextarea!),
            );
        };
        resizePromptArea();

        const enablePasteNewline = () => {
            const stopPropagationPaste = (event: ClipboardEvent) => {
                // ペースト時のイベントで改行削除処理をしてるっぽいのでstop
                event.stopPropagation();
            };

            procPositiveAndNegative(
                () => addEvent(promptTextarea!, 'paste', 'pasteEventAdded', stopPropagationPaste),
                () =>
                    addEvent(
                        promptNegativeTextarea!,
                        'paste',
                        'pasteEventAdded',
                        stopPropagationPaste,
                    ),
            );
        };
        pasteNewline && enablePasteNewline();

        const procAddShortcuts = () => {
            const addShortcutsToPromptArea = (promptArea: HTMLTextAreaElement) => {
                const handleShortcuts = (keyEvent: KeyboardEvent) => {
                    controlBracket(keyEvent);
                };

                const handleInput = (inputEvent: InputEvent) => {
                    autoBracket(inputEvent);
                };

                shortcutControlBracket &&
                    addEvent(promptArea, 'keydown', 'shortcutsAdded', handleShortcuts);
                shortcutAutoBracket &&
                    addEvent(promptArea, 'beforeinput', 'beforeInputAdded', handleInput);
            };

            procPositiveAndNegative(
                () => addShortcutsToPromptArea(promptTextarea!),
                () => addShortcutsToPromptArea(promptNegativeTextarea!),
            );
        };
        // TODO: 設定値追加
        procAddShortcuts();
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

const procPositiveAndNegative = (positiveProc: () => void, negativeProc: () => void) => {
    if (!promptTextarea) {
        return;
    }

    positiveProc();

    if (!promptNegativeTextarea) {
        return;
    }

    negativeProc();
};

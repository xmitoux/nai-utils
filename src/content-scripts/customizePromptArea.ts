import {
    leftPaneDiv,
    promptTextarea,
    promptNegativeTextarea,
    originalPromptAreaDiv,
    originalNegativePromptAreaDiv,
} from '@/content-scripts/setupContents';
import { addEvent, submitPrompt } from '@/utils';
import { autoBracket, controlBracket } from './shortcutBracket';
import { moveLine } from './shortcutMoveLine';

export const costomizePromptArea = ({
    promptWidth,
    promptHeight,
    resizePromptHeight,
    shortcutControlBracket,
    shortcutAutoBracket,
    shortcutMoveLine,
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
            const updatePromptAreaStyle = (
                promptArea: HTMLTextAreaElement,
                promptAreaDiv: HTMLDivElement,
            ) => {
                // 高さ固定かリサイズ可のどちらかを適用
                // (固定時にリサイズも可にすると、リサイズ後即高さが戻る挙動になるため二者択一とする)
                if (promptHeight > 0) {
                    promptArea.style.height = `${promptHeight}vh`;
                    promptAreaDiv.style.height = `${promptHeight}vh`;
                } else if (resizePromptHeight) {
                    promptArea.style.resize = 'vertical';
                    promptAreaDiv.style.height = 'vertical';
                }
            };

            procPositiveAndNegative(
                () => updatePromptAreaStyle(promptTextarea!, originalPromptAreaDiv!),
                () =>
                    updatePromptAreaStyle(promptNegativeTextarea!, originalNegativePromptAreaDiv!),
            );
        };
        resizePromptArea();

        const procAddShortcuts = () => {
            const addShortcutsToPromptArea = (
                promptArea: HTMLTextAreaElement,
                promptAreaDiv: HTMLDivElement,
            ) => {
                const handleShortcuts = (keyEvent: KeyboardEvent) => {
                    shortcutControlBracket && controlBracket(keyEvent, promptAreaDiv);
                    shortcutMoveLine && moveLine(keyEvent, promptAreaDiv);
                };

                const handleAutoBracketInput = (inputEvent: InputEvent) => {
                    shortcutAutoBracket && autoBracket(inputEvent, promptAreaDiv);
                };

                addEvent(promptArea, 'keydown', 'shortcutsAdded', handleShortcuts);
                addEvent(promptArea, 'beforeinput', 'beforeInputAdded', handleAutoBracketInput);
            };

            procPositiveAndNegative(
                () => addShortcutsToPromptArea(promptTextarea!, originalPromptAreaDiv!),
                () =>
                    addShortcutsToPromptArea(
                        promptNegativeTextarea!,
                        originalNegativePromptAreaDiv!,
                    ),
            );
        };
        procAddShortcuts();

        const procAddEssntialEventHandler = () => {
            const addEssntialEventHandler = (
                promptArea: HTMLTextAreaElement,
                promptAreaDiv: HTMLDivElement,
            ) => {
                const handleSimpleInput = (inputEvent: InputEvent) => {
                    submitPrompt(inputEvent.target as HTMLTextAreaElement, promptAreaDiv);
                };

                const handlePaste = (event: ClipboardEvent) => {
                    submitPrompt(event.target as HTMLTextAreaElement, promptAreaDiv);
                };

                addEvent(promptArea, 'input', 'simpleInputAdded', handleSimpleInput);
                addEvent(promptArea, 'paste', 'pasteEventAdded', handlePaste);
            };

            procPositiveAndNegative(
                () => addEssntialEventHandler(promptTextarea!, originalPromptAreaDiv!),
                () =>
                    addEssntialEventHandler(
                        promptNegativeTextarea!,
                        originalNegativePromptAreaDiv!,
                    ),
            );
        };
        procAddEssntialEventHandler();
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

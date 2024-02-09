import {
    leftPaneDiv,
    promptNegativeTextarea,
    promptTextarea,
} from '@/content-scripts/setupContents';
import { addEvent } from '@/utils';

export const costomizePromptArea = ({
    promptWidth,
    promptHeight,
    resizePromptHeight,
    pasteNewline,
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
            if (!promptTextarea) {
                return;
            }

            // 高さ固定かリサイズ可のどちらかを適用
            // (固定時にリサイズも可にすると、リサイズ後即高さが戻る挙動になるため二者択一とする)
            if (promptHeight > 0) {
                promptTextarea.style.height = `${promptHeight}vh`;
            } else if (resizePromptHeight) {
                promptTextarea.style.resize = 'vertical';
            }

            if (!promptNegativeTextarea) {
                return;
            }

            // 2段表示時のネガティブロンプトも同様
            if (promptHeight > 0) {
                promptNegativeTextarea.style.height = `${promptHeight}vh`;
            } else if (resizePromptHeight) {
                promptNegativeTextarea.style.resize = 'vertical';
            }
        };
        resizePromptArea();

        const enablePasteNewline = () => {
            if (!promptTextarea) {
                return;
            }

            const stopPropagationPaste = (event: ClipboardEvent) => {
                // ペースト時のイベントで改行削除処理をしてるっぽいのでstop
                event.stopPropagation();
            };

            addEvent(promptTextarea, 'paste', 'pasteEventAdded', stopPropagationPaste);

            if (!promptNegativeTextarea) {
                return;
            }

            addEvent(promptNegativeTextarea, 'paste', 'pasteEventAdded', stopPropagationPaste);
        };
        pasteNewline && enablePasteNewline();
    };

    new MutationObserver(proc).observe(document.body, { childList: true, subtree: true });
};

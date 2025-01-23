import {
    promptTextarea,
    promptNegativeTextarea,
    originalPromptAreaDiv,
    originalNegativePromptAreaDiv,
} from '@/content-scripts/setupContents';

import { BUTTON_TEXT_IMPORT_METADATA_EN, BUTTON_TEXT_IMPORT_METADATA_JA } from '@/constants/nai';
import { addEvent, submitPromptFromOriginalPromptAreaDiv } from '@/utils';

export const handleButonEvents = () => {
    const proc = () => {
        const buttons = document.querySelectorAll('button');

        buttons.forEach((button) => {
            // Import Metadataボタン
            if (
                button.textContent === BUTTON_TEXT_IMPORT_METADATA_EN ||
                button.textContent === BUTTON_TEXT_IMPORT_METADATA_JA
            ) {
                // 取り込んだプロンプトを擬似プロンプトエリアに反映する
                const handleImportMetadata = () => {
                    // ボタンクリック直後はpromptAreaDivに反映されてないかもしれないのでちょっと待つ
                    setTimeout(() => {
                        // 通常プロンプト
                        submitPromptFromOriginalPromptAreaDiv(
                            promptTextarea!,
                            originalPromptAreaDiv!,
                        );

                        // ネガティブプロンプト
                        submitPromptFromOriginalPromptAreaDiv(
                            promptNegativeTextarea!,
                            originalNegativePromptAreaDiv!,
                        );
                    }, 100);
                };

                // Import Metadataボタンにイベントハンドラを追加
                addEvent(button, 'click', 'metadataImportAdded', handleImportMetadata);
            }

            // Naildcard
            if (button.textContent === '🎲') {
                // 取り込んだプロンプトを擬似プロンプトエリアに反映する
                const handleNaildcard = () => {
                    // ボタンクリック直後はpromptAreaDivに反映されてないことがあるのでちょっと待つ
                    setTimeout(() => {
                        submitPromptFromOriginalPromptAreaDiv(
                            promptTextarea!,
                            originalPromptAreaDiv!,
                        );
                    }, 10);
                };

                // Import Metadataボタンにイベントハンドラを追加
                addEvent(button, 'click', 'naildcardHandlerAdded', handleNaildcard);
            }
        });
    };

    const observer = new MutationObserver(proc);
    observer.observe(document.body, { childList: true, subtree: true });
};

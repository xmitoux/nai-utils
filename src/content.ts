import { watchHistoryScripts } from './content-scripts/watch-history-scripts';
import { deleteHistoryWithoutConfirm } from './content-scripts/delete-history-without-confirm';
import { generationScripts } from './content-scripts/generationScripts';
import { saveImageScripts } from './content-scripts/saveImageScripts';
import { noModelSelector } from './content-scripts/no-model-selector';
import { shrinkPromptArea } from './content-scripts/shrink-prompt-area';

import { ACTION_GET_SETTINGS } from '@/constants/chrome-api';

// ページ読み込み時に設定を取得する
chrome.runtime.sendMessage({ action: ACTION_GET_SETTINGS }, (response) => {
    if (!response || !response.settings) {
        return;
    }

    const extensionSettings = response.settings as ExtensionSettings;

    generationScripts(extensionSettings);
    saveImageScripts(extensionSettings);
    watchHistoryScripts(extensionSettings);

    if (extensionSettings.hideModelSelector) {
        noModelSelector();
    }

    if (extensionSettings.enableDeleteHistoryWithoutConfirm) {
        deleteHistoryWithoutConfirm();
    }

    if (extensionSettings.shrinkPromptArea) {
        shrinkPromptArea();
    }
});

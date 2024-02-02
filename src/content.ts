import { historyScripts } from './content-scripts/historyScripts';
import { deleteHistoryWithoutConfirm } from './content-scripts/delete-history-without-confirm';
import { generationScripts } from './content-scripts/generationScripts';
import { noModelSelector } from './content-scripts/no-model-selector';
import { shrinkPromptArea } from './content-scripts/shrink-prompt-area';

import { ACTION_GET_SETTINGS } from '@/constants/chrome-api';
import { setupContents } from './content-scripts/setupContents';
import { confirmDialog } from './content-scripts/confrimDialog';

// ページ読み込み時に設定を取得する
chrome.runtime.sendMessage({ action: ACTION_GET_SETTINGS }, (response) => {
    if (!response || !response.settings) {
        return;
    }

    const extensionSettings = response.settings as ExtensionSettings;

    setupContents();
    generationScripts(extensionSettings);
    historyScripts(extensionSettings);
    confirmDialog();

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

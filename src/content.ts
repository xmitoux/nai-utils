import { historyScripts } from './content-scripts/historyScripts';
import { withoutConfirm } from './content-scripts/withoutConfirm';
import { generationScripts } from './content-scripts/generationScripts';
import { noModelSelector } from './content-scripts/no-model-selector';
import { ACTION_GET_SETTINGS } from '@/constants/chrome-api';
import { setupContents } from './content-scripts/setupContents';
import { confirmDialog } from './content-scripts/confrimDialog';
import { addSliderButton } from './content-scripts/addSliderButton';
import { rearrangeImageSettings } from './content-scripts/rearrangeImageSettings';
import { removeDirectorTools } from './content-scripts/removeDirectorTools';
import { removeGetStarted } from './content-scripts/removeGetStarted';

// ページ読み込み時に設定を取得する
chrome.runtime.sendMessage({ action: ACTION_GET_SETTINGS }, (response) => {
    if (!response || !response.settings) {
        return;
    }

    const extensionSettings = response.settings as ExtensionSettings;

    setupContents(extensionSettings);
    generationScripts(extensionSettings);
    historyScripts(extensionSettings);
    confirmDialog(extensionSettings);
    addSliderButton(extensionSettings);
    withoutConfirm(extensionSettings);
    rearrangeImageSettings(extensionSettings);

    if (extensionSettings.hideModelSelector) {
        noModelSelector();
    }

    if (extensionSettings.hideDirectorTools) {
        removeDirectorTools();
    }

    if (extensionSettings.hideGetStarted) {
        removeGetStarted();
    }
});

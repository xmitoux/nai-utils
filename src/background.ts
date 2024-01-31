import { ACTION_GET_SETTINGS } from './constants/chrome-api';
import { defaultExtensionSettings } from './utils';

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'index.html' });

    chrome.storage.local.get().then((settings) => {
        if (!Object.keys(settings).length) {
            // インストール直後は設定が無なのでデフォルト値を設定
            chrome.storage.local.set(defaultExtensionSettings);
        }
    });
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === ACTION_GET_SETTINGS) {
        chrome.storage.local.get().then((settings) => {
            sendResponse({ settings: settings });
        });
    }

    // 必須 ないと以下のエラーになって設定が読み込めない
    // Unchecked runtime.lastError: The message port closed before a response was received.
    return true;
});

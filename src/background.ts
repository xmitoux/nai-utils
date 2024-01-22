import { ACTION_GET_SETTINGS } from './constants/chrome-api';

const defaultSettings: ExtensionSettings = {
    disableEnterKeyGeneration: false,
    hideModelSelector: false,
    enableDeleteHistoryWithoutConfirm: false,
    enableHistorySaveShortcut: false,
    selectHistoryWithMouseWheel: false,
    highlightViewedHistory: false,
    shrinkPromptArea: false,
};

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'index.html' });

    chrome.storage.local.get().then((settings) => {
        if (!Object.keys(settings).length) {
            // インストール直後は設定が無なのでデフォルト値を設定
            chrome.storage.local.set(defaultSettings);
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

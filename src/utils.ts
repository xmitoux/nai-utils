export const defaultExtensionSettings: ExtensionSettings = {
    disableEnterKeyGeneration: false,
    generateEverywhere: false,
    datetimeFilename: false,
    hideModelSelector: false,
    enableDeleteHistoryWithoutConfirm: false,
    enableHistorySaveShortcut: false,
    selectHistoryWithMouseWheel: false,
    highlightViewedHistory: false,
    shrinkPromptArea: false,
};

/**
 * querySelectorで指定する'.'繋ぎのクラス名を作成
 */
export const createClassName = (className: string): string => {
    return className
        .split(' ')
        .map((className) => '.' + className)
        .join('');
};

export const addEventListener = (
    element: HTMLElement,
    event: keyof HTMLElementEventMap,
    flagName: string,
    listener: (event: Event) => void,
) => {
    if (element && !element.dataset[flagName]) {
        element.addEventListener(event, listener);
        element.dataset[flagName] = 'true';
    }
};

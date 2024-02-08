export const defaultExtensionSettings: ExtensionSettings = {
    disableEnterKeyGeneration: false,
    generateEverywhere: false,
    datetimeFilename: false,
    hideModelSelector: false,
    enableDeleteHistoryWithoutConfirm: false,
    enableHistorySaveShortcut: false,
    wheelHistory: false,
    highlightViewedHistory: false,
    shrinkPromptArea: false,
    confirmDialog: false,
    sliderButton: false,
    generatedSound: false,
    promptWidth: 0,
    promptHeight: 0,
    resizePromptHeight: false,
    importImageWithoutConfirm: false,
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

export const addEvent = <T extends Event>(
    element: HTMLElement,
    event: keyof HTMLElementEventMap,
    flagName: string,
    listener: (event: T) => void,
) => {
    if (element && !element.dataset[flagName]) {
        element.addEventListener(event, (e) => listener(e as T));
        element.dataset[flagName] = 'true';
    }
};

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
    rearrangeImageSettings: false,
    pasteNewline: false,
    shortcutControlBracket: false,
    shortcutAutoBracket: false,
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

export const submitPrompt = (promptTextarea: HTMLTextAreaElement) => {
    // プロンプト欄のReactコンポーネントのinputイベントを発火させてテキスト入力を確定させる
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (promptTextarea as any)._valueTracker = '';
    promptTextarea.dispatchEvent(new Event('input', { bubbles: true }));
};

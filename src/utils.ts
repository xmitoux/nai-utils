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
    shortcutControlBracket: false,
    shortcutAutoBracket: false,
    shortcutMoveLine: false,
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

export const submitPrompt = (
    promptTextarea: HTMLTextAreaElement,
    promptAreaDiv: HTMLDivElement,
) => {
    if (!promptAreaDiv) {
        console.error('プロンプト入力欄がない😢');
        return;
    }

    // プロンプト入力のたびに中身をクリアする
    promptAreaDiv.innerHTML = '';

    // プロンプトの各行をp要素として追加していく
    const lines = promptTextarea.value.split('\n');
    lines.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        promptAreaDiv.appendChild(p);
    });
};

/** PromptAreaDivのテキストを取得し疑似プロンプトエリアに挿入する */
export const submitPromptFromOriginalPromptAreaDiv = (
    promptTextarea: HTMLTextAreaElement,
    promptAreaDiv: HTMLDivElement,
) => {
    if (!promptAreaDiv) {
        console.error('プロンプト入力欄がない😢');
        return '';
    }

    const prompt = getPromptAreaDivText(promptAreaDiv!);
    promptTextarea.value = prompt;
};

/** PromptAreaDivのテキストを取得する */
export const getPromptAreaDivText = (promptAreaDiv: HTMLDivElement): string => {
    if (!promptAreaDiv) {
        console.error('プロンプト入力欄がない😢');
        return '';
    }

    // pタグを改行区切りの文字列に変換
    return Array.from(promptAreaDiv.querySelectorAll<HTMLParagraphElement>('p'))
        .map((p) => p.textContent ?? '')
        .join('\n');
};

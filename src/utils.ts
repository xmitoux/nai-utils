export const defaultExtensionSettings: ExtensionSettings = {
    generateEverywhere: false,
    datetimeFilename: false,
    hideModelSelector: false,
    hideDirectorTools: false,
    hideGetStarted: false,
    enableDeleteHistoryWithoutConfirm: false,
    enableHistorySaveShortcut: false,
    wheelHistory: false,
    highlightViewedHistory: false,
    confirmDialog: false,
    sliderButton: false,
    generatedSound: false,
    rearrangeImageSettings: false,
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

interface StyleProperties {
    [key: string]: string;
}

/** 要素をstyleで検索して取得する */
export function getElementsByStyle(styles: string): HTMLElement[] {
    const allElements = document.getElementsByTagName('*');
    const matchingElements: HTMLElement[] = [];

    function normalizeStyle(style: string): StyleProperties {
        return style
            .split(';')
            .filter((s) => s.trim())
            .reduce((acc: StyleProperties, style) => {
                const [property, value] = style.split(':').map((s) => s.trim());
                if (property && value) {
                    // プロパティ名をキャメルケースに変換
                    const normalizedProperty = property.replace(/-([a-z])/g, (_, letter) =>
                        letter.toUpperCase(),
                    );
                    acc[normalizedProperty] = value;
                }
                return acc;
            }, {});
    }

    const targetStyles = normalizeStyle(styles);

    Array.from(allElements).forEach((element) => {
        if (!element.hasAttribute('style')) return;

        const elementStyle = element.getAttribute('style') || '';
        const currentStyles = normalizeStyle(elementStyle);

        // すべてのターゲットスタイルが要素のスタイルに含まれているかチェック
        const matches = Object.entries(targetStyles).every(([property, value]) => {
            return currentStyles[property] === value;
        });

        if (matches) {
            matchingElements.push(element as HTMLElement);
        }
    });

    return matchingElements;
}

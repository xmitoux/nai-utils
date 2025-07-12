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
    capture: boolean = false,
) => {
    if (element && !element.dataset[flagName]) {
        element.addEventListener(event, (e) => listener(e as T), { capture });
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

/** テキストボタンを取得する */
export const getTextButton = (
    textButtons: HTMLButtonElement[],
    buttonTextEn: string,
    buttonTextJa: string,
): HTMLButtonElement | undefined => {
    for (const button of textButtons) {
        const buttonText = button.textContent;
        if (buttonText?.includes(buttonTextEn) || buttonText?.includes(buttonTextJa)) {
            // 最初の1個だけを取得
            return button;
        }
    }

    return undefined;
};

/** アイコンボタンを取得する */
export const getIconButton = (
    iconButtons: HTMLButtonElement[],
    buttonIconName: string,
): HTMLButtonElement | undefined => {
    const targetButton = iconButtons.find((button) => {
        if ([...button.children].some((child) => child.tagName === 'SPAN')) {
            // ボタン直下にspanを含む場合(テキストボタン)はスルー
            // (upscaleのアイコンがi2i欄と被っているため)
            return undefined;
        }

        const iconDiv = button.querySelector<HTMLDivElement>('div');
        if (!iconDiv) {
            return undefined;
        }

        // アイコンのmask-imageからURLを取得しその名前で特定
        const iconUrl = getComputedStyle(iconDiv).maskImage;
        return iconUrl.includes(buttonIconName);
    });

    return targetButton!;
};

/**
 * アイコンボタンリストを取得する
 * (一意に定まらないとき用)
 */
export const getIconButtons = (
    iconButtons: HTMLButtonElement[],
    buttonIconName: string,
): HTMLButtonElement[] => {
    const targetButtons = iconButtons.filter((button) => {
        if ([...button.children].some((child) => child.tagName === 'SPAN')) {
            // ボタン直下にspanを含む場合(テキストボタン)はスルー
            // (upscaleのアイコンがi2i欄と被っているため)
            return undefined;
        }

        const iconDiv = button.querySelector<HTMLDivElement>('div');
        if (!iconDiv) {
            return undefined;
        }

        // アイコンのmask-imageからURLを取得しその名前で特定
        const iconUrl = getComputedStyle(iconDiv).maskImage;
        return iconUrl.includes(buttonIconName);
    });

    return targetButtons;
};

export const noModelSelector = () => {
    const observer = new MutationObserver(proc);
    function proc() {
        const targetStyle =
            'display: flex; flex-direction: row; justify-content: space-between; width: 100%; padding: 10px';

        const targets = getElementsByStyle(targetStyle);
        if (!targets.length) return;

        hideParentElements(targets);
        observer.disconnect();
    }

    observer.observe(document.body, { childList: true, subtree: true });
};

interface StyleProperties {
    [key: string]: string;
}

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

function getElementsByStyle(styles: string): HTMLElement[] {
    const allElements = document.getElementsByTagName('*');
    const matchingElements: HTMLElement[] = [];
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

function hideParentElements(elements: HTMLElement[]): void {
    elements.forEach((element) => {
        const parentElement = element.parentElement;
        if (parentElement) {
            parentElement.style.display = 'none';
        }
    });
}

export const generationScripts = () => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!event.target) {
            return;
        }

        const el = event.target as HTMLElement;

        // プロンプト欄でのEnterキー生成を抑制
        if (
            el.tagName === 'TEXTAREA' &&
            !(event.ctrlKey || event.metaKey) &&
            event.key == 'Enter'
        ) {
            event.stopPropagation();
            return;
        }

        // ページ内のどこでも Ctrl * Enter で生成
        if ((event.ctrlKey || event.metaKey) && event.key == 'Enter') {
            const generateButton = document.querySelector<HTMLButtonElement>(
                'button:has(span):has(div)',
            );
            generateButton?.click();
            return;
        }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
};
